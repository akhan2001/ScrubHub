import { NextResponse } from 'next/server';
import { verifyStripeSignature } from '@/lib/integrations/stripe';
import { setPaymentStatusFromWebhook } from '@/server/services/bookings.service';
import { logAuditEvent } from '@/server/services/audit.service';
import { checkRateLimit } from '@/lib/rate-limit';

type StripeEvent = {
  type: string;
  data?: {
    object?: {
      id?: string;
      status?: string;
    };
  };
};

export async function POST(request: Request) {
  const rate = checkRateLimit({
    key: 'webhook:stripe',
    windowMs: 60_000,
    max: 120,
  });
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!verifyStripeSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as StripeEvent;
  const intent = event.data?.object;
  if (
    (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') &&
    intent?.id
  ) {
    await setPaymentStatusFromWebhook(
      intent.id,
      event.type === 'payment_intent.succeeded' ? 'succeeded' : 'failed'
    );
  }

  await logAuditEvent({
    source: 'api.webhooks.stripe',
    eventName: event.type,
    payload: { intentId: intent?.id, status: intent?.status },
  });

  return NextResponse.json({ received: true });
}
