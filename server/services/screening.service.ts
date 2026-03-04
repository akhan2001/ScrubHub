import { fetchBookingById, updateBookingScreeningResults, updateBookingStatus } from '@/server/repositories/bookings.repository';
import { fetchScreeningRuleForListing } from '@/server/repositories/screening-rules.repository';
import { insertNotificationLog } from '@/server/repositories/notification-logs.repository';
import type { ScreeningRule } from '@/types/database';

interface CheckResult {
  pass: boolean;
  [key: string]: unknown;
}

function mockCreditCheck(_rule: ScreeningRule): CheckResult {
  return { score: 720, pass: true };
}

function mockBackgroundCheck(_rule: ScreeningRule): CheckResult {
  return { flags: [], pass: true };
}

function mockLicenseCheck(_rule: ScreeningRule): CheckResult {
  return { valid: true, expired: false, pass: true };
}

function mockEmploymentCheck(_rule: ScreeningRule): CheckResult {
  return { verified: true, pass: true };
}

export async function evaluateApplication(bookingId: string): Promise<void> {
  const booking = await fetchBookingById(bookingId);
  if (!booking) throw new Error('Booking not found');

  const rules = await fetchScreeningRuleForListing(booking.listing_id, booking.landlord_user_id);
  if (!rules) {
    return;
  }

  const creditResult = mockCreditCheck(rules);
  const backgroundResult = rules.require_background_check
    ? mockBackgroundCheck(rules)
    : { pass: true, skipped: true };
  const licenseResult = rules.require_license_verification
    ? mockLicenseCheck(rules)
    : { pass: true, skipped: true };
  const employmentResult = rules.require_employment_verification
    ? mockEmploymentCheck(rules)
    : { pass: true, skipped: true };

  const overallPass =
    creditResult.pass && backgroundResult.pass && licenseResult.pass && employmentResult.pass;

  const screeningResult: CheckResult = {
    pass: overallPass,
    credit: creditResult,
    background: backgroundResult,
    license: licenseResult,
    employment: employmentResult,
  };

  await updateBookingScreeningResults(bookingId, {
    screening_result: screeningResult,
    credit_check_result: creditResult,
    background_check_result: backgroundResult,
  });

  if (overallPass && (rules.auto_approve || rules.instant_book_enabled)) {
    await updateBookingStatus(bookingId, 'approved');

    await insertNotificationLog({
      user_id: booking.tenant_user_id,
      event_type: 'application_auto_approved',
      title: 'Application Approved',
      body: 'Your application has been automatically approved. Welcome to your new home!',
      metadata: { bookingId, listingId: booking.listing_id },
    });

    await insertNotificationLog({
      user_id: booking.landlord_user_id,
      event_type: 'application_auto_approved',
      title: 'Application Auto-Approved',
      body: `A tenant application was auto-approved based on your screening rules.`,
      metadata: { bookingId, listingId: booking.listing_id },
    });
  } else if (!overallPass) {
    await updateBookingStatus(bookingId, 'reviewing');

    await insertNotificationLog({
      user_id: booking.landlord_user_id,
      event_type: 'application_needs_review',
      title: 'Application Needs Review',
      body: 'A tenant application did not pass all screening checks. Manual review required.',
      metadata: { bookingId, listingId: booking.listing_id },
    });
  }
}
