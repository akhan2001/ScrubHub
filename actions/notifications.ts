'use server';

import { createClient } from '@/lib/supabase/server';
import { fetchNotificationLogsForUser } from '@/server/repositories/notification-logs.repository';

export async function getDashboardNotificationsAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  return fetchNotificationLogsForUser(user.id, 50, { channel: 'in_app' });
}
