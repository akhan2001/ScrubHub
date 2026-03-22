import { sendEmail } from '@/lib/integrations/resend';
import { insertNotificationLog } from '@/server/repositories/notification-logs.repository';
import { bookingRequestLandlordHtml } from '@/lib/email/templates/booking-request-landlord';
import {
  bookingApprovedTenantHtml,
  bookingRejectedTenantHtml,
} from '@/lib/email/templates/booking-status-tenant';
import { bookingApplicationSubmittedTenantHtml } from '@/lib/email/templates/booking-application-submitted-tenant';
import { signupPendingVerificationHtml } from '@/lib/email/templates/signup-pending-verification';
import { paymentReceivedLandlordHtml } from '@/lib/email/templates/payment-received-landlord';
import { jobApplicationAdminHtml } from '@/lib/email/templates/job-application-admin';
import { n9ReceivedLandlordHtml, n9AcknowledgedTenantHtml } from '@/lib/email/templates/n9-emails';
import { welcomeUserHtml } from '@/lib/email/templates/welcome';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidRecipientEmail(email: string | null | undefined): email is string {
  if (!email || typeof email !== 'string') return false;
  const t = email.trim();
  return t.length > 3 && EMAIL_RE.test(t);
}

function logSkip(reason: string, extra?: Record<string, unknown>) {
  console.info('[email] skip', reason, extra ?? '');
}

/**
 * Fire-and-forget transactional email. Never throws to caller.
 */
async function deliverEmail(opts: {
  to: string;
  subject: string;
  html: string;
  templateKey: string;
  logUserId: string;
  logTitle: string;
  logBody: string;
  logMetadata?: Record<string, unknown>;
}): Promise<void> {
  if (!isValidRecipientEmail(opts.to)) {
    logSkip('invalid or missing email', { templateKey: opts.templateKey });
    return;
  }

  try {
    const { id } = await sendEmail({
      to: opts.to.trim(),
      subject: opts.subject,
      html: opts.html,
    });
    try {
      await insertNotificationLog({
        user_id: opts.logUserId,
        event_type: opts.templateKey,
        title: opts.logTitle,
        body: opts.logBody,
        channel: 'email',
        status: 'sent',
        metadata: { resend_id: id, ...opts.logMetadata },
      });
    } catch (logErr) {
      console.warn('[email] notification log insert failed', logErr);
    }
  } catch (err) {
    console.error('[email] send failed', opts.templateKey, err);
    try {
      await insertNotificationLog({
        user_id: opts.logUserId,
        event_type: opts.templateKey,
        title: opts.logTitle,
        body: opts.logBody,
        channel: 'email',
        status: 'failed',
        metadata: {
          error: err instanceof Error ? err.message : String(err),
          ...opts.logMetadata,
        },
      });
    } catch {
      /* ignore */
    }
  }
}

export function voidSendBookingRequestToLandlord(input: {
  landlordUserId: string;
  landlordEmail: string | null | undefined;
  landlordName: string | null | undefined;
  tenantName: string | null | undefined;
  listingTitle: string;
  listingAddress?: string | null;
  moveInDate?: string | null;
  message?: string | null;
  approvalsUrl: string;
}): void {
  void deliverEmail({
    to: input.landlordEmail ?? '',
    subject: `New booking request: ${input.listingTitle}`,
    html: bookingRequestLandlordHtml({
      landlordName: input.landlordName ?? 'there',
      tenantName: input.tenantName ?? 'A tenant',
      listingTitle: input.listingTitle,
      listingAddress: input.listingAddress,
      moveInDate: input.moveInDate,
      message: input.message,
      approvalsUrl: input.approvalsUrl,
    }),
    templateKey: 'email_booking_request_landlord',
    logUserId: input.landlordUserId,
    logTitle: 'Booking request email sent',
    logBody: `Email sent for listing: ${input.listingTitle}`,
    logMetadata: { listingTitle: input.listingTitle },
  });
}

export function voidSendBookingApplicationSubmittedToTenant(input: {
  tenantUserId: string;
  tenantEmail: string | null | undefined;
  tenantName: string | null | undefined;
  listingTitle: string;
  listingAddress?: string | null;
  moveInDate?: string | null;
  messageToLandlord?: string | null;
  bookingsUrl: string;
}): void {
  void deliverEmail({
    to: input.tenantEmail ?? '',
    subject: `Application received: ${input.listingTitle}`,
    html: bookingApplicationSubmittedTenantHtml({
      tenantName: input.tenantName ?? 'there',
      listingTitle: input.listingTitle,
      listingAddress: input.listingAddress,
      moveInDate: input.moveInDate,
      messageToLandlord: input.messageToLandlord,
      bookingsUrl: input.bookingsUrl,
    }),
    templateKey: 'email_booking_application_submitted_tenant',
    logUserId: input.tenantUserId,
    logTitle: 'Application confirmation email sent',
    logBody: input.listingTitle,
    logMetadata: { listingTitle: input.listingTitle },
  });
}

/** Branded follow-up when email signup requires inbox verification (Supabase sends the actual confirm link). */
export function voidSendSignupPendingVerificationEmail(input: {
  userId: string;
  email: string | null | undefined;
  userName: string | null | undefined;
  loginUrl: string;
}): void {
  void deliverEmail({
    to: input.email ?? '',
    subject: 'Complete your ScrubHub signup',
    html: signupPendingVerificationHtml({
      userName: input.userName ?? 'there',
      loginUrl: input.loginUrl,
    }),
    templateKey: 'email_signup_pending_verification',
    logUserId: input.userId,
    logTitle: 'Signup verification reminder sent',
    logBody: 'Check inbox to confirm email',
  });
}

