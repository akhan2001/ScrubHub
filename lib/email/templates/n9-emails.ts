import { emailLayout, escapeHtml } from '@/lib/email/layout';

export function n9ReceivedLandlordHtml(v: {
  landlordName: string;
  tenantName: string;
  terminationDate: string;
  viewNoticeUrl: string;
  dashboardUrl: string;
}): string {
  return emailLayout(`
    <p>Hi ${escapeHtml(v.landlordName || 'there')},</p>
    <p><strong>${escapeHtml(v.tenantName)}</strong> has submitted an N9 notice to end their tenancy on <strong>${escapeHtml(v.terminationDate)}</strong>.</p>
    <p style="margin-top:16px;">
      <a href="${escapeHtml(v.viewNoticeUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">View signed notice (expires in 7 days)</a>
    </p>
    <p style="margin-top:16px;font-size:13px;color:#64748b;">Or open your dashboard: <a href="${escapeHtml(v.dashboardUrl)}">${escapeHtml(v.dashboardUrl)}</a></p>
  `);
}

export function n9AcknowledgedTenantHtml(v: {
  tenantName: string;
  tenancyUrl: string;
}): string {
  return emailLayout(`
    <p>Hi ${escapeHtml(v.tenantName || 'there')},</p>
    <p>Your landlord has acknowledged your N9 termination notice.</p>
    <p style="margin-top:24px;">
      <a href="${escapeHtml(v.tenancyUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">View tenancy</a>
    </p>
  `);
}
