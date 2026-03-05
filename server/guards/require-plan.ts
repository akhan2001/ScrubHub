import { redirect } from 'next/navigation';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import { getUserSubscription, isTierSufficient } from '@/server/services/subscriptions.service';
import type { PlanTier } from '@/types/database';

export async function requirePlan(
  minimumTier: PlanTier,
  context: { action: string; redirectTo?: string }
): Promise<void> {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const profile = await getProfile(user.id);
  if (!profile) redirect('/login');

  if (profile.role === 'tenant') return;

  if (minimumTier === 'free') return;

  const subscription = await getUserSubscription(user.id);

  if (!subscription) {
    redirect(
      context.redirectTo ??
        `/dashboard/upgrade?reason=${encodeURIComponent(context.action)}`
    );
  }

  const isActive =
    subscription.status === 'trialing' || subscription.status === 'active';

  if (!isActive || !isTierSufficient(subscription.plan_tier, minimumTier)) {
    redirect(
      context.redirectTo ??
        `/dashboard/upgrade?reason=${encodeURIComponent(context.action)}`
    );
  }
}
