from pathlib import Path
p=Path('dist/app.js')
s=p.read_text(encoding='utf-8')
s=s.replace("${award||'Contractor to be appointed'}", "${selected===0&&award?escape(award):selected===2?'Ridgeview Construction':'Contractor to be appointed'}")
s=s.replace('<td><strong>${p.name}</strong>', '<td><strong><button data-project="${projects.indexOf(p)}" style="text-align:left;padding:0">${p.name}</button></strong>')
s=s.replace('<input name="name"', '<input aria-label="Name" name="name"').replace('<input name="region"','<input aria-label="Region" name="region"').replace('<select name="source"','<select aria-label="Lead source" name="source"').replace('<input name="value"','<input aria-label="Estimated value" name="value"').replace('<input name="amount"','<input aria-label="Proposal amount" name="amount"')
p.write_text(s,encoding='utf-8')
