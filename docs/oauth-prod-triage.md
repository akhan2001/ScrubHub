# OAuth "Unable to sign in" — prod triage (scrubhub.ca)

**Symptoms reported**:
- UI: "Unable to sign in / Authentication failed. Please try again."
- DevTools console: `Uncaught SyntaxError: Cannot use import statement outside a module`

The SyntaxError is the actual blocker — the "Authentication failed" copy is the fallback the page shows when the OAuth handoff doesn't complete. Two independent failure modes, triaged separately.

---

## Triage A — the auth handoff itself

The flow:

1. User on `www.scrubhub.ca/login` clicks Google → `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: getAppAuthCallbackUrl() } })` ([`components/auth/LoginForm.tsx`](../components/auth/LoginForm.tsx)).
2. `getAppAuthCallbackUrl()` → `https://app.scrubhub.ca/auth/callback` ([`lib/app-url.ts:55`](../lib/app-url.ts)).
3. Google → Supabase project URL `<ref>.supabase.co/auth/v1/callback` (this is what Google posts to, NOT the app).
4. Supabase → `https://app.scrubhub.ca/auth/callback?code=…`
5. `app/(marketing)/auth/callback/route.ts` runs `exchangeCodeForSession`, sets cookies on `app.scrubhub.ca`, redirects to `/dashboard`.

### Checklist — verify in this order

**1. Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**

Must include **all** of:
- `https://app.scrubhub.ca/auth/callback`
- `https://www.scrubhub.ca/auth/callback` (in case the user starts the flow from www and Supabase mirrors back)
- `https://app.scrubhub.ca/` (Supabase sometimes posts back to Site URL on failure)
- `http://localhost:3000/auth/callback` (dev — keep this in)

Wildcards are fine: `https://app.scrubhub.ca/**` and `https://www.scrubhub.ca/**` if simpler.

**2. Supabase Dashboard → Authentication → URL Configuration → Site URL**

Set to `https://app.scrubhub.ca`. Site URL is the fallback Supabase redirects to when no redirect_uri matches the allow-list.

**3. Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client**

Authorized redirect URIs **must only** contain:
- `https://<project-ref>.supabase.co/auth/v1/callback`

Do NOT add `app.scrubhub.ca/auth/callback` here — Google posts to Supabase, not the app. Adding app URLs here breaks the flow.

Authorized JavaScript origins should contain:
- `https://app.scrubhub.ca`
- `https://www.scrubhub.ca`

**4. Vercel env vars on the prod deployment**

Confirm set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL=https://app.scrubhub.ca`
- `NEXT_PUBLIC_WWW_URL=https://www.scrubhub.ca`

If `NEXT_PUBLIC_APP_URL` is missing, `getAppAuthCallbackUrl()` falls back to `window.location.origin`, which on the www domain becomes `https://www.scrubhub.ca/auth/callback`. Supabase then rejects if that URL isn't whitelisted → "Authentication failed".

**5. Cookie domain**

Cookies set by `exchangeCodeForSession` are scoped to `app.scrubhub.ca` only. If the user lands on `www.scrubhub.ca/dashboard` they won't see the session. The middleware already redirects www → app for dashboard paths ([`middleware.ts:94-123`](../middleware.ts)), so this should be fine, but if Supabase ever sets `cookieOptions.domain` to a leading-dot `.scrubhub.ca`, that becomes shared — check Supabase client config if there's still a cookie issue.

---

## Triage B — the `SyntaxError: Cannot use import statement outside a module`

This is a **separate** problem from the OAuth allow-list. It says: the browser fetched something it loaded as a classic `<script>` (no `type="module"`), but the content contained an ES `import` statement.

The codebase contains **no** `<Script>` components, no inline `<script>` blocks, and no `dangerouslySetInnerHTML` script injection. Middleware excludes `_next/static`, so static asset routing is correct. That means the SyntaxError almost certainly comes from one of:

1. **A stale HTML referencing a JS chunk that no longer exists.** Vercel serves the cached `index.html` which points at `_next/static/chunks/abc123.js`, but the deploy overwrote that chunk with a new hash. The 404 returns an HTML body, which the browser tries to execute as a script. → Resolution: **hard-refresh** (Ctrl+Shift+R), and / or **purge Vercel edge cache** for `/` and `/login`. The user reports it as persistent though — so probably not just a one-off.

2. **A third-party script tag injected at the edge.** Vercel Speed Insights / Analytics, or a Cloudflare worker if there's one in front, can inject scripts. Open DevTools → Network → filter "JS" → find the response that's HTML instead of JS, look at its initiator and URL. That tells us who's loading the bad file.

3. **Subdomain mismatch in script src.** If a script tag in the `app.scrubhub.ca` HTML points at `/_next/static/...` but the request actually hits `www.scrubhub.ca` due to a redirect chain, the response could be the www landing HTML. Less likely but possible if there's an inflight redirect on a different request than the document.

4. **A `.mjs` file served with the wrong Content-Type.** Less common on Vercel but possible if `vercel.json` has custom routes that strip extensions. We have no `vercel.json` in the repo right now — confirm there isn't one in the deployed project that we don't have locally.

### What we need from prod DevTools

Two specific data points pinpoint this in seconds. Could you grab the following and paste back here:

1. **The exact filename** the SyntaxError points at. Click the error in the Console — Chrome shows the source line; the top-right corner of that source pane lists the file URL.
2. **The Network tab response** for that file. Click the request → Response tab → first 200 chars of the body. If it starts with `<!DOCTYPE html>` we have answer 1 above (cached HTML for a missing chunk). If it starts with `import …` we have answer 2 or 4 (script tag with wrong type).

With those two we either ship a one-line fix or open a Vercel support ticket — but it's <5 min from data to action.

---

## Order to attack

1. Verify the Supabase URL Configuration allow-list (1 min). 90% chance this alone clears the "Authentication failed" copy.
2. Hard-refresh prod, try Google sign-in again. If the SyntaxError survives, capture the filename + response body per Triage B.
3. If it works in incognito but not in your usual browser, it was a stale cache — purge Vercel edge for `/`, `/login`, `/dashboard`.

If 1 + 2 don't resolve it, we re-engage with the DevTools data and patch the specific source.
