'use server';

import { requireAuth } from '@/server/guards/require-auth';
import { updateProfileRole as updateProfileRoleService } from '@/server/services/profiles.service';
import type { AppRole } from '@/types/database';

export async function updateProfileRole(role: AppRole) {
  const user = await requireAuth();
  await updateProfileRoleService(user.id, role);
}
