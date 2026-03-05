-- Create listing-photos storage bucket (public read for listing images).
-- If this INSERT fails (e.g. bucket already exists or storage schema differs), create the bucket
-- in Supabase Dashboard > Storage with id "listing-photos", public read, and apply the policies below.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-photos',
  'listing-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload listing photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-photos');

-- Allow authenticated users to update/delete their uploads (optional: use auth.uid() in naming to scope)
CREATE POLICY "Authenticated users can update listing photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'listing-photos');

CREATE POLICY "Authenticated users can delete listing photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing-photos');

-- Public read (bucket is public)
CREATE POLICY "Public read for listing photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-photos');
