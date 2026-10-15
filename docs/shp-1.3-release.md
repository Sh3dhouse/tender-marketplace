# SHP 1.3

Three isolated role worktrees delivered the updates, integrated into the shared portal.

## Shed House

Attach a PDF BOM to a project and import a reconciled inventory CSV with category,item_code,description,specification,quantity,unit headers. Repeated manufacturer codes retain distinct source lines. Browser PDF extraction is not automatic: SH validates the structured schedule before import. Source files remain in local IndexedDB, with shared project document metadata.

Two draft TMP projects cover kitset-to-lockup and internal fitout. Each has responsibilities, exclusions, trade and supply-only pricing scopes. Existing SH kitset materials are excluded from duplicate supplier pricing. Trade directory entries can record NZBN verification evidence, confirmed service regions and trades. Regional targeting prepares shortlists; no companies are contacted. Live NZBN lookup remains pending subscribed API access. Registered addresses alone do not establish service coverage. Official reference: https://www.nzbn.govt.nz/using-the-nzbn/nzbn-services/api/

## Customer

Record received and damaged quantities, inspection details and confirmation of a thorough physical check. Shortages and damage appear on the exact supplied inventory line in both roles. Reports can await shipment assignment while retaining material holds. Existing incidents require explicit SH assessment; saving a receipt does not resolve them.

## Contractor

Proposed monthly fees excluding GST: builder NZ$149, trade contractor NZ$99, supply-only NZ$49. Builder pricing reflects subcontractor coordination. These are draft proposals; the existing NZ$99 trial setting is unchanged and charging is disabled.

## Validation and limits

Role workflow checks cover package seed idempotency, repeated item codes, quantities, receipt flags and draft fees. Three private source PDFs were converted into reviewed local test schedules (73, 92 and 114 material rows); administrative rows were excluded and cut lengths remained specifications rather than quantities. One actual PDF was attached and its 73 rows imported through localhost for an end-to-end check. Damage and shortage persisted on the same line across customer and SH views.

Private source PDFs, extracted text and schedules are outside Git and the deployment archive. The hosted preview has separate browser storage and does not contain those local test uploads. Demo role switching and browser storage remain prototype functionality; server authentication, durable shared uploads, live freight/NZBN connections and real billing are not enabled.

## Project management follow-up

Adds a distinct draft project-management-company membership proposal at NZ$199/month excluding GST alongside builder149, trade99 and supply-only49. Proposed eligibility covers appointed coordination duties, relevant experience, business identity and insurance evidence for SH review. A registration or self-declaration is not competence verification; tier interest does not activate billing or project permissions.

The Project manager page records internal phase reviews with pass/fail, reviewer, date and a required explanatory summary. Earlier reviews remain available and records are scoped to the selected project. Contractor preview can record reviews; Shed House and Customer previews can read them. These internal coordination records do not replace council inspections, consent decisions or practitioner certifications. The prototype continues using browser-local storage and demo roles.

## Separate Project Manager role

Project Manager is a fourth role with a dedicated preview entry, dashboard, assigned-project list and phase-review workspace. The dashboard summarises latest passed/failed reviews across assigned projects. Shed House controls demo assignments under Manager assignments; initially only the two TMP demonstration projects are assigned. Empty assignments show an explicit empty state. Contractors can read phase reviews but cannot append them; only the assigned PM role can append pass/fail decisions with required summaries, date and reviewer. Prior history is retained.

Authentication limitation: this static preview does not implement individual credentials, sessions or server-enforced role/project authorization. Sites owner-private access protects the preview audience, not separate business accounts. No fake password form is provided. Operational PM login requires server identity, verified membership, assignment authorization on each request, database-backed reviews and audit history. Membership tier purchase or interest must never grant a project assignment automatically.
