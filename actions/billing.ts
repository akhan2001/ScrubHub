'use server';

import { redirect } from 'next/navigation';
import { requireAuth } from '@/server/guards/require-auth';
import { selectPlanForUser } from '@/server/services/subscriptions.service';
import type { PlanTier } from '@/types/database';

const VALID_TIERS: PlanTier[] = ['starter', 'growth', 'pro'];
const VALID_CYCLES = ['monthly', 'annual'] as const;

export async function selectPlan(
  tier: PlanTier,
  billingCycle: 'monthly' | 'annual',
  returnTo?: string
) {
  if (!VALID_TIERS.includes(tier)) {
    throw new Error('Invalid plan tier');
  }
  if (!VALID_CYCLES.includes(billingCycle)) {
    throw new Error('Invalid billing cycle');
  }

  const user = await requireAuth();
  await selectPlanForUser(user.id, tier, billingCycle);

  redirect(returnTo ?? '/dashboard');
}
