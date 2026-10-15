import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {customerAPI} from '../worker/customer-api.mjs';
const rows=new Map();const DB={prepare(sql){return {bind(...args){return {async first(){
 if(sql.startsWith('SELECT'))return rows.get(args[0])||null;
 if(sql.startsWith('INSERT')){if(rows.has(args[0]))return null;rows.set(args[0],{revision:1,data:args[1]});return {revision:1};}
 const row=rows.get(args[2]);if(!row||row.revision!==args[3])return null;row.data=args[0];return {revision:++row.revision};
 }}}}}};
const req=(method,user,body,origin='https://portal.test')=>new Request('https://portal.test/api/customer-state',{method,headers:{...(user?{'oai-authenticated-user-id':user}:{}),'Origin':origin,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
assert.equal((await customerAPI(req('GET'),{DB})).status,401);
assert.equal((await customerAPI(req('PUT','owner',{expectedRevision:0,data:{}},'https://evil.test'),{DB})).status,403);
const data={moodboards:[{id:'m1',projectId:'SH-TMP-DEMO-LOCKUP',roofColourId:'titania'}]};
assert.equal((await customerAPI(req('PUT','owner',{expectedRevision:0,data}),{DB})).status,200);
const other=await (await customerAPI(req('GET','other'),{DB})).json();assert.equal(other.revision,0);
assert.equal((await customerAPI(req('PUT','owner',{expectedRevision:0,data}),{DB})).status,409);
const loaded=await (await customerAPI(req('GET','owner'),{DB})).json();assert.equal(loaded.data.moodboards[0].roofColourId,'titania');
assert.equal((await customerAPI(req('PUT','owner',{expectedRevision:1,data}),{DB})).status,200);
assert.equal((await customerAPI(req('PUT','owner',{expectedRevision:2,data:{moodboards:[{id:'x',projectId:'invalid'}]}}),{DB})).status,400);
console.log('Passed: authenticated shared state, owner isolation, same-origin writes, stale revision conflict and bounded record validation.');
async function device(){let timer;const local=new Map(),context={window:{},location:{hostname:'portal.test',protocol:'https:'},document:{getElementById:()=>null,querySelector:()=>null},localStorage:{setItem:(k,v)=>local.set(k,v)},setTimeout:fn=>{timer=fn;return 1;},clearTimeout:()=>{},fetch:async(url,init={})=>customerAPI(req(init.method||'GET','owner',init.body?JSON.parse(init.body):undefined),{DB})};vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../dist/shared-selections.js',import.meta.url),'utf8'),context);const store={};await context.window.SHSharedSelections.start(store,{saveLocal:()=>true,render:()=>{}});return {store,sync:context.window.SHSharedSelections,flush:async()=>{if(timer)await timer();}};}
const first=await device(),second=await device();
first.store.moodboards[0].roofColourId='flaxpod-low';first.sync.queue();await first.flush();
const third=await device();assert.equal(third.store.moodboards[0].roofColourId,'flaxpod-low');
second.store.moodboards[0].roofColourId='karaka';second.sync.queue();await second.flush();
assert(second.sync.panel().includes('Another device updated'));
assert.equal((await device()).store.moodboards[0].roofColourId,'flaxpod-low');
console.log('Passed: separate browser stores reload shared selections and conflicting saves do not overwrite newer data.');
