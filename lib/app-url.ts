/**
 * Base URL for the app subdomain (app.scrubhub.ca).
 * In production: set NEXT_PUBLIC_APP_URL=https://app.scrubhub.ca
 * In dev: unset; uses same origin with ?host=app for subdomain simulation.
 */
export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? '';
}

/**
 * Base URL for the www subdomain (www.scrubhub.ca).
 * In production: set NEXT_PUBLIC_WWW_URL=https://www.scrubhub.ca
 * In dev: unset; uses same origin with ?host=www for subdomain simulation.
 */
export function getWwwUrl(): string {
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
  if (base) return `${base}/login`;
  return '/login?host=app';
}

export function getAppSignupUrl(): string {
  const base = getAppUrl();
  if (base) return `${base}/signup`;
  return '/signup?host=app';
}

export function getAppDashboardUrl(): string {
  const base = getAppUrl();
  if (base) return `${base}/dashboard`;
  return '/dashboard?host=app';
}

export function getAppListingsUrl(): string {
  const base = getAppUrl();
  if (base) return `${base}/listings`;
  return '/listings?host=app';
}

export function getAppListingUrl(id: string): string {
  const base = getAppUrl();
  if (base) return `${base}/listings/${id}`;
  return `/listings/${id}?host=app`;
}

export function getAppJobUrl(id: string): string {
  const base = getAppUrl();
  if (base) return `${base}/jobs/${id}`;
  return `/jobs/${id}?host=app`;
}

export function getStaffingJobUrl(id: string): string {
  return `/staffing/jobs/${id}`;
}