export function voidSendBookingApprovedToTenant(input: {
  tenantUserId: string;
  tenantEmail: string | null | undefined;
  tenantName: string | null | undefined;
  listingTitle: string;
  listingAddress?: string | null;
  bookingsUrl: string;
}): void {
  void deliverEmail({
    to: input.tenantEmail ?? '',
    subject: `Approved: ${input.listingTitle}`,
    html: bookingApprovedTenantHtml({
      tenantName: input.tenantName ?? 'there',
      listingTitle: input.listingTitle,
      listingAddress: input.listingAddress,
      bookingsUrl: input.bookingsUrl,
    }),
    templateKey: 'email_booking_approved_tenant',
    logUserId: input.tenantUserId,
    logTitle: 'Booking approved email sent',
    logBody: input.listingTitle,
  });
}

export function voidSendBookingRejectedToTenant(input: {
  tenantUserId: string;
  tenantEmail: string | null | undefined;
  tenantName: string | null | undefined;
  listingTitle: string;
  listingsUrl: string;
}): void {
  void deliverEmail({
    to: input.tenantEmail ?? '',
    subject: `Update on your request: ${input.listingTitle}`,
    html: bookingRejectedTenantHtml({
      tenantName: input.tenantName ?? 'there',
      listingTitle: input.listingTitle,
      listingsUrl: input.listingsUrl,
    }),
    templateKey: 'email_booking_rejected_tenant',
    logUserId: input.tenantUserId,
    logTitle: 'Booking update email sent',
    logBody: input.listingTitle,
  });
}

export function voidSendPaymentReceivedToLandlord(input: {
  landlordUserId: string;
  landlordEmail: string | null | undefined;
  landlordName: string | null | undefined;
  amountFormatted: string;
  tenantName: string;
  listingTitle: string;
  dashboardUrl: string;
}): void {
  void deliverEmail({
    to: input.landlordEmail ?? '',
    subject: `Payment received — ${input.listingTitle}`,
    html: paymentReceivedLandlordHtml({
      landlordName: input.landlordName ?? 'there',
      amountFormatted: input.amountFormatted,
      tenantName: input.tenantName,
      listingTitle: input.listingTitle,
      dashboardUrl: input.dashboardUrl,
    }),
    templateKey: 'email_payment_received_landlord',
    logUserId: input.landlordUserId,
    logTitle: 'Payment received email sent',
    logBody: input.amountFormatted,
    logMetadata: { listingTitle: input.listingTitle },
  });
}

export function voidSendJobApplicationToAdmin(input: {
  adminUserId: string;
  adminEmail: string | null | undefined;
  adminName: string | null | undefined;
  applicantEmail: string;
  jobTitle: string;
  applicationsUrl: string;
}): void {
  void deliverEmail({
    to: input.adminEmail ?? '',
    subject: `New application: ${input.jobTitle}`,
    html: jobApplicationAdminHtml({
      adminName: input.adminName ?? 'there',
      applicantEmail: input.applicantEmail,
      jobTitle: input.jobTitle,
      applicationsUrl: input.applicationsUrl,
    }),
    templateKey: 'email_job_application_admin',
    logUserId: input.adminUserId,
    logTitle: 'Job application email sent',
    logBody: `${input.applicantEmail} → ${input.jobTitle}`,
    logMetadata: { jobTitle: input.jobTitle },
  });
}

export function voidSendN9ReceivedToLandlord(input: {
  landlordUserId: string;
  landlordEmail: string | null | undefined;
  landlordName: string | null | undefined;
  tenantName: string;
  terminationDate: string;
  viewNoticeUrl: string;
  dashboardUrl: string;
}): void {
  void deliverEmail({
    to: input.landlordEmail ?? '',
    subject: 'N9 notice received',
    html: n9ReceivedLandlordHtml({
      landlordName: input.landlordName ?? 'there',
      tenantName: input.tenantName,
      terminationDate: input.terminationDate,
      viewNoticeUrl: input.viewNoticeUrl,
      dashboardUrl: input.dashboardUrl,
    }),
    templateKey: 'email_n9_received_landlord',
    logUserId: input.landlordUserId,
    logTitle: 'N9 notice email sent',
    logBody: input.terminationDate,
    // Do not log signed PDF URLs
    logMetadata: {},
  });
}

export function voidSendN9AcknowledgedToTenant(input: {
  tenantUserId: string;
  tenantEmail: string | null | undefined;
  tenantName: string | null | undefined;
  tenancyUrl: string;
}): void {
  void deliverEmail({
    to: input.tenantEmail ?? '',
    subject: 'Your N9 notice was acknowledged',
    html: n9AcknowledgedTenantHtml({
      tenantName: input.tenantName ?? 'there',
      tenancyUrl: input.tenancyUrl,
    }),
    templateKey: 'email_n9_acknowledged_tenant',
    logUserId: input.tenantUserId,
    logTitle: 'N9 acknowledgement email sent',
    logBody: 'Landlord acknowledged your notice',
  });
}

export function voidSendWelcomeEmail(input: {
  userId: string;
  email: string | null | undefined;
  userName: string | null | undefined;
  dashboardUrl: string;
}): void {
  void deliverEmail({
    to: input.email ?? '',
    subject: 'Welcome to ScrubHub',
    html: welcomeUserHtml({
      userName: input.userName ?? 'there',
      dashboardUrl: input.dashboardUrl,
    }),
    templateKey: 'email_welcome_user',
    logUserId: input.userId,
    logTitle: 'Welcome email sent',
    logBody: 'Onboarding',
  });
}
