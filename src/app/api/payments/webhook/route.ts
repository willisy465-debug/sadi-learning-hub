import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceNumber, gatewayTransactionId, idempotencyKey, amount, currency, status } = body;

    if (!invoiceNumber || !idempotencyKey) {
      return NextResponse.json({ error: 'Missing invoice number or idempotency key' }, { status: 400 });
    }

    // Check Idempotency Key
    const existingPayment = await prisma.payment.findUnique({
      where: { idempotencyKey },
    });

    if (existingPayment) {
      return NextResponse.json({ message: 'Duplicate webhook event ignored (idempotent)', payment: existingPayment });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
    });

    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

    // Record Payment
    const payment = await prisma.payment.create({
      data: {
        receiptNumber: `SADI-REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        payerEmail: invoice.billedToEmail,
        invoiceId: invoice.id,
        amount: Number(amount) || invoice.totalAmount,
        currency: currency || invoice.currency,
        paymentMethod: 'CREDIT_CARD_PAYFAST',
        transactionRef: gatewayTransactionId || `GATEWAY-TX-${Date.now()}`,
        idempotencyKey,
        status: status || 'SUCCESS',
      },
    });

    // Update Invoice Status
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount: invoice.totalAmount,
        status: 'PAID',
      },
    });

    await logAuditEvent('SYSTEM_PAYMENT_WEBHOOK', 'PAYMENT_RECEIVED', 'PAYMENT', `Payment of ${currency} ${amount} received for invoice ${invoiceNumber}`, undefined, payment.id);

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return NextResponse.json({ error: 'Failed to process payment webhook' }, { status: 500 });
  }
}
