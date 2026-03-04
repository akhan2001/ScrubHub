import { withRetries } from '@/lib/integrations/retry';

export async function summarizeTextForModeration(input: {
  text: string;
  context?: string;
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return 'OpenAI integration unavailable; returning safe fallback summary.';
  }

  return withRetries(async () => {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content: 'Summarize text for moderation and risk. Keep it concise.',
          },
          {
            role: 'user',
            content: `${input.context ?? 'General listing context'}\n\n${input.text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      output_text?: string;
    };
    return data.output_text ?? 'No summary produced.';
  });
}
