# ScrubHub Security Checklist

## Authentication and Session
- Verify unauthenticated users are redirected from `/dashboard` and nested routes.
- Verify callback failures redirect to `/login?error=auth`.
- Verify role updates only happen through `actions/auth.ts`.

## RBAC and Route Guards
- Tenant cannot access landlord routes.
- Tenant cannot access enterprise routes.
- Landlord cannot access enterprise team or jobs routes.
- Enterprise cannot access landlord listing management routes.
- Ensure `requireRole`, `requireAnyRole`, and `requireVerifiedRole` are enforced on server actions.

## Supabase RLS
- Confirm RLS is enabled on all new tables in `00002_mvp_workflow_schema.sql`.
- Confirm `bookings` and `payments` are restricted to tenant/landlord relationships.
- Confirm `org_memberships` and `job_posts` are constrained by `org_id` membership.
- Confirm screening rules are only editable by owning landlord.

## Integrations and Webhooks
- Verify Stripe webhook requires `stripe-signature`.
- Verify Twilio webhook requires `x-twilio-signature`.
- Verify webhook routes are rate-limited.
- Verify webhook events write `audit_events`.

## Validation and Error Handling
- Verify all mutating actions parse payloads with Zod.
- Verify known validation failures return safe errors and do not leak secrets.
- Verify payment and booking mutations reject invalid UUIDs and invalid state transitions.

## Data and Auditability
- Verify `role_change_events` is populated on role updates.
- Verify booking state updates create `booking_events`.
- Verify integration events are recorded in `audit_events`.
