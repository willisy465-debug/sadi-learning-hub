import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, setAuthCookie, logAuditEvent } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: { include: { role: true } },
        organisationUsers: { include: { organisation: true } },
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid credentials or inactive account' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      await logAuditEvent(email, 'FAILED_LOGIN', 'USER', 'Invalid password attempt', user.id);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const roles = user.userRoles.map((ur) => ur.role.code);
    const orgId = user.organisationUsers[0]?.organisationId || null;

    const payload = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      organisationId: orgId,
    };

    await setAuthCookie(payload);
    await logAuditEvent(user.email, 'USER_LOGIN', 'USER', `Successful login for ${user.firstName} ${user.lastName}`, user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
        organisationId: orgId,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
