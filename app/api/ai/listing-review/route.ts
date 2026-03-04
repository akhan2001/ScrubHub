import { NextResponse } from 'next/server';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { summarizeTextForModeration } from '@/lib/integrations/openai';
import { checkRateLimit } from '@/lib/rate-limit';
import { logAuditEvent } from '@/server/services/audit.service';

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rate = checkRateLimit({
    key: `ai-listing-review:${user.id}`,
    windowMs: 60_000,
    max: 10,
  });
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = (await request.json()) as { text?: string };
  if (!body.text || body.text.length < 10) {
    return NextResponse.json({ error: 'Text must be at least 10 characters' }, { status: 400 });
  }

  const summary = await summarizeTextForModeration({
    text: body.text,
    context: 'ScrubHub listing review',
  });

  await logAuditEvent({
    actorUserId: user.id,
    source: 'api.ai.listing-review',
    eventName: 'ai.listing_review',
    payload: { textLength: body.text.length },
  });

  return NextResponse.json({ summary });
}
