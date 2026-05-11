import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect (dashboard) routes and sensitive API routes
  const protectedPrefixes = ['/admin', '/pos', '/api/reports', '/api/referrals', '/api/branches'];
  const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

  if (isProtected) {
    // In a production environment, use a secure HTTP-only cookie for session management.
    // Here we check for 'grace_auth_session' which the AuthContext sets in localStorage.
    // Note: middleware cannot access localStorage, so in a real app we'd use a cookie.
    const authSession = request.cookies.get('grace_auth_session');

    if (!authSession && !pathname.includes('/login')) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/pos/:path*',
    '/api/reports/:path*',
    '/api/referrals/:path*',
    '/api/branches/:path*',
  ],
};
