import { createClient } from '@/lib/supabase/server';

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

export async function fetchNotificationLogsForUser(userId: string, limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notification_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
