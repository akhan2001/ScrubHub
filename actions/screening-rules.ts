'use server';

import { revalidatePath } from 'next/cache';
import { requireVerifiedRole } from '@/server/guards/require-verified-role';
import { screeningRulesSchema } from '@/lib/validation/schemas';
import { ValidationError } from '@/server/errors/app-error';
import { saveScreeningRule } from '@/server/services/screening-rules.service';

export async function upsertLandlordScreeningRules(input: {
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
  const parsed = screeningRulesSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message);
  }

  const user = await requireVerifiedRole('landlord', { onFailure: 'throw' });
  await saveScreeningRule({
    landlordUserId: user.id,
    minimumScore: parsed.data.minimumScore,
    notes: parsed.data.notes,
    autoApprove: parsed.data.autoApprove,
    listingId: parsed.data.listingId,
    requireBackgroundCheck: parsed.data.requireBackgroundCheck,
    requireEmploymentVerification: parsed.data.requireEmploymentVerification,
    requireLicenseVerification: parsed.data.requireLicenseVerification,
    maxIncomeToRentRatio: parsed.data.maxIncomeToRentRatio,
    instantBookEnabled: parsed.data.instantBookEnabled,
  });

  revalidatePath('/dashboard/landlord');
}
