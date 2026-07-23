import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, logAuditEvent } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Please log in to enrol' }, { status: 401 });

    const formData = await request.formData();
    const courseId = formData.get('courseId') as string;
    const cohortId = formData.get('cohortId') as string;

    if (!courseId) return NextResponse.json({ error: 'Course ID required' }, { status: 400 });

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    const selectedCohortId = cohortId || (await prisma.cohort.findFirst({ where: { courseId } }))?.id;

    if (!selectedCohortId) return NextResponse.json({ error: 'No active cohort found' }, { status: 400 });

    // Check existing enrolment
    const existing = await prisma.enrolment.findFirst({
      where: { userId: user.userId, courseId },
    });

    if (existing) {
      return NextResponse.redirect(new URL('/learner/dashboard', request.url));
    }

    // Create enrolment
    const enrolment = await prisma.enrolment.create({
      data: {
        userId: user.userId,
        courseId,
        cohortId: selectedCohortId,
      },
    });

    // Create registration record
    const regNum = `SADI-REG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const registration = await prisma.registration.create({
      data: {
        registrationNumber: regNum,
        userId: user.userId,
        courseId,
        cohortId: selectedCohortId,
        totalAmount: course.priceZar,
        status: 'CONFIRMED',
      },
    });

    // Generate Invoice
    const invoiceNum = `SADI-INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    await prisma.invoice.create({
      data: {
        invoiceNumber: invoiceNum,
        registrationId: registration.id,
        billedToName: `${user.firstName} ${user.lastName}`,
        billedToEmail: user.email,
        currency: 'ZAR',
        subtotal: course.priceZar,
        taxAmount: course.priceZar * 0.15,
        totalAmount: course.priceZar * 1.15,
        paidAmount: course.priceZar * 1.15,
        balanceDue: 0,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'PAID',
      },
    });

    await logAuditEvent(user.email, 'COURSE_ENROLMENT', 'ENROLMENT', `Enrolled in ${course.code} - Invoice ${invoiceNum}`, user.userId);

    return NextResponse.redirect(new URL('/learner/dashboard', request.url));
  } catch (error) {
    console.error('Enrolment error:', error);
    return NextResponse.json({ error: 'Failed to complete enrolment' }, { status: 500 });
  }
}
