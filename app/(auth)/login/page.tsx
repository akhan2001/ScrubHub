import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const user = await getAuthUser();
  if (user) redirect('/dashboard');

  return (
    <AuthPanel mode="login">
      <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-md" />}>
        <LoginForm />
      </Suspense>
    </AuthPanel>
  );
}
