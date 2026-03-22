import { emailLayout, escapeHtml } from '@/lib/email/layout';

export function bookingApprovedTenantHtml(v: {
  tenantName: string;
  listingTitle: string;
  listingAddress?: string | null;
  bookingsUrl: string;
}): string {
  const addr = v.listingAddress ? `<p>${escapeHtml(v.listingAddress)}</p>` : '';
  return emailLayout(`
    <p>Hi ${escapeHtml(v.tenantName || 'there')},</p>
    <p>Great news — your booking request for <strong>${escapeHtml(v.listingTitle)}</strong> was <strong>approved</strong>.</p>
    ${addr}
    <p style="margin-top:24px;">
      <a href="${escapeHtml(v.bookingsUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">View booking</a>
    </p>
  `);
}

export function bookingRejectedTenantHtml(v: {
  tenantName: string;
  listingTitle: string;
  listingsUrl: string;
}): string {
  return emailLayout(`
    <p>Hi ${escapeHtml(v.tenantName || 'there')},</p>
    <p>Your booking request for <strong>${escapeHtml(v.listingTitle)}</strong> was not approved at this time.</p>
    <p>You can browse other listings anytime.</p>
    <p style="margin-top:24px;">
      <a href="${escapeHtml(v.listingsUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">Browse listings</a>
    </p>
  `);
}
