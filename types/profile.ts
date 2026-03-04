import type { Profile, WorkerProfile, LandlordProfile, Organization } from './database';

export type ProfileSectionStatus = 'completed' | 'incomplete';

export interface ProfileSection {
  id: string;
  label: string;
  weight: number;
  status: ProfileSectionStatus;
  fields: { label: string; value: string | null }[];
}

export interface ProfileData {
  profile: Profile;
  workerProfile: WorkerProfile | null;
  landlordProfile: LandlordProfile | null;
  organization: Organization | null;
  sections: ProfileSection[];
  completionPercent: number;
}
