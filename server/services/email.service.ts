import { EMAIL_FROM, getResendClient } from '@/lib/integrations/resend';
import { getProfile } from '@/server/services/profiles.service';
import { fetchListingById } from '@/server/repositories/listings.repository';
import { insertEmailNotificationLog } from '@/server/repositories/notification-logs.repository';

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.scrubhub.ca';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

/**
 * Send a single transactional email and log the outcome. Never throws — callers
 * are mutation paths (booking create, status update) that must not fail because
 * email is misconfigured.
 */
async function sendAndLog(
  userId: string,
  eventType: string,
  metadata: Record<string, unknown>,
  payload: EmailPayload,
): Promise<void> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn(`[email.service] RESEND_API_KEY not set; skipping ${eventType}`);
      return;
    }
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
    if (error) {
      console.error(`[email.service] resend error for ${eventType}`, error);
      await insertEmailNotificationLog({
        user_id: userId,
        event_type: eventType,
        status: 'failed',
        metadata: { ...metadata, error: error.message ?? String(error) },
      });
      return;
    }
    await insertEmailNotificationLog({
      user_id: userId,
      event_type: eventType,
      status: 'sent',
      metadata,
    });
  } catch (err) {
    console.error(`[email.service] unexpected error for ${eventType}`, err);
    try {
      await insertEmailNotificationLog({
        user_id: userId,
        event_type: eventType,
        status: 'failed',
        metadata: { ...metadata, error: err instanceof Error ? err.message : String(err) },
      });
    } catch {
      // swallow — last-ditch logging
    }
  }
}

/**
 * Fire-and-forget: notify both tenant and landlord that an application was submitted.
 */
export async function sendApplicationSubmittedEmails(opts: {
  bookingId: string;
  listingId: string;
  tenantUserId: string;
  landlordUserId: string;
}): Promise<void> {
  const [tenant, landlord, listing] = await Promise.all([
    getProfile(opts.tenantUserId),
    getProfile(opts.landlordUserId),
    fetchListingById(opts.listingId),
  ]);

  const title = listing?.title ?? 'your listing';
  const tenantName = tenant?.full_name ?? 'a tenant';
  const landlordName = landlord?.full_name ?? 'there';
  const tenantFirstName = (tenant?.full_name ?? '').split(' ')[0] || 'there';
  const tenantTrackUrl = `${APP_BASE_URL}/dashboard/tenant/bookings`;
  const landlordReviewUrl = `${APP_BASE_URL}/dashboard/landlord/approvals`;

  if (tenant?.email) {
    await sendAndLog(
      tenant.id,
      'application_submitted_tenant',
      { bookingId: opts.bookingId, listingId: opts.listingId },
      {
        to: tenant.email,
        subject: `Application submitted — ${title}`,
        text:
          `Hi ${tenantFirstName},\n\n` +
          `Your application for "${title}" has been submitted. ` +
          `We'll email you again as soon as the landlord responds.\n\n` +
          `Track your applications: ${tenantTrackUrl}\n\n— ScrubHub`,
        html:
          `<p>Hi ${escapeHtml(tenantFirstName)},</p>` +
          `<p>Your application for <strong>${escapeHtml(title)}</strong> has been submitted. ` +
          `We'll email you again as soon as the landlord responds.</p>` +
          `<p><a href="${escapeHtml(tenantTrackUrl)}">Track your applications</a></p>` +
          `<p>— ScrubHub</p>`,
      },
    );
  }

  if (landlord?.email) {
    await sendAndLog(
      landlord.id,
      'application_submitted_landlord',
      { bookingId: opts.bookingId, listingId: opts.listingId, tenantUserId: opts.tenantUserId },
      {
        to: landlord.email,
        subject: `New application — ${title}`,
        text:
          `Hi ${landlordName.split(' ')[0] || 'there'},\n\n` +
          `${tenantName} just submitted an application for "${title}". ` +
          `Open your dashboard to review the details and respond.\n\n` +
          `${landlordReviewUrl}\n\n— ScrubHub`,
        html:
          `<p>Hi ${escapeHtml(landlordName.split(' ')[0] || 'there')},</p>` +
          `<p><strong>${escapeHtml(tenantName)}</strong> just submitted an application for <strong>${escapeHtml(title)}</strong>.</p>` +
          `<p><a href="${escapeHtml(landlordReviewUrl)}">Review and respond</a></p>` +
          `<p>— ScrubHub</p>`,
      },
    );
  }
}

/**
 * Notify the tenant when a landlord approves or rejects their application.
 */
export async function sendBookingDecisionEmail(opts: {
  bookingId: string;
  listingId: string;
  tenantUserId: string;
  decision: 'approved' | 'rejected';
}): Promise<void> {
  const [tenant, listing] = await Promise.all([
    getProfile(opts.tenantUserId),
    fetchListingById(opts.listingId),
  ]);
  if (!tenant?.email) return;

  const title = listing?.title ?? 'your application';
  const firstName = (tenant.full_name ?? '').split(' ')[0] || 'there';
  const dashboardUrl = `${APP_BASE_URL}/dashboard/tenant/bookings`;
  const approved = opts.decision === 'approved';

  await sendAndLog(
    tenant.id,
    `booking_status_${opts.decision}`,
    { bookingId: opts.bookingId, listingId: opts.listingId },
    {
      to: tenant.email,
      subject: approved
        ? `Your application for "${title}" was approved`
        : `Update on your application for "${title}"`,
      text:
        `Hi ${firstName},\n\n` +
        (approved
          ? `Good news — the landlord approved your application for "${title}". ` +
            `Open your dashboard to continue with next steps.`
          : `The landlord declined your application for "${title}". ` +
            `You can browse other stays from your dashboard whenever you're ready.`) +
        `\n\n${dashboardUrl}\n\n— ScrubHub`,
      html:
        `<p>Hi ${escapeHtml(firstName)},</p>` +
        (approved
          ? `<p>Good news — the landlord approved your application for <strong>${escapeHtml(title)}</strong>.</p>`
          : `<p>The landlord declined your application for <strong>${escapeHtml(title)}</strong>. ` +
            `You can browse other stays from your dashboard whenever you're ready.</p>`) +
        `<p><a href="${escapeHtml(dashboardUrl)}">Open your dashboard</a></p>` +
        `<p>— ScrubHub</p>`,
    },
  );
}
