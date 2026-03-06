import { z } from 'zod';

export const roleSchema = z.enum(['tenant', 'landlord', 'enterprise']);
export const verificationStateSchema = z.enum(['pending', 'verified', 'rejected', 'suspended']);

export const createBookingSchema = z.object({
  listingId: z.string().uuid(),
  notes: z.string().max(1000).optional(),
  moveInDateRequested: z.string().optional(),
  messageToLandlord: z.string().max(1000).optional(),
});

export const updateBookingStatusSchema = z.object({
  bookingId: z.string().uuid(),
  status: z.enum(['approved', 'rejected', 'cancelled', 'completed', 'reviewing', 'withdrawn']),
});

export const screeningRulesSchema = z.object({
  minimumScore: z.coerce.number().int().min(0).max(100),
  notes: z.string().max(1000).optional(),
  autoApprove: z.boolean(),
  listingId: z.string().uuid().optional(),
  requireBackgroundCheck: z.boolean().optional(),
  requireEmploymentVerification: z.boolean().optional(),
  requireLicenseVerification: z.boolean().optional(),
  maxIncomeToRentRatio: z.coerce.number().min(0).optional(),
  instantBookEnabled: z.boolean().optional(),
});

export const organizationSchema = z.object({
  name: z.string().min(2).max(120),
  domain: z.string().max(180).optional(),
});

export const jobPostSchema = z.object({
  orgId: z.string().uuid(),
  title: z.string().min(3).max(180),
  description: z.string().min(3, 'Description must be at least 3 characters').max(5000),
  status: z.enum(['draft', 'published', 'closed', 'filled']).default('draft'),
  facilityName: z.string().max(200).optional(),
  location: z.string().max(500).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  roleType: z.string().max(100).optional(),
  contractType: z.string().max(100).optional(),
  contractLength: z.string().max(100).optional(),
  payRangeMin: z.coerce.number().int().min(0).optional(),
  payRangeMax: z.coerce.number().int().min(0).optional(),
  startDate: z.string().optional(),
  housingIncluded: z.boolean().optional(),
  linkedListingId: z.string().uuid().optional(),
});

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  amountCents: z.coerce.number().int().positive(),
});
