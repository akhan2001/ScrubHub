'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { 
  workerPersonalSchema, 
  workerCredentialsSchema, 
  workerHousingSchema, 
  workerRentalHistorySchema, 
  workerBackgroundSchema,
  landlordIdentitySchema,
  landlordBusinessSchema,
  landlordPropertySchema,
  landlordListingSchema,
  enterpriseOrgSchema,
  enterpriseAdminSchema,
  enterpriseJobPostSchema
} from '@/lib/validations/onboarding';

export async function saveWorkerStep(step: number, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Validate data based on step
  // Note: In a real app, we'd validate strictly here. 
  // For Beta v1, we'll trust the client validation but ensure type safety where possible.

  let updateData: any = {};

  try {
    switch (step) {
      case 1: // Personal
        const personal = workerPersonalSchema.parse(data);
        // Update profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: `${personal.firstName} ${personal.lastName}`,
            phone_number: personal.phoneNumber,
            date_of_birth: personal.dateOfBirth,
            avatar_url: personal.profilePhotoUrl,
          })
          .eq('id', user.id);
        if (profileError) throw profileError;
        break;

      case 2: // Credentials
        const credentials = workerCredentialsSchema.parse(data);
        updateData = {
          healthcare_role: credentials.healthcareRole,
          license_number: credentials.licenseNumber,
          license_state: credentials.licenseState,
          license_expiry: credentials.licenseExpirationDate,
          license_document_url: credentials.licenseDocumentUrl,
          employment_status: credentials.employmentStatus,
          employer_name: credentials.employerName,
          employer_contact: credentials.employerContact,
        };
        break;

      case 3: // Housing
        const housing = workerHousingSchema.parse(data);
        updateData = {
          move_in_date: housing.moveInDate,
          lease_term_preference: housing.leaseTerm,
          location_preference: housing.locationPreference,
          unit_type_preference: housing.unitType,
          furnished_preference: housing.furnished,
          budget_min: housing.budgetMin,
          budget_max: housing.budgetMax,
          has_pets: housing.hasPets,
          pet_details: housing.petDetails,
          accessibility_needs: housing.accessibilityNeeds,
        };
        break;

      case 4: // Rental History
        const rental = workerRentalHistorySchema.parse(data);
        updateData = {
          current_address: rental.currentAddress,
          current_landlord: rental.currentLandlord,
          previous_address: rental.previousAddress,
          previous_landlord: rental.previousLandlord,
          eviction_history: rental.evictionHistory,
          eviction_details: rental.evictionDetails,
          broken_lease_history: rental.brokenLeaseHistory,
          broken_lease_details: rental.brokenLeaseDetails,
        };
        break;

      case 5: // Background
        const background = workerBackgroundSchema.parse(data);
        updateData = {
          background_check_consent: background.consent,
          id_document_url: background.idDocumentUrl,
          ssn_last_4: background.ssnLast4,
        };
        break;
      
      case 6: // Payment (Mocked - no DB update needed for MVP/Beta unless storing stripe ID)
        // In real app, we'd save stripe customer ID
        break;

      case 7: // Review & Submit
        // Mark verification state as pending if not already
        await supabase.from('profiles').update({ verification_state: 'pending' }).eq('id', user.id);
        break;
    }

    if (Object.keys(updateData).length > 0) {
      // Upsert into worker_profiles
      const { error } = await supabase
        .from('worker_profiles')
        .upsert({ id: user.id, ...updateData });
      
      if (error) throw error;
    }

  } catch (error) {
    console.error('Error saving worker step:', error);
    throw new Error('Failed to save step');
  }

  revalidatePath('/onboarding/worker');
}

export async function completeWorkerOnboarding() {
    // Finalize onboarding
    redirect('/dashboard');
}

