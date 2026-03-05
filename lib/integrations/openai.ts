import { withRetries } from '@/lib/integrations/retry';

export type ListingDescriptionContext = {
  address?: string;
  title?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  monthlyRent?: number;
  isFurnished?: boolean;
  arePetsAllowed?: boolean;
  leaseTerms?: string[];
  amenities?: string[];
};

export async function generateListingDescription(params: {
  context: ListingDescriptionContext;
  userPrompt?: string;
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const { context, userPrompt } = params;
  const parts: string[] = [];
  if (context.address) parts.push(`Address: ${context.address}`);
  if (context.title) parts.push(`Title: ${context.title}`);
  if (context.bedrooms != null) parts.push(`Bedrooms: ${context.bedrooms}`);
  if (context.bathrooms != null) parts.push(`Bathrooms: ${context.bathrooms}`);
  if (context.squareFootage != null) parts.push(`Square footage: ${context.squareFootage}`);
  if (context.monthlyRent != null) parts.push(`Monthly rent: $${context.monthlyRent}`);
  if (context.isFurnished) parts.push('Furnished: yes');
  if (context.arePetsAllowed) parts.push('Pets allowed: yes');
  if (context.leaseTerms?.length) parts.push(`Lease terms: ${context.leaseTerms.join(', ')}`);
  if (context.amenities?.length) parts.push(`Amenities: ${context.amenities.join(', ')}`);
  const contextBlock = parts.length ? parts.join('\n') : 'No property details provided.';
  const userContent = userPrompt
    ? `${contextBlock}\n\nAdditional instructions: ${userPrompt}`
    : contextBlock;

  return withRetries(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a real estate copywriter. Generate a concise, professional rental listing description for healthcare workers. Output only the description text, no headings or labels.',
          },
          { role: 'user', content: userContent },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('OpenAI returned no description');
    }
    return content;
  });
}

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
