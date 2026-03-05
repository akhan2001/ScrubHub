'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { selectPlan } from '@/actions/billing';
import { Button } from '@/components/ui/button';
import type { AppRole, PlanTier } from '@/types/database';
import { cn } from '@/lib/utils';

type BillingCycle = 'monthly' | 'annual';

interface PlanCard {
  tier: PlanTier;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  tagline: string;
  features: string[];
  cta: string;
  popular?: boolean;
  contactSales?: boolean;
}

const LANDLORD_PLANS: PlanCard[] = [
  {
    tier: 'starter',
    name: 'Starter',
    monthlyPrice: 29,
    annualPrice: 23,
    tagline: 'For individual landlords',
    features: [
      'Up to 3 listings',
      'Basic tenant screening',
      'Application management',
      'Email notifications',
    ],
    cta: 'Start free trial',
  },
  {
    tier: 'growth',
    name: 'Growth',
    monthlyPrice: 79,
    annualPrice: 63,
    tagline: 'For growing portfolios',
    features: [
      'Up to 15 listings',
      'Advanced screening rules',
      'Auto-approve engine',
      'Analytics dashboard',
      'Priority support',
    ],
    cta: 'Start free trial',
    popular: true,
  },
  {
    tier: 'pro',
    name: 'Pro',
    monthlyPrice: 199,
    annualPrice: 159,
    tagline: 'For professional managers',
    features: [
      'Unlimited listings',
      'Full analytics & reporting',
      'API access',
      'Custom screening workflows',
      'Dedicated account manager',
    ],
    cta: 'Contact sales',
    contactSales: true,
  },
];

const ENTERPRISE_PLANS: PlanCard[] = [
  {
    tier: 'starter',
    name: 'Starter',
    monthlyPrice: 99,
    annualPrice: 79,
    tagline: 'For small teams',
    features: [
      'Up to 5 team members',
      'Job posting',
      'Up to 3 properties',
      'Basic reporting',
    ],
    cta: 'Start free trial',
  },
  {
    tier: 'growth',
    name: 'Growth',
    monthlyPrice: 249,
    annualPrice: 199,
    tagline: 'For scaling organizations',
    features: [
      'Up to 25 team members',
      'Unlimited job posts',
      'Up to 15 properties',
      'Advanced reporting & export',
      'Priority support',
    ],
    cta: 'Start free trial',
    popular: true,
  },
  {
    tier: 'pro',
    name: 'Pro',
    monthlyPrice: 499,
    annualPrice: 399,
    tagline: 'For large enterprises',
    features: [
      'Unlimited team members',
      'Unlimited properties',
      'Full API access',
      'Custom integrations',
      'Dedicated success manager',
    ],
    cta: 'Contact sales',
    contactSales: true,
  },
];

export function PlanSelection({
  contextMessage,
  currentTier,
  currentBillingCycle,
  role,
}: {
  contextMessage: string;
  currentTier: PlanTier;
  currentBillingCycle: 'monthly' | 'annual' | null;
  role: AppRole;
}) {
  const [cycle, setCycle] = useState<BillingCycle>(currentBillingCycle ?? 'monthly');
  const [isPending, startTransition] = useTransition();
  const [pendingTier, setPendingTier] = useState<PlanTier | null>(null);
  const router = useRouter();

  const plans = role === 'enterprise' ? ENTERPRISE_PLANS : LANDLORD_PLANS;

  function handleSelectPlan(plan: PlanCard) {
    if (plan.contactSales) {
      window.open('mailto:sales@scrubhub.com?subject=Pro%20Plan%20Inquiry', '_blank');
      return;
    }
    if (isPending) return;
    setPendingTier(plan.tier);
    startTransition(async () => {
      await selectPlan(plan.tier, cycle);
    });
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-medium text-primary">{contextMessage}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Choose a plan to continue
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start with a free trial. No credit card required for beta.
        </p>
      </div>

      <div className="mb-8 flex items-center justify-center">
        <div className="inline-flex items-center rounded-full border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setCycle('monthly')}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              cycle === 'monthly'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setCycle('annual')}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              cycle === 'annual'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Annual
            <span className="ml-1.5 text-xs opacity-80">save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {plans.map((plan) => {
          const price = cycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
          const isCurrent = plan.tier === currentTier;
          const isLoading = pendingTier === plan.tier && isPending;

          return (
            <div
              key={plan.tier}
              className={cn(
                'relative flex flex-col rounded-xl border-2 bg-card p-6 transition-shadow',
                plan.popular ? 'border-primary shadow-md' : 'border-border',
                isCurrent && 'opacity-60'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    <Sparkles className="size-3" />
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{plan.tagline}</p>
              </div>

              <div className="mb-5">
                <span className="text-3xl font-bold tracking-tight text-foreground">
                  ${price}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>

              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                disabled={isCurrent || isPending}
                onClick={() => handleSelectPlan(plan)}
              >
                {isLoading ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                ) : isCurrent ? (
                  'Current plan'
                ) : (
                  plan.cta
                )}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Go back
        </button>
      </div>
    </div>
  );
}
