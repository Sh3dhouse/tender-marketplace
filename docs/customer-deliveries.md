# Customer delivery workspace — SHP 1.2

`window.SHDeliveries` exposes Deliveries & evidence, Damage & missing items, and Kitset upgrades. Load its JS/CSS before routing. The shared context includes `files.put/get/list/remove`; evidence blobs are written only to that IndexedDB API, while shared store records contain attachment metadata and IDs only.

Delivery receipts capture shipment, arrival time, receiver, condition and notes. Completed receipts require kitset photos and an actual signed consignment document. Drafts permit missing evidence, remain visibly incomplete, and accept additional evidence later. No signatures are invented. Photos support JPEG/PNG/WebP; signed documents support PDF/JPEG/PNG. Each record is limited to 10 files, each up to 10 MB. Failed multi-file writes attempt cleanup before any shared record is created. Local evidence is previewed/downloaded after project and owner checks; object URLs are revoked on rerender.

Damage reports link project shipments and manifest inventory references, with expected and observed quantities, descriptions, carrier deadline notes, attachments and status/history. The guide prompts users to check carrier-specific terms, keep damaged goods/packaging, document differences, and seek SH assessment before installing unsafe parts. Local notifications reach all preview roles; neither carrier claims nor outbound messages are sent.

Shipment events and statuses are explicitly manual. External carrier links accept HTTPS only. Active upgrades show supplier, ex-GST and inclusive GST prices. Interest requests snapshot price and notify parties, without creating an order, contract variation or automatic work authorisation.

Local evidence is device/browser specific and is not backed up or shared with other devices. Production needs server storage, malware/content validation, verified project access, retention controls and delivery integration. Client MIME/size validation is an intake convenience, not server security.
