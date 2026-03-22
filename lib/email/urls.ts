/**
 * Absolute base URL for links inside transactional emails.
 * Set NEXT_PUBLIC_APP_URL in production (e.g. https://app.scrubhub.ca).
 */
export function getEmailAppBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  return 'http://localhost:3000';
}

export function emailAppPath(path: string): string {
  const base = getEmailAppBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
