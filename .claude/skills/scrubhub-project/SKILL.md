---
name: scrubhub-project
description: ScrubHub repo orientation — what the product is, the directory layout, the tech stack, and the architectural conventions to follow when reading or writing code in this repo. Use this skill whenever working in the scrub-hub Next.js project (any file under app/, components/, actions/, server/, lib/, hooks/, supabase/, types/) so you don't have to re-discover where things live or how layers connect.
---

# ScrubHub — project knowledge

## What ScrubHub is

A healthcare housing + staffing marketplace serving Ontario's 401 corridor. Three user roles:

- **tenant** — travelling nurses, locum doctors, healthcare practitioners looking for furnished short-term stays near a hospital and/or contract roles.
- **landlord** — property owners listing furnished units within walking distance of a hospital.
- **enterprise** — hospitals / clinics / staffing agencies posting roles and consuming the housing supply for their workforce.

The marketing site at `www.scrubhub.ca` is for discovery and signup. The authenticated app at `app.scrubhub.ca/dashboard` is the actual product.

## Top-level directory map

| Path | Purpose |
|---|---|
| `app/` | Next.js 16 App Router. Segment groups: `(auth)`, `(marketing)`, `(platform)`. Plus `api/` for route handlers. |
| `actions/` | Server actions (`'use server'`). Always Zod-validate input, then call a service. ~11 modules: profile, bookings, auth, listings, n9, job-applications, tenant-application, etc. |
| `components/` | Feature-scoped React components: `auth/`, `billing/`, `bookings/`, `dashboard/`, `facility-map/`, `jobs/`, `landlord/`, `listings/`, `n9/`, `onboarding/`, `profile/`, `tenant/`, `www/`, `brand/`, `layout/`. Shared primitives live in `components/ui/` (shadcn-style). |
| `hooks/` | Client React hooks: `use-facility-map`, `use-job-apply`, `use-job-filters`. |
| `lib/` | Utilities + integrations. `supabase/{server,client}.ts` (the only place Supabase clients are instantiated), `validation/schemas.ts` (Zod), `integrations/` (Stripe, Mapbox, Supabase Storage, OpenAI, Twilio), `app-url.ts`, `marketing-site.ts`, `roles.ts`, `rate-limit.ts`. |
| `server/` | Server-only logic. `auth/` (session resolution, dashboard routing), `guards/` (`requireAuth`, `requireVerifiedRole`, `requirePlan`), `repositories/` (13 modules — pure Supabase data access), `services/` (12 modules — business logic), `errors.ts`. |
| `types/` | `database.ts` is the single source of truth for DB shapes and enums (`AppRole`, `Profile`, `WorkerProfile`, `Booking`, `Listing`, `Subscription`, etc.). |
| `supabase/` | `config.toml` + numbered SQL migrations in `migrations/`. |
| `public/` | Static assets — fonts, logos, SVGs, docs. |
| `pdf/` | PDF generation utilities (React PDF + pdf-lib). |
| `docs/` | `design-system.md`, `release-runbook.md`, `security-checklist.md`. |
| `middleware.ts` | Subdomain routing (www / app). Supports `?host=app|www` for single-origin dev. |

There is **no** root `CLAUDE.md` or `AGENTS.md`. This skill is the closest thing — keep it updated.

## App Router segments

- `app/(auth)` — `/login`, `/signup`. Unauthenticated.
- `app/(marketing)` — `/` landing, `/staffing`, `/plans`, `/listings`, `/facility-map`, `/auth/callback`, `/privacy`, `/terms`, etc. Served at `www.scrubhub.ca`.
- `app/(platform)/dashboard` — the authenticated app. Subroutes: `profile`, `bookings`, `listings`, `landlord/*`, `tenant/*`, `n9/*`, `staffing/*`, `facility-map`, etc.
- `app/(platform)/(public)` — public discovery features accessible without login (facility map, listing detail). Lives under `(platform)` so it can share dashboard layouts when authed, but is reachable anonymously.
- `app/api/` — route handlers. `ai/*` (OpenAI listing copy), `auth/signout`, `geocode`, `listings/map`, `webhooks/{stripe,twilio}`.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16.1.6**, React 19.2.3, App Router, Turbopack |
| TS | strict, path alias `@/*` |
| Styling | **Tailwind v4** + `tailwind-merge`, shadcn/ui primitives (Radix-based) in `components/ui/` |
| DB / Auth | **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) — Postgres + Auth + Storage |
| Forms | `react-hook-form` + **Zod** validators in `lib/validation/schemas.ts` |
| Maps | **Mapbox** + MapLibre GL — *not* Google Maps. `lib/integrations/mapbox.ts`. |
| Payments | **Stripe** for subscriptions. Webhook at `app/api/webhooks/stripe/`. |
| Email | **Resend** — keys in `.env.local` (`RESEND_API_KEY`, `RESEND_FROM_EMAIL=service@scrubhub.ca`). Package may or may not be installed — check `package.json`. |
| SMS | **Twilio**. Webhook at `app/api/webhooks/twilio/`. |
| AI | **OpenAI** for listing description generation. |
| Icons | `lucide-react`. |
| Toasts | `sonner`. |
| PDF | `@react-pdf/renderer` + `pdf-lib`. |
| Lint | ESLint 9 (`eslint-config-next`). |

