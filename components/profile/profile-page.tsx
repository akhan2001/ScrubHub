'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ProfileCard } from './profile-card';
import { ProfileSidebar } from './profile-sidebar';
import { PersonalInfoForm } from './sections/personal-info-form';
import { CredentialsForm } from './sections/credentials-form';
import { HousingForm } from './sections/housing-form';
import { IdentityForm } from './sections/identity-form';
import { PaymentForm } from './sections/payment-form';
import { BusinessForm } from './sections/business-form';
import { LandlordIdentityForm } from './sections/landlord-identity-form';
import { OrgForm } from './sections/org-form';
import type { Profile, WorkerProfile, LandlordProfile, Organization } from '@/types/database';
import type { ProfileSection } from '@/types/profile';

interface ProfilePageProps {
  profile: Profile;
  workerProfile: WorkerProfile | null;
  landlordProfile: LandlordProfile | null;
  organization: Organization | null;
  sections: ProfileSection[];
  completionPercent: number;
}

export function ProfilePage({
  profile,
  workerProfile,
  landlordProfile,
  organization,
  sections,
  completionPercent,
}: ProfilePageProps) {
  const router = useRouter();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleEdit = useCallback(
    (sectionId: string) => {
      if (isDirty) {
        const confirmed = window.confirm('You have unsaved changes. Discard them?');
        if (!confirmed) return;
      }
      setEditingSection(sectionId);
      setIsDirty(true);
    },
    [isDirty],
  );

  const handleCancel = useCallback(() => {
    setEditingSection(null);
    setIsDirty(false);
  }, []);

  const handleSaved = useCallback(() => {
    setEditingSection(null);
    setIsDirty(false);
    router.refresh();
  }, [router]);

  function renderForm(sectionId: string) {
    switch (sectionId) {
      case 'personal':
        return <PersonalInfoForm profile={profile} onSaved={handleSaved} />;
      case 'credentials':
        return <CredentialsForm workerProfile={workerProfile} onSaved={handleSaved} />;
      case 'housing':
        return <HousingForm workerProfile={workerProfile} onSaved={handleSaved} />;
      case 'identity':
        if (profile.role === 'landlord') {
          return <LandlordIdentityForm landlordProfile={landlordProfile} onSaved={handleSaved} />;
        }
        return <IdentityForm workerProfile={workerProfile} onSaved={handleSaved} />;
      case 'payment':
        return (
          <PaymentForm
            workerProfile={workerProfile}
            landlordProfile={landlordProfile}
            onSaved={handleSaved}
          />
        );
      case 'business':
        return <BusinessForm landlordProfile={landlordProfile} onSaved={handleSaved} />;
      case 'organization':
        return <OrgForm organization={organization} onSaved={handleSaved} />;
      default:
        return null;
    }
  }

  const initials = profile.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className="flex flex-col-reverse gap-6 lg:flex-row">
      {/* Left column */}
      <div className="flex-1 space-y-6">
        {/* Avatar section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-20 border-2 border-border">
              <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? 'User'} />
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-1 -right-1 size-7 rounded-full p-0"
              aria-label="Upload photo"
            >
              <Camera className="size-3.5" />
            </Button>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {profile.full_name ?? 'Complete your profile'}
            </h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        {/* Section cards */}
        {sections.map((section) => (
          <ProfileCard
            key={section.id}
            id={section.id}
            label={section.label}
            status={section.status}
            fields={section.fields}
            isEditing={editingSection === section.id}
            onEdit={() => handleEdit(section.id)}
            onCancel={handleCancel}
          >
            {editingSection === section.id && renderForm(section.id)}
          </ProfileCard>
        ))}
      </div>

      {/* Right column (sidebar) */}
      <div className="w-full shrink-0 lg:w-80">
        <div className="lg:sticky lg:top-6">
          <ProfileSidebar
            sections={sections}
            completionPercent={completionPercent}
            role={profile.role}
            profile={profile}
          />
        </div>
      </div>
    </div>
  );
}
