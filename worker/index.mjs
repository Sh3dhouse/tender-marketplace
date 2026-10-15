import {customerAPI} from './customer-api.mjs';
export function createWorker(assets){return {async fetch(request,env){
 try{const url=new URL(request.url);if(url.pathname==='/api/customer-state')return await customerAPI(request,env);
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
  const path=url.pathname==='/'?'/index.html':url.pathname;const asset=assets[path];if(!asset)return new Response('Not found',{status:404});
  const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
  return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'Cache-Control':'private, max-age=60','X-Content-Type-Options':'nosniff'}});
 }catch{return new Response(JSON.stringify({error:'The portal could not complete the request. Please retry.'}),{status:500,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}
}};}
