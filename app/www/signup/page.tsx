import { SignupForm } from '@/components/auth/SignupForm';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { redirect } from 'next/navigation';
import { getAppDashboardUrl } from '@/lib/app-url';

export default async function SignupPage() {
  const user = await getAuthUser();
  if (user) redirect(getAppDashboardUrl());

  return (
    <AuthPanel mode="signup">
      <SignupForm defaultRedirectTo={getAppDashboardUrl()} />
    </AuthPanel>
  );
}
