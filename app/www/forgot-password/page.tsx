import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { redirect } from 'next/navigation';
import { getAppDashboardUrl } from '@/lib/app-url';

export default async function ForgotPasswordPage() {
  const user = await getAuthUser();
  if (user) redirect(getAppDashboardUrl());

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <h1 className="text-2xl font-semibold mb-2 text-foreground">Reset password</h1>
      <p className="text-muted-foreground text-sm mb-6 text-center max-w-sm">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>
      <ForgotPasswordForm />
      <p className="mt-4 text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:underline">
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
