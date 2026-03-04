import { getSessionUser } from '@/server/auth/get-session-user';
import {
  getFullProfileData,
  computeTenantSections,
  computeLandlordSections,
  computeEnterpriseSections,
} from '@/server/services/profiles.service';
import { DashboardSection } from '@/components/dashboard/dashboard-section';
import { ProfilePage } from '@/components/profile/profile-page';

export default async function ProfileRoute() {
  const session = await getSessionUser();
  const { profile, workerProfile, landlordProfile, organization } =
    await getFullProfileData(session.id);

  let sections;
  let completionPercent;

  switch (profile.role) {
    case 'tenant': {
      const result = computeTenantSections(profile, workerProfile);
      sections = result.sections;
      completionPercent = result.completionPercent;
      break;
    }
    case 'landlord': {
      const result = computeLandlordSections(profile, landlordProfile);
      sections = result.sections;
      completionPercent = result.completionPercent;
      break;
    }
    case 'enterprise': {
      const result = computeEnterpriseSections(profile, organization);
      sections = result.sections;
      completionPercent = result.completionPercent;
      break;
    }
  }

  const breadcrumb = [
    { label: 'Dashboard', href: `/dashboard/${profile.role}` },
    { label: 'Profile' },
  ];

  return (
    <DashboardSection
      breadcrumb={breadcrumb}
      title="Profile"
      description="Manage your account details and verification."
    >
      <ProfilePage
        profile={profile}
        workerProfile={workerProfile}
        landlordProfile={landlordProfile}
        organization={organization}
        sections={sections}
        completionPercent={completionPercent}
      />
    </DashboardSection>
  );
}
