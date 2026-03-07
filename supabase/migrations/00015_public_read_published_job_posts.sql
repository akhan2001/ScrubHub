-- Allow anyone (including anonymous) to read published job posts for the public staffing page
CREATE POLICY "Anyone can view published job posts"
  ON public.job_posts FOR SELECT
  USING (status = 'published');
