'use client';

import { useState, useTransition } from 'react';
import { confirmRoleSelection } from '@/actions/auth';
import type { AppRole } from '@/types/database';
import { ROLES } from '@/lib/roles';
import { RoleCard } from './role-card';

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
        {ROLES.map((role) => (
          <RoleCard
            key={role.id}
            as="button"
            role={role}
            isActive={selected === role.id}
            disabled={isPending}
            isLoading={selected === role.id && isPending}
            onClick={() => handleSelect(role.id)}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        You can always add a role later from your dashboard settings.
      </p>
    </div>
  );
}
