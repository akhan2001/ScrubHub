'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { confirmRoleSelection } from '@/actions/auth';
import type { AppRole } from '@/types/database';
import { ROLES } from '@/lib/roles';
import { RoleCard } from './role-card';

type Props = { isChangingRole?: boolean };

export function RoleSelection({ isChangingRole }: Props) {
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
          {isChangingRole ? 'Change your role' : "I'm joining ScrubHub as…"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isChangingRole
            ? 'Select the role you want to switch to.'
            : 'Choose the role that best describes you. You can change it anytime from your profile.'}
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
        {isChangingRole
          ? 'You’ll be redirected to your dashboard after selecting.'
          : 'You can change your role anytime from your profile.'}
      </p>
      {isChangingRole && (
        <p className="mt-4 text-center">
          <Link
            href="/dashboard/profile"
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            Back to profile
          </Link>
        </p>
      )}
    </div>
  );
}
