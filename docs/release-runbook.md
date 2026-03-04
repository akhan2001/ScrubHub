# ScrubHub MVP Release Runbook

## Pre-Release (T-1 day)
1. Run `npm run lint`.
2. Apply latest Supabase migrations in staging.
3. Validate environment variables for Supabase, Stripe, Twilio, and OpenAI.
4. Smoke test role onboarding for tenant, landlord, and enterprise.

## Release Day Checklist
1. Deploy application build.
2. Apply `supabase/migrations/00002_mvp_workflow_schema.sql`.
3. Verify auth callback and sign-out routes.
4. Verify landlord can create listing only after verification.
5. Verify tenant can submit booking and create payment intent.
6. Verify enterprise can create organization and job posts.
7. Verify webhook endpoints are reachable and reject invalid signatures.

## Security Gate
1. Execute checks from `docs/security-checklist.md`.
2. Confirm RLS deny behavior by testing unauthorized reads and writes.
3. Confirm rate-limited endpoints return `429` under burst traffic.

## Rollback Plan
1. Roll back app deployment to previous stable build.
2. Disable external webhook forwarding if data divergence is detected.
3. Restore DB from last backup if migration rollback is required.
4. Communicate incident status and ETA in the release channel.

## Post-Release Monitoring
1. Review auth error rates and webhook failures.
2. Review booking and payment audit events.
3. Review Twilio/OpenAI error logs for retries.
