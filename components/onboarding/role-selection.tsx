'use client';

import { useState, useTransition } from 'react';
import { Stethoscope, Building2, Landmark } from 'lucide-react';
import { confirmRoleSelection } from '@/actions/auth';
import type { AppRole } from '@/types/database';

const ROLES = [
  {
    id: 'tenant' as AppRole,
    icon: Stethoscope,
    title: 'Healthcare Professional',
    description: 'Find housing near your facility. Browse verified listings, apply directly, and move in faster.',
    pricing: 'Free to apply',
    pricingMuted: false,
    accent: 'bg-teal-50 text-teal-700 border-teal-200',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    ring: 'ring-teal-500/30',
    border: 'border-teal-500',
  },
  {
    id: 'landlord' as AppRole,
    icon: Landmark,
    title: 'Property Owner',
    description: 'List and manage properties for healthcare workers. Screen tenants, automate approvals.',
    pricing: 'From $29/mo',
    pricingMuted: true,
    accent: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    ring: 'ring-blue-500/30',
    border: 'border-blue-500',
  },
  {
    id: 'enterprise' as AppRole,
    icon: Building2,
    title: 'Enterprise',
    description: 'Manage portfolios, post jobs, and place staff at scale. Housing and recruitment in one platform.',
    pricing: 'From $99/mo',
    pricingMuted: true,
    accent: 'bg-violet-50 text-violet-700 border-violet-200',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    ring: 'ring-violet-500/30',
    border: 'border-violet-500',
  },
] as const;

export function RoleSelection() {
  const [selected, setSelected] = useState<AppRole | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSelect(role: AppRole) {
    if (isPending) return;
    setSelected(role);
    startTransition(async () => {
      await confirmRoleSelection(role);
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold">
          S
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          I&apos;m joining ScrubHub as&hellip;
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose the role that best describes you. You can add more roles later.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isActive = selected === role.id;
          const isLoading = isActive && isPending;

          return (
            <button
              key={role.id}
              type="button"
              disabled={isPending}
              onClick={() => handleSelect(role.id)}
              className={`
                group relative flex cursor-pointer flex-col items-start rounded-xl border-2 bg-card p-5 text-left
                transition-all duration-200 ease-out
                hover:shadow-md hover:-translate-y-0.5
                focus-visible:outline-none focus-visible:ring-2 ${role.ring}
                disabled:pointer-events-none
                ${isActive ? `${role.border} shadow-md -translate-y-0.5` : 'border-border'}
              `}
            >
              <div className={`mb-4 flex size-11 items-center justify-center rounded-lg ${role.iconBg} transition-colors`}>
                <Icon className={`size-5 ${role.iconColor}`} />
              </div>

              <h2 className="text-base font-semibold text-foreground">
                {role.title}
              </h2>

              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {role.description}
              </p>

              <div className="mt-auto pt-4">
                <span
                  className={`
                    inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium
                    ${role.accent}
                  `}
                >
                  {role.pricing}
                </span>
              </div>

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-card/80 backdrop-blur-[1px]">
                  <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        You can always add a role later from your dashboard settings.
      </p>
    </div>
  );
}
