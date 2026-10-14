import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {Workbook, SpreadsheetFile} from '@oai/artifact-tool';
const out = new URL('../../dist/downloads/', import.meta.url);
await fs.mkdir(out, {recursive:true});
const wb=Workbook.create();
const estimate=wb.worksheets.add('Estimate');
const input=wb.worksheets.add('Import');
const headers=['item_code','description','category','unit','quantity','unit_cost_ex_gst','markup_percent'];
const rows=[['DEMO-001','Fictitious erection labour','Labour','hour',40,50,20],['DEMO-002','Fictitious fixings allowance','Materials','lot',1,200,25],['DEMO-003','Fictitious equipment hire','Equipment','day',2,100,10]];
input.getRange('A1:G4').values=[headers,...rows];
input.getRange('A2:G4').format.fill='#F3EBE1';
input.getRange('E2:G4').setNumberFormat('0.00');
estimate.getRange('A2').values=[['Shed House contractor pricing']];
estimate.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:'#20353c'};
estimate.getRange('A3').values=[['DRAFT. Fictitious examples only. NZD.']];
estimate.getRange('A5:B9').values=[['GST assumption',0.15],['Cost excluding GST',null],['Selling excluding GST',null],['GST',null],['Selling including GST',null]];
estimate.getRange('B5').format.fill='#FAA21F';
estimate.getRange('B5').setNumberFormat('0%');
estimate.getRange('B6:B9').formulas=[['=SUM(F13:F15)'],['=SUM(H13:H15)'],['=ROUND(B7*B5,2)'],['=B7+B8']];
estimate.getRange('A11').values=[['Markup is a percentage added to cost. Edit inputs on Import.']];
estimate.getRange('A12:H12').values=[['Item code','Description','Category','Unit','Quantity','Cost ex GST','Markup %','Sell ex GST']];
for(let r=13;r<=15;r++){
 const source=r-11;
 estimate.getRange(`A${r}:E${r}`).formulas=[['A','B','C','D','E'].map(c=>`=Import!${c}${source}`)];
 estimate.getRange(`F${r}:H${r}`).formulas=[[`=ROUND(E${r}*Import!F${source},2)`,`=Import!G${source}`,`=ROUND(F${r}*(1+G${r}/100),2)`]];
}
for(const s of [estimate,input]){
 s.showGridLines=false;
 s.getUsedRange().format.font={name:'Arial',size:11,color:'#20353c'};
 s.getUsedRange().format.rowHeight=26;
 s.getUsedRange().format.verticalAlignment='center';
 s.getRange('A:A').format.columnWidth=17;
 s.getRange('B:B').format.columnWidth=38;
 s.getRange('C:C').format.columnWidth=18;
 s.getRange('D:D').format.columnWidth=12;
 s.getRange('E:H').format.columnWidth=18;
 s.tabColor='#20353c';
}
estimate.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:'#20353c'};
estimate.getRange('A3:H3').merge();
estimate.getRange('A11:H11').merge();
estimate.getRange('B6:B9').setNumberFormat('"NZ$"#,##0.00');
estimate.getRange('F13:F15').setNumberFormat('"NZ$"#,##0.00');
estimate.getRange('H13:H15').setNumberFormat('"NZ$"#,##0.00');
for(const [s,range] of [[estimate,'A12:H12'],[input,'A1:G1']]){
 s.getRange(range).format={fill:'#20353c',font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},wrapText:true,rowHeight:40};
}
input.getRange('F:G').format.columnWidth=25;
input.freezePanes.freezeRows(1);
wb.recalculate();
console.log((await wb.inspect({kind:'table',range:'Estimate!A5:B9',include:'values,formulas',tableMaxRows:5,tableMaxCols:2})).ndjson);
const expect=[2400,2870,430.5,3300.5];
const actual=estimate.getRange('B6:B9').values.flat();
if(actual.some((n,i)=>Math.abs(n-expect[i])>0.001)) throw Error('Totals failed '+JSON.stringify(actual));
input.getRange('E2').values=[[0]];
wb.recalculate();
if(estimate.getRange('B6').values[0][0]!==400) throw Error('Recalculation check failed');
input.getRange('E2').values=[[40]];
wb.recalculate();
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!',options:{useRegex:true,maxResults:10}})).ndjson);
await (await SpreadsheetFile.exportXlsx(wb)).save(fileURLToPath(new URL('shp-contractor-pricing-development.xlsx',out)));
await fs.writeFile(new URL('shp-contractor-pricing-development.csv',out),[headers,...rows].map(r=>r.join(',')).join('\r\n')+'\r\n');
for(const sheetName of ['Estimate','Import']){
 const img=await wb.render({sheetName,range:sheetName==='Estimate'?'A1:H16':'A1:G5',scale:1,format:'png'});
 await fs.writeFile(new URL(`../../../../${sheetName}-pricing-preview.png`,import.meta.url),new Uint8Array(await img.arrayBuffer()));
}
