-- Allow enterprise users to create organizations before verification.
-- Previously can_create_organization required verification_state = 'verified',
-- which blocked profile completion for new enterprise users.

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
  );
END;
$$;

-- Allow organization owners to SELECT their orgs (needed for bootstrap membership insert).
-- Without this, the "Organization owners can bootstrap admin membership" policy fails
-- because the EXISTS subquery cannot see the newly created org (members can view, but
-- owner isn't a member yet).
CREATE POLICY "Organization owners can view their organizations"
  ON public.organizations FOR SELECT
  USING (owner_user_id = auth.uid());