export async function saveLandlordStep(step: number, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  let updateData: any = {};

  try {
    switch (step) {
      case 1: // Personal + Identity
        const identity = landlordIdentitySchema.parse(data);
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: `${identity.firstName} ${identity.lastName}`,
            phone_number: identity.phoneNumber,
            date_of_birth: identity.dateOfBirth,
            avatar_url: identity.profilePhotoUrl,
            role: 'landlord', // Set role on start
          })
          .eq('id', user.id);
        if (profileError) throw profileError;
        
        updateData = {
          identity_document_url: identity.idDocumentUrl,
        };
        break;

      case 2: // Business Info
        const business = landlordBusinessSchema.parse(data);
        updateData = {
          entity_type: business.entityType,
          business_name: business.businessName,
          ein_number: business.einNumber,
          business_address: business.businessAddress,
          uses_property_management_software: business.usesPropertyManagementSoftware,
        };
        break;

      case 3: // First Property
        const property = landlordPropertySchema.parse(data);
        
        // Find existing draft
        const { data: drafts } = await supabase
            .from('listings')
            .select('id')
            .eq('user_id', user.id)
            .eq('status', 'draft')
            .limit(1);
            
        const draftId = drafts?.[0]?.id;
        
        const listingData = {
            address: property.address,
            amenities: property.amenities,
            images: property.propertyPhotos,
        };

        if (draftId) {
            await supabase.from('listings').update(listingData).eq('id', draftId);
        } else {
            await supabase.from('listings').insert({
                user_id: user.id,
                title: 'New Property', // Placeholder
                status: 'draft',
                ...listingData
            });
        }
        break;

      case 4: // First Listing Setup
        const listing = landlordListingSchema.parse(data);
        
        // Find existing draft (created in step 3)
        const { data: drafts2 } = await supabase
            .from('listings')
            .select('id')
            .eq('user_id', user.id)
            .eq('status', 'draft')
            .limit(1);
            
        const draftId2 = drafts2?.[0]?.id;
        
        const listingDetails = {
            unit_number: listing.unitNumber,
            title: listing.title,
            bedrooms: listing.bedrooms,
            bathrooms: listing.bathrooms,
            square_footage: listing.squareFootage,
            price_cents: Math.round(listing.monthlyRent * 100),
            deposit_amount_cents: Math.round(listing.securityDeposit * 100),
            available_date: listing.availableDate,
            lease_terms: listing.leaseTerms,
            is_furnished: listing.furnished,
            are_pets_allowed: listing.petsAllowed,
            description: listing.description,
        };

        if (draftId2) {
             await supabase.from('listings').update(listingDetails).eq('id', draftId2);
        } else {
             await supabase.from('listings').insert({
                user_id: user.id,
                status: 'draft',
                address: 'Unknown Address', // Fallback
                ...listingDetails
            });
        }
        break;

      case 5: // Payout (Mocked)
        break;

      case 6: // Review & Submit
         // Mark verification state as pending
         await supabase.from('profiles').update({ verification_state: 'pending' }).eq('id', user.id);
         break;
    }

    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from('landlord_profiles')
        .upsert({ id: user.id, ...updateData });
      
      if (error) throw error;
    }

  } catch (error) {
    console.error('Error saving landlord step:', error);
    throw new Error('Failed to save step');
  }

  revalidatePath('/onboarding/landlord');
}

export async function completeLandlordOnboarding() {
    redirect('/dashboard');
}

export async function saveEnterpriseStep(step: number, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    switch (step) {
      case 1: // Org Setup
        const org = enterpriseOrgSchema.parse(data);
        
        // Update profile role to enterprise
        await supabase.from('profiles').update({ role: 'enterprise' }).eq('id', user.id);
        
        // Find existing org owned by user
        const { data: orgs } = await supabase
            .from('organizations')
            .select('id')
            .eq('owner_user_id', user.id)
            .limit(1);
            
        const orgId = orgs?.[0]?.id;
        
        const orgData = {
            name: org.organizationName,
            type: org.organizationType,
            industry: org.industryFocus,
            size: org.propertiesManaged,
            website: org.website,
            ein_number: org.einNumber,
            billing_address: org.billingAddress
        };

        if (orgId) {
             await supabase.from('organizations').update(orgData).eq('id', orgId);
        } else {
             await supabase.from('organizations').insert({
                owner_user_id: user.id,
                verification_state: 'pending',
                ...orgData
            });
        }
        break;

      case 2: // Admin Profile
        const admin = enterpriseAdminSchema.parse(data);
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: `${admin.firstName} ${admin.lastName}`,
            phone_number: admin.phoneNumber,
            avatar_url: admin.profilePhotoUrl,
            job_title: admin.jobTitle,
          })
          .eq('id', user.id);
        if (profileError) throw profileError;
        break;

      case 3: // Team Setup
        // Mocked for now
        break;

      case 4: // Portfolio
        // Mocked for now
        break;

      case 5: // Job Board
        // Mocked for now
        break;

      case 6: // Billing
        // Mocked for now
        break;

      case 7: // Review
         await supabase.from('profiles').update({ verification_state: 'pending' }).eq('id', user.id);
         break;
    }

  } catch (error) {
    console.error('Error saving enterprise step:', error);
    throw new Error('Failed to save step');
  }

  revalidatePath('/onboarding/enterprise');
}

export async function completeEnterpriseOnboarding() {
    redirect('/dashboard');
}
