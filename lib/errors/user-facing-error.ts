/**
 * Maps caught errors (including Next.js server action / Supabase shapes) to safe UI copy.
 * Never surfaces raw PostgREST payloads, JSON blobs, or digests in toasts.
 */
export function getUserFacingErrorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (err == null) return fallback;

  const isTechnicalMessage = (raw: string): boolean => {
    const t = raw.trim();
    if (!t) return true;
    if (t.startsWith('{') && (t.includes('"code"') || t.includes("'code'"))) return true;
    if (/PGRST\d{3}/i.test(t)) return true;
    if (/invalid input syntax for type uuid/i.test(t)) return true;
    if (/^[\d]+@[A-Z0-9]+$/i.test(t) && t.includes('@')) return true; // Next digest-style
    return false;
  };

  const useOrFallback = (raw: string | undefined | null): string => {
    if (raw == null) return fallback;
    const t = String(raw).trim();
    if (!t || isTechnicalMessage(t)) return fallback;
    return t;
  };

  if (typeof err === 'string') {
    return useOrFallback(err);
  }

  if (typeof err === 'object' && err !== null) {
    const o = err as Record<string, unknown>;

    // PostgREST / Supabase client error shape (plain object on client)
    if (typeof o.code === 'string' && /^PGRST/i.test(o.code)) {
      return fallback;
    }

    if (typeof o.message === 'string') {
      return useOrFallback(o.message);
    }
  }

  if (err instanceof Error) {
    return useOrFallback(err.message);
  }

  return fallback;
}
