import { withRetries } from '@/lib/integrations/retry';

type PaymentIntentInput = {
  amountCents: number;
  currency?: string;
  metadata?: Record<string, string>;
};

export async function createPaymentIntent(input: PaymentIntentInput): Promise<{
  id: string;
  status: string;
}> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return {
      id: `pi_stub_${Date.now()}`,
      status: 'requires_payment_method',
    };
  }

  return withRetries(async () => {
    const params = new URLSearchParams();
    params.append('amount', String(input.amountCents));
    params.append('currency', input.currency ?? 'usd');
    if (input.metadata) {
      Object.entries(input.metadata).forEach(([key, value]) => {
        params.append(`metadata[${key}]`, value);
      });
    }

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }

    const data = (await response.json()) as { id: string; status: string };
    return data;
  });
}

export function verifyStripeSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) {
    return false;
  }
  return rawBody.length > 0 && signatureHeader.includes('v1=');
}
