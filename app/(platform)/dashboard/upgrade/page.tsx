import { getSessionUser } from '@/server/auth/get-session-user';
import { getUserSubscription } from '@/server/services/subscriptions.service';
import { PlanSelection } from '@/components/billing/plan-selection';

const REASON_MESSAGES: Record<string, string> = {
  publish_listing: "You're trying to publish your listing.",
  post_job: "You're trying to post a job.",
  screening_rules: "You're trying to configure screening rules.",
  add_listing: "You're adding another listing.",
  add_team_member: "You're adding a team member.",
};

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const params = await searchParams;
  const session = await getSessionUser();
  const subscription = await getUserSubscription(session.id);

  const reason = params.reason ?? '';
  const contextMessage =
    REASON_MESSAGES[reason] ?? 'Upgrade your plan to unlock more features.';

  return (
    <PlanSelection
      contextMessage={contextMessage}
      currentTier={subscription?.plan_tier ?? 'free'}
      currentBillingCycle={subscription?.billing_cycle ?? null}
      role={session.role}
    />
  );
}
