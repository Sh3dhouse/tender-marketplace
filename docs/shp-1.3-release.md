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

## Customer visual reminder and quick plan set

The Customer dashboard and Project documents page include a project-specific visual reminder and quick plan access. A dedicated Plan set page groups floor plan, elevations and selected renders; three renders (front exterior, rear exterior, interior) are the starting suggestion. Shed House manages project files, versions, status and selection through Plan set. No architectural source render or plan was supplied, so the initial view clearly asks for the actual project files rather than displaying a fictional house as contracted.

Images and PDFs use the existing device-local file store. Uploaded files are not included in Git or the deployment archive, and do not synchronize across browsers. Status labels are supplied by SH; uploading a file does not approve a design or establish consent. Production requires shared durable storage and account/project authorization.

## Customer project information and design preferences

Project information cards use SH-entered facts and source/status labels rather than deriving area or bedroom counts from a model name. The lockup test reference uses supplied PLANS.pdf A101 (05/10/2026): 300 m² ground-floor area including garage, two bedrooms and two bathrooms including ensuite. Mezzanine-inclusive total floor area remains unconfirmed. Other project facts await SH entry.

Customer fixtures and finishes are draft preferences grouped by construction element, with supplier, product, finish and notes. No order, substitution or contract variation is executed by saving a preference.

The mood board combines a schematic gable exterior with separate roof and cladding selectors, and interior colour preferences. Its COLORSTEEL digital swatches were read from the official colour selector HTML on 15 October 2026: https://www.colorsteel.co.nz/colours . Names and digital swatches support visual exploration only. Physical samples, product/finish availability and the actual project specification require confirmation. The schematic is not a recoloured photo, engineering model or approved project render. No exterior steel colour is represented as an interior paint product. Preferences remain browser-local in this prototype.
