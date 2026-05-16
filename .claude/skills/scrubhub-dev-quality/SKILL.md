---
name: scrubhub-dev-quality
description: Engineering habits and quality bar for ScrubHub. Use whenever you're writing, editing, or refactoring code in this Next.js 16 / Supabase / Tailwind v4 repo. Codifies the architectural layering (action → service → repository), input validation discipline, reuse-before-build rules, type-safety smoke test, and PR-scope guardrails so changes are accurate, efficient, and consistent with the rest of the codebase.
---

# ScrubHub — dev quality bar

This is the "how to write code here without making it worse" skill. Pair it with `scrubhub-project` (the orientation skill).

## The five non-negotiables

1. **Layer discipline.** Mutations: `client → server action → service → repository → Supabase`. No shortcuts.
2. **Validate every action input** with Zod. Schemas live in `lib/validation/schemas.ts`.
3. **Reuse before you build.** Grep first — there is almost always an existing helper.
4. **`npx tsc --noEmit` must pass** after every change. Lint should pass too.
5. **Tight scope.** One change per change. Tangents become spawn-task chips, not bigger diffs.

Everything below is detail in service of those five.

## 1. Layer discipline

```
client ──▶ server action ──▶ service ──▶ repository ──▶ Supabase
              (zod)         (logic)      (queries)
```

- **Client components don't talk to Supabase for writes.** Browser client (`lib/supabase/client.ts`) is for auth state, session listeners, and *reads* that are fine to do client-side (rare). Anything else → server action.
- **Server actions** (`actions/*.ts`) are thin: parse input → call `requireAuth()` (or another guard) → call a service → return the result. They do not contain SQL or business logic.
- **Services** (`server/services/*.ts`) are where the *thinking* happens: combine repositories, enforce invariants, orchestrate side effects (email, audit log, etc.).
- **Repositories** (`server/repositories/*.ts`) are pure data access. One module per table or tight cluster. They return typed rows from `types/database.ts`.
- **Guards** (`server/guards/`) are how you assert who can call what. Always at the top of an action / route / server component:
  - `await requireAuth()` — must be signed in.
  - `await requireVerifiedRole('landlord')` — must be a verified landlord.
  - `await requirePlan('pro')` — must have an active Pro subscription.

If you find yourself wanting to call `createClient()` from `lib/supabase/server.ts` directly inside a feature file, stop — that's a repository's job.

## 2. Zod validation

Every server action does this dance:

```ts
'use server';
import { z } from 'zod';
import { mySchema } from '@/lib/validation/schemas';
import { requireAuth } from '@/server/guards';
import { doTheThing } from '@/server/services/thing.service';

export async function doThingAction(input: unknown) {
  const { id, payload } = mySchema.parse(input);  // throws ZodError on bad shape
  const user = await requireAuth();
  return doTheThing({ userId: user.id, id, payload });
}
```

- Define the schema next to others in `lib/validation/schemas.ts`. Don't inline a one-off `z.object({...})` at the top of an action.
- Use `.parse()` and let the throw bubble up — the framework surfaces it. Don't `.safeParse()` and silently no-op.
- File uploads validate `File` instances inside the upload helper (`lib/integrations/supabase-storage.ts`), not in the Zod schema.

## 3. Reuse before you build

Before adding a new helper, **grep for the verb you'd give it**:

| If you're about to add… | First check… |
|---|---|
| an upload helper | `lib/integrations/supabase-storage.ts` (`uploadResume`, `uploadListingPhoto`) |
| a Stripe call | `lib/integrations/stripe.ts` |
| a Mapbox / geocode call | `lib/integrations/mapbox.ts` + `app/api/geocode/route.ts` |
| an OpenAI call | `lib/integrations/openai.ts` |
| a Resend / email send | `lib/integrations/resend.ts` (if present) + `server/services/email.service.ts` |
| a "can this user do X?" check | `server/guards/` |
| a session / role lookup | `server/auth/` |
| a Supabase query for an existing table | `server/repositories/` |
| a URL builder (app vs www) | `lib/app-url.ts` |
| a UI primitive (button, input, dialog) | `components/ui/` |
| a pre-flight check for tenant apply | `actions/tenant-application.ts` (`getTenantApplicationContext`) |

