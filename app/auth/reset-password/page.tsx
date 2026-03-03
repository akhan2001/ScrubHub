import Link from 'next/link';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <h1 className="text-2xl font-semibold mb-2 text-foreground">Set new password</h1>
      <p className="text-muted-foreground text-sm mb-6 text-center max-w-sm">
        Enter your new password below.
      </p>
      <ResetPasswordForm />
      <p className="mt-4 text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:underline">
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
