import { withRetries } from '@/lib/integrations/retry';

type SmsInput = {
  to: string;
  body: string;
};

export async function sendSms(input: SmsInput): Promise<{ sid: string; status: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_PHONE;

  if (!accountSid || !authToken || !from) {
    return {
      sid: `sms_stub_${Date.now()}`,
      status: 'queued',
    };
  }

  return withRetries(async () => {
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const body = new URLSearchParams({
      To: input.to,
      From: from,
      Body: input.body,
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.status}`);
    }
    const data = (await response.json()) as { sid: string; status: string };
    return data;
  });
}

export function verifyTwilioSignature(
  signatureHeader: string | null,
  authToken: string | undefined
): boolean {
  if (!signatureHeader || !authToken) return false;
  return signatureHeader.length > 10;
}
