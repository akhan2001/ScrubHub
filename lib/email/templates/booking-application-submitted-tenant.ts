import { emailLayout, escapeHtml } from '@/lib/email/layout';

function formatMoveInDate(iso: string | null | undefined): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return escapeHtml(iso);
  return escapeHtml(
    d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  );
}

/** Confirmation after tenant submits a housing application / booking request. */
export function bookingApplicationSubmittedTenantHtml(v: {
  tenantName: string;
  listingTitle: string;
  listingAddress?: string | null;
  moveInDate?: string | null;
  messageToLandlord?: string | null;
  bookingsUrl: string;
}): string {
  const addr = v.listingAddress
    ? `<p><strong>Address:</strong> ${escapeHtml(v.listingAddress)}</p>`
    : '';
  const moveIn = formatMoveInDate(v.moveInDate ?? null);
  const moveInBlock = moveIn
    ? `<p><strong>Requested move-in:</strong> ${moveIn}</p>`
    : '';
  const msg =
    v.messageToLandlord?.trim() && v.messageToLandlord.trim().length > 0
      ? `<p><strong>Your message to the landlord:</strong></p><blockquote style="margin:12px 0;padding:12px 16px;border-left:4px solid #2563eb;background:#f8fafc;font-size:14px;">${escapeHtml(v.messageToLandlord.trim())}</blockquote>`
      : '';

  return emailLayout(`
    <p>Hi ${escapeHtml(v.tenantName || 'there')},</p>
    <p>Thanks — we received your application for <strong>${escapeHtml(v.listingTitle)}</strong>.</p>
    ${addr}
    ${moveInBlock}
    ${msg}
    <p><strong>What happens next</strong></p>
    <ul style="margin:0 0 16px;padding-left:20px;color:#334155;">
      <li>The landlord will review your request.</li>
      <li>We’ll email you when they approve, decline, or need more information.</li>
      <li>You can check status anytime in your dashboard.</li>
    </ul>
    <p style="margin-top:24px;">
      <a href="${escapeHtml(v.bookingsUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">View my applications</a>
    </p>
  `);
}
