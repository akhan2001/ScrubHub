import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { logAuditEvent } from '@/server/services/audit.service';
import { verifyTwilioSignature } from '@/lib/integrations/twilio';

export async function POST(request: Request) {
  const rate = checkRateLimit({
    key: 'webhook:twilio',
    windowMs: 60_000,
    max: 200,
  });
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const signature = request.headers.get('x-twilio-signature');
  if (!verifyTwilioSignature(signature, process.env.TWILIO_AUTH_TOKEN)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const formData = await request.formData();
  const messageSid = String(formData.get('MessageSid') ?? '');
  const messageStatus = String(formData.get('MessageStatus') ?? '');
  const to = String(formData.get('To') ?? '');
  const from = String(formData.get('From') ?? '');

  await logAuditEvent({
    source: 'api.webhooks.twilio',
    eventName: 'twilio.message.status',
    payload: { messageSid, messageStatus, to, from },
  });

  return NextResponse.json({ received: true });
}
