import { fetchProfileById, updateProfileRole as updateProfileRoleRepo } from '@/server/repositories/profiles.repository';
import type { AppRole } from '@/types/database';

export async function getProfile(userId: string) {
  return fetchProfileById(userId);
}

export async function updateProfileRole(userId: string, role: AppRole): Promise<void> {
  await updateProfileRoleRepo(userId, role);
}
