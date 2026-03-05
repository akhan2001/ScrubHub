import {
  fetchSubscriptionByUser,
  upsertSubscription,
} from '@/server/repositories/subscriptions.repository';
import type { PlanTier, Subscription } from '@/types/database';

const TIER_ORDER: Record<PlanTier, number> = {
  free: 0,
  starter: 1,
  growth: 2,
  pro: 3,
};

export function isTierSufficient(current: PlanTier, required: PlanTier): boolean {
  return TIER_ORDER[current] >= TIER_ORDER[required];
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  return fetchSubscriptionByUser(userId);
}

export async function selectPlanForUser(
  userId: string,
  planTier: PlanTier,
  billingCycle: 'monthly' | 'annual'
): Promise<void> {
  const now = new Date();
  const periodEnd = new Date(now);
  if (billingCycle === 'annual') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  await upsertSubscription(userId, {
    plan_tier: planTier,
    status: 'trialing',
    billing_cycle: billingCycle,
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
  });
}
