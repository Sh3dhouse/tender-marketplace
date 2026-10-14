# Hilton Haulage Transport tracking connection

Status: HHT is the user-nominated carrier. The owner asks us to assume access can be obtained. Account access, the actual portal URL, supported API/event format and credentials have not yet been supplied or verified. No live HHT call is made by SHP 1.2.

[Hilton transport services](https://hiltonhaulage.co.nz/transport/) describes nationwide transport. [Global logistics](https://hiltonhaulage.co.nz/global-logistics/) describes visibility and electronic documentation through its online customer portal. The unrelated Hilton hospitality developer portal is not a freight integration source.

## Access and adapter contract

Confirm with HHT whether the SH account supports an API, webhook, EDI export or a permitted polling feed; obtain the real endpoint, authentication, request limits, event IDs/status codes and proof-of-delivery access rules. Do not scrape a private portal or store carrier secrets in client JavaScript.

The internal tracking integration should map a verified carrier reference to a shipment ID and project ID, normalize carrier status/events into an append-only timeline, record source and retrieval time, and keep internal material holds separate from carrier delivery status. A delivered carrier status cannot clear an unresolved damage/shortage hold. Do not mark customer acceptance from a carrier scan.

Expected internal normalized information: carrier, trackingNumber, carrierStatus, carrierUpdatedAt, retrievedAt, trackingUrl, events with stable carrier event ID/date/location/status/description, and optional proofOfDelivery reference. This is an SHP adapter contract, not a claimed HHT API format.

Server requirements: verify project ownership, protect credentials in runtime secrets, validate payloads/signatures where supported, deduplicate event IDs, handle retries and stale feeds, throttle/poll to vendor limits, and send notifications only on meaningful verified changes. Use permission-controlled proof-of-delivery storage. Keep events auditable and label manual versus carrier updates.

## Current implementation

Each shipment carries a carrier reference, explicit HTTPS tracking link when SH has the actual URL, supplier/project/manifest mapping and manually recorded events. Missing portal URLs remain blank. No invented tracking URL or simulated live update is shown. HHT service links are informational.

An actual live feed remains a next integration step after access confirmation. Photos and consignment PDFs currently persist in local IndexedDB, independent of file metadata in localStorage; production needs secured central storage and verified access.
