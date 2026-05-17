import { Resend } from 'resend';

/**
 * Lazy Resend client. Reads RESEND_API_KEY at first call so missing config
 * fails on send (logged + swallowed by the service layer) rather than at import.
 */
let _client: Resend | null = null;

export function getResendClient(): Resend {
  if (_client) return _client;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not configured');
  _client = new Resend(key);
  return _client;
}

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? 'ScrubHub <service@scrubhub.ca>';
