# Customer workspace

Four pages are exposed by `window.SHCustomer`: Inspections, Variations, Project documents, Tender scope. The root application supplies project selection, context, persistence, navigation and the shared notification inbox. Both files must load before the root render uses this module.

All mutations are local demonstration records. Inspection hold points must be mapped to actual consent requirements. A manually recorded pass is evidence tracking, not council approval. No construction stage is automatically released. Inspection creation and result changes notify all three roles.

Customers create variation requests. The staff/contractor assessment workflow should use shared statuses `requested`, `assessment`, `customer approval`, `approved work`. Customers can approve at the customer approval state or return for assessment. Notifications do not automatically authorise or begin work.

The project library reads shared documents visible to `customer`. Links accept HTTP and HTTPS only and open with noopener/noreferrer. Shared documents have no fabricated defaults or official approval claims.

Scope revisions capture inclusions, exclusions, responsibilities, site access, consent references, specification revisions and acceptance criteria. Optional tender selection stores interest and a fee snapshot. An unset fee remains visibly unconfigured; no payment is taken. Scope revision storage currently keeps the current revision number, not historical snapshots.

Shared keys: inspections, variations, documents, tenderScopes, tenderOptions, fees.customerTender. Notifications use `staff`, `customer`, `contractor` role identifiers. Data fields and mutation events are escaped on output.

Customer followup: Kitset inventory groups shared customer-visible items by category and hides supplier ordering information. Inline document content is escaped, preserving preparation draft labels. Inspection due dates sort upcoming first, with unresolved hold counts. Tender service snapshots preserve fees excluding and including configured GST, with the GST rate.

Final UI QA: inspection recording uses inline expandable forms; recorded pass requires inspector, inspection date and evidence. Variation approval uses an inline explicit review checkbox, and both decisions append customer status history. No native prompt/confirm dialogs are used.
