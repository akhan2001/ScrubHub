/**
 * Base URL for the canonical site. Everything lives on www now — marketing,
 * listings, applications, AND the tracking dashboard.
 *
 * In dev (NODE_ENV !== 'production') we always return '' so helpers produce
 * relative paths and links stay on http://localhost:3000 even if the user
 * has NEXT_PUBLIC_WWW_URL set in .env.local for some other purpose. In prod
 * we prefer NEXT_PUBLIC_WWW_URL with NEXT_PUBLIC_APP_URL as a legacy fallback.
 */
export function getAppUrl(): string {
  if (process.env.NODE_ENV !== 'production') return '';
  return process.env.NEXT_PUBLIC_WWW_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? '';
}

/**
 * Base URL for the www subdomain. Dev returns '' for the same reason as
 * getAppUrl. In prod, reads NEXT_PUBLIC_WWW_URL.
 */
export function getWwwUrl(): string {
  if (process.env.NODE_ENV !== 'production') return '';
  return process.env.NEXT_PUBLIC_WWW_URL ?? '';
}

export function getWwwLoginUrl(): string {
  const base = getWwwUrl();
  if (base) return `${base}/login`;
  return '/login?host=www';
}

export function getWwwSignupUrl(): string {
  const base = getWwwUrl();
  if (base) return `${base}/signup`;
  return '/signup?host=www';
}

export function getAppLoginUrl(): string {
  const base = getAppUrl();
  return base ? `${base}/login` : '/login';
}

export function getAppSignupUrl(): string {
  const base = getAppUrl();
  return base ? `${base}/signup` : '/signup';
}

export function getAppDashboardUrl(): string {
  const base = getAppUrl();
  return base ? `${base}/dashboard` : '/dashboard';
}

/**
 * Full URL for the OAuth callback. Used as redirectTo for signInWithOAuth.
 * Resolves to www.scrubhub.ca/auth/callback in prod (everything lives on www now).
 * On localhost, uses current origin.
 * Must be in Supabase Dashboard → Auth → URL Configuration → Redirect URLs.
 */
export function getAppAuthCallbackUrl(): string {
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) return `${window.location.origin}/auth/callback`;
  }
  const base = getAppUrl();
  if (base) return `${base}/auth/callback`;
  if (typeof window !== 'undefined') return `${window.location.origin}/auth/callback`;
  return '/auth/callback';
}

export function getAppListingsUrl(): string {
  const base = getAppUrl();
  return base ? `${base}/listings` : '/listings';
}

export function getAppListingUrl(id: string): string {
  const base = getAppUrl();
  return base ? `${base}/listings/${id}` : `/listings/${id}`;
}

export function getAppJobUrl(id: string): string {
  const base = getAppUrl();
  return base ? `${base}/jobs/${id}` : `/jobs/${id}`;
}

export function getStaffingJobUrl(id: string): string {
  return `/staffing/jobs/${id}`;
}
