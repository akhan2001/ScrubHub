-- Fix onboarding role update failures caused by missing INSERT policy.
-- Trigger capture_role_change_event inserts into role_change_events on profile role change.
-- With RLS enabled, we must allow authenticated users to insert their own role-change event row.

CREATE POLICY "Users can insert own role changes"
  ON public.role_change_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);
