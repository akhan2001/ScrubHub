'use server';

import { redirect } from 'next/navigation';
import { requireAuth } from '@/server/guards/require-auth';
import {
  updateProfileRole as updateProfileRoleService,
  confirmRoleSelection as confirmRoleSelectionService,
} from '@/server/services/profiles.service';
import { resolveDashboardRoute } from '@/server/auth/resolve-dashboard-route';
import type { AppRole } from '@/types/database';
import { roleSchema } from '@/lib/validation/schemas';
import { ValidationError } from '@/server/errors/app-error';

export async function updateProfileRole(role: AppRole) {
  const parsed = roleSchema.safeParse(role);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message);
  }

  const user = await requireAuth();
  await updateProfileRoleService(user.id, parsed.data);
}

export async function confirmRoleSelection(role: AppRole) {
  const parsed = roleSchema.safeParse(role);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message);
  }

  const user = await requireAuth();
  await confirmRoleSelectionService(user.id, parsed.data);
  redirect(resolveDashboardRoute(parsed.data));
}
