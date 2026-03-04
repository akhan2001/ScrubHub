export type AppRole = 'tenant' | 'landlord' | 'enterprise';
export type VerificationState = 'pending' | 'verified' | 'rejected' | 'suspended';

export type ListingStatus = 'draft' | 'published' | 'archived';
export type BookingStatus = 'requested' | 'approved' | 'rejected' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'requires_action' | 'succeeded' | 'failed' | 'refunded';
export type OrganizationRole = 'admin' | 'manager' | 'viewer';
export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked';
export type JobStatus = 'draft' | 'published' | 'closed';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: AppRole;
  verification_state: VerificationState;
  verification_notes: string | null;
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

export interface Booking {
  id: string;
  listing_id: string;
  tenant_user_id: string;
  landlord_user_id: string;
  notes: string | null;
  status: BookingStatus;
  requested_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  stripe_payment_intent_id: string | null;
  amount_cents: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface ScreeningRule {
  id: string;
  landlord_user_id: string;
  minimum_score: number;
  notes: string | null;
  auto_approve: boolean;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  owner_user_id: string;
  name: string;
  domain: string | null;
  verification_state: VerificationState;
  created_at: string;
  updated_at: string;
}

export interface OrgMembership {
  id: string;
  org_id: string;
  user_id: string;
  role: OrganizationRole;
  created_at: string;
}

export interface JobPost {
  id: string;
  org_id: string;
  created_by: string;
  title: string;
  description: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}
