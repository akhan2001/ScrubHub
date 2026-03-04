export interface AddressSuggestion {
  address: string;
  latitude: number;
  longitude: number;
}

export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
  if (!query || query.length < 2) return [];

  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];

  const data = await res.json();
  return data.suggestions ?? [];
}
