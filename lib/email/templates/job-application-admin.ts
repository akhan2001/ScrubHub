import { emailLayout, escapeHtml } from '@/lib/email/layout';

export function jobApplicationAdminHtml(v: {
  adminName: string;
  applicantEmail: string;
  jobTitle: string;
  applicationsUrl: string;
}): string {
  return emailLayout(`
    <p>Hi ${escapeHtml(v.adminName || 'there')},</p>
    <p><strong>${escapeHtml(v.applicantEmail)}</strong> applied for <strong>${escapeHtml(v.jobTitle)}</strong>.</p>
    <p style="margin-top:24px;">
      <a href="${escapeHtml(v.applicationsUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">View applications</a>
    </p>
  `);
}
