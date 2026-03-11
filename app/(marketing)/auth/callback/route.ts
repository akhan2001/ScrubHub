import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAppUrl } from '@/lib/app-url';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectToParam = searchParams.get('redirectTo');
  const redirectTo =
    redirectToParam && redirectToParam.startsWith('/') ? redirectToParam : '/dashboard';
  const origin = request.nextUrl.origin;
  const isLocalhost =
    request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1';
  const appUrl = isLocalhost ? '' : getAppUrl();

  function buildRedirect(path: string): string {
    if (path.startsWith('http')) return path;
    if (appUrl) return `${appUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
  }

  const successRedirect = buildRedirect(redirectTo);
  const response = NextResponse.redirect(successRedirect);

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
      response.headers.set('Location', successRedirect);
      return response;
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
