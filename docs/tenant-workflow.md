# Tenant journey (housing) — product & email flow

This describes how a **tenant** moves through ScrubHub for **staff housing listings**, and which emails fire today.

## 1. Account & access

| Step | What happens | Email (Resend) |
|------|----------------|----------------|
| **Sign up (email/password)** | Supabase sends the **confirm email** link (Supabase templates). | **`email_signup_pending_verification`** — ScrubHub-branded note to check inbox and sign in after confirming. Requires `SUPABASE_SERVICE_ROLE_KEY` + `sendSignupFollowUpEmail`. |
| **Sign up (instant session)** | Project allows login without separate confirm step. | **`email_welcome_user`** — same as below. |
| **Sign up / first login (Google OAuth)** | User returns via `/auth/callback`. | **`email_welcome_user`** when profile flips to verified the first time (existing behaviour). |

## 2. Profile & applying

1. **Role & onboarding** — Tenant selects role, completes verification requirements (profile, payment method, ID/consent as enforced by the apply gate).
2. **Browse** — Facility map / listings; open a property.
3. **Submit application** — Form collects move-in date, optional message, consent.

## 3. After application submit

| Channel | What the tenant gets |
|---------|----------------------|
| **Email** | **`email_booking_application_submitted_tenant`** — Confirms listing, address, move-in, message; explains landlord review and next steps; CTA to **My bookings**. |
| **In-app** | Notification log: `booking_application_submitted` (shows in the dashboard bell for `in_app` channel). |
| **Landlord** | Existing landlord email + approvals link. |

## 4. Later in the pipeline

| Event | Tenant email (existing) |
|-------|-------------------------|
| Landlord **approves** | `email_booking_approved_tenant` |
| Landlord **rejects** / similar | `email_booking_rejected_tenant` |
| **Payment** completed (landlord-side flow) | Landlord gets payment email; tenant UX may add receipts later. |
| **N9 / lease** | Separate N9 tenant emails when applicable. |

## 5. Operational notes

- **Resend**: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_APP_URL` for correct links.
- **Signup follow-up**: Without `SUPABASE_SERVICE_ROLE_KEY`, post-signup ScrubHub emails are skipped (logged); Supabase confirm mail still works.
- **Job applications** (enterprise jobs) use a different flow (`job-applications`); this doc is housing-focused.
