# Customer design details

`SHCustomerDesign` exports Project information, Fixtures & finishes, Mood board pages, render/bind, panel/bindPanel, validateFacts and validateMood. Root routes staff/customer to pages and includes panel on customer Overview.

Project facts are staff-entered with source/revision and explicit Unconfirmed, SH confirmed or Test reference status. Existing Gable model names are not used to infer area or room counts. Unconfirmed values remain visibly unconfirmed. The lockup test reference is seeded only from plan facts visually verified by the coordinating agent, as detailed below. Icons are inline SVG with adjacent readable labels. Total floor area records measurement basis separately.

The fixtures page separates SH-entered base specifications from customer supplier/product/finish preferences. Categories cover exterior roof, walls, joinery and interior walls, flooring, kitchen and bathroom. No suppliers are recommended or ordered automatically. Preferences do not change contracts or price. Staff-only base controls and staff/customer preference controls retain project IDs and save rollback on storage failure.

Exterior schematic uses `window.SHColorsteelPalette={sourceUrl,verifiedAt,colours:[{id,name,hex}]}` supplied by the root after source verification. IDs must match that verified palette; only six-digit hex values are rendered. It is an approximate diagram rather than a recoloured house photo. Actual samples, product availability and SH suitability checks remain necessary. Interior colours are separate generic customer preferences, not represented as COLORSTEEL paint.

Project-scoped arrays: projectFacts, finishSpecifications, finishSelections, moodboards. Data remains in the shared device-local workspace; no remote upload or publishing is performed by this module. Existing plan-set, delivery and inventory functionality is untouched.

Verified test-reference facts: only SH-TMP-DEMO-LOCKUP seeds 300 m² ground-floor plan area (including 177 m² garage), two bedrooms and two bathrooms including ensuite, based on root visual inspection of user-supplied PLANS.pdf A101 dated 05/10/2026. This is explicitly Test reference — verify with SH; total area including mezzanine remains unconfirmed and is shown beside the area card. Other projects retain unknown values.
