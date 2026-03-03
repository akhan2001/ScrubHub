import { SignupForm } from '@/components/auth/SignupForm';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { redirect } from 'next/navigation';

export default async function SignupPage() {
  const user = await getAuthUser();
  if (user) redirect('/dashboard');

  return (
    <AuthPanel mode="signup">
      <SignupForm />
    </AuthPanel>
  );
}
