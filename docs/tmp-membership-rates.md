# Proposed TMP membership tiers

Builder / managing contractor: NZD 149/month excluding GST, 171.35 including 15% GST. Trade subcontractor: 99 excluding, 113.85 including. Supply-only supplier: 49 excluding, 56.35 including. These are product suggestions, not researched market economics or approved charges.

Module window.SHMembership exposes pages, render and bind. Only membershipTierProposals, membershipTierInterests and contractorTenderProfiles are initialised; the existing store.fees.contractorMonthly is never changed. Proposal rates can be supplied through membershipTierProposals. Every interest snapshots tier price and GST. Signup has no subscription activation, payment or binding terms. Staff see proposals and recorded interests but cannot submit interest in this UI.

Contractor interest records optional NZBN using format validation only, and self-declared tenderRole/tradeType in contractorTenderProfiles. No verification is claimed. Overlapping roles are explained as a negotiable proposal to use the highest applicable tier, not an enforced upgrade. Pricing, eligible invitations, tender types, invoices and privacy are compared without promising leads. No shared files, publication or push performed.
