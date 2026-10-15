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
