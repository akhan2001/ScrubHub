import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAppDashboardUrl, getAppUrl } from '@/lib/app-url';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';

  const appUrl = getAppUrl();
  let redirectTarget: string;
  if (redirectTo.startsWith('http')) {
    redirectTarget = redirectTo;
  } else if (appUrl) {
    redirectTarget = `${appUrl}${redirectTo.startsWith('/') ? '' : '/'}${redirectTo}`;
  } else {
    redirectTarget = redirectTo === '/dashboard'
      ? `${request.nextUrl.origin}${getAppDashboardUrl()}`
      : `${request.nextUrl.origin}${redirectTo}`;
  }

  const response = NextResponse.redirect(redirectTarget);

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
      return response;
    }
  }
  return NextResponse.redirect(`${request.nextUrl.origin}/login?error=auth`);
}
