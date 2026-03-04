import { NextRequest, NextResponse } from 'next/server';

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  if (!MAPBOX_TOKEN) {
    return NextResponse.json(
      { error: 'Geocoding service not configured' },
      { status: 503 },
    );
  }

  const url = new URL('https://api.mapbox.com/search/geocode/v6/forward');
  url.searchParams.set('q', query);
  url.searchParams.set('access_token', MAPBOX_TOKEN);
  url.searchParams.set('limit', '5');
  url.searchParams.set('types', 'address,place');
  url.searchParams.set('country', 'US,CA');

  const res = await fetch(url.toString());
  if (!res.ok) {
    return NextResponse.json(
      { error: 'Geocoding request failed' },
      { status: 502 },
    );
  }

  const data = await res.json();
  const suggestions = (data.features ?? []).map(
    (f: { properties: { full_address?: string; name?: string }; geometry: { coordinates: number[] } }) => ({
      address: f.properties.full_address ?? f.properties.name ?? '',
      latitude: f.geometry.coordinates[1],
      longitude: f.geometry.coordinates[0],
    }),
  );

  return NextResponse.json({ suggestions });
}
