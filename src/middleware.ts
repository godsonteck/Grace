import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect (dashboard) routes and sensitive API routes
  const protectedPrefixes = ['/admin', '/pos', '/dashboard', '/api/reports', '/api/referrals', '/api/branches', '/api/patients'];
  const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

  // Appointments API is public for POST (booking), but private for GET (listing)
  const isAppointmentsProtected = pathname.startsWith('/api/appointments') && request.method !== 'POST';

  if (isProtected || isAppointmentsProtected) {
    // In a production environment, use a secure HTTP-only cookie for session management.
    // Here we check for 'grace_auth_session' which the AuthContext sets in localStorage.
    // Note: middleware cannot access localStorage, so in a real app we'd use a cookie.
    const authSession = request.cookies.get('grace_auth_session');

    if (!authSession && !pathname.includes('/login')) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.startsWith('/dashboard') ? '/dashboard/login' : '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/pos/:path*',
    '/dashboard/:path*',
    '/api/reports/:path*',
    '/api/referrals/:path*',
    '/api/branches/:path*',
    '/api/patients/:path*',
    '/api/appointments/:path*',
  ],
};
