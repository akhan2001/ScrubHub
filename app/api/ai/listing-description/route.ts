import { NextResponse } from 'next/server';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { generateListingDescription } from '@/lib/integrations/openai';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rate = checkRateLimit({
    key: `ai-listing-description:${user.id}`,
    windowMs: 60_000,
    max: 10,
  });
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: {
    userPrompt?: string;
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
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const context = {
    address: body.address,
    title: body.title,
    bedrooms: body.bedrooms,
    bathrooms: body.bathrooms,
    squareFootage: body.squareFootage,
    monthlyRent: body.monthlyRent,
    isFurnished: body.isFurnished,
    arePetsAllowed: body.arePetsAllowed,
    leaseTerms: body.leaseTerms,
    amenities: body.amenities,
  };

  try {
    const description = await generateListingDescription({
      context,
      userPrompt: body.userPrompt,
    });
    return NextResponse.json({ description });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI description failed';
    if (message.includes('not configured') || message.includes('API key')) {
      return NextResponse.json(
        { error: 'AI description is not configured.' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: message || 'Failed to generate description' },
      { status: 503 }
    );
  }
}
