// Sites authenticates the owner-private preview. Business roles remain previews.
const KEYS=['projectFacts','finishSpecifications','finishSelections','moodboards','selectionMeasurements','supplierQuoteRequests','suppliers'];
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export function validateState(data){
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Invalid state');
 const clean={};for(const key of KEYS){const rows=data[key]??[];if(!Array.isArray(rows)||rows.length>1500)throw Error('Invalid collection');
  clean[key]=rows.map(row=>{if(!row||typeof row!=='object'||Array.isArray(row)||typeof row.id!=='string'||row.id.length>160)throw Error('Invalid record');if(key!=='suppliers'&&(typeof row.projectId!=='string'||!/^SH-[A-Za-z0-9-]{1,100}$/.test(row.projectId)))throw Error('Invalid project');return row;});
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
 const encoded=JSON.stringify(data),stamp=new Date().toISOString();let result;
 if(body.expectedRevision===0)result=await env.DB.prepare('INSERT INTO customer_workspace (user_id, revision, data, updated_at) VALUES (?, 1, ?, ?) ON CONFLICT(user_id) DO NOTHING RETURNING revision').bind(user,encoded,stamp).first();
 else result=await env.DB.prepare('UPDATE customer_workspace SET revision = revision + 1, data = ?, updated_at = ? WHERE user_id = ? AND revision = ? RETURNING revision').bind(encoded,stamp,user,body.expectedRevision).first();
 return result?json({revision:result.revision,updatedAt:stamp}):json({error:'Another device updated selections. Reload shared selections before saving again.'},409);
}
