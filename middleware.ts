import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAppHost(request: NextRequest): boolean {
  const host = request.headers.get('host') ?? '';
  const hostParam = request.nextUrl.searchParams.get('host');
  if (hostParam === 'www') return false;
  if (host.startsWith('app.')) return true;
  if (hostParam === 'app') return true;
  return false;
}

function withSupabaseCookies(base: NextResponse, target: NextResponse): NextResponse {
  base.cookies.getAll().forEach(({ name, value }) => {
    target.cookies.set(name, value);
  });
  return target;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const code = request.nextUrl.searchParams.get('code');

  // Supabase OAuth sometimes redirects to Site URL (root) instead of /auth/callback.
  // Redirect root with ?code= to /auth/callback so the session can be exchanged.
  if (pathname === '/' && code) {
    const callbackUrl = new URL('/auth/callback', request.url);
    request.nextUrl.searchParams.forEach((v, k) => callbackUrl.searchParams.set(k, v));
    return NextResponse.redirect(callbackUrl);
  }

  let APP_URL = process.env.NEXT_PUBLIC_APP_URL;

  if (!APP_URL) {
    const url = new URL(request.url);
    APP_URL = `${url.protocol}//${url.host}`;
  }

  const isApp = isAppHost(request);
  const isWww = !isApp;

  const response = NextResponse.next({ request });
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
            response.cookies.set(name, value, options ?? {})
          );
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPath =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname === '/auth/reset-password' ||
    pathname === '/auth/callback';

  const isDashboardPath = pathname.startsWith('/dashboard');

  if (isApp) {
    // Redirect root to dashboard
    if (pathname === '/') {
      return withSupabaseCookies(response, NextResponse.redirect(new URL('/dashboard', request.url)));
    }

    // If user is already logged in and tries to access auth pages, redirect to dashboard
    if (isAuthPath && user && (pathname === '/login' || pathname === '/signup')) {
      return withSupabaseCookies(response, NextResponse.redirect(new URL('/dashboard', request.url)));
    }

    // Protect dashboard routes
    if (isDashboardPath && !user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', `${APP_URL}${pathname}`);
      return withSupabaseCookies(response, NextResponse.redirect(loginUrl));
    }

    // Allow all other routes to resolve naturally
    return response;
  }

  if (isWww) {
    // Everything lives on www now — listings, applications, AND the
    // tracking dashboard. The only thing the middleware enforces here is
    // that protected /dashboard routes require a signed-in user.
    if (isDashboardPath && !user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return withSupabaseCookies(response, NextResponse.redirect(loginUrl));
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
