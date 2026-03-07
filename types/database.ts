export type AppRole = 'tenant' | 'landlord' | 'enterprise';
export type VerificationState = 'pending' | 'verified' | 'rejected' | 'suspended';

export type ListingStatus = 'draft' | 'published' | 'archived';
export type BookingStatus = 'requested' | 'reviewing' | 'approved' | 'rejected' | 'cancelled' | 'completed' | 'withdrawn';
export type PaymentStatus = 'pending' | 'requires_action' | 'succeeded' | 'failed' | 'refunded';
export type OrganizationRole = 'admin' | 'manager' | 'viewer';
export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked';
export type JobStatus = 'draft' | 'published' | 'closed' | 'filled';
export type JobApplicationStatus = 'submitted' | 'reviewed' | 'rejected' | 'hired';
export type PlanTier = 'free' | 'starter' | 'growth' | 'pro';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled';
export type LeaseStatus = 'active' | 'terminating' | 'terminated' | 'expired';
export type LeaseType = 'monthly' | 'fixed_term';
export type RentalPeriod = 'monthly' | 'weekly';
export type N9Reason = 'end_of_term' | 'moving_out' | 'mutual_agreement';
export type N9Status = 'draft' | 'signed' | 'delivered' | 'acknowledged' | 'disputed';

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
  has_selected_role: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_tier: PlanTier;
  status: SubscriptionStatus;
  billing_cycle: 'monthly' | 'annual' | null;
  current_period_start: string | null;
  current_period_end: string | null;
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
  amenities: string[] | null;

  latitude: number | null;
  longitude: number | null;

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
  move_in_date_requested: string | null;
  message_to_landlord: string | null;
  screening_result: ScreeningCheckResult | null;
  credit_check_result: ScreeningCheckResult | null;
  background_check_result: ScreeningCheckResult | null;
  requested_at: string;
  updated_at: string;
}

export interface ScreeningCheckResult {
  pass: boolean;
  [key: string]: unknown;
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
  listing_id: string | null;
  minimum_score: number;
  notes: string | null;
  auto_approve: boolean;
  require_background_check: boolean;
  require_employment_verification: boolean;
  require_license_verification: boolean;
  max_income_to_rent_ratio: number | null;
  instant_book_enabled: boolean;
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

export interface Lease {
  id: string;
  booking_id: string | null;
  listing_id: string;
  tenant_user_id: string;
  landlord_user_id: string;
  status: LeaseStatus;
  lease_type: LeaseType;
  rental_period: RentalPeriod;
  start_date: string;
  end_date: string | null;
  monthly_rent_cents: number;
  created_at: string;
  updated_at: string;
}

export interface N9Notice {
  id: string;
  lease_id: string;
  tenant_user_id: string;
  reason: N9Reason;
  termination_date: string;
  status: N9Status;
  signature_name: string | null;
  signature_date: string | null;
  signature_ip: string | null;
  pdf_url: string | null;
  landlord_acknowledged_at: string | null;
  landlord_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedN9Form {
  id: string;
  tenant_user_id: string;
  landlord_name: string;
  tenant_name: string;
  rental_address: string;
  termination_date: string;
  phone_number: string | null;
  signature_first_name: string;
  signature_last_name: string;
  pdf_url: string;
  created_at: string;
}

export interface JobPost {
  id: string;
  org_id: string;
  created_by: string;
  title: string;
  description: string;
  status: JobStatus;
  facility_name: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  role_type: string | null;
  contract_type: string | null;
  contract_length: string | null;
  pay_range_min: number | null;
  pay_range_max: number | null;
  start_date: string | null;
  housing_included: boolean;
  linked_listing_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_post_id: string;
  user_id: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_message: string | null;
  status: JobApplicationStatus;
  created_at: string;
  updated_at: string;
}
