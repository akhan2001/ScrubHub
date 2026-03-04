-- Fix enterprise organization creation RLS failures (42501 on organizations)
-- and bootstrap org membership/admin creation path.

CREATE OR REPLACE FUNCTION public.can_create_organization(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = target_user_id
      AND role = 'enterprise'
      AND verification_state = 'verified'
  );
END;
$$;

DROP POLICY IF EXISTS "Enterprise users can create organizations" ON public.organizations;

CREATE POLICY "Enterprise users can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (
    auth.uid() = owner_user_id
    AND public.can_create_organization(auth.uid())
  );

-- Allow first admin row to be inserted for a newly created organization.
CREATE POLICY "Organization owners can bootstrap admin membership"
  ON public.org_memberships FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND role = 'admin'
    AND EXISTS (
      SELECT 1
      FROM public.organizations
      WHERE id = org_memberships.org_id
        AND owner_user_id = auth.uid()
    )
  );

-- App server writes audit events during workflows; allow inserts for self or system-style null actor.
CREATE POLICY "Users can insert audit events"
  ON public.audit_events FOR INSERT
  WITH CHECK (auth.uid() = actor_user_id OR actor_user_id IS NULL);
