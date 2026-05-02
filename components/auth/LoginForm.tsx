'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { getAppAuthCallbackUrl } from '@/lib/app-url';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ERROR_MESSAGES: Record<string, string> = {
  auth: 'Authentication failed. Please try again.',
  'Invalid login credentials': 'Invalid email or password. Please try again.',
};

type LoginFormProps = {
  defaultRedirectTo?: string;
};

export function LoginForm({ defaultRedirectTo = '/dashboard' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? defaultRedirectTo;
  const queryError = useMemo(() => {
    const err = searchParams.get('error');
    if (!err) return null;
    return ERROR_MESSAGES[err] ?? 'Something went wrong. Please try again.';
  }, [searchParams]);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled || !session) return;
      if (!searchParams.get('error')) return;
      router.replace(redirectTo);
      router.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [redirectTo, router, searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(ERROR_MESSAGES[err.message] ?? err.message);
      return;
    }
    router.push(redirectTo);
    router.refresh();
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
        queryParams: redirectTo !== '/dashboard' ? { redirectTo } : undefined,
      },
    });
    setLoading(false);
    if (err) {
      setError(ERROR_MESSAGES[err.message] ?? err.message);
      return;
    }
    // Supabase redirects to Google
  }

  const fieldLabel =
    'font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#6B7585]';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(error || queryError) && (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50 text-red-900 [&_svg]:text-red-700"
        >
          <AlertTitle>Unable to sign in</AlertTitle>
          <AlertDescription>{error ?? queryError}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className={fieldLabel}>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@hospital.org"
          autoComplete="email"
          className="h-11 rounded-xl border-[#E5DFD2] bg-[#F7F4EE]/50 text-[15px] text-[#0E1A2B] placeholder:text-[#6B7585]/80 focus-visible:border-primary/40 focus-visible:ring-primary/25"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="password" className={fieldLabel}>
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#6B7585] transition-colors hover:text-primary"
          >
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            autoComplete="current-password"
            className="h-11 rounded-xl border-[#E5DFD2] bg-[#F7F4EE]/50 pr-10 text-[15px] text-[#0E1A2B] placeholder:text-[#6B7585]/80 focus-visible:border-primary/40 focus-visible:ring-primary/25"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7585] hover:text-[#0E1A2B]"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#3A4759]">
          <Checkbox
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            className="border-[#E5DFD2] data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          />
          Remember me
        </label>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl text-[15px] font-semibold shadow-[0_6px_18px_rgba(22,99,212,0.28)]"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#E5DFD2]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#6B7585]">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-12 w-full rounded-xl border-[#E5DFD2] bg-white text-[15px] font-semibold text-[#0E1A2B] hover:bg-[#F7F4EE]"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <FcGoogle className="mr-2 size-4" />
        Google
      </Button>
    </form>
  );
}
