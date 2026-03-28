-- Allow authenticated users to read profiles of published listing owners (tenant booking flows).
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

-- Landlords must read tenant profile rows for bookings they own (name, email, phone on approvals UI).
CREATE POLICY "Landlords can view tenant profiles for their bookings"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.tenant_user_id = profiles.id
        AND b.landlord_user_id = auth.uid()
    )
  );
