export const APP_NAME = 'ScrubHub';

export type AppRole = 'tenant' | 'landlord' | 'enterprise';
export type VerificationState = 'pending' | 'verified' | 'rejected' | 'suspended';

export const ROLES: AppRole[] = ['tenant', 'landlord', 'enterprise'];
export const VERIFICATION_STATES: VerificationState[] = [
  'pending',
  'verified',
  'rejected',
  'suspended',
];
