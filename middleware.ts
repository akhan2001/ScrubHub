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

function isWwwHost(request: NextRequest): boolean {
  const host = request.headers.get('host') ?? '';
  const hostParam = request.nextUrl.searchParams.get('host');
  if (host.startsWith('www.') || (host !== 'localhost' && !host.startsWith('localhost:'))) {
    if (host.startsWith('app.')) return false;
    return true;
  }
  return hostParam !== 'app';
}

function getRewritePath(pathname: string, prefix: string): string {
  if (pathname === '/' || pathname === '') return prefix;
  return `${prefix}${pathname}`;
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
  const isWww = isWwwHost(request);

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
  const isAppContentPath =
    pathname === '/' || pathname.startsWith('/dashboard') || pathname.startsWith('/listings');

  if (isApp) {
    if (isAuthPath) {
      if (user && (pathname === '/login' || pathname === '/signup')) {
        const target = new URL('/dashboard', request.url);
        return withSupabaseCookies(response, NextResponse.redirect(target));
      }
      const rewritePath = getRewritePath(pathname, '/www');
      return withSupabaseCookies(response, NextResponse.rewrite(new URL(rewritePath, request.url)));
    }

    if (isAppContentPath) {
      if (isDashboardPath && !user) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', `${APP_URL}/dashboard`);
        return withSupabaseCookies(response, NextResponse.redirect(loginUrl));
      }
      const rewritePath = getRewritePath(pathname, '/app');
      return withSupabaseCookies(response, NextResponse.rewrite(new URL(rewritePath, request.url)));
    }
  }

  if (isWww) {
    if (pathname === '/') {
      const rewritePath = getRewritePath(pathname === '/' ? '' : pathname, '/www');
      return withSupabaseCookies(response, NextResponse.rewrite(new URL(rewritePath || '/www', request.url)));
    }
    if (isAuthPath || pathname.startsWith('/dashboard') || pathname.startsWith('/listings')) {
      const target = new URL(APP_URL);
      target.pathname = pathname;
      target.search = request.nextUrl.search;
      if (!process.env.NEXT_PUBLIC_APP_URL) {
        target.searchParams.set('host', 'app');
      }
      return withSupabaseCookies(response, NextResponse.redirect(target));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
