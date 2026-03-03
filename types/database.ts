export type AppRole = 'tenant' | 'landlord' | 'enterprise';

export type ListingStatus = 'draft' | 'published' | 'archived';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: AppRole;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  address: string | null;
  price_cents: number | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}
