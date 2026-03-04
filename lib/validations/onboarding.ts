import { z } from 'zod';

// --- Shared Schemas ---

export const phoneSchema = z.string().min(10, "Phone number must be at least 10 digits");
export const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date");

// --- Worker Onboarding Schemas ---

export const workerPersonalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: phoneSchema,
  dateOfBirth: dateSchema,
  profilePhotoUrl: z.string().optional(),
});

export const workerCredentialsSchema = z.object({
  healthcareRole: z.enum(['RN', 'LPN', 'CNA', 'Medical Tech', 'Surgical Tech', 'Allied Health', 'Other']),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseState: z.string().min(2, "State is required"),
  licenseExpirationDate: dateSchema,
  licenseDocumentUrl: z.string().min(1, "License document is required"),
  employmentStatus: z.enum(['Employed', 'Travel Contract', 'Between Contracts', 'Student']),
  employerName: z.string().min(1, "Employer name is required"),
  employerContact: z.string().min(1, "Employer contact is required"),
});

export const workerHousingSchema = z.object({
  moveInDate: dateSchema,
  leaseTerm: z.enum(['Short-term', 'Standard', 'Long-term', 'Flexible']),
  locationPreference: z.string().optional(),
  unitType: z.enum(['Studio', '1BR', '2BR', 'Shared', 'Flexible']),
  furnished: z.enum(['Furnished', 'Unfurnished', 'No preference']),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  hasPets: z.boolean(),
  petDetails: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
});

export const workerRentalHistorySchema = z.object({
  currentAddress: z.string().min(1, "Current address is required"),
  currentLandlord: z.string().optional(),
  previousAddress: z.string().optional(),
  previousLandlord: z.string().optional(),
  evictionHistory: z.boolean(),
  evictionDetails: z.string().optional(),
  brokenLeaseHistory: z.boolean(),
  brokenLeaseDetails: z.string().optional(),
});

export const workerBackgroundSchema = z.object({
  consent: z.literal(true, { errorMap: () => ({ message: "You must consent to the background check" }) }),
  idDocumentUrl: z.string().min(1, "ID document is required"),
  ssnLast4: z.string().length(4, "Must be last 4 digits"),
});

// --- Landlord Onboarding Schemas ---

export const landlordIdentitySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: phoneSchema,
  dateOfBirth: dateSchema,
  idDocumentUrl: z.string().min(1, "ID document is required"),
  profilePhotoUrl: z.string().optional(),
});

export const landlordBusinessSchema = z.object({
  entityType: z.enum(['Individual', 'LLC', 'Corporation', 'Partnership']),
  businessName: z.string().optional(),
  einNumber: z.string().optional(),
  businessAddress: z.string().optional(),
  usesPropertyManagementSoftware: z.boolean(),
});

export const landlordPropertySchema = z.object({
  address: z.string().min(1, "Address is required"),
  propertyType: z.enum(['Single family', 'Duplex', 'Apartment building', 'Condo', 'Townhouse']),
  numberOfUnits: z.number().min(1),
  yearBuilt: z.number().optional(),
  propertyPhotos: z.array(z.string()).min(1, "At least one photo is required"),
  amenities: z.array(z.string()),
});

export const landlordListingSchema = z.object({
  unitNumber: z.string().min(1, "Unit number is required"),
  title: z.string().min(1, "Title is required"),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  squareFootage: z.number().optional(),
  monthlyRent: z.number().min(0),
  securityDeposit: z.number().min(0),
  availableDate: dateSchema,
  leaseTerms: z.array(z.string()).min(1, "Select at least one lease term"),
  furnished: z.boolean(),
  petsAllowed: z.boolean(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  unitPhotos: z.array(z.string()).min(1, "At least one photo is required"),
});

// --- Enterprise Onboarding Schemas ---

export const enterpriseOrgSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  organizationType: z.enum(['Hospital System', 'Staffing Agency', 'Property Management Firm', 'Other']),
  industryFocus: z.enum(['Healthcare', 'Mixed', 'Other']),
  propertiesManaged: z.enum(['1-10', '11-50', '51-200', '200+']),
  website: z.string().url().optional().or(z.literal('')),
  einNumber: z.string().min(1, "EIN is required"),
  billingAddress: z.string().min(1, "Billing address is required"),
});

export const enterpriseAdminSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  phoneNumber: phoneSchema,
  profilePhotoUrl: z.string().optional(),
});

// Step 3 (Team) and 4 (Portfolio) are arrays/complex, handled separately or via sub-forms

export const enterpriseJobPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  facilityName: z.string().min(1, "Facility name is required"),
  location: z.string().min(1, "Location is required"),
  roleType: z.enum(['RN', 'LPN', 'CNA', 'Tech', 'Allied Health', 'Other']),
  contractType: z.enum(['Full-time', 'Part-time', 'Travel Contract', 'Per Diem']),
  contractLength: z.string().optional(),
  payRange: z.string().optional(),
  startDate: dateSchema,
  description: z.string().min(10),
  housingIncluded: z.boolean(),
});
