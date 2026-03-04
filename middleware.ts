import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAppHost(request: NextRequest): boolean {
  const host = request.headers.get('host') ?? '';
  const hostParam = request.nextUrl.searchParams.get('host');
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
  let APP_URL = process.env.NEXT_PUBLIC_APP_URL;

  if (!APP_URL) {
    const url = new URL(request.url);
    APP_URL = `${url.protocol}//${url.host}`;
  }

  const pathname = request.nextUrl.pathname;
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
  const isOnboardingPath = pathname.startsWith('/onboarding');
  const isListingsPath = pathname.startsWith('/listings');

  if (isApp) {
    // Redirect root to dashboard
    if (pathname === '/') {
      return withSupabaseCookies(response, NextResponse.redirect(new URL('/dashboard', request.url)));
    }

    // If user is already logged in and tries to access auth pages, redirect to dashboard
    if (isAuthPath && user && (pathname === '/login' || pathname === '/signup')) {
      return withSupabaseCookies(response, NextResponse.redirect(new URL('/dashboard', request.url)));
    }

    // Protect dashboard and onboarding routes
    if ((isDashboardPath || isOnboardingPath) && !user) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', `${APP_URL}${pathname}`);
        return withSupabaseCookies(response, NextResponse.redirect(loginUrl));
    }

    // Allow all other routes to resolve naturally
    return response;
  }

  if (isWww) {
    // Redirect app-specific paths to App domain
    if (isDashboardPath || isListingsPath) {
      const target = new URL(APP_URL);
      target.pathname = pathname;
      target.search = request.nextUrl.search;
      
      // Fallback for local dev without subdomain support
      if (!process.env.NEXT_PUBLIC_APP_URL) {
        target.searchParams.set('host', 'app');
      }
      
      return withSupabaseCookies(response, NextResponse.redirect(target));
    }

    // Allow all other routes to resolve naturally
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
