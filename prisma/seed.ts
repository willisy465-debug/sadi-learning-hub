import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SADI Learning Hub Database Seed...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Roles & Permissions
  const roleCodes = [
    { code: 'SUPER_ADMIN', name: 'Super Administrator', description: 'Full platform operational & governance control' },
    { code: 'PROGRAMME_DIRECTOR', name: 'Programme Director', description: 'Strategic quality, approvals & financial oversight' },
    { code: 'OPERATIONS_MANAGER', name: 'Head of Operations', description: 'Logistics, cohorts, venues & attendance' },
    { code: 'LMS_ADMIN', name: 'LMS Administrator', description: 'User, course, enrolment & platform management' },
    { code: 'PROGRAMME_MANAGER', name: 'Programme Manager', description: 'Facilitator assignments, progress & evaluation' },
    { code: 'PROGRAMME_COORDINATOR', name: 'Programme Coordinator', description: 'Daily logistics, materials & registers' },
    { code: 'FACILITATOR', name: 'Facilitator / Instructor', description: 'Course delivery, marking & attendance' },
    { code: 'ASSESSOR', name: 'Assessor / Invigilator', description: 'Exam grading & moderation' },
    { code: 'FINANCE_OFFICER', name: 'Finance Officer', description: 'Invoicing, receipts, ledger & financial reports' },
    { code: 'MARKETING_USER', name: 'Marketing & BizDev', description: 'Leads, campaign links & enquiries' },
    { code: 'CORPORATE_ADMIN', name: 'Corporate Client Admin', description: 'Sponsoring organisation delegate management' },
    { code: 'LEARNER', name: 'Learner / Delegate', description: 'Course participant & examination candidate' },
    { code: 'SUPPORT_AGENT', name: 'Support Agent', description: 'Help desk & learner assistance' },
  ];

  const roleMap: Record<string, string> = {};
  for (const r of roleCodes) {
    const role = await prisma.role.upsert({
      where: { code: r.code },
      update: { name: r.name, description: r.description },
      create: { code: r.code, name: r.name, description: r.description },
    });
    roleMap[r.code] = role.id;
  }

  // 2. SADI Corporate Client Organisations
  const eskom = await prisma.organisation.upsert({
    where: { code: 'ORG-ESKOM' },
    update: {},
    create: {
      name: 'Eskom Holdings SOC Ltd',
      code: 'ORG-ESKOM',
      country: 'South Africa',
      industry: 'Energy & Power Utilities',
      contactEmail: 'capacity@eskom.co.za',
      contactPhone: '+27 11 800 1111',
      address: 'Megawatt Park, Maxwell Drive, Sunninghill, Johannesburg',
      taxNumber: '4740101508',
    },
  });

  const cbk = await prisma.organisation.upsert({
    where: { code: 'ORG-CBK' },
    update: {},
    create: {
      name: 'Central Bank of Kenya',
      code: 'ORG-CBK',
      country: 'Kenya',
      industry: 'Banking & Public Financial Regulation',
      contactEmail: 'hr-training@centralbank.go.ke',
      contactPhone: '+254 20 286 0000',
      address: 'Haile Selassie Avenue, Nairobi, Kenya',
      taxNumber: 'P051123456Z',
    },
  });

  // 3. System Users
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@saditraining.com' },
    update: {},
    create: {
      email: 'admin@saditraining.com',
      passwordHash,
      firstName: 'Tendai',
      lastName: 'Moyo',
      country: 'South Africa',
      jobTitle: 'Chief Information & Academic Officer',
      department: 'Executive Governance',
      userRoles: { create: { roleId: roleMap['SUPER_ADMIN'] } },
    },
  });

  const director = await prisma.user.upsert({
    where: { email: 'director@saditraining.com' },
    update: {},
    create: {
      email: 'director@saditraining.com',
      passwordHash,
      firstName: 'Dr. Kagiso',
      lastName: 'Dlamini',
      country: 'South Africa',
      jobTitle: 'Executive Director of Academic Affairs',
      userRoles: { create: { roleId: roleMap['PROGRAMME_DIRECTOR'] } },
    },
  });

  const financeUser = await prisma.user.upsert({
    where: { email: 'finance@saditraining.com' },
    update: {},
    create: {
      email: 'finance@saditraining.com',
      passwordHash,
      firstName: 'Nompumelelo',
      lastName: 'Khumalo',
      country: 'South Africa',
      jobTitle: 'Senior Finance Manager',
      userRoles: { create: { roleId: roleMap['FINANCE_OFFICER'] } },
    },
  });

  const facilitatorUser = await prisma.user.upsert({
    where: { email: 'facilitator@saditraining.com' },
    update: {},
    create: {
      email: 'facilitator@saditraining.com',
      passwordHash,
      firstName: 'Prof. Emmanuel',
      lastName: 'Okonkwo',
      country: 'South Africa',
      jobTitle: 'Lead Executive Facilitator',
      userRoles: { create: { roleId: roleMap['FACILITATOR'] } },
    },
  });

  const corporateAdminUser = await prisma.user.upsert({
    where: { email: 'corporate@eskom.co.za' },
    update: {},
    create: {
      email: 'corporate@eskom.co.za',
      passwordHash,
      firstName: 'Sibusiso',
      lastName: 'Zwane',
      country: 'South Africa',
      jobTitle: 'Head of Learning & Capacity Development',
      organisationUsers: { create: { organisationId: eskom.id, isPrimaryAdmin: true } },
      userRoles: { create: { roleId: roleMap['CORPORATE_ADMIN'] } },
    },
  });

  const learnerUser = await prisma.user.upsert({
    where: { email: 'learner@saditraining.com' },
    update: {},
    create: {
      email: 'learner@saditraining.com',
      passwordHash,
      firstName: 'Aminata',
      lastName: 'Diallo',
      country: 'Kenya',
      jobTitle: 'Senior Public Policy Advisor',
      department: 'Public Governance',
      userRoles: { create: { roleId: roleMap['LEARNER'] } },
    },
  });

  // 4. Course Categories
  const execCat = await prisma.courseCategory.upsert({
    where: { slug: 'leadership-executive-management' },
    update: {},
    create: {
      name: 'Leadership & Executive Management',
      slug: 'leadership-executive-management',
      description: 'Strategic leadership, governance, crisis resilience, and board development for African public & private institutions.',
      icon: 'ShieldCheck',
      displayOrder: 1,
    },
  });

  const finCat = await prisma.courseCategory.upsert({
    where: { slug: 'finance-accounting-audit' },
    update: {},
    create: {
      name: 'Finance, Accounting & Audit',
      slug: 'finance-accounting-audit',
      description: 'Public financial management, IPSAS compliance, risk-based internal auditing, and anti-fraud management.',
      icon: 'Calculator',
      displayOrder: 2,
    },
  });

  const techCat = await prisma.courseCategory.upsert({
    where: { slug: 'technology-ai-cybersecurity' },
    update: {},
    create: {
      name: 'Technology, AI & Cybersecurity',
      slug: 'technology-ai-cybersecurity',
      description: 'Digital transformation, enterprise AI governance, data privacy (POPIA/GDPR), and cybersecurity defense.',
      icon: 'Cpu',
      displayOrder: 3,
    },
  });

  // 5. Courses
  const execCourse = await prisma.course.upsert({
    where: { slug: 'executive-leadership-strategic-governance' },
    update: {},
    create: {
      slug: 'executive-leadership-strategic-governance',
      code: 'SADI-EXEC-01',
      title: 'Executive Leadership & Strategic Governance for African Institutions',
      shortDescription: 'Master modern institutional governance, policy design, stakeholder negotiation, and ethical executive leadership.',
      fullDescription: 'This flagship 5-day executive programme provides senior public servants, C-suite executives, board members, and directors with state-of-the-art tools for managing complex African public & private institutions in an era of digital transformation and global economic volatility.',
      categoryId: execCat.id,
      deliveryMethod: 'BLENDED',
      durationDays: 5,
      cpdPoints: 25,
      priceZar: 28500.0,
      priceUsd: 1850.0,
      isPublished: true,
      featuredImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
      promotionalVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      targetAudience: 'Permanent Secretaries, Directors-General, Board Members, CEOs, Municipal Managers, and Senior Executives.',
      learningObjectives: '• Align institutional governance with African Agenda 2063.\n• Implement ethical leadership frameworks.\n• Manage multi-stakeholder policy formulation.\n• Drive crisis-resilient corporate strategy.',
      prerequisites: 'Minimum 5 years in senior management or institutional leadership.',
      accreditationInfo: 'Accredited by SADI Capacity Development Council (CPD 25 Points). Registered CIPC 2011/070892/23.',
    },
  });

  const techCourse = await prisma.course.upsert({
    where: { slug: 'ai-cybersecurity-executive-boards' },
    update: {},
    create: {
      slug: 'ai-cybersecurity-executive-boards',
      code: 'SADI-TECH-03',
      title: 'AI & Cybersecurity Risk Management for Executive Boards',
      shortDescription: 'Self-paced comprehensive guide to generative AI risks, data protection compliance (POPIA/GDPR), and cyber defense governance.',
      fullDescription: 'Designed for non-technical executives and board members, this course breaks down artificial intelligence deployment risks, cyber attack mitigation strategies, legal compliance requirements across SADC countries, and incident response planning.',
      categoryId: techCat.id,
      deliveryMethod: 'SELF_PACED',
      durationDays: 3,
      cpdPoints: 15,
      priceZar: 14500.0,
      priceUsd: 950.0,
      isPublished: true,
      featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
      promotionalVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      targetAudience: 'CIOs, Risk Officers, Board Members, Compliance Managers, and Legal Counsel.',
      learningObjectives: '• Understand Enterprise GenAI Risks.\n• Conduct Cyber Governance Audits.\n• Master POPIA and African Data Laws.\n• Structure an Effective CSIRT.',
    },
  });

  // 6. Cohorts
  const cohortPretoria = await prisma.cohort.upsert({
    where: { code: 'EXEC-2026-Q3-PTA' },
    update: {},
    create: {
      courseId: execCourse.id,
      code: 'EXEC-2026-Q3-PTA',
      name: 'Pretoria Winter Executive Cohort 2026',
      deliveryMethod: 'BLENDED',
      startDate: new Date('2026-08-10'),
      endDate: new Date('2026-08-14'),
      location: 'Pretoria, South Africa',
      venueDetails: 'Brooklyn Forum Conference Centre, 379 Veale Street, Brooklyn, Pretoria',
      maxCapacity: 25,
      currentCapacity: 12,
      facilitatorName: 'Prof. Emmanuel Okonkwo',
      isAccepting: true,
    },
  });

  const cohortSelfPaced = await prisma.cohort.upsert({
    where: { code: 'TECH-SELF-2026' },
    update: {},
    create: {
      courseId: techCourse.id,
      code: 'TECH-SELF-2026',
      name: 'Continuous E-Learning 2026',
      deliveryMethod: 'SELF_PACED',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      location: 'Online Digital Campus',
      maxCapacity: 1000,
      currentCapacity: 145,
      facilitatorName: 'Dr. Kagiso Dlamini',
      isAccepting: true,
    },
  });

  // 7. Course Modules & Lessons for Tech Course (Self-Paced)
  const module1 = await prisma.module.create({
    data: {
      courseId: techCourse.id,
      title: 'Module 1: Enterprise Artificial Intelligence & Governance',
      description: 'Foundations of GenAI, machine learning ethics, and board-level risk oversight.',
      displayOrder: 1,
      lessons: {
        create: [
          {
            title: 'Lesson 1.1: The African AI Landscape & Executive Opportunities',
            summary: 'Understanding AI capabilities in public services, banking, and utility management.',
            contentType: 'VIDEO',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            durationMinutes: 18,
            displayOrder: 1,
            textContent: 'Artificial Intelligence is revolutionizing public administration across Southern Africa. In this lesson, we explore high-impact deployment models in treasury automation, energy forecasting, and fraud prevention.',
          },
          {
            title: 'Lesson 1.2: Generative AI Risk Assessment Matrix',
            summary: 'Frameworks for identifying data leakage, hallucination risks, and IP vulnerabilities.',
            contentType: 'RICH_TEXT',
            durationMinutes: 20,
            displayOrder: 2,
            textContent: 'When deploying LLMs inside enterprise networks, executive boards must mandate: 1. Zero data-retention agreements with AI vendors. 2. Role-Based Access Controls on internal knowledge bases. 3. Automated output auditing.',
          },
        ],
      },
    },
  });

  const module2 = await prisma.module.create({
    data: {
      courseId: techCourse.id,
      title: 'Module 2: Cybersecurity Governance & Incident Management',
      description: 'Ransomware mitigation, POPIA reporting protocols, and boardroom emergency drills.',
      displayOrder: 2,
      lessons: {
        create: [
          {
            title: 'Lesson 2.1: Ransomware & Critical Infrastructure Defense',
            summary: 'Executive protocols when critical utility or financial infrastructure is targeted.',
            contentType: 'VIDEO',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            durationMinutes: 25,
            displayOrder: 1,
            textContent: 'Ransomware attacks in SADC region have increased by 40%. Learn how to maintain business continuity and avoid legal liability during a breach.',
          },
        ],
      },
    },
  });

  // 8. Examination Engine Setup for Tech Course
  const exam = await prisma.examination.upsert({
    where: { code: 'EXAM-TECH-03' },
    update: {},
    create: {
      courseId: techCourse.id,
      code: 'EXAM-TECH-03',
      title: 'Certified AI & Cybersecurity Risk Assessor Examination',
      description: 'Comprehensive timed assessment testing executive understanding of AI governance, POPIA compliance, and ransomware response protocols.',
      timeLimitMinutes: 45,
      passMarkPercent: 75.0,
      maxAttempts: 3,
      isPublished: true,
      questions: {
        create: [
          {
            questionText: 'Under South Africa POPIA and regional data protection laws, what is the legal mandate when a major personal data breach occurs?',
            questionType: 'MULTIPLE_CHOICE',
            points: 25,
            displayOrder: 1,
            options: {
              create: [
                { optionText: 'Notify the Information Regulator and affected data subjects as soon as reasonably possible.', isCorrect: true },
                { optionText: 'Pay the ransomware perpetrator within 48 hours without public announcement.', isCorrect: false },
                { optionText: 'Wait 90 days to complete an internal forensic investigation before informing anyone.', isCorrect: false },
                { optionText: 'Delete affected databases to prevent further inspection.', isCorrect: false },
              ],
            },
          },
          {
            questionText: 'Which of the following represents the most critical risk when integrating public Generative AI LLMs into corporate workflow?',
            questionType: 'MULTIPLE_CHOICE',
            points: 25,
            displayOrder: 2,
            options: {
              create: [
                { optionText: 'Accidental disclosure of proprietary internal documents used in AI prompt inputs.', isCorrect: true },
                { optionText: 'The AI model slowing down computer monitor refresh rates.', isCorrect: false },
                { optionText: 'High power consumption by standard desktop keyboards.', isCorrect: false },
                { optionText: 'Inability to translate documents into PDF format.', isCorrect: false },
              ],
            },
          },
          {
            questionText: 'Detail your institutional incident response plan if your enterprise network suffers a nation-state ransomware attack.',
            questionType: 'ESSAY',
            points: 50,
            displayOrder: 3,
          },
        ],
      },
    },
  });

  // 9. Learner Registration & Enrolment
  const reg = await prisma.registration.upsert({
    where: { registrationNumber: 'SADI-REG-2026-0089' },
    update: {},
    create: {
      registrationNumber: 'SADI-REG-2026-0089',
      userId: learnerUser.id,
      courseId: techCourse.id,
      cohortId: cohortSelfPaced.id,
      organisationId: eskom.id,
      deliveryMethod: 'SELF_PACED',
      status: 'CONFIRMED',
      participantCount: 1,
      currency: 'ZAR',
      totalAmount: 14500.0,
      notes: 'Sponsored delegate by Eskom Learning & Development',
    },
  });

  const enrolment = await prisma.enrolment.upsert({
    where: {
      userId_cohortId: {
        userId: learnerUser.id,
        cohortId: cohortSelfPaced.id,
      },
    },
    update: {},
    create: {
      userId: learnerUser.id,
      courseId: techCourse.id,
      cohortId: cohortSelfPaced.id,
      registrationId: reg.id,
      progressPercent: 100.0,
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  // 10. Financial Invoice & Payment
  const invoice = await prisma.invoice.upsert({
    where: { invoiceNumber: 'INV-2026-8801' },
    update: {},
    create: {
      invoiceNumber: 'INV-2026-8801',
      registrationId: reg.id,
      organisationId: eskom.id,
      billedToName: 'Eskom Holdings SOC Ltd',
      billedToEmail: 'capacity@eskom.co.za',
      currency: 'ZAR',
      subtotal: 14500.0,
      taxAmount: 2175.0, // 15% VAT
      discountAmount: 0.0,
      totalAmount: 16675.0,
      paidAmount: 16675.0,
      balanceDue: 0.0,
      status: 'PAID',
      dueDate: new Date('2026-08-01'),
      invoiceItems: {
        create: [
          {
            description: 'SADI-TECH-03: AI & Cybersecurity Risk Management (1 Delegate: Aminata Diallo)',
            quantity: 1,
            unitPrice: 14500.0,
            totalPrice: 14500.0,
          },
        ],
      },
    },
  });

  const payment = await prisma.payment.upsert({
    where: { receiptNumber: 'REC-SADI-2026-0901' },
    update: {},
    create: {
      receiptNumber: 'REC-SADI-2026-0901',
      invoiceId: invoice.id,
      registrationId: reg.id,
      paymentMethod: 'BANK_TRANSFER',
      transactionRef: 'EFT-ESKOM-9920192',
      currency: 'ZAR',
      amount: 16675.0,
      status: 'COMPLETED',
      payerEmail: 'capacity@eskom.co.za',
      idempotencyKey: 'IDEMP-ESKOM-PAY-9920192',
    },
  });

  // 11. Certificate & Verification Record
  const certificate = await prisma.certificate.upsert({
    where: { certificateNumber: 'SADI-CERT-2026-90412' },
    update: {},
    create: {
      certificateNumber: 'SADI-CERT-2026-90412',
      verificationCode: 'VER-SADI-90412-AD',
      userId: learnerUser.id,
      courseId: techCourse.id,
      courseTitle: techCourse.title,
      learnerName: 'Aminata Diallo',
      issueDate: new Date(),
      status: 'VALID',
      cpdPoints: 15,
      digitalSignature: 'SHA256:d8a94e7b1c3f5a2b0e9f8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a',
      qrVerificationUrl: 'http://localhost:3000/verify/VER-SADI-90412-AD',
      pdfUrl: '/certificates/SADI-CERT-2026-90412.pdf',
    },
  });

  // 12. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: superAdmin.id,
        actorEmail: superAdmin.email,
        action: 'SYSTEM_INITIALIZATION',
        entityType: 'PLATFORM',
        details: 'SADI Learning Hub platform initialized with 13 RBAC roles and corporate configurations.',
      },
      {
        actorId: financeUser.id,
        actorEmail: financeUser.email,
        action: 'PAYMENT_RECONCILED',
        entityType: 'INVOICE',
        entityId: invoice.id,
        details: 'Reconciled EFT payment of ZAR 16,675.00 from Eskom Holdings for invoice INV-2026-8801.',
      },
      {
        actorId: director.id,
        actorEmail: director.email,
        action: 'CERTIFICATE_ISSUED',
        entityType: 'CERTIFICATE',
        entityId: certificate.id,
        details: 'Issued certified credential SADI-CERT-2026-90412 to Aminata Diallo upon 100% course completion.',
      },
    ],
  });

  console.log('✅ Seed completed successfully! Registered default accounts:');
  console.log('  👑 Super Admin: admin@saditraining.com / Password123!');
  console.log('  🎓 Director:    director@saditraining.com / Password123!');
  console.log('  💳 Finance:     finance@saditraining.com / Password123!');
  console.log('  👨‍🏫 Facilitator: facilitator@saditraining.com / Password123!');
  console.log('  🏢 Corporate:   corporate@eskom.co.za / Password123!');
  console.log('  👤 Learner:     learner@saditraining.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
