import { insertAuditEvent } from '@/server/repositories/audit.repository';

export async function logAuditEvent(input: {
  actorUserId?: string | null;
  source: string;
  eventName: string;
  payload?: Record<string, unknown>;
}): Promise<void> {
  await insertAuditEvent({
    actor_user_id: input.actorUserId ?? null,
    source: input.source,
    event_name: input.eventName,
    payload: input.payload,
  });
}
