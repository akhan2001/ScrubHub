-- ============================================================
-- Migration 00011: Leases and N9 Termination Notices
-- ============================================================

-- Lease status enum
CREATE TYPE lease_status AS ENUM ('active', 'terminating', 'terminated', 'expired');
CREATE TYPE lease_type AS ENUM ('monthly', 'fixed_term');
CREATE TYPE rental_period AS ENUM ('monthly', 'weekly');
CREATE TYPE n9_reason AS ENUM ('end_of_term', 'moving_out', 'mutual_agreement');
CREATE TYPE n9_status AS ENUM ('draft', 'signed', 'delivered', 'acknowledged', 'disputed');

-- Leases table
CREATE TABLE leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  tenant_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  landlord_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status lease_status NOT NULL DEFAULT 'active',
  lease_type lease_type NOT NULL DEFAULT 'monthly',
  rental_period rental_period NOT NULL DEFAULT 'monthly',
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_rent_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leases_tenant ON leases(tenant_user_id);
CREATE INDEX idx_leases_landlord ON leases(landlord_user_id);
CREATE INDEX idx_leases_listing ON leases(listing_id);
CREATE INDEX idx_leases_booking ON leases(booking_id);

-- N9 notices table
CREATE TABLE n9_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
  tenant_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason n9_reason NOT NULL,
  termination_date DATE NOT NULL,
  status n9_status NOT NULL DEFAULT 'draft',
  signature_name TEXT,
  signature_date TIMESTAMPTZ,
  signature_ip TEXT,
  pdf_url TEXT,
  landlord_acknowledged_at TIMESTAMPTZ,
  landlord_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_n9_notices_lease ON n9_notices(lease_id);
CREATE INDEX idx_n9_notices_tenant ON n9_notices(tenant_user_id);

-- Auto-update updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_leases_updated_at') THEN
    CREATE TRIGGER set_leases_updated_at
      BEFORE UPDATE ON leases
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_n9_notices_updated_at') THEN
    CREATE TRIGGER set_n9_notices_updated_at
      BEFORE UPDATE ON n9_notices
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

-- RLS
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE n9_notices ENABLE ROW LEVEL SECURITY;

-- Leases: tenants can read their own
CREATE POLICY "Tenants can view own leases"
  ON leases FOR SELECT TO authenticated
  USING (tenant_user_id = auth.uid());

-- Leases: landlords can read leases on their properties
CREATE POLICY "Landlords can view their leases"
  ON leases FOR SELECT TO authenticated
  USING (landlord_user_id = auth.uid());

-- Leases: landlords can insert (when creating from approved booking)
CREATE POLICY "Landlords can create leases"
  ON leases FOR INSERT TO authenticated
  WITH CHECK (landlord_user_id = auth.uid());

-- Leases: landlords can update status
CREATE POLICY "Landlords can update leases"
  ON leases FOR UPDATE TO authenticated
  USING (landlord_user_id = auth.uid());

-- Leases: service role can update (for system-driven status changes)
CREATE POLICY "Service can update leases"
  ON leases FOR UPDATE TO authenticated
  USING (tenant_user_id = auth.uid());

-- N9: tenants can insert their own notices
CREATE POLICY "Tenants can create n9 notices"
  ON n9_notices FOR INSERT TO authenticated
  WITH CHECK (tenant_user_id = auth.uid());

-- N9: tenants can view their own notices
CREATE POLICY "Tenants can view own n9 notices"
  ON n9_notices FOR SELECT TO authenticated
  USING (tenant_user_id = auth.uid());

-- N9: tenants can update their own draft notices (signing)
CREATE POLICY "Tenants can update own n9 notices"
  ON n9_notices FOR UPDATE TO authenticated
  USING (tenant_user_id = auth.uid());

-- N9: landlords can view notices on their leases
CREATE POLICY "Landlords can view n9 notices on their leases"
  ON n9_notices FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leases
      WHERE leases.id = n9_notices.lease_id
        AND leases.landlord_user_id = auth.uid()
    )
  );

-- N9: landlords can update notices (acknowledgement)
CREATE POLICY "Landlords can acknowledge n9 notices"
  ON n9_notices FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leases
      WHERE leases.id = n9_notices.lease_id
        AND leases.landlord_user_id = auth.uid()
    )
  );

-- N9 Documents storage bucket (private, authenticated access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'n9-documents',
  'n9-documents',
  false,
  10485760,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Authenticated users can upload n9 documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'n9-documents');

CREATE POLICY "Authenticated users can read n9 documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'n9-documents');
