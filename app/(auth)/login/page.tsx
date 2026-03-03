import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-6">Sign in to ScrubHub</h1>
      <Suspense fallback={<div className="w-full max-w-sm h-48 animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded" />}>
        <LoginForm />
      </Suspense>
      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-zinc-900 dark:text-zinc-100 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
