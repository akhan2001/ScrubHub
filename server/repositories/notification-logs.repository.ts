import { createClient } from '@/lib/supabase/server';

export type NotificationChannel = 'in_app' | 'email';

export async function insertNotificationLog(input: {
  user_id: string;
  event_type: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
  channel?: NotificationChannel;
  status?: 'sent' | 'failed' | 'queued';
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('notification_logs').insert({
    user_id: input.user_id,
    channel: input.channel ?? 'in_app',
    template_key: input.event_type,
    status: input.status ?? 'sent',
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
  limit = 20,
  options?: { channel?: NotificationChannel }
) {
  const supabase = await createClient();
  let query = supabase.from('notification_logs').select('*').eq('user_id', userId);
  if (options?.channel) {
    query = query.eq('channel', options.channel);
  }
  const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);

  if (error) throw error;
  return data ?? [];
}
