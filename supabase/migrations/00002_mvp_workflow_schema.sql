-- Verification and organization enums
CREATE TYPE verification_state AS ENUM ('pending', 'verified', 'rejected', 'suspended');
CREATE TYPE booking_status AS ENUM ('requested', 'approved', 'rejected', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'requires_action', 'succeeded', 'failed', 'refunded');
CREATE TYPE organization_role AS ENUM ('admin', 'manager', 'viewer');
CREATE TYPE invite_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');
CREATE TYPE job_status AS ENUM ('draft', 'published', 'closed');

ALTER TABLE public.profiles
  ADD COLUMN verification_state verification_state NOT NULL DEFAULT 'pending',
  ADD COLUMN verification_notes TEXT;

CREATE TABLE public.role_change_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  previous_role app_role NOT NULL,
  new_role app_role NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.landlord_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  kyc_submitted BOOLEAN NOT NULL DEFAULT FALSE,
  payout_account_ready BOOLEAN NOT NULL DEFAULT FALSE,
  screening_rules_configured BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.enterprise_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_name TEXT,
  domain TEXT,
  domain_verified BOOLEAN NOT NULL DEFAULT FALSE,
  admin_approved BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  verification_state verification_state NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.org_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role organization_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, user_id)
);

CREATE TABLE public.invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role organization_role NOT NULL DEFAULT 'viewer',
  token TEXT NOT NULL UNIQUE,
  status invite_status NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.job_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status job_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  tenant_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  landlord_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  status booking_status NOT NULL DEFAULT 'requested',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.booking_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.screening_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  minimum_score INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  auto_approve BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source TEXT NOT NULL,
  event_name TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  template_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_role_change_events_user_id ON public.role_change_events(user_id);
CREATE INDEX idx_bookings_listing_id ON public.bookings(listing_id);
CREATE INDEX idx_bookings_tenant_user_id ON public.bookings(tenant_user_id);
CREATE INDEX idx_bookings_landlord_user_id ON public.bookings(landlord_user_id);
CREATE INDEX idx_booking_events_booking_id ON public.booking_events(booking_id);
CREATE INDEX idx_job_posts_org_id ON public.job_posts(org_id);
CREATE INDEX idx_org_memberships_user_id ON public.org_memberships(user_id);
CREATE INDEX idx_payments_stripe_payment_intent_id ON public.payments(stripe_payment_intent_id);

CREATE OR REPLACE FUNCTION public.enforce_profile_verification_state()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'tenant' THEN
    IF NEW.verification_state NOT IN ('pending', 'verified', 'suspended') THEN
      RAISE EXCEPTION 'Invalid tenant verification state';
    END IF;
  ELSIF NEW.role = 'landlord' THEN
    IF NEW.verification_state NOT IN ('pending', 'verified', 'rejected', 'suspended') THEN
      RAISE EXCEPTION 'Invalid landlord verification state';
    END IF;
  ELSIF NEW.role = 'enterprise' THEN
    IF NEW.verification_state NOT IN ('pending', 'verified', 'rejected', 'suspended') THEN
      RAISE EXCEPTION 'Invalid enterprise verification state';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.capture_role_change_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    INSERT INTO public.role_change_events(user_id, previous_role, new_role)
    VALUES (NEW.id, OLD.role, NEW.role);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_profile_verification_state_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_profile_verification_state();

CREATE TRIGGER role_change_event_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.capture_role_change_event();

CREATE TRIGGER landlord_verifications_updated_at
  BEFORE UPDATE ON public.landlord_verifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER enterprise_verifications_updated_at
  BEFORE UPDATE ON public.enterprise_verifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER screening_rules_updated_at
  BEFORE UPDATE ON public.screening_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER job_posts_updated_at
  BEFORE UPDATE ON public.job_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.role_change_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlord_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Profile ownership
CREATE POLICY "Users can view own role changes"
  ON public.role_change_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own landlord verification"
  ON public.landlord_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own landlord verification"
  ON public.landlord_verifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own landlord verification"
  ON public.landlord_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own enterprise verification"
  ON public.enterprise_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own enterprise verification"
  ON public.enterprise_verifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own enterprise verification"
  ON public.enterprise_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Organizations and memberships
CREATE POLICY "Organization members can view organizations"
  ON public.organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_id = organizations.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Enterprise users can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (
    auth.uid() = owner_user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'enterprise'
    )
  );

CREATE POLICY "Organization admins can update organizations"
  ON public.organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_id = organizations.id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

CREATE POLICY "Organization members can view memberships"
  ON public.org_memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships AS me
      WHERE me.org_id = org_memberships.org_id AND me.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization admins can manage memberships"
  ON public.org_memberships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships AS me
      WHERE me.org_id = org_memberships.org_id
        AND me.user_id = auth.uid()
        AND me.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_memberships AS me
      WHERE me.org_id = org_memberships.org_id
        AND me.user_id = auth.uid()
        AND me.role = 'admin'
    )
  );

CREATE POLICY "Organization admins can manage invites"
  ON public.invites FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_id = invites.org_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_id = invites.org_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

CREATE POLICY "Organization members can view invites"
  ON public.invites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_id = invites.org_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can view job posts"
  ON public.job_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_id = job_posts.org_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "Organization manager and admin can create job posts"
  ON public.job_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_id = job_posts.org_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'manager')
    )
    AND auth.uid() = created_by
  );

CREATE POLICY "Organization manager and admin can update job posts"
  ON public.job_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_id = job_posts.org_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Organization admins can delete job posts"
  ON public.job_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_id = job_posts.org_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Bookings
CREATE POLICY "Tenant can create booking for self"
  ON public.bookings FOR INSERT
  WITH CHECK (
    auth.uid() = tenant_user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'tenant'
        AND verification_state = 'verified'
    )
  );

CREATE POLICY "Tenant and landlord can view related bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = tenant_user_id OR auth.uid() = landlord_user_id);

CREATE POLICY "Tenant and landlord can update related bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = tenant_user_id OR auth.uid() = landlord_user_id)
  WITH CHECK (auth.uid() = tenant_user_id OR auth.uid() = landlord_user_id);

CREATE POLICY "Tenant and landlord can view booking events"
  ON public.booking_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_events.booking_id
        AND (tenant_user_id = auth.uid() OR landlord_user_id = auth.uid())
    )
  );

CREATE POLICY "Tenant and landlord can insert booking events"
  ON public.booking_events FOR INSERT
  WITH CHECK (
    auth.uid() = actor_user_id
    AND EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_events.booking_id
        AND (tenant_user_id = auth.uid() OR landlord_user_id = auth.uid())
    )
  );

CREATE POLICY "Tenant and landlord can view related payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = payments.booking_id
        AND (tenant_user_id = auth.uid() OR landlord_user_id = auth.uid())
    )
  );

CREATE POLICY "Tenant can create payment for own booking"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = payments.booking_id
        AND tenant_user_id = auth.uid()
    )
  );

CREATE POLICY "Tenant and landlord can update related payments"
  ON public.payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = payments.booking_id
        AND (tenant_user_id = auth.uid() OR landlord_user_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = payments.booking_id
        AND (tenant_user_id = auth.uid() OR landlord_user_id = auth.uid())
    )
  );

CREATE POLICY "Landlord can manage own screening rules"
  ON public.screening_rules FOR ALL
  USING (
    auth.uid() = landlord_user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  )
  WITH CHECK (
    auth.uid() = landlord_user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  );

CREATE POLICY "Users can view own notifications"
  ON public.notification_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own audit events"
  ON public.audit_events FOR SELECT
  USING (auth.uid() = actor_user_id);
