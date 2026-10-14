# Shed House role additions

Six standalone demo pages expose lead pricing and notes, categorized kitset ordering, project document registration, draft supply particulars, marketplace fee configuration and a staff activity inbox.

Integration: load dist/staff.js and dist/staff.css. SHStaff.render(page, ctx) returns content; call SHStaff.bind(page, ctx) after insertion. ctx contains projectId, project, projects, leads, store, save, notify, navigate, money, escape and toast. The project selector persists store.staffProjectId; root should derive staff ctx.projectId from it. ctx.save must persist both the shared store and current CRM leads to retain pipeline updates. notify events provide visibility roles and project ID.

Inventory records contain projectId, category, name, spec, qty, unit, supplier, orderReference, status and visibility. Customer/contractor views can read the shared register without mutation. Template quantities deliberately start at zero and require engineer/supplier reconciliation. Documents are registered HTTPS links, not uploads. Document statuses are manually recorded by SH; links do not grant external access. Restrict all production writes with server authorization.

Agreement pages are expressly unreviewed drafts without signatures or a compliance claim. Professional review must determine statute applicability and final terms. Fees start unset and are proposals in NZD excluding 15% GST; no payment service runs. Email notes are manual paste with provenance; email/SMS preferences are planned only. Demo persistence contains no live integration, messaging, billing, authentication or legal execution.
