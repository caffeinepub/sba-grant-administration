# Specification

## Summary
**Goal:** Make the admin portal easier to understand by simplifying “Receiving Accounts” wording into clear “Payment Methods/Payment Accounts” language and improving discoverability from the Admin Dashboard.

**Planned changes:**
- Rename admin-facing labels from “Receiving Accounts” to “Payment Methods” (or “Payment Accounts”) across admin navigation and relevant admin pages, without changing the existing /admin/accounts route.
- Update the /admin/accounts page title/description to match the new “Payment Methods/Payment Accounts” wording.
- Add a clear “Payment Methods” (or “Payment Accounts”) button/link on the Admin Dashboard that navigates to /admin/accounts (within the existing authenticated admin area).

**User-visible outcome:** Admins see clearer “Payment Methods/Payment Accounts” wording throughout the admin area and can quickly jump to the payment details management page from the Admin Dashboard, while routes and public-page behavior remain unchanged.
