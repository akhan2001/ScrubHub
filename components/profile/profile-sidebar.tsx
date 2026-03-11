'use client';

import { CheckCircle2, X, ShieldCheck, CalendarDays, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DonutChart } from './donut-chart';
import type { ProfileSection } from '@/types/profile';
import type { AppRole, Profile } from '@/types/database';

const NUDGE_COPY: Record<AppRole, string> = {
  tenant: 'Complete your profile to apply for housing',
  landlord: 'Complete verification to publish listings',
  enterprise: 'Add billing to unlock all features',
};

interface ProfileSidebarProps {
  sections: ProfileSection[];
  completionPercent: number;
  role: AppRole;
  profile: Profile;
}

export function ProfileSidebar({
  sections,
  completionPercent,
  role,
  profile,
}: ProfileSidebarProps) {
  const isComplete = completionPercent >= 100;
  const isVerified = profile.verification_state === 'verified';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            {isComplete ? 'Profile complete' : 'Complete your profile'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex justify-center py-2">
            <DonutChart percent={completionPercent} />
          </div>

          {isComplete && isVerified ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0fdf4] px-3 py-1.5 text-sm font-medium text-[#16a34a]">
                  <ShieldCheck className="size-4" />
                  Verified
                </span>
              </div>
              <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                <InfoRow label="Account status" value="Active" />
                <InfoRow label="Role" value={role.charAt(0).toUpperCase() + role.slice(1)} />
                <InfoRow
                  label="Member since"
                  value={new Date(profile.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    {section.status === 'completed' ? (
                      <CheckCircle2 className="size-4 text-[#16a34a]" />
                    ) : (
                      <X className="size-4 text-[#94a3b8]" />
                    )}
                    <span
                      className={
                        section.status === 'completed'
                          ? 'text-slate-700'
                          : 'text-slate-500'
                      }
                    >
                      {section.label}
                    </span>
                  </div>
                  {section.status === 'completed' ? (
                    <span className="text-xs font-medium text-[#94a3b8]">
                      {section.weight}%
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[#16a34a]">
                      +{section.weight}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isComplete && (
            <p className="text-center text-sm text-muted-foreground">
              {NUDGE_COPY[role]}
            </p>
          )}
        </CardContent>
      </Card>

      <Link
        href="/onboarding?change=1"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <RefreshCw className="size-4" />
        Change role?
      </Link>

      {isComplete && isVerified && (
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <CalendarDays className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-slate-900">
                {profile.full_name ?? 'User'}
              </p>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
