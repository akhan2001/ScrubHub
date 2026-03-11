-- Allow authenticated users to insert notification logs.
-- Used when tenants apply for jobs: we create in-app notifications for org admins/managers.
-- The application logic controls when and for whom notifications are created.
CREATE POLICY "Authenticated users can insert notification logs"
  ON public.notification_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
