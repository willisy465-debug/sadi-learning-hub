import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, logAuditEvent } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { attemptId, examinationId, answers } = await request.json();

    if (!attemptId || !examinationId) {
      return NextResponse.json({ error: 'Attempt ID and Examination ID required' }, { status: 400 });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Exam attempt not found' }, { status: 404 });
    }

    if (attempt.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (attempt.examinationId !== examinationId) {
      return NextResponse.json({ error: 'Attempt does not match examination' }, { status: 400 });
    }

    if (attempt.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'This attempt has already been submitted' }, { status: 409 });
    }

    const exam = await prisma.examination.findUnique({
      where: { id: examinationId },
      include: {
        course: true,
        questions: { include: { options: true } },
      },
    });

    if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

    let totalPointsAwarded = 0;
    let totalMaxPoints = 0;

    const responseRecords = [];

    for (const q of exam.questions) {
      totalMaxPoints += q.points;
      const ans = answers?.[q.id];

      if ((q.questionType === 'MULTIPLE_CHOICE' || q.questionType === 'TRUE_FALSE') && ans?.selectedOptionId) {
        const correctOption = q.options.find((opt) => opt.isCorrect);
        const isCorrect = correctOption?.id === ans.selectedOptionId;
        const score = isCorrect ? q.points : 0;
        totalPointsAwarded += score;

        responseRecords.push({
          examAttemptId: attemptId,
          questionId: q.id,
          selectedOptionId: ans.selectedOptionId,
          scoreAwarded: score,
          isCorrect,
        });
      } else if (q.questionType === 'ESSAY' && ans?.essayAnswer) {
        const essayScore = q.points * 0.8;
        totalPointsAwarded += essayScore;

        responseRecords.push({
          examAttemptId: attemptId,
          questionId: q.id,
          essayAnswer: ans.essayAnswer,
          scoreAwarded: essayScore,
          isCorrect: true,
        });
      }
    }

    const scorePercent = totalMaxPoints > 0 ? (totalPointsAwarded / totalMaxPoints) * 100 : 0;
    const isPassed = scorePercent >= exam.passMarkPercent;

    await prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        status: isPassed ? 'PASSED' : 'FAILED',
        submittedAt: new Date(),
        scorePercent,
        isPassed,
      },
    });

    for (const r of responseRecords) {
      await prisma.examResponse.create({ data: r });
    }

    if (isPassed) {
      const firstInitial = (user.firstName?.[0] || 'X').toUpperCase();
      const lastInitial = (user.lastName?.[0] || 'X').toUpperCase();
      const certNumber = `SADI-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const verCode = `VER-SADI-${Math.floor(10000 + Math.random() * 90000)}-${firstInitial}${lastInitial}`;

      const existingCert = await prisma.certificate.findFirst({
        where: {
          userId: user.userId,
          courseId: exam.courseId,
        },
      });

      if (!existingCert) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const cert = await prisma.certificate.create({
          data: {
            certificateNumber: certNumber,
            verificationCode: verCode,
            userId: user.userId,
            courseId: exam.courseId,
            courseTitle: exam.course.title,
            learnerName: `${user.firstName} ${user.lastName}`.trim() || user.email,
            issueDate: new Date(),
            status: 'VALID',
            cpdPoints: exam.course.cpdPoints,
            digitalSignature: `SHA256:${Math.random().toString(36).substring(2)}${Date.now()}`,
            qrVerificationUrl: `${baseUrl}/verify/${verCode}`,
          },
        });

        await logAuditEvent(
          user.email,
          'CERTIFICATE_GENERATED',
          'CERTIFICATE',
          `Auto-generated certificate ${certNumber} for ${user.firstName} ${user.lastName}`,
          user.userId,
          cert.id
        );
      }
    }

    return NextResponse.json({
      success: true,
      scorePercent,
      isPassed,
      attemptId,
    });
  } catch (error) {
    console.error('Exam submit error:', error);
    return NextResponse.json({ error: 'Failed to process exam submission' }, { status: 500 });
  }
}
