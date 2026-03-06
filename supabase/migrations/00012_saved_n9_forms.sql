-- Standalone N9 forms saved by tenants (no lease required)
CREATE TABLE saved_n9_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  landlord_name TEXT NOT NULL,
  tenant_name TEXT NOT NULL,
  rental_address TEXT NOT NULL,
  termination_date DATE NOT NULL,
  phone_number TEXT,
  signature_first_name TEXT NOT NULL,
  signature_last_name TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_saved_n9_forms_tenant ON saved_n9_forms (tenant_user_id);

ALTER TABLE saved_n9_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can insert their own saved N9 forms"
  ON saved_n9_forms FOR INSERT
  WITH CHECK (tenant_user_id = auth.uid());

CREATE POLICY "Tenants can view their own saved N9 forms"
  ON saved_n9_forms FOR SELECT
  USING (tenant_user_id = auth.uid());

CREATE POLICY "Tenants can delete their own saved N9 forms"
  ON saved_n9_forms FOR DELETE
  USING (tenant_user_id = auth.uid());
