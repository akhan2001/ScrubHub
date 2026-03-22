import { emailLayout, escapeHtml } from '@/lib/email/layout';

export function paymentReceivedLandlordHtml(v: {
  landlordName: string;
  amountFormatted: string;
  tenantName: string;
  listingTitle: string;
  dashboardUrl: string;
}): string {
  return emailLayout(`
    <p>Hi ${escapeHtml(v.landlordName || 'there')},</p>
    <p>Payment of <strong>${escapeHtml(v.amountFormatted)}</strong> was received for a booking on <strong>${escapeHtml(v.listingTitle)}</strong> (tenant: ${escapeHtml(v.tenantName)}).</p>
    <p style="margin-top:24px;">
      <a href="${escapeHtml(v.dashboardUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">Open dashboard</a>
    </p>
  `);
}
