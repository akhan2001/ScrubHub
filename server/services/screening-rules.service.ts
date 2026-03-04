import {
  fetchScreeningRuleByLandlord,
  upsertScreeningRule,
} from '@/server/repositories/screening-rules.repository';

export async function getScreeningRule(landlordUserId: string) {
  return fetchScreeningRuleByLandlord(landlordUserId);
}

export async function saveScreeningRule(input: {
  landlordUserId: string;
  minimumScore: number;
  notes?: string;
  autoApprove: boolean;
}) {
  await upsertScreeningRule({
    landlord_user_id: input.landlordUserId,
    minimum_score: input.minimumScore,
    notes: input.notes,
    auto_approve: input.autoApprove,
  });
}
