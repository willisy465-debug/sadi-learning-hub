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
      return NextResponse.json({ error: 'First name, last name, email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    let existing;
    try {
      existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    } catch (dbErr: any) {
      console.error('Database error during register check:', dbErr);
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
    }

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // Get or create LEARNER role
    let learnerRole = await prisma.role.findUnique({ where: { code: 'LEARNER' } });
    if (!learnerRole) {
      learnerRole = await prisma.role.create({
        data: {
          code: 'LEARNER',
          name: 'Learner / Delegate',
          description: 'Course participant & examination candidate',
        },
      });
    }

    // Handle Organisation entity linkage if sponsored
    let orgId: string | undefined;
    if (sponsorType === 'ORGANISATION' && organisationName) {
      const orgCode = 'ORG-' + organisationName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'ORG-SADI';
      try {
        const org = await prisma.organisation.upsert({
          where: { code: orgCode },
          update: { taxNumber: taxNumber || undefined },
          create: {
            name: organisationName,
            code: orgCode,
            country: country || 'South Africa',
            contactEmail: managerEmail || cleanEmail,
            taxNumber: taxNumber || undefined,
          },
        });
        orgId = org.id;
      } catch (orgErr) {
        console.error('Organisation creation notice:', orgErr);
      }
    }

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
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
      organisationId: orgId || null,
    };

    await setAuthCookie(payload);
    await logAuditEvent(
      cleanEmail,
      'USER_REGISTER',
      'USER',
      `Registered ${sponsorType === 'ORGANISATION' ? `ORGANISATION-SPONSORED (${organisationName})` : 'SELF-SPONSORED'} delegate for ${firstName} ${lastName}`,
      newUser.id
    );

    return NextResponse.json({
      success: true,
      roles: ['LEARNER'],
      user: payload,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error?.message || 'Registration failed due to server error' },
      { status: 500 }
    );
  }
}
