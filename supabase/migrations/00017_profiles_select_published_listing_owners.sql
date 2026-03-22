-- Tenants (and other authenticated users) need to read landlord profile fields
-- (email, name) when creating bookings / sending notifications. Without this,
-- RLS returns 0 rows for "other" profiles and .single()-style queries error.

CREATE POLICY "Authenticated can view profiles of published listing owners"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.listings l
      WHERE l.user_id = profiles.id
        AND l.status = 'published'
    )
  );
