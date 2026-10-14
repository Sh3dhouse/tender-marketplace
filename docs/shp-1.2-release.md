# SHP 1.2 — supply, freight and contractor accounts

Three role agents worked in separate worktrees, with a fourth pricing-model agent preparing the development spreadsheet. Their source changes are integrated with the existing SHP 1.1 workflows.

## Delivered

Shed House: ranked material suppliers with availability/approval evidence, upgrade packages with baseline price delta, nationwide project freight register, manifests linked to kitset inventory, supplier/SH/carrier/customer handovers, and damage/shortage assessment with owner, carrier case reference, material hold, remedy and resolution confirmation. HHT is the owner-nominated default carrier; material suppliers remain unassigned until entered by SH.

Customer: delivery manifest and manual tracking history, actual photo/PDF attachment controls, signed-consignment evidence, incomplete receipt drafts, missing/damaged item reports with expected and observed quantities, how-to guidance, and optional upgrade assessment interest. Available SH upgrade packages are shared with customer views. Interest does not authorize an order or change contract scope.

Contractor: selectable stage/milestone, progress valuation, time/materials and fixed-price invoice preferences; supplier/GST/terms/tax-basis settings; adapted draft invoices and exports; validated spreadsheet CSV preview/import with retained manual lines and source provenance; first development pricing XLSX and matching CSV.

## Verification

Syntax and cross-role smoke checks passed for all navigation pages, project scoping, document/inventory visibility, freight/inspection holds, upgrade status compatibility, pricing CSV rejection/calculations, imported example reconciliation and invoice GST calculations. Browser checks covered supplier/consignment/manifest creation, a real PNG/PDF test upload, evidence reappearance after reload, customer shortage-to-SH hold, and a time/materials draft of NZ$700 net + NZ$105 GST = NZ$805 gross.

Spreadsheet formula/error and cached-total checks passed: NZ$2,400 cost, NZ$2,870 sell, NZ$430.50 GST and NZ$3,300.50 including GST. The bundled visual renderer failed because Vulkan was unavailable; native Excel visual review remains required. The workbook is a development foundation, initially three example rows, not an approved estimating model.

## Boundaries

No live HHT access has been verified; the owner assumes it can be obtained. Manual statuses and external carrier links are labelled accordingly. See hht-tracking-integration.md for the internal integration plan. No carrier claim, message, booking, purchase order, payment or statutory invoice is sent.

Files persist only on the current browser/device using IndexedDB; the private production URL and localhost have separate storage origins. Clearing browser data removes evidence. Shared records/notifications are browser-local demonstrations; production permissions, central storage, file scanning, delivery notifications and audit remain required.

Do not manufacture signatures or treat uploaded documentation as automatic acceptance. Keep affected materials identifiable, retain packaging and evidence, avoid installation pending assessment, and check actual carrier terms promptly. No universal carrier claim deadline or liability promise is assumed.
