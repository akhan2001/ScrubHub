-- Pay-stubs storage bucket (private; tenant-scoped reads/writes via auth.uid() folder)
-- Each user uploads to "{user_id}/{uuid}.pdf"; only that user can read/list/delete.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pay-stubs',
  'pay-stubs',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Tenants upload own pay stubs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pay-stubs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Tenants read own pay stubs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'pay-stubs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Tenants delete own pay stubs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'pay-stubs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Persist the storage path of the most recent pay stub on the worker profile.
ALTER TABLE public.worker_profiles
  ADD COLUMN IF NOT EXISTS pay_stub_url TEXT;
