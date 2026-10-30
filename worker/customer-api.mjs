// Sites authenticates the owner-private preview. Business roles remain previews.
const KEYS=['projectFacts','finishSpecifications','finishSelections','moodboards','selectionMeasurements','supplierQuoteRequests','suppliers','selectionInventory','facebookPosts','facebookEnquiries','facebookCRMLeads'];
const BUSINESS=new Set(['suppliers','facebookPosts','facebookEnquiries','facebookCRMLeads']);
function validateFacebook(data){
 const posts=new Map(),postKeys=new Set(),comments=new Set(),fallbacks=new Map();
 for(const post of data.facebookPosts){const u=new URL(post.url);if(u.protocol!=='https:'||u.hostname!=='www.facebook.com'||u.username||u.password||u.port||u.search||u.hash||!/^\/groups\/[a-z0-9._-]+\/posts\/[A-Za-z0-9_-]+\/$/.test(u.pathname)||post.shAuthorConfirmed!==true||post.publicGroupConfirmed!==true||!String(post.title||'').trim())throw Error('Invalid SH post');if(posts.has(post.id)||postKeys.has(u.pathname))throw Error('Duplicate SH post');posts.set(post.id,post);postKeys.add(u.pathname);}
 for(const enquiry of data.facebookEnquiries){const post=posts.get(enquiry.postId);if(!post||enquiry.postKey!==post.postKey||enquiry.publicCommentConfirmed!==true||!String(enquiry.author||'').trim()||!String(enquiry.originalText||'').trim()||!['New interest','Contact details requested','Qualified','Quote preparation','Closed'].includes(enquiry.status))throw Error('Invalid SH enquiry');if(enquiry.commentId){if(comments.has(enquiry.commentId))throw Error('Duplicate comment');comments.add(enquiry.commentId);}const key=JSON.stringify([post.postKey,enquiry.author.normalize('NFKC').replace(/\s+/g,' ').trim().toLocaleLowerCase('en-NZ'),enquiry.originalText.normalize('NFKC').replace(/\s+/g,' ').trim().toLocaleLowerCase('en-NZ')]);const prior=fallbacks.get(key);if(prior&&(!prior.commentId||!enquiry.commentId))throw Error('Duplicate manual comment');fallbacks.set(key,enquiry);}
 const linked=new Set();for(const lead of data.facebookCRMLeads){if(!data.facebookEnquiries.some(e=>e.id===lead.sourceEnquiryId)||linked.has(lead.sourceEnquiryId))throw Error('Invalid linked lead');linked.add(lead.sourceEnquiryId);}
}
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export function validateState(data){
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Invalid state');
 const clean={};for(const key of KEYS){const rows=data[key]??[];if(!Array.isArray(rows)||rows.length>1500)throw Error('Invalid collection');
  clean[key]=rows.map(row=>{if(!row||typeof row!=='object'||Array.isArray(row)||typeof row.id!=='string'||row.id.length>160)throw Error('Invalid record');if(!BUSINESS.has(key)&&(typeof row.projectId!=='string'||!/^SH-[A-Za-z0-9-]{1,100}$/.test(row.projectId)))throw Error('Invalid project');return key==='selectionInventory'?Object.fromEntries(['id','projectId','name','qty','unit','spec','sourceBOMId','version'].filter(k=>row[k]!==undefined).map(k=>[k,row[k]])):row;});
 }return clean;
}
export async function customerAPI(request,env){
 const user=request.headers.get('oai-authenticated-user-id');
 if(!user)return json({error:'Sign in to the private portal to use shared selections.'},401);
 if(!env.DB)return json({error:'Shared database is unavailable.'},503);
 if(request.method==='GET'){
  const row=await env.DB.prepare('SELECT revision, data FROM customer_workspace WHERE user_id = ?').bind(user).first();
  return json(row?{revision:row.revision,data:JSON.parse(row.data)}:{revision:0,data:{}});
 }
 if(request.method!=='PUT')return json({error:'Method not allowed'},405);
 const origin=request.headers.get('Origin');if(!origin||origin!==new URL(request.url).origin)return json({error:'Same-origin request required'},403);
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'JSON required'},415);
 const text=await request.text();if(text.length>750000)return json({error:'Selection workspace exceeds the size limit'},413);
 let body,data;try{body=JSON.parse(text);data=validateState(body.data);if(!Number.isSafeInteger(body.expectedRevision)||body.expectedRevision<0)throw Error('Invalid revision');}catch{return json({error:'Invalid selection data'},400);}
 // Preserve collections omitted by older clients. Revision checks still reject stale writes.
 if(body.expectedRevision>0){const previous=await env.DB.prepare('SELECT revision, data FROM customer_workspace WHERE user_id = ?').bind(user).first();if(!previous||previous.revision!==body.expectedRevision)return json({error:'Another device updated selections. Reload shared selections before saving again.'},409);const previousData=JSON.parse(previous.data);for(const key of KEYS)if(!Object.prototype.hasOwnProperty.call(body.data,key))data[key]=previousData[key]||[];}
 try{validateFacebook(data);}catch{return json({error:'Facebook enquiries must reference unique, registered SH-authored public posts.'},400);}
 const encoded=JSON.stringify(data),stamp=new Date().toISOString();let result;
 if(body.expectedRevision===0)result=await env.DB.prepare('INSERT INTO customer_workspace (user_id, revision, data, updated_at) VALUES (?, 1, ?, ?) ON CONFLICT(user_id) DO NOTHING RETURNING revision').bind(user,encoded,stamp).first();
 else result=await env.DB.prepare('UPDATE customer_workspace SET revision = revision + 1, data = ?, updated_at = ? WHERE user_id = ? AND revision = ? RETURNING revision').bind(encoded,stamp,user,body.expectedRevision).first();
 return result?json({revision:result.revision,updatedAt:stamp}):json({error:'Another device updated selections. Reload shared selections before saving again.'},409);
}
