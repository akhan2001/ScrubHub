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
  amenities?: any | null;
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
  });

  if (error) throw error;
}
