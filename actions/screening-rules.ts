'use server';

import { requireVerifiedRole } from '@/server/guards/require-verified-role';
import { screeningRulesSchema } from '@/lib/validation/schemas';
import { ValidationError } from '@/server/errors/app-error';
import { saveScreeningRule } from '@/server/services/screening-rules.service';

export async function upsertLandlordScreeningRules(input: {
  minimumScore: number;
  notes?: string;
  autoApprove: boolean;
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
  });
}
