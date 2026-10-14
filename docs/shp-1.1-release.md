# SHP 1.1 implementation and next steps

## Role delivery

Shed House: estimate lines, quote reference/validity, sales stages, manual/pasted-email notes, contract-ready lead conversion, kitset category register, supplier/order references, ordering CSV, document/consent links, draft supply particulars, trial fees, notifications and preferences.

Customer: actual-consent inspection hold points with evidence, inspector/date and prominent unresolved warnings; variation request and assessed approval workflow; documents and readable inventory; structured contractor tender scope and optional tender service interest.

Contractor: awarded-scope summary, visible documents/inventory, internal estimate lines and NDA review preference, draft stage valuations, hours/date meters, business/subcontractor licence/insurance/certificate register, membership interest, and completion/ROW preparation with owner/project/consent/practitioner fields.

## Shared workflow

One browser-local state coordinates project documents, inventories, tender scopes, variation statuses and role/project notifications. Contractor-only cost lines are omitted from staff/customer screens, but the browser is not a confidentiality boundary. Customer demo owns Lawson; contractor demo starts on Ridgeview and gains Lawson context after a demo tender selection. Staff can manage all demo projects. A future backend must enforce actual person/project assignments independently of the UI.

Variation: requested -> assessment -> customer approval -> approved work. Changes never start construction or issue an instruction automatically. Actual signature/authority, consent changes and contract notices need separate operational controls.

Inspection: planned consent hold -> recorded pending/pass/fail with evidence. A recorded pass is tracking information, not council approval. The portal shows the warning before continuing work; actual programme gating requires a real milestone engine and verified consent mapping.

Notifications: durable event inbox + email for required decisions/digests + opt-in SMS for urgent holds. Production should use an outbox queue, deduplication, per-project recipients, delivery attempts, acknowledgement, overdue escalation and audit history. This release stores events/preferences locally without outbound messaging.

## Fees selected for trial

Contractor NZ$99/month excluding GST (NZ$113.85 including GST). Customer NZ$399 per kitset tender excluding GST (NZ$458.85 including GST). Optional customer selection is interest only. Payment processor, verification, service coverage, cancellation/renewal, refunds and commercial terms must be implemented before charging.

## Regulatory and integration findings

- [LBP Records of Work](https://www.lbp.govt.nz/for-lbps/skills-maintenance/codewords/records-of-work/): each responsible LBP provides the record to the homeowner and territorial authority on completion; non-payment is not a basis for withholding. Draft preparation and payment tracking are separate.
- [Official Record of Building Work form](https://www.lbp.govt.nz/assets/lbp/documents/forms/memorandum-record-of-building-work.pdf): prescribed form completion, practitioner review and signature remain required.
- [Construction Contracts Act section 6](https://www.legislation.govt.nz/act/public/2002/0046/latest/DLM163456.html): construction work can include customized prefabricated components. Obtain review of the actual SH supply arrangement rather than assuming supply is outside the Act.
- [MBIE construction payment requirements](https://www.building.govt.nz/projects-and-consents/why-contracts-are-valuable/construction-contracts-act-2002/other-requirements): draft claim checklist includes contract/work/period, amount/calculation, due date, statutory identification, prescribed Form 1 and service review.
- [MBIE homeowner protection](https://www.building.govt.nz/getting-started/your-rights-and-obligations/homeowner-rights-and-obligations/know-your-rights-consumers/protection-for-homeowners): residential building and consumer obligations require review for the actual work and agreement. No compliance certification or executed legal template is provided.
- [MBIE building to consent](https://www.building.govt.nz/projects-and-consents/build-to-the-consent): use the actual consent requirements and inspection process.
- [Objective Build](https://www.objective.com/products/objective-build) and [document management](https://www.objective.com/resources/whats-new-document-management): published product information confirms document workflows; no supported SH portal API was verified. Manual permission-controlled links are implemented; automatic sync requires vendor/council confirmation, authorisation and technical documentation.

## Operational phase

Invitation-only authentication, server role/project permissions, contractor private data separation, a durable database, secure uploads and version history, verified practitioners, reviewed legal agreements, prescribed forms, actual billing, authorised email integration and notification delivery. Demo data must not be migrated as actual contracts/approvals/consents.
