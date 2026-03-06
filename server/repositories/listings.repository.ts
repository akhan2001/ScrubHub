import { createClient } from '@/lib/supabase/server';
import type { Listing, ListingStatus } from '@/types/database';

export type ListingRow = Listing;

export async function fetchListingsByUser(
  userId: string
): Promise<Pick<Listing, 'id' | 'title' | 'status' | 'created_at'>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function countListingsByUser(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchPublishedListings(): Promise<ListingRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchPublishedListingById(
  id: string
): Promise<ListingRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function fetchListingOwnerById(
  id: string
): Promise<Pick<Listing, 'id' | 'user_id' | 'status'> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('id, user_id, status')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export type InsertListingInput = {
  user_id: string;
  title: string;
  description?: string | null;
  address?: string | null;
  price_cents?: number | null;
  status?: ListingStatus;
  unit_number?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_footage?: number | null;
  deposit_amount_cents?: number | null;
  available_date?: string | null;
  lease_terms?: string[] | null;
  is_furnished?: boolean;
  are_pets_allowed?: boolean;
  images?: string[] | null;
  amenities?: unknown;
  latitude?: number | null;
  longitude?: number | null;
};

export async function insertListing(input: InsertListingInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('listings').insert({
    user_id: input.user_id,
    title: input.title,
    description: input.description ?? null,
    address: input.address ?? null,
    price_cents: input.price_cents ?? null,
    status: input.status ?? 'draft',
    unit_number: input.unit_number ?? null,
    bedrooms: input.bedrooms ?? null,
    bathrooms: input.bathrooms ?? null,
    square_footage: input.square_footage ?? null,
    deposit_amount_cents: input.deposit_amount_cents ?? null,
    available_date: input.available_date ?? null,
    lease_terms: input.lease_terms ?? null,
    is_furnished: input.is_furnished ?? false,
    are_pets_allowed: input.are_pets_allowed ?? false,
    images: input.images ?? null,
    amenities: input.amenities ?? null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
  });

  if (error) throw error;
}

export async function updateListingById(
  listingId: string,
  userId: string,
  fields: Partial<Omit<InsertListingInput, 'user_id'>>
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('listings')
    .update(fields)
    .eq('id', listingId)
    .eq('user_id', userId);

  if (error) throw error;
}

export interface MapBoundsFilter {
  north: number;
  south: number;
  east: number;
  west: number;
  minPrice?: number;
  maxPrice?: number;
  leaseTerms?: string[];
  isFurnished?: boolean;
  arePetsAllowed?: boolean;
}

export type MapListingRow = Pick<
  Listing,
  'id' | 'title' | 'description' | 'address' | 'price_cents' | 'status' | 'created_at' |
  'latitude' | 'longitude' | 'bedrooms' | 'bathrooms' | 'square_footage' |
  'is_furnished' | 'are_pets_allowed' | 'images' | 'lease_terms'
>;

export async function fetchPublishedListingsInBounds(
  filters: MapBoundsFilter
): Promise<MapListingRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from('listings')
    .select('id, title, description, address, price_cents, status, created_at, latitude, longitude, bedrooms, bathrooms, square_footage, is_furnished, are_pets_allowed, images, lease_terms')
    .eq('status', 'published')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .gte('latitude', filters.south)
    .lte('latitude', filters.north)
    .gte('longitude', filters.west)
    .lte('longitude', filters.east);

  if (filters.minPrice != null) {
    query = query.gte('price_cents', filters.minPrice * 100);
  }
  if (filters.maxPrice != null) {
    query = query.lte('price_cents', filters.maxPrice * 100);
  }
  if (filters.isFurnished != null) {
    query = query.eq('is_furnished', filters.isFurnished);
  }
  if (filters.arePetsAllowed != null) {
    query = query.eq('are_pets_allowed', filters.arePetsAllowed);
  }

  const { data, error } = await query.limit(200);
  if (error) throw error;
  return (data ?? []) as MapListingRow[];
}

export async function fetchListingById(
  listingId: string
): Promise<Listing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function deleteListingById(
  listingId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function fetchListingsByUserWithDetails(
  userId: string
): Promise<Listing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
