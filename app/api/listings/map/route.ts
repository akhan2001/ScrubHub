import { NextRequest, NextResponse } from 'next/server';
import { getPublishedListingsInBounds } from '@/server/services/listings.service';

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const north = parseFloat(sp.get('north') ?? '');
  const south = parseFloat(sp.get('south') ?? '');
  const east = parseFloat(sp.get('east') ?? '');
  const west = parseFloat(sp.get('west') ?? '');

  if ([north, south, east, west].some(isNaN)) {
    return NextResponse.json({ error: 'Missing bounding box params' }, { status: 400 });
  }

  const minPrice = sp.get('minPrice') ? parseFloat(sp.get('minPrice')!) : undefined;
  const maxPrice = sp.get('maxPrice') ? parseFloat(sp.get('maxPrice')!) : undefined;
  const isFurnished = sp.get('isFurnished') === 'true' ? true : undefined;
  const arePetsAllowed = sp.get('arePetsAllowed') === 'true' ? true : undefined;

  const listings = await getPublishedListingsInBounds({
    north,
    south,
    east,
    west,
    minPrice,
    maxPrice,
    isFurnished,
    arePetsAllowed,
  });

  return NextResponse.json({ listings });
}
