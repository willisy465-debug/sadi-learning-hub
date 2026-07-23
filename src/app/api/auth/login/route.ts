import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, hashPassword, setAuthCookie, logAuditEvent } from '@/lib/auth';

// Helper to seed demo accounts on demand if the database is empty or user is missing
async function ensureDemoUser(email: string) {
  const demoEmails = [
    'admin@saditraining.com',
    'director@saditraining.com',
    'finance@saditraining.com',
    'facilitator@saditraining.com',
    'corporate@eskom.co.za',
    'learner@saditraining.com',
  ];

  if (!demoEmails.includes(email)) return null;

  try {
    const passwordHash = await hashPassword('Password123!');
    const roleCodeMap: Record<string, { role: string; firstName: string; lastName: string; jobTitle: string }> = {
      'admin@saditraining.com': { role: 'SUPER_ADMIN', firstName: 'Tendai', lastName: 'Moyo', jobTitle: 'Chief Information & Academic Officer' },
      'director@saditraining.com': { role: 'PROGRAMME_DIRECTOR', firstName: 'Dr. Kagiso', lastName: 'Dlamini', jobTitle: 'Executive Director of Academic Affairs' },
      'finance@saditraining.com': { role: 'FINANCE_OFFICER', firstName: 'Nompumelelo', lastName: 'Khumalo', jobTitle: 'Senior Finance Manager' },
      'facilitator@saditraining.com': { role: 'FACILITATOR', firstName: 'Prof. Emmanuel', lastName: 'Okonkwo', jobTitle: 'Lead Executive Facilitator' },
      'corporate@eskom.co.za': { role: 'CORPORATE_ADMIN', firstName: 'Sibusiso', lastName: 'Zwane', jobTitle: 'Head of Learning & Capacity Development' },
      'learner@saditraining.com': { role: 'LEARNER', firstName: 'Aminata', lastName: 'Diallo', jobTitle: 'Senior Public Policy Advisor' },
    };

    const info = roleCodeMap[email];
    if (!info) return null;

    // Ensure role exists
    let role = await prisma.role.findUnique({ where: { code: info.role } });
    if (!role) {
      role = await prisma.role.create({
        data: {
          code: info.role,
          name: info.role.replace(/_/g, ' '),
          description: `Auto-generated ${info.role} role`,
        },
      });
    }

    const createdUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: info.firstName,
        lastName: info.lastName,
        country: 'South Africa',
        jobTitle: info.jobTitle,
        isActive: true,
        userRoles: {
          create: { roleId: role.id },
        },
      },
      include: {
        userRoles: { include: { role: true } },
        organisationUsers: { include: { organisation: true } },
      },
    });

    return createdUser;
  } catch (err) {
    console.error('Error auto-creating demo user:', err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: {
          userRoles: { include: { role: true } },
          organisationUsers: { include: { organisation: true } },
        },
      });
    } catch (dbErr: any) {
      console.error('Prisma query error during login:', dbErr);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again shortly.' },
        { status: 503 }
      );
    }

    // Auto-provision demo account if missing
    if (!user) {
      user = await ensureDemoUser(cleanEmail);
    }

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid credentials or inactive account' }, { status: 401 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: 'Password not configured for this account' }, { status: 401 });
    }

    let isValid = false;
    try {
      isValid = await verifyPassword(password, user.passwordHash);
    } catch (pwdErr: any) {
      console.error('Password verification error:', pwdErr);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!isValid) {
      await logAuditEvent(cleanEmail, 'FAILED_LOGIN', 'USER', 'Invalid password attempt', user.id);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const roles = (user.userRoles || [])
      .map((ur) => ur?.role?.code)
      .filter(Boolean) as string[];

    if (roles.length === 0) {
      roles.push('LEARNER');
    }

    const orgId = user.organisationUsers?.[0]?.organisationId || null;

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
      roles,
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
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
