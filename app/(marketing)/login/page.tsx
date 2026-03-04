import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { redirect } from 'next/navigation';
import { getAppDashboardUrl } from '@/lib/app-url';

export default async function LoginPage() {
  const user = await getAuthUser();
  if (user) redirect(getAppDashboardUrl());

  return (
    <AuthPanel mode="login">
      <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-md" />}>
        <LoginForm defaultRedirectTo={getAppDashboardUrl()} />
      </Suspense>
    </AuthPanel>
  );
}
