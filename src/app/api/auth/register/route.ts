import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setAuthCookie, logAuditEvent } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      country,
      sponsorType,
      organisationName,
      taxNumber,
      jobTitle,
      department,
      managerEmail,
    } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // Get LEARNER role
    const learnerRole = await prisma.role.findUnique({ where: { code: 'LEARNER' } });
    if (!learnerRole) {
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
    }

    // Handle Organisation entity linkage if sponsored
    let orgId: string | undefined;
    if (sponsorType === 'ORGANISATION' && organisationName) {
      const orgCode = organisationName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) || 'ORG-SADI';
      const org = await prisma.organisation.upsert({
        where: { code: orgCode },
        update: { taxNumber: taxNumber || undefined },
        create: {
          name: organisationName,
          code: orgCode,
          country: country || 'South Africa',
          contactEmail: managerEmail || email,
          taxNumber: taxNumber || undefined,
        },
      });
      orgId = org.id;
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        country: country || 'South Africa',
        jobTitle: jobTitle || undefined,
        department: department || undefined,
        userRoles: {
          create: { roleId: learnerRole.id },
        },
        ...(orgId
          ? {
              organisationUsers: {
                create: { organisationId: orgId, isPrimaryAdmin: false },
              },
            }
          : {}),
      },
    });

    const payload = {
      userId: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      roles: ['LEARNER'],
    };

    await setAuthCookie(payload);
    await logAuditEvent(
      email,
      'USER_REGISTER',
      'USER',
      `Registered ${sponsorType === 'ORGANISATION' ? `ORGANISATION-SPONSORED (${organisationName})` : 'SELF-SPONSORED'} delegate for ${firstName} ${lastName}`,
      newUser.id
    );

    return NextResponse.json({
      success: true,
      user: payload,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
