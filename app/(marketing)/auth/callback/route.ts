import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAppDashboardUrl, getAppUrl } from '@/lib/app-url';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';
  const origin = request.nextUrl.origin;

  const appUrl = getAppUrl();

  function buildRedirect(path: string): string {
    if (path.startsWith('http')) return path;
    if (appUrl) return `${appUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
  }

  const response = NextResponse.redirect(buildRedirect('/dashboard'));

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ verification_state: 'verified' }).eq('id', user.id);
      }
      response.headers.set('Location', buildRedirect('/auth/confirm-success'));
      return response;
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
