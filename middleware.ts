import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const WWW_URL = process.env.NEXT_PUBLIC_WWW_URL ?? 'http://localhost:3000';

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

const WWW_PATHS = ['/', '/login', '/signup', '/forgot-password', '/auth/reset-password', '/auth/callback'];
const APP_PATHS = ['/', '/dashboard', '/listings'];

function getRewritePath(pathname: string, prefix: string): string {
  if (pathname === '/' || pathname === '') return prefix;
  return `${prefix}${pathname}`;
}

export async function middleware(request: NextRequest) {
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

  if (isApp) {
    if (pathname === '/' || pathname.startsWith('/dashboard') || pathname.startsWith('/listings')) {
      if (pathname.startsWith('/dashboard') && !user) {
        const loginUrl = new URL(WWW_URL);
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('redirectTo', `${APP_URL}/dashboard`);
        return NextResponse.redirect(loginUrl);
      }
      const rewritePath = getRewritePath(pathname, '/app');
      return NextResponse.rewrite(new URL(rewritePath, request.url));
    }
    if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password')) {
      const target = new URL(WWW_URL);
      target.pathname = pathname;
      target.search = request.nextUrl.search;
      return NextResponse.redirect(target);
    }
  }

  if (isWww) {
    if (pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' ||
        pathname === '/auth/reset-password' || pathname === '/auth/callback') {
      const rewritePath = getRewritePath(pathname === '/' ? '' : pathname, '/www');
      return NextResponse.rewrite(new URL(rewritePath || '/www', request.url));
    }
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/listings')) {
      const target = new URL(APP_URL);
      target.pathname = pathname;
      target.search = request.nextUrl.search;
      if (!process.env.NEXT_PUBLIC_APP_URL) {
        target.searchParams.set('host', 'app');
      }
      return NextResponse.redirect(target);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
