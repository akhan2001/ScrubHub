-- Persist a non-sensitive hint after "save payment" (until full Stripe Elements integration).
ALTER TABLE public.worker_profiles
  ADD COLUMN IF NOT EXISTS payment_method_last4 TEXT;
