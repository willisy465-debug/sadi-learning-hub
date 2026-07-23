import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/token';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('sadi_token')?.value;
  const user = token ? await verifyToken(token) : null;

  // Protected paths
  const isLearnerPath = path.startsWith('/learner');
  const isFacilitatorPath = path.startsWith('/facilitator');
  const isAdminPath = path.startsWith('/admin');

  if ((isLearnerPath || isFacilitatorPath || isAdminPath) && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route check
  if (isAdminPath && user) {
    const hasAdminAccess = user.roles.some((r) =>
      ['SUPER_ADMIN', 'PROGRAMME_DIRECTOR', 'OPERATIONS_MANAGER', 'LMS_ADMIN', 'PROGRAMME_MANAGER', 'FINANCE_OFFICER'].includes(r)
    );
    if (!hasAdminAccess) {
      return NextResponse.redirect(new URL('/learner/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/learner/:path*', '/facilitator/:path*', '/admin/:path*'],
};
