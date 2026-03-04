'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  personalInfoSchema,
  credentialsSchema,
  housingSchema,
  identitySchema,
  businessSchema,
  landlordIdentitySchema,
  orgInfoSchema,
} from '@/lib/validations/profile';
import {
  updateProfile,
  upsertWorkerProfile,
  upsertLandlordProfile,
  updateOrganization,
  fetchOrganizationByOwner,
} from '@/server/repositories/profiles.repository';

async function getAuthUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return user.id;
}

export async function savePersonalInfo(data: unknown) {
  const userId = await getAuthUserId();
  const parsed = personalInfoSchema.parse(data);

  await updateProfile(userId, {
    full_name: parsed.fullName,
    phone_number: parsed.phoneNumber,
    date_of_birth: parsed.dateOfBirth,
  });

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function saveCredentials(data: unknown) {
  const userId = await getAuthUserId();
  const parsed = credentialsSchema.parse(data);

  await upsertWorkerProfile(userId, {
    healthcare_role: parsed.healthcareRole,
    license_number: parsed.licenseNumber,
    license_state: parsed.licenseState,
    license_expiry: parsed.licenseExpiry,
    employment_status: parsed.employmentStatus,
    employer_name: parsed.employerName,
    employer_contact: parsed.employerContact ?? null,
  });

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function saveHousingPreferences(data: unknown) {
  const userId = await getAuthUserId();
  const parsed = housingSchema.parse(data);

  await upsertWorkerProfile(userId, {
    move_in_date: parsed.moveInDate,
    lease_term_preference: parsed.leaseTerm,
    location_preference: parsed.locationPreference ?? null,
    unit_type_preference: parsed.unitType,
    furnished_preference: parsed.furnished,
    budget_min: parsed.budgetMin,
    budget_max: parsed.budgetMax,
    has_pets: parsed.hasPets,
    pet_details: parsed.petDetails ?? null,
  });

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function saveIdentityVerification(data: unknown) {
  const userId = await getAuthUserId();
  const parsed = identitySchema.parse(data);

  await upsertWorkerProfile(userId, {
    id_document_url: parsed.idDocumentUrl,
    ssn_last_4: parsed.ssnLast4,
    background_check_consent: Boolean(parsed.backgroundCheckConsent),
  });

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function saveBusinessDetails(data: unknown) {
  const userId = await getAuthUserId();
  const parsed = businessSchema.parse(data);

  await upsertLandlordProfile(userId, {
    entity_type: parsed.entityType,
    business_name: parsed.businessName,
    ein_number: parsed.einNumber ?? null,
    business_address: parsed.businessAddress ?? null,
  });

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function saveLandlordIdentity(data: unknown) {
  const userId = await getAuthUserId();
  const parsed = landlordIdentitySchema.parse(data);

  await upsertLandlordProfile(userId, {
    identity_document_url: parsed.identityDocumentUrl,
  });

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function saveOrgInfo(data: unknown) {
  const userId = await getAuthUserId();
  const parsed = orgInfoSchema.parse(data);

  const org = await fetchOrganizationByOwner(userId);
  if (!org) throw new Error('Organization not found');

  await updateOrganization(org.id, {
    name: parsed.name,
    domain: parsed.domain ?? null,
  });

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function savePaymentMethod(_data: unknown) {
  // Mocked — in production this would create/update a Stripe payment method
  await getAuthUserId();
  revalidatePath('/dashboard/profile');
  return { success: true };
}
