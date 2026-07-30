import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/token';

const ADMIN_ROLES = [
  'SUPER_ADMIN',
  'PROGRAMME_DIRECTOR',
  'OPERATIONS_MANAGER',
  'LMS_ADMIN',
  'PROGRAMME_MANAGER',
  'FINANCE_OFFICER',
];

const FACILITATOR_ROLES = ['FACILITATOR', 'ASSESSOR', 'SUPER_ADMIN', 'PROGRAMME_DIRECTOR'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('sadi_token')?.value;
  const user = token ? await verifyToken(token) : null;

  const isLearnerPath = path.startsWith('/learner');
  const isFacilitatorPath = path.startsWith('/facilitator');
  const isAdminPath = path.startsWith('/admin');
  const isCorporatePath = path.startsWith('/corporate');

  if ((isLearnerPath || isFacilitatorPath || isAdminPath || isCorporatePath) && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && user) {
    const hasAdminAccess = user.roles.some((r) => ADMIN_ROLES.includes(r));
    if (!hasAdminAccess) {
      return NextResponse.redirect(new URL('/learner/dashboard', request.url));
    }
  }

  if (isFacilitatorPath && user) {
    const hasFacilitatorAccess = user.roles.some((r) => FACILITATOR_ROLES.includes(r));
    if (!hasFacilitatorAccess) {
      return NextResponse.redirect(new URL('/learner/dashboard', request.url));
    }
  }

  if (isCorporatePath && user) {
    const hasCorporateAccess = user.roles.some((r) =>
      ['CORPORATE_ADMIN', 'SUPER_ADMIN', 'PROGRAMME_DIRECTOR'].includes(r)
    );
    if (!hasCorporateAccess) {
      return NextResponse.redirect(new URL('/learner/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/learner/:path*', '/facilitator/:path*', '/admin/:path*', '/corporate/:path*'],
};
