-- Payout / debit card last-4 hint for landlords (until Stripe Connect is integrated).
ALTER TABLE public.landlord_profiles
  ADD COLUMN IF NOT EXISTS payout_method_last4 TEXT;