## Architectural layering — follow this

```
client component / page
        │
        ▼
  server action  (actions/*.ts, 'use server')   ← Zod-validate input here
        │
        ▼
  service       (server/services/*.ts)          ← business logic, orchestration
        │
        ▼
  repository    (server/repositories/*.ts)      ← Supabase queries, returns typed rows
        │
        ▼
  Supabase
```

Rules:
- **Mutations always go through a server action**, never client → Supabase directly.
- **Every action input** is parsed by a Zod schema (add to `lib/validation/schemas.ts`).
- **Services own business logic**; never put logic in a repository.
- **Repositories own SQL**; never put a Supabase call outside a repository for a real table.
- **`lib/supabase/server.ts`** is the only place to instantiate the server client (it's `async` and reads cookies via `next/headers`). `lib/supabase/client.ts` is the only place for the browser client.
- **Guards** (`server/guards/`) enforce permissions: `requireAuth()`, `requireVerifiedRole(role)`, `requirePlan(plan)`. Call them at the top of server actions / server components / route handlers.
- **External SDKs** are wrapped in `lib/integrations/*.ts` (Stripe, Mapbox, Resend, OpenAI, Supabase Storage). Never `new Stripe()` in a feature file.
- **Types** come from `types/database.ts`. If you add a column, update this file in the same change.

## Auth flow at a glance

- Google OAuth: client calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: getAppAuthCallbackUrl() } })` (see `components/auth/LoginForm.tsx`).
- `getAppAuthCallbackUrl()` (in `lib/app-url.ts`) returns `https://app.scrubhub.ca/auth/callback` in prod, `${origin}/auth/callback` on localhost.
- Callback route at `app/(marketing)/auth/callback/route.ts` exchanges the code, flips `verification_state` to `'verified'`, redirects to `/dashboard`.
- Supabase redirect-URL allow-list (Dashboard → Auth → URL Configuration) must include both `https://app.scrubhub.ca/auth/callback` and `https://www.scrubhub.ca/auth/callback`.
- Google Cloud Console authorized redirect URIs must be `https://<project-ref>.supabase.co/auth/v1/callback` (Google bounces to Supabase, *not* the app).

## Dev workflow

Scripts (`package.json`):

- `npm run dev` — Next dev server on `http://localhost:3000`.
- `npm run build` — production build.
- `npm run start` — run production build.
- `npm run lint` — ESLint.

There is **no test runner yet**. The smoke test you run after every change is:

```
npx tsc --noEmit
```

This must pass before committing. `npm run lint` should pass too.

### Subdomain simulation in dev

The app uses two subdomains in prod (`www.scrubhub.ca` and `app.scrubhub.ca`). In dev, append `?host=app` or `?host=www` to any URL and `middleware.ts` will route it as if from that subdomain. This lets you test the auth/redirect flow without DNS.

## Environment variables

Stored in `.env.local` (not committed). Key ones:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, used by both clients.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, never expose.
- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_WWW_URL` — full URLs of each subdomain in prod. Empty in dev.
- `MAPBOX_ACCESS_TOKEN` — server-side geocoding (`app/api/geocode/route.ts` returns 503 if missing).
- `OPENAI_API_KEY` — optional, only for listing copy generation.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` — transactional email.
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` — SMS.

There is no `lib/env.ts` typed accessor yet. Read `process.env.X!` directly with a `!` and assume it's set, or add the env file if you're touching env handling broadly.

## Conventions worth remembering

- **No emojis in committed files** unless the user explicitly asks.
- **No new markdown docs** unless the user asks. Update existing ones (this skill, `docs/*`).
- **Brand colors** (single source: `app/globals.css`): `--paper #F7F4EE`, `--paper-deep #EFE9DD`, `--ink #0E1A2B`, `--ink-soft #3A4759`, `--ink-mute #6B7585`, `--accent-blue #1E5BBE` (clinical blue), `--font-serif Instrument Serif`. Editorial italic accents in marketing headlines use blue.
- **Imports** use the `@/` alias, not relative chains.
- **File naming** mirrors Next conventions: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `not-found.tsx`. Component files use kebab-case (`new-listing-modal.tsx`) except a handful of older PascalCase ones — match the directory's existing convention rather than inventing a new one.
- **Supabase migrations** are zero-padded and numbered: `00010_listing_photos_bucket.sql`. Take the next number when adding.
- **Windows-safe**: this repo is developed on Windows. Don't use POSIX-only shell features in scripts.

## File-finding cheatsheet

When you're looking for…

- the Supabase client → `lib/supabase/{server,client}.ts`
- a Zod schema → `lib/validation/schemas.ts`
- a DB type → `types/database.ts`
- the OAuth callback → `app/(marketing)/auth/callback/route.ts`
- the dashboard shell → `components/dashboard/dashboard-header.tsx` + `components/dashboard/dashboard-sidebar.tsx`
- the marketing header → `components/layout/site-header.tsx`
- the listing-apply entry → `components/facility-map/FacilityMapListingApply.tsx` → `components/listings/application-form.tsx`
- the tenant pre-flight check → `actions/tenant-application.ts`
- a file upload helper → `lib/integrations/supabase-storage.ts`
- a Stripe call → `lib/integrations/stripe.ts`
- the logo component → `components/brand/scrubhub-logo.tsx`
