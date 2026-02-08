# Specification

## Summary
**Goal:** Build the “SBA Grant Administration” grant application portal with public intake, Application ID-based status tracking, and an Internet Identity–protected admin dashboard for reviewing and managing applications, fees, and payment receiving accounts.

**Planned changes:**
- Create a public homepage with an application form (full name, email, country, requested amount) enforcing $5,000–$50,000 (inclusive), persisting submissions with status = Pending, and returning a unique Application ID with a copy action.
- Add an applicant status tracker where users can look up their application by Application ID and view status (Pending/Approved/Rejected); if Approved, show assigned processing fee and selected payment instructions when configured.
- Implement backend (single Motoko actor) data models and methods for: creating applications, generating unique Application IDs, retrieving public application view by ID, listing applications for admin, and updating status/fee/receiving account; persist all data in stable state.
- Build an admin dashboard UI to list/search applications by Application ID, view full application details, and approve/reject applications.
- Add admin tools to set/update a numeric USD processing fee per application.
- Add admin management for receiving accounts (create/edit/delete Bank or Crypto accounts with full details) and select an account for an approved application; only show account details to approved applicants.
- Restrict admin UI and admin backend methods to authorized administrators using Internet Identity; show an in-app “Not authorized” state for non-admin access attempts and provide a mechanism to configure initial admin principal(s).
- Apply a consistent official, professional government-style theme across public and admin pages (English UI text, accessible contrast, avoid blue/purple as primary colors).
- Generate and include static brand assets in `frontend/public/assets/generated` and wire them into the UI (e.g., header/hero uses local generated imagery).

**User-visible outcome:** Applicants can submit a grant application, receive and copy an Application ID, and later check their application status (and, if approved, see their fee and payment instructions). Admins can log in with Internet Identity to review applications, approve/reject them, set processing fees, manage bank/crypto receiving accounts, and assign payment instructions to approved applications.
