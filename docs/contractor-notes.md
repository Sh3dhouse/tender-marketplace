# Contractor role

Six role pages implement browser-local scope review, private estimate lines, stage valuation drafts, hours and programme meters, practitioner records and completion record preparation. Load contractor.css and contractor.js, then call SHContractor.render(page,ctx) / bind(page,ctx). Persisted project selection uses store.contractorProjectId; the host must apply this to ctx.projectId when building context. All mutations use ctx.save and no network requests are made.

Quote costs remain UI-private only. Production needs server-enforced tenant/project permissions, separate cost data, verified accounts, safe document storage and audited release. NDA choice is a proposed review preference, not an executed agreement.

Payment claims are draft valuations only. Section 20 checklist and prescribed Form 1 review are shown; no claim is served, certified or represented as compliant. See the current Construction Contracts Act and MBIE guidance linked in the interface.

ROW treatment intentionally separates payment from release. Official LBP guidance says a Record of Work cannot be withheld for non-payment. The preparation draft requires review and confirmation that the practitioner's work is completed. It contains no fabricated signature, is labelled as not the prescribed official form, and links to official guidance/forms. A released preparation draft does not replace the statutory ROW.

Scope/inventory/document lists consume shared records defensively. Documents use the agreed schema and released drafts include content. Empty scope falls back to an explicitly illustrative scope, never a claimed actual award. Agent does not publish or push.
