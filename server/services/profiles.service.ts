import {
  fetchProfileById,
  fetchWorkerProfile,
  fetchLandlordProfile,
  fetchOrganizationByOwner,
  updateProfileRole as updateProfileRoleRepo,
  updateProfileVerificationState as updateProfileVerificationStateRepo,
  fetchUserOnboardingStatus as fetchUserOnboardingStatusRepo,
  markRoleSelected as markRoleSelectedRepo,
} from '@/server/repositories/profiles.repository';
import type { AppRole, Profile, WorkerProfile, LandlordProfile, Organization, VerificationState } from '@/types/database';

export async function getProfile(userId: string) {
  return fetchProfileById(userId);
}

export async function updateProfileRole(userId: string, role: AppRole): Promise<void> {
  await updateProfileRoleRepo(userId, role);
}

export async function confirmRoleSelection(userId: string, role: AppRole): Promise<void> {
  await updateProfileRoleRepo(userId, role);
  await markRoleSelectedRepo(userId);
}

const TRANSITIONS: Record<VerificationState, VerificationState[]> = {
  pending: ['verified', 'rejected', 'suspended'],
  verified: ['suspended'],
  rejected: ['pending', 'verified'],
  suspended: ['pending', 'verified'],
};

export function canTransitionVerificationState(
  from: VerificationState,
  to: VerificationState
): boolean {
  return TRANSITIONS[from].includes(to);
}

export async function updateProfileVerificationState(
  userId: string,
  nextState: VerificationState,
  notes?: string
): Promise<void> {
  const profile = await fetchProfileById(userId);
  if (!profile) {
    throw new Error('Profile not found');
  }

  if (!canTransitionVerificationState(profile.verification_state, nextState)) {
    throw new Error(
      `Invalid verification transition: ${profile.verification_state} -> ${nextState}`
    );
  }

  await updateProfileVerificationStateRepo(userId, nextState, notes);
}

export function isVerifiedForRole(profile: Pick<Profile, 'role' | 'verification_state'>): boolean {
  if (profile.role === 'tenant') {
    return profile.verification_state === 'verified';
  }
  if (profile.role === 'landlord') {
    return profile.verification_state === 'verified';
  }
  return profile.verification_state === 'verified';
}

export async function getUserOnboardingStatus(userId: string) {
  return fetchUserOnboardingStatusRepo(userId);
}

export async function getFullProfileData(userId: string): Promise<{
  profile: Profile;
  workerProfile: WorkerProfile | null;
  landlordProfile: LandlordProfile | null;
  organization: Organization | null;
}> {
  const profile = await fetchProfileById(userId);
  if (!profile) throw new Error('Profile not found');

  let workerProfile: WorkerProfile | null = null;
  let landlordProfile: LandlordProfile | null = null;
  let organization: Organization | null = null;

  switch (profile.role) {
    case 'tenant':
      workerProfile = await fetchWorkerProfile(userId);
      break;
    case 'landlord':
      landlordProfile = await fetchLandlordProfile(userId);
      break;
    case 'enterprise':
      organization = await fetchOrganizationByOwner(userId);
      break;
  }

  return { profile, workerProfile, landlordProfile, organization };
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function computeTenantSections(profile: Profile, wp: WorkerProfile | null) {
  const personalComplete = !!(profile.full_name && profile.phone_number && profile.date_of_birth);
  const credentialsComplete = !!(wp?.healthcare_role && wp?.license_number && wp?.license_state);
  const housingComplete = !!(wp?.move_in_date && wp?.budget_min != null && wp?.budget_max != null);
  const identityComplete = !!(wp?.id_document_url && wp?.background_check_consent);
  const paymentComplete = false;

  const statuses: boolean[] = [personalComplete, credentialsComplete, housingComplete, identityComplete, paymentComplete];

  function getStatus(index: number): 'completed' | 'incomplete' {
    return statuses[index] ? 'completed' : 'incomplete';
  }

  const sections = [
    {
      id: 'personal',
      label: 'Personal Info',
      weight: 20,
      status: getStatus(0),
      fields: [
        { label: 'Full Name', value: profile.full_name },
        { label: 'Phone', value: profile.phone_number },
        { label: 'Date of Birth', value: formatDate(profile.date_of_birth) },
      ],
    },
    {
      id: 'credentials',
      label: 'Professional Credentials',
      weight: 25,
      status: getStatus(1),
      fields: [
        { label: 'Healthcare Role', value: wp?.healthcare_role ?? null },
        { label: 'License Number', value: wp?.license_number ?? null },
        { label: 'License State', value: wp?.license_state ?? null },
        { label: 'License Expiry', value: formatDate(wp?.license_expiry ?? null) },
        { label: 'Employment Status', value: wp?.employment_status ?? null },
        { label: 'Employer', value: wp?.employer_name ?? null },
      ],
    },
    {
      id: 'housing',
      label: 'Housing Preferences',
      weight: 20,
      status: getStatus(2),
      fields: [
        { label: 'Move-in Date', value: formatDate(wp?.move_in_date ?? null) },
        { label: 'Budget', value: wp?.budget_min != null && wp?.budget_max != null ? `$${wp.budget_min} – $${wp.budget_max}` : null },
        { label: 'Location', value: wp?.location_preference ?? null },
        { label: 'Unit Type', value: wp?.unit_type_preference ?? null },
        { label: 'Lease Term', value: wp?.lease_term_preference ?? null },
        { label: 'Furnished', value: wp?.furnished_preference ?? null },
      ],
    },
    {
      id: 'identity',
      label: 'Identity Verification',
      weight: 25,
      status: getStatus(3),
      fields: [
        { label: 'Government ID', value: wp?.id_document_url ? 'Uploaded' : null },
        { label: 'SSN (last 4)', value: wp?.ssn_last_4 ? `••••${wp.ssn_last_4}` : null },
        { label: 'Background Check', value: wp?.background_check_consent ? 'Consented' : null },
      ],
    },
    {
      id: 'payment',
      label: 'Payment Method',
      weight: 10,
      status: getStatus(4),
      fields: [
        { label: 'Payment Method', value: null },
      ],
    },
  ];

  const completedWeight = sections.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.weight, 0);

  return { sections, completionPercent: completedWeight };
}

