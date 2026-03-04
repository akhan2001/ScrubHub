import { z } from 'zod';

export const roleSchema = z.enum(['tenant', 'landlord', 'enterprise']);
export const verificationStateSchema = z.enum(['pending', 'verified', 'rejected', 'suspended']);

export const createBookingSchema = z.object({
  listingId: z.string().uuid(),
  notes: z.string().max(1000).optional(),
});

export const updateBookingStatusSchema = z.object({
  bookingId: z.string().uuid(),
  status: z.enum(['approved', 'rejected', 'cancelled', 'completed']),
});

export const screeningRulesSchema = z.object({
  minimumScore: z.coerce.number().int().min(0).max(100),
  notes: z.string().max(1000).optional(),
  autoApprove: z.boolean(),
});

export const organizationSchema = z.object({
  name: z.string().min(2).max(120),
  domain: z.string().max(180).optional(),
});

export const jobPostSchema = z.object({
  orgId: z.string().uuid(),
  title: z.string().min(3).max(180),
  description: z.string().min(10).max(5000),
  status: z.enum(['draft', 'published', 'closed']).default('draft'),
});

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  amountCents: z.coerce.number().int().positive(),
});
