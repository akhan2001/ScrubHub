-- Migration 00006: Beta v1 Schema Updates

-- 1. Update Profiles Table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Create Worker Profiles Table
CREATE TABLE IF NOT EXISTS public.worker_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Credentials
  healthcare_role TEXT,
  license_number TEXT,
  license_state TEXT,
  license_expiry DATE,
  license_document_url TEXT,
  employment_status TEXT,
  employer_name TEXT,
  employer_contact TEXT,
  -- Housing Preferences
  move_in_date DATE,
  lease_term_preference TEXT,
  location_preference TEXT,
  unit_type_preference TEXT,
  furnished_preference TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  has_pets BOOLEAN DEFAULT FALSE,
  pet_details TEXT,
  accessibility_needs TEXT,
  -- Rental History
  current_address TEXT,
  current_landlord TEXT,
  previous_address TEXT,
  previous_landlord TEXT,
  eviction_history BOOLEAN DEFAULT FALSE,
  eviction_details TEXT,
  broken_lease_history BOOLEAN DEFAULT FALSE,
  broken_lease_details TEXT,
  -- Background Check
  background_check_consent BOOLEAN DEFAULT FALSE,
  id_document_url TEXT,
  ssn_last_4 TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Landlord Profiles Table
CREATE TABLE IF NOT EXISTS public.landlord_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  identity_document_url TEXT,
  entity_type TEXT DEFAULT 'Individual',
  business_name TEXT,
  ein_number TEXT,
  business_address TEXT,
  uses_property_management_software BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Update Listings Table
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS unit_number TEXT,
ADD COLUMN IF NOT EXISTS bedrooms NUMERIC,
ADD COLUMN IF NOT EXISTS bathrooms NUMERIC,
ADD COLUMN IF NOT EXISTS square_footage INTEGER,
ADD COLUMN IF NOT EXISTS deposit_amount_cents INTEGER,
ADD COLUMN IF NOT EXISTS available_date DATE,
ADD COLUMN IF NOT EXISTS lease_terms TEXT[], -- Array of strings: ['Short-term', 'Standard', 'Long-term']
ADD COLUMN IF NOT EXISTS is_furnished BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS are_pets_allowed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS images TEXT[], -- Array of URLs
ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb;

-- 5. Enable RLS and Add Policies

-- Worker Profiles RLS
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own worker profile"
  ON public.worker_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own worker profile"
  ON public.worker_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own worker profile"
  ON public.worker_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Landlord Profiles RLS
ALTER TABLE public.landlord_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own landlord profile"
  ON public.landlord_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own landlord profile"
  ON public.landlord_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own landlord profile"
  ON public.landlord_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Triggers for updated_at
CREATE TRIGGER worker_profiles_updated_at
  BEFORE UPDATE ON public.worker_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER landlord_profiles_updated_at
  BEFORE UPDATE ON public.landlord_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
