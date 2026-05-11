import { NextResponse } from 'next/server';

export type UserRole = 'ADMIN' | 'CASHIER' | 'RADIOLOGIST';

export function authorize(request: Request, allowedRoles: UserRole[]) {
  const authHeader = request.headers.get('x-auth-session');

  if (!authHeader) {
    return { authorized: false, response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) };
  }

  try {
    const session = JSON.parse(authHeader);
    if (!allowedRoles.includes(session.role)) {
      return { authorized: false, response: NextResponse.json({ error: 'Access denied' }, { status: 403 }) };
    }
    return { authorized: true, user: session };
  } catch {
    return { authorized: false, response: NextResponse.json({ error: 'Invalid session' }, { status: 401 }) };
  }
}
