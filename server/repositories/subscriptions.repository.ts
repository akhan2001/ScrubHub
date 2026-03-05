import { createClient } from '@/lib/supabase/server';
import type { Subscription, PlanTier, SubscriptionStatus } from '@/types/database';

export async function fetchSubscriptionByUser(userId: string): Promise<Subscription | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertSubscription(
  userId: string,
  fields: {
    plan_tier: PlanTier;
    status: SubscriptionStatus;
    billing_cycle: 'monthly' | 'annual' | null;
    current_period_start?: string | null;
    current_period_end?: string | null;
  }
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        plan_tier: fields.plan_tier,
        status: fields.status,
        billing_cycle: fields.billing_cycle,
        current_period_start: fields.current_period_start ?? null,
        current_period_end: fields.current_period_end ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
}