If none of the above match, then add one — but put it in the right home and name it predictably.

## 4. Type-safety smoke test

After any code change, before declaring victory:

```
npx tsc --noEmit
```

Must produce no output. If it fails, fix the types — don't add `any`, don't `@ts-ignore`. The strict TS config is load-bearing.

For UI / layout changes, also visually verify in dev (`npm run dev`) — type-check doesn't catch a broken Tailwind class.

For mutation flow changes (action / service), do at least one end-to-end run in dev with a real Supabase row to catch RLS issues that types can't see.

## 5. Tight scope

One change per change. If, while in the file, you notice:

- a stale TODO that's unrelated
- a typo in unrelated copy
- a missing prop type on a sibling component
- a security smell in adjacent code

…**don't fold it in**. Surface it as a `spawn_task` chip with a self-contained prompt. The current diff stays focused; the tangent becomes its own session.

Exceptions: trivial in-file cleanup (rename a single variable while you're there, remove an unused import the linter catches) is fine. Use judgement — if it'd land in the same PR review without comment, leave it; if it'd draw "this should be a separate PR," chip it.

## File / component placement

- **New mutation**: action in `actions/<feature>.ts`, schema in `lib/validation/schemas.ts`, service in `server/services/<feature>.service.ts`, repository if it touches a new table.
- **New UI component**: under `components/<feature>/`. If it's a generic primitive (button, input, dialog), `components/ui/` instead.
- **New page**: under `app/<segment>/<route>/page.tsx`. Server component by default; add `'use client'` only when you need state, effects, or browser APIs.
- **New table**: SQL migration in `supabase/migrations/<NNNNN>_<slug>.sql`. Add the type to `types/database.ts` in the same change. Build a repository.
- **New bucket**: SQL migration that creates the bucket + RLS policies. Helper function in `lib/integrations/supabase-storage.ts`.

## Naming

- Components: kebab-case file (`new-listing-modal.tsx`) unless the directory already uses PascalCase. Default export is the component, named matching the file (`NewListingModal`).
- Actions: verb-first (`createBooking`, `updateProfile`, `uploadPayStub`).
- Services: `<feature>.service.ts`, exports verb functions.
- Repositories: `<table>.repository.ts`, exports `findX`, `insertY`, `updateZ`.

## Common pitfalls (we've hit these before)

- **Cross-domain auth.** `getAppAuthCallbackUrl()` returns the *app* subdomain. If you start OAuth on www and Supabase isn't configured to allow that callback origin, you'll get "Authentication failed" with no useful message. Whitelist both subdomains in Supabase Auth → URL Configuration.
- **Email sends blocking mutations.** Wrap `resend.emails.send` in try/catch inside the service. Email failures must never roll back the underlying booking / profile / etc.
- **Cached static assets in `public/`.** Vercel edge-caches `/public/*` aggressively. To replace an image users have already loaded, *rename the file* (or add a query string) — overwriting in place is not enough.
- **RLS surprises.** A query that works as service role fails as the user. Always test with a real signed-in user, not just the service role.
- **`useEffect` on server data.** If you're fetching data from a server action via `useEffect`, you probably wanted a server component or a `loading.tsx`. Stop and rethink.
- **Adding `any`.** Don't. Either narrow the type, build a small `z.infer<>` helper from the schema, or extend `types/database.ts`.

## Commit hygiene

- Subject under 70 chars, sentence case, no trailing period.
- Body explains *why* in 1-3 sentences. The diff explains *what*.
- Stage files explicitly (`git add <path>`) — never `git add .` or `git add -A`. Avoids accidentally committing `.env.local`, screenshots in the working tree, etc.
- Don't push to main with failing `tsc` or lint.
- Don't amend a commit that's already pushed.

## When in doubt

- The architecture rules **>** what's already in the repo. Some older files predate the layering — match the *rule*, not the legacy.
- If a file you're editing doesn't follow these rules, fixing it falls under "tight scope" — chip it or open a follow-up. Don't half-refactor mid-feature.
