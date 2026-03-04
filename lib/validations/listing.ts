import { z } from 'zod';

export const AMENITY_OPTIONS = [
  'Parking',
  'In-unit Laundry',
  'Shared Laundry',
  'Pet Friendly',
  'Near Medical Campus',
  'Wheelchair Accessible',
  'Gym / Fitness',
  'Pool',
  'Doorman / Concierge',
  'Balcony / Patio',
  'Storage Unit',
  'EV Charging',
] as const;

export const LEASE_TERM_OPTIONS = [
  'Short-term',
  'Standard',
  'Long-term',
] as const;

export const createListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(180),
  description: z.string().max(4000).optional(),
  address: z.string().min(1, 'Address is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  unitNumber: z.string().optional(),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  squareFootage: z.number().min(0).optional(),
  monthlyRent: z.number().min(0, 'Rent must be positive'),
  depositAmount: z.number().min(0).optional(),
  leaseTerms: z.array(z.string()).min(1, 'Select at least one lease term'),
  isFurnished: z.boolean(),
  arePetsAllowed: z.boolean(),
  amenities: z.array(z.string()),
  images: z.array(z.string()).min(1, 'Upload at least one photo'),
  availableDate: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date'),
  status: z.enum(['draft', 'published']),
});

export type CreateListingData = z.infer<typeof createListingSchema>;
