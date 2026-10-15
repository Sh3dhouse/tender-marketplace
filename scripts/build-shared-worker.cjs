const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),assets={};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf','.csv':'text/csv','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};
function walk(dir,prefix=''){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(item.name.startsWith('.')||item.name==='server')continue;const p=path.join(dir,item.name),rel=prefix+'/'+item.name;if(item.isDirectory())walk(p,rel);else assets[rel]={type:mime[path.extname(item.name)]||'application/octet-stream',data:fs.readFileSync(p).toString('base64')};}}
walk(path.join(root,'dist'));
const out=path.join(root,'.site-build','dist');fs.mkdirSync(path.join(out,'server'),{recursive:true});fs.mkdirSync(path.join(out,'.openai'),{recursive:true});
const api=fs.readFileSync(path.join(root,'worker/customer-api.mjs'),'utf8').replaceAll('export function','function').replaceAll('export async function','async function');
const entry=fs.readFileSync(path.join(root,'worker/index.mjs'),'utf8').replace(/^import .*\n/,'').replace('export function','function');
fs.writeFileSync(path.join(out,'server/index.js'),api+'\n'+entry+'\nexport default createWorker('+JSON.stringify(assets)+');\n');
fs.copyFileSync(path.join(root,'.openai/hosting.json'),path.join(out,'.openai/hosting.json'));
fs.cpSync(path.join(root,'drizzle'),path.join(out,'.openai/drizzle'),{recursive:true});
console.log('Built shared Worker with '+Object.keys(assets).length+' embedded assets.');
