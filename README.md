# Shed House Portal — SHP 1.1

Responsive branded concept using the supplied Shed House SVG logos and brand palette. Work Sans is the approved alternative to Kit Sans, loaded from Google Fonts with a local sans-serif fallback.

Open dist/index.html or serve dist with an HTTP server. This is a browser-only prototype, not an authenticated production customer portal. All names, values, stages, dates and proposals are fictional. CRM leads, demo proposals and a demo contractor selection persist only in browser localStorage; do not enter real personal or confidential information.

Implemented: role entry, sales/CRM, lead pricing and sourced notes, contract-ready project conversion, categorized kitset ordering and CSV export, shared approved-document register, supply agreement particulars and draft export, fee configuration and notification preferences. Customer pages add consent inspection holds, variations, shared documents and inventory, tender scope revisions and optional tender interest. Contractor pages add scope packages, private estimate screens, stage valuation drafts, dual hours/date meters, business/practitioner records, membership interest and ROW preparation.

The three role modules were developed in separate Git worktrees and integrated through dist/workspace.js. The shared browser state uses shp-workspace-v11; existing CRM leads and demo tenders remain compatible. Browser demo role restrictions are not security controls. Do not enter real confidential contractor pricing or personal information.

User-selected trial fees: NZ$99/month contractor and NZ$399 per optional customer kitset tender, excluding GST. Including 15% GST: NZ$113.85 and NZ$458.85. These are editable proposals. No subscriptions, payments, emails or SMS are actually activated or sent.

Objective Build integration currently means registering an HTTPS project/document link, subject to its external permissions. Email notes are pasted manually with provenance. Plans/document metadata added by SH appear in the relevant customer/contractor views in the same browser; no remote file synchronization or secure upload exists yet.

Inventory is a comprehensive category template with zero quantities, requiring approved engineering and supplier reconciliation. Inspection holds must be entered from the actual consent. Agreements and valuations are unreviewed preparations, not certified statutory documents. The ROW workspace prepares information for the official prescribed form, without creating a signature. Completion record sharing is independent of payment; non-payment cannot be used to withhold an LBP Record of Work.

Checks: run the bundled Node executable against scripts/check-workspaces.cjs from this folder. Browser checks cover variation request/assessment/approval persistence, inspection dashboard warnings, fee presentation and contractor meters; responsive width was checked at 390px.

Phase 02: invitation-only authentication, server-side role and project permissions, database, secure documents, audit trail, notifications and real CRM integration. Phase 03: contractor verification, tender lifecycle, proposal comparison, customer award approval, contractor-specific milestones and handover records.

Before operational use, validate actual Shed House contract milestones and responsibility boundaries. The common timeline is a proposed conceptual structure, not a contract statement. Resolve the SHP abbreviation overlap by using Portal and Project in full.
