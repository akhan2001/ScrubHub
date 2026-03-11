'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { getAppAuthCallbackUrl } from '@/lib/app-url';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ERROR_MESSAGES: Record<string, string> = {
  'User already registered': 'An account with this email already exists.',
};

type SignupFormProps = {
  defaultRedirectTo?: string;
};

export function SignupForm({ defaultRedirectTo = '/dashboard' }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<'confirm' | 'signed_in' | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || undefined } },
    });
    setLoading(false);
    if (err) {
      setError(ERROR_MESSAGES[err.message] ?? err.message);
      return;
    }
    if (data.session) {
      setSuccess('signed_in');
      router.push(defaultRedirectTo);
      router.refresh();
    } else {
      setSuccess('confirm');
      router.refresh();
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const callbackUrl = getAppAuthCallbackUrl();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: defaultRedirectTo !== '/dashboard' ? { redirectTo: defaultRedirectTo } : undefined,
      },
    });
    setLoading(false);
    if (err) {
      setError(ERROR_MESSAGES[err.message] ?? err.message);
      return;
    }
    // Supabase redirects to Google
  }

  if (success === 'confirm') {
    return (
      <Alert variant="default">
        <AlertTitle>Check your inbox</AlertTitle>
        <AlertDescription>
          Check your email to confirm your account. Then{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            sign in
          </Link>
          .
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive" className="space-y-2">
          <AlertTitle>Unable to create account</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          {(error.includes('already exists') || error.includes('already registered')) && (
            <Link href="/login" className="font-medium underline block">
              Sign in instead →
            </Link>
          )}
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your name"
          autoComplete="name"
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          autoComplete="email"
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            className="h-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full h-10">
        {loading ? 'Creating account…' : 'Sign up'}
      </Button>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full h-10"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <FcGoogle className="size-4 mr-2" />
        Continue with Google
      </Button>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in here
        </Link>
      </p>
    </form>
  );
}
