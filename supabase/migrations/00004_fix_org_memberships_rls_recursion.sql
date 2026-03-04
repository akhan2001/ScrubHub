-- Fix recursive RLS evaluation on org_memberships.
-- Previous policies queried org_memberships from within org_memberships policies,
-- which causes Postgres 42P17 (infinite recursion).

CREATE OR REPLACE FUNCTION public.is_org_member(target_org_id UUID, target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.org_memberships
    WHERE org_id = target_org_id
      AND user_id = target_user_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(target_org_id UUID, target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.org_memberships
    WHERE org_id = target_org_id
      AND user_id = target_user_id
      AND role = 'admin'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_org_manager_or_admin(target_org_id UUID, target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.org_memberships
    WHERE org_id = target_org_id
      AND user_id = target_user_id
      AND role IN ('admin', 'manager')
  );
END;
$$;

DROP POLICY IF EXISTS "Organization members can view organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization admins can update organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization members can view memberships" ON public.org_memberships;
DROP POLICY IF EXISTS "Organization admins can manage memberships" ON public.org_memberships;
DROP POLICY IF EXISTS "Organization admins can manage invites" ON public.invites;
DROP POLICY IF EXISTS "Organization members can view invites" ON public.invites;
DROP POLICY IF EXISTS "Organization members can view job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Organization manager and admin can create job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Organization manager and admin can update job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Organization admins can delete job posts" ON public.job_posts;

CREATE POLICY "Organization members can view organizations"
  ON public.organizations FOR SELECT
  USING (public.is_org_member(organizations.id, auth.uid()));

CREATE POLICY "Organization admins can update organizations"
  ON public.organizations FOR UPDATE
  USING (public.is_org_admin(organizations.id, auth.uid()));

CREATE POLICY "Organization members can view memberships"
  ON public.org_memberships FOR SELECT
  USING (public.is_org_member(org_memberships.org_id, auth.uid()));

CREATE POLICY "Organization admins can manage memberships"
  ON public.org_memberships FOR ALL
  USING (public.is_org_admin(org_memberships.org_id, auth.uid()))
  WITH CHECK (public.is_org_admin(org_memberships.org_id, auth.uid()));

CREATE POLICY "Organization admins can manage invites"
  ON public.invites FOR ALL
  USING (public.is_org_admin(invites.org_id, auth.uid()))
  WITH CHECK (public.is_org_admin(invites.org_id, auth.uid()));

CREATE POLICY "Organization members can view invites"
  ON public.invites FOR SELECT
  USING (public.is_org_member(invites.org_id, auth.uid()));

CREATE POLICY "Organization members can view job posts"
  ON public.job_posts FOR SELECT
  USING (public.is_org_member(job_posts.org_id, auth.uid()));

CREATE POLICY "Organization manager and admin can create job posts"
  ON public.job_posts FOR INSERT
  WITH CHECK (
    public.is_org_manager_or_admin(job_posts.org_id, auth.uid())
    AND auth.uid() = created_by
  );

CREATE POLICY "Organization manager and admin can update job posts"
  ON public.job_posts FOR UPDATE
  USING (public.is_org_manager_or_admin(job_posts.org_id, auth.uid()));

CREATE POLICY "Organization admins can delete job posts"
  ON public.job_posts FOR DELETE
  USING (public.is_org_admin(job_posts.org_id, auth.uid()));
