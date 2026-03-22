import { emailLayout, escapeHtml } from '@/lib/email/layout';

/** After email/password signup when the user must confirm their inbox (no session yet). */
export function signupPendingVerificationHtml(v: { userName: string; loginUrl: string }): string {
  return emailLayout(`
    <p>Hi ${escapeHtml(v.userName || 'there')},</p>
    <p>Thanks for signing up for <strong>ScrubHub</strong>.</p>
    <p>You should receive a separate email with a <strong>confirm your email address</strong> link. Please click that link to activate your account, then sign in to continue.</p>
    <p style="margin-top:24px;">
      <a href="${escapeHtml(v.loginUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">Go to sign in</a>
    </p>
    <p style="font-size:14px;color:#64748b;margin-top:20px;">If you didn’t create an account, you can ignore this message.</p>
  `);
}
