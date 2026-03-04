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
  phone_number: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkerProfile {
  id: string;
  healthcare_role: string | null;
  license_number: string | null;
  license_state: string | null;
  license_expiry: string | null;
  license_document_url: string | null;
  employment_status: string | null;
  employer_name: string | null;
  employer_contact: string | null;
  move_in_date: string | null;
  lease_term_preference: string | null;
  location_preference: string | null;
  unit_type_preference: string | null;
  furnished_preference: string | null;
  budget_min: number | null;
  budget_max: number | null;
  has_pets: boolean;
  pet_details: string | null;
  accessibility_needs: string | null;
  current_address: string | null;
  current_landlord: string | null;
  previous_address: string | null;
  previous_landlord: string | null;
  eviction_history: boolean;
  eviction_details: string | null;
  broken_lease_history: boolean;
  broken_lease_details: string | null;
  background_check_consent: boolean;
  id_document_url: string | null;
  ssn_last_4: string | null;
  created_at: string;
  updated_at: string;
}

export interface LandlordProfile {
  id: string;
  identity_document_url: string | null;
  entity_type: string | null;
  business_name: string | null;
  ein_number: string | null;
  business_address: string | null;
  uses_property_management_software: boolean;
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
  
  // Beta v1 fields
  unit_number: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_footage: number | null;
  deposit_amount_cents: number | null;
  available_date: string | null;
  lease_terms: string[] | null;
  is_furnished: boolean;
  are_pets_allowed: boolean;
  images: string[] | null;
  amenities: unknown;

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
