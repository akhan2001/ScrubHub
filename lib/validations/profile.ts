import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
});

export const credentialsSchema = z.object({
  healthcareRole: z.enum(['RN', 'LPN', 'CNA', 'Medical Tech', 'Surgical Tech', 'Allied Health', 'Other']),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseState: z.string().min(2, 'State is required'),
  licenseExpiry: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  employmentStatus: z.enum(['Employed', 'Travel Contract', 'Between Contracts', 'Student']),
  employerName: z.string().min(1, 'Employer name is required'),
  employerContact: z.string().optional(),
});

export const housingSchema = z
  .object({
    moveInDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
    leaseTerm: z.enum(['Short-term', 'Standard', 'Long-term', 'Flexible']),
    locationPreference: z.string().optional(),
    unitType: z.enum(['Studio', '1BR', '2BR', 'Shared', 'Flexible']),
    furnished: z.enum(['Furnished', 'Unfurnished', 'No preference']),
    budgetMin: z.number().min(0, 'Budget must be positive'),
    budgetMax: z.number().min(0, 'Budget must be positive'),
    hasPets: z.boolean(),
    petDetails: z.string().optional(),
  })
  .refine((d) => d.budgetMax >= d.budgetMin, {
    message: 'Maximum budget must be greater than or equal to minimum',
    path: ['budgetMax'],
  });

export const identitySchema = z.object({
  idDocumentUrl: z.string().min(1, 'ID document is required'),
  ssnLast4: z.string().length(4, 'Must be last 4 digits'),
  backgroundCheckConsent: z.boolean().refine((v) => v === true, { message: 'You must consent to the background check' }),
});

export const businessSchema = z.object({
  entityType: z.enum(['Individual', 'LLC', 'Corporation', 'Partnership']),
  businessName: z.string().min(1, 'Business name is required'),
  einNumber: z.string().optional(),
  businessAddress: z.string().optional(),
});

export const landlordIdentitySchema = z.object({
  identityDocumentUrl: z.string().min(1, 'Identity document is required'),
});

export const orgInfoSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  domain: z.string().optional(),
});

export const paymentSchema = z.object({
  cardNumber: z.string().min(1, 'Card number is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  cvc: z.string().min(3, 'CVC is required'),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type CredentialsData = z.infer<typeof credentialsSchema>;
export type HousingData = z.infer<typeof housingSchema>;
export type IdentityData = z.infer<typeof identitySchema>;
export type BusinessData = z.infer<typeof businessSchema>;
export type LandlordIdentityData = z.infer<typeof landlordIdentitySchema>;
export type OrgInfoData = z.infer<typeof orgInfoSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
