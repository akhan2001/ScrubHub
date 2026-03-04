'use server';

import { requireAuth } from '@/server/guards/require-auth';
import { updateProfileRole as updateProfileRoleService } from '@/server/services/profiles.service';
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
