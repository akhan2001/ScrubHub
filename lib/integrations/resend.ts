import { Resend } from 'resend';
import { withRetries } from '@/lib/integrations/retry';

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

function getFromAddress(): string | null {
  const explicit = process.env.RESEND_FROM_EMAIL?.trim();
  if (explicit) return explicit;
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return 'ScrubHub <onboarding@resend.dev>';
}

/**
 * Send-only email via Resend. No-op when RESEND_API_KEY is unset (returns stub id).
 */
export async function sendEmail(input: SendEmailInput): Promise<{ id: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = getFromAddress();

  if (!apiKey || !from) {
    return { id: `email_stub_${Date.now()}` };
  }

  return withRetries(async () => {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
    });

    if (error) {
      throw new Error(error.message || 'Resend send failed');
    }
    if (!data?.id) {
      throw new Error('Resend returned no message id');
    }
    return { id: data.id };
  });
}
