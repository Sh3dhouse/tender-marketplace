# Inventory receipt checks — SHP 1.3

Load `inventory-checks.js/css`. `window.SHInventoryChecks` exposes one customer page, `Inventory receipt check`, plus `summary(projectId, store)` and `rowState(item, store)` for badges in existing kitset lists. The root supplies project access, routing, persistence and local notifications.

The customer must physically check components and explicitly confirm labels, manifest and relevant photos. Quantity-derived checks record expected (read from inventory), actual received, damaged within received, condition, person, date and notes. Non-negative finite quantities are required; damaged cannot exceed received. Extra deliveries are accepted and flagged for SH review. Condition must agree with damage quantity. Uploading delivery documents does not constitute an inspection.

Summary counts are inventory row counts, not component quantities. Damaged and missing can overlap. Row state considers confirmed checks plus unresolved freight incidents. Matching uses project and exact inventory ID; fallback itemCode/bomItemCode matching is used only for incidents without inventoryId. No broad item-name matching. Resolved/Closed incidents cease flagging, but any old physical discrepancy must also be rechecked after remedy. No check resolves incidents or clears holds automatically.

Explicit reporting requires a same-project shipment and creates a Reported incident with hold true, linked source inventory ID and stable item code. `expectedQty`, `receivedQty`, `damagedQty` and `missingQty` are separate. Compatibility field `qty` is damaged plus missing affected quantity, explained in the description. The shipment gets a manual On hold event. All three roles receive local notifications; no carrier claim or outbound message is sent.

Shared records: inventoryChecks, freightIncidents, shipments. Existing inventory supply rows are read, not changed. A replacement check updates that item’s current inspection record; freight incidents retain their independent assessment histories.

Identity followup: code-only incidents match only when that code is unique within the project. Explicit sourceIdentity matches or inventoryId links identify specific cut-length rows. Ambiguous manufacturer codes remain unlinked until SH supplies the exact row ID. A confirmed check marked Needs SH assessment prevents the complete badge even when quantities reconcile; summary.review counts those rows.

Unassigned shipment reporting: a customer can explicitly report a physical discrepancy before SH registers freight. Such incidents retain shipmentId null, shipmentAssignmentPending true and affected-material hold true. Notifications identify the missing shipment assignment. Supplied invalid/other-project shipment IDs are rejected; no carrier or consignment is fabricated.
