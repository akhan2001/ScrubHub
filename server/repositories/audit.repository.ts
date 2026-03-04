import { createClient } from '@/lib/supabase/server';

type AuditEventInput = {
  actor_user_id?: string | null;
  source: string;
  event_name: string;
  payload?: Record<string, unknown>;
};

export async function insertAuditEvent(input: AuditEventInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('audit_events').insert({
    actor_user_id: input.actor_user_id ?? null,
    source: input.source,
    event_name: input.event_name,
    payload: input.payload ?? {},
  });

  if (error) throw error;
}
