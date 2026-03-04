-- Beta v2: Listings geocoding, application fields, per-listing screening, enriched job posts

-- 1. Listings: add geocoding columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- 2. Bookings: extend to serve as applications
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'reviewing';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'withdrawn';

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS move_in_date_requested DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS message_to_landlord TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS screening_result JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS credit_check_result JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS background_check_result JSONB;

-- 3. Screening rules: extend to per-listing with richer fields
ALTER TABLE screening_rules DROP CONSTRAINT IF EXISTS screening_rules_landlord_user_id_key;
ALTER TABLE screening_rules ADD COLUMN IF NOT EXISTS listing_id UUID REFERENCES listings(id);
ALTER TABLE screening_rules ADD COLUMN IF NOT EXISTS require_background_check BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE screening_rules ADD COLUMN IF NOT EXISTS require_employment_verification BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE screening_rules ADD COLUMN IF NOT EXISTS require_license_verification BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE screening_rules ADD COLUMN IF NOT EXISTS max_income_to_rent_ratio NUMERIC;
ALTER TABLE screening_rules ADD COLUMN IF NOT EXISTS instant_book_enabled BOOLEAN NOT NULL DEFAULT FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS screening_rules_listing_unique
  ON screening_rules(listing_id) WHERE listing_id IS NOT NULL;

-- 4. Job posts: add all spec fields
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS facility_name TEXT;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS role_type TEXT;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS contract_type TEXT;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS contract_length TEXT;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS pay_range_min INTEGER;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS pay_range_max INTEGER;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS housing_included BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS linked_listing_id UUID REFERENCES listings(id);

ALTER TYPE job_status ADD VALUE IF NOT EXISTS 'filled';
