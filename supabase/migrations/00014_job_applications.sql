-- Job applications: tenants apply for jobs with contact info and resume
CREATE TYPE job_application_status AS ENUM ('submitted', 'reviewed', 'rejected', 'hired');

CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_post_id UUID NOT NULL REFERENCES public.job_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  cover_message TEXT,
  status job_application_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (job_post_id, user_id)
);

CREATE INDEX idx_job_applications_job_post_id ON public.job_applications(job_post_id);
CREATE INDEX idx_job_applications_user_id ON public.job_applications(user_id);

-- RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Tenants can insert their own applications
CREATE POLICY "Tenants can insert own job applications"
ON public.job_applications FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'tenant'
  )
);

-- Tenants can read their own applications
CREATE POLICY "Tenants can read own job applications"
ON public.job_applications FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.job_posts jp
    JOIN public.org_memberships om ON om.org_id = jp.org_id
    WHERE jp.id = job_applications.job_post_id AND om.user_id = auth.uid()
  )
);

-- Resumes storage bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Authenticated tenants can upload resumes
CREATE POLICY "Tenants can upload resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'tenant'
  )
);

-- Users can read their own uploads (path format: {user_id}/{filename})
CREATE POLICY "Users can read own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
