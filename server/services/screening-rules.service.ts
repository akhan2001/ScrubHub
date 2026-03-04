import {
  fetchScreeningRuleByLandlord,
  fetchScreeningRuleByListing,
  fetchScreeningRuleForListing,
  upsertScreeningRule,
} from '@/server/repositories/screening-rules.repository';

export async function getScreeningRule(landlordUserId: string) {
  return fetchScreeningRuleByLandlord(landlordUserId);
}

export async function getScreeningRuleForListing(listingId: string, landlordUserId: string) {
  return fetchScreeningRuleForListing(listingId, landlordUserId);
}

export async function getScreeningRuleByListing(listingId: string) {
  return fetchScreeningRuleByListing(listingId);
}

export async function saveScreeningRule(input: {
  landlordUserId: string;
  minimumScore: number;
  notes?: string;
  autoApprove: boolean;
  listingId?: string;
  requireBackgroundCheck?: boolean;
  requireEmploymentVerification?: boolean;
  requireLicenseVerification?: boolean;
  maxIncomeToRentRatio?: number;
  instantBookEnabled?: boolean;
}) {
  await upsertScreeningRule({
    landlord_user_id: input.landlordUserId,
    minimum_score: input.minimumScore,
    notes: input.notes,
    auto_approve: input.autoApprove,
    listing_id: input.listingId ?? null,
    require_background_check: input.requireBackgroundCheck,
    require_employment_verification: input.requireEmploymentVerification,
    require_license_verification: input.requireLicenseVerification,
    max_income_to_rent_ratio: input.maxIncomeToRentRatio ?? null,
    instant_book_enabled: input.instantBookEnabled,
  });
}
