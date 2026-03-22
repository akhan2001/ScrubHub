import { emailLayout, escapeHtml } from '@/lib/email/layout';

export function welcomeUserHtml(v: { userName: string; dashboardUrl: string }): string {
  return emailLayout(`
    <p>Hi ${escapeHtml(v.userName || 'there')},</p>
    <p>Welcome to ScrubHub — your account is ready.</p>
    <p>Find housing near healthcare facilities, manage listings, and stay on top of bookings from your dashboard.</p>
    <p style="margin-top:24px;">
      <a href="${escapeHtml(v.dashboardUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">Go to dashboard</a>
    </p>
  `);
}
