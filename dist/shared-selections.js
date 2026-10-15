/* Owner-private shared customer workspace. Other prototype records remain device-local. */
window.SHSharedSelections=(()=>{
 const keys=['projectFacts','finishSpecifications','finishSelections','moodboards','selectionMeasurements','supplierQuoteRequests','suppliers','selectionInventory'];
 let store,options,revision=0,ready=false,saving=false,blocked=false,local=false,timer,last='',message='Loading shared customer selections…',pending=false;
 const snapshot=()=>{store.selectionInventory||=[];if(typeof role!=='undefined'&&role==='staff')for(const x of store.inventory||[]){const row={id:x.id,projectId:x.projectId,name:x.name,qty:x.qty,unit:x.unit,spec:x.spec,sourceBOMId:x.sourceBOMId,version:x.version};if(!row.id||!row.projectId)continue;const index=store.selectionInventory.findIndex(y=>y.id===row.id&&y.projectId===row.projectId);if(index<0)store.selectionInventory.push(row);else store.selectionInventory[index]=row;}return Object.fromEntries(keys.map(k=>[k,Array.isArray(store[k])?store[k]:[]]));};
 function status(text){message=text;const el=document.getElementById('shared-selection-status');if(el){el.querySelector('[data-shared-message]').textContent=message;el.querySelector('[data-shared-retry]').hidden=!blocked;}}
 function panel(){return '<section id="shared-selection-status" class="shared-selection-status" aria-live="polite"><span data-shared-message>'+message+'</span> <button class="link" data-shared-refresh>Refresh shared selections</button> <button class="link" data-shared-retry '+(blocked?'':'hidden')+'>Retry save</button></section>';}
 async function read(){const response=await fetch('/api/customer-state',{credentials:'same-origin',cache:'no-store'});if(!response.ok)throw Error('Shared selections could not load. Local edits are not shared.');return response.json();}
 function apply(data){for(const key of keys)store[key]=Array.isArray(data[key])?data[key]:[];options.saveLocal();last=JSON.stringify(Object.fromEntries(keys.map(k=>[k,store[k]])));}
 async function start(s,o){store=s;options=o;if(location.protocol==='file:'||location.hostname==='localhost'||location.hostname==='127.0.0.1'){local=true;status('Local preview: shared storage is available on the hosted private portal.');return;}
  try{const remote=await read();revision=remote.revision;ready=true;
   if(revision){localStorage.setItem('shp-selections-before-shared-load',JSON.stringify(snapshot()));apply(remote.data);status('Shared customer selections loaded.');}
   else {last=JSON.stringify(Object.fromEntries(keys.map(k=>[k,[]])));status('Shared customer selections connected.');queue();}
   if(document.querySelector('aside'))options.render();
  }catch(error){blocked=true;status(error.message);}
 }
 function queue(){if(!store||local)return;pending=true;if(!ready||blocked)return;clearTimeout(timer);timer=setTimeout(flush,450);status('Customer selection changes waiting to sync…');}
 async function flush(){if(!ready||blocked||saving)return;const data=snapshot(),serialized=JSON.stringify(data);if(serialized===last){pending=false;status('Customer selections are up to date across devices.');return;}saving=true;pending=false;status('Saving customer selections to shared storage…');
  try{const response=await fetch('/api/customer-state',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedRevision:revision,data})});const result=await response.json();if(!response.ok)throw Error(result.error||'Shared save failed.');revision=result.revision;last=serialized;status('Customer selections saved across devices.');}
  catch(error){blocked=true;pending=true;localStorage.setItem('shp-unsynced-customer-selections',serialized);status(error.message+' Changes remain in this browser; refresh shared selections to resolve conflicts.');}
  finally{saving=false;if(pending&&!blocked)queue();}
 }
 function bind(){const retry=document.querySelector('[data-shared-retry]');if(retry)retry.onclick=()=>{if(!ready){blocked=false;start(store,options);}else{blocked=false;queue();}};
  const refresh=document.querySelector('[data-shared-refresh]');if(refresh)refresh.onclick=async()=>{if(saving)return status('Wait for the current save before refreshing.');try{const remote=await read();localStorage.setItem('shp-selections-before-shared-refresh',JSON.stringify(snapshot()));revision=remote.revision;apply(remote.data);blocked=false;ready=true;pending=false;clearTimeout(timer);status('Latest shared selections loaded. Previous local values retained as a browser backup.');options.render();}catch(error){blocked=true;status(error.message);}};
 }
 return {start,queue,panel,bind,isLoading:()=>!local&&!ready&&!blocked};
})();