export function computeLandlordSections(profile: Profile, lp: LandlordProfile | null) {
  const personalComplete = !!(profile.full_name && profile.phone_number && profile.date_of_birth);
  const businessComplete = !!(lp?.entity_type && lp?.business_name);
  const identityComplete = !!(lp?.identity_document_url);
  const payoutComplete = true; // Mocked for now — no real charges

  const statuses: boolean[] = [personalComplete, businessComplete, identityComplete, payoutComplete];

  function getStatus(index: number): 'completed' | 'incomplete' {
    return statuses[index] ? 'completed' : 'incomplete';
  }

  const sections = [
    {
      id: 'personal',
      label: 'Personal Info',
      weight: 25,
      status: getStatus(0),
      fields: [
        { label: 'Full Name', value: profile.full_name },
        { label: 'Phone', value: profile.phone_number },
        { label: 'Date of Birth', value: formatDate(profile.date_of_birth) },
      ],
    },
    {
      id: 'business',
      label: 'Business Details',
      weight: 30,
      status: getStatus(1),
      fields: [
        { label: 'Entity Type', value: lp?.entity_type ?? null },
        { label: 'Business Name', value: lp?.business_name ?? null },
        { label: 'EIN', value: lp?.ein_number ?? null },
        { label: 'Business Address', value: lp?.business_address ?? null },
      ],
    },
    {
      id: 'identity',
      label: 'Identity Verification',
      weight: 30,
      status: getStatus(2),
      fields: [
        { label: 'Identity Document', value: lp?.identity_document_url ? 'Uploaded' : null },
      ],
    },
    {
      id: 'payment',
      label: 'Payout Method',
      weight: 15,
      status: getStatus(3),
      fields: [
        { label: 'Payout Method', value: '•••• 4242 (Verified)' },
      ],
    },
  ];

  const completedWeight = sections.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.weight, 0);

  return { sections, completionPercent: completedWeight };
}

export function computeEnterpriseSections(profile: Profile, org: Organization | null) {
  const adminComplete = !!(profile.full_name && profile.phone_number);
  const orgComplete = !!(org?.name);
  const billingComplete = false;

  const statuses: boolean[] = [adminComplete, orgComplete, billingComplete];

  function getStatus(index: number): 'completed' | 'incomplete' {
    return statuses[index] ? 'completed' : 'incomplete';
  }

  const sections = [
    {
      id: 'personal',
      label: 'Admin Profile',
      weight: 35,
      status: getStatus(0),
      fields: [
        { label: 'Full Name', value: profile.full_name },
        { label: 'Phone', value: profile.phone_number },
        { label: 'Email', value: profile.email },
      ],
    },
    {
      id: 'organization',
      label: 'Organization Info',
      weight: 40,
      status: getStatus(1),
      fields: [
        { label: 'Organization', value: org?.name ?? null },
        { label: 'Domain', value: org?.domain ?? null },
        { label: 'Status', value: org?.verification_state ?? null },
      ],
    },
    {
      id: 'payment',
      label: 'Billing',
      weight: 25,
      status: getStatus(2),
      fields: [
        { label: 'Billing Method', value: null },
      ],
    },
  ];

  const completedWeight = sections.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.weight, 0);

  return { sections, completionPercent: completedWeight };
}
