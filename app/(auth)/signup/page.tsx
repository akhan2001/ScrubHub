import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-6">Create a ScrubHub account</h1>
      <SignupForm />
      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-zinc-900 dark:text-zinc-100 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
