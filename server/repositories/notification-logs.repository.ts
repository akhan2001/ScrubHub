import { createClient } from '@/lib/supabase/server';
import type { NotificationLog } from '@/types/database';

export type NotificationChannel = 'in_app' | 'email';

export async function insertNotificationLog(input: {
  user_id: string;
  event_type: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('notification_logs').insert({
    user_id: input.user_id,
    channel: 'in_app',
    template_key: input.event_type,
    status: 'sent',
    metadata: {
      title: input.title,
      body: input.body,
      ...input.metadata,
    },
  });

  if (error) throw error;
}

export async function fetchNotificationLogsForUser(
  userId: string,
  limit = 50,
  options?: { channel?: NotificationChannel }
): Promise<NotificationLog[]> {
  const supabase = await createClient();
  let query = supabase.from('notification_logs').select('*').eq('user_id', userId);
  if (options?.channel) {
    query = query.eq('channel', options.channel);
  }
  const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);

  if (error) throw error;
  return (data ?? []) as NotificationLog[];
}

export async function countInAppNotificationsForUser(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('notification_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('channel', 'in_app');

  if (error) throw error;
  return count ?? 0;
}
