import { emailLayout, escapeHtml } from '@/lib/email/layout';

export function bookingRequestLandlordHtml(v: {
  landlordName: string;
  tenantName: string;
  listingTitle: string;
  listingAddress?: string | null;
  moveInDate?: string | null;
  message?: string | null;
  approvalsUrl: string;
}): string {
  const addr = v.listingAddress ? `<p><strong>Address:</strong> ${escapeHtml(v.listingAddress)}</p>` : '';
  const moveIn = v.moveInDate
    ? `<p><strong>Requested move-in:</strong> ${escapeHtml(v.moveInDate)}</p>`
    : '';
  const msg = v.message
    ? `<p><strong>Message from applicant:</strong><br/>${escapeHtml(v.message)}</p>`
    : '';

  return emailLayout(`
    <p>Hi ${escapeHtml(v.landlordName || 'there')},</p>
    <p><strong>${escapeHtml(v.tenantName || 'A tenant')}</strong> requested to book <strong>${escapeHtml(v.listingTitle)}</strong>.</p>
    ${addr}
    ${moveIn}
    ${msg}
    <p style="margin-top:24px;">
      <a href="${escapeHtml(v.approvalsUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">Review request</a>
    </p>
  `);
}
