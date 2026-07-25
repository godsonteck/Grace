import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect (dashboard) routes and sensitive API routes
  const protectedPrefixes = ['/dashboard', '/api/reports', '/api/referrals', '/api/branches', '/api/patients'];
  const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

  // Appointments API is public for POST (booking), but private for GET (listing)
  const isAppointmentsProtected = pathname.startsWith('/api/appointments') && request.method !== 'POST';

  if (isProtected || isAppointmentsProtected) {
    const authSession = request.cookies.get('grace_auth_session');

    // Allow access to login page
    if (pathname.includes('/login')) {
      return NextResponse.next();
    }

    if (!authSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/reports/:path*',
    '/api/referrals/:path*',
    '/api/branches/:path*',
    '/api/patients/:path*',
    '/api/appointments/:path*',
  ],
};
