import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { redirect } from 'next/navigation';
import { getAppDashboardUrl } from '@/lib/app-url';

export const metadata: Metadata = {
  title: 'Sign in',
  description:
    'Sign in to ScrubHub to manage furnished stays, listings, and healthcare staffing along Ontario’s 401 Corridor.',
};

export default async function LoginPage() {
  const user = await getAuthUser();
  if (user) redirect(getAppDashboardUrl());

  return (
    <AuthPanel mode="login">
      <Suspense
        fallback={
          <div className="h-64 animate-pulse rounded-[28px] border border-[#E5DFD2] bg-[#F7F4EE]/80" />
        }
      >
        <LoginForm defaultRedirectTo={getAppDashboardUrl()} />
      </Suspense>
    </AuthPanel>
  );
}
