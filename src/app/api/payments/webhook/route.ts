import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (webhookSecret) {
      const provided =
        request.headers.get('x-webhook-secret') ||
        request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
      if (provided !== webhookSecret) {
        return NextResponse.json({ error: 'Unauthorized webhook' }, { status: 401 });
      }
    }

    const body = await request.json();
    const { invoiceNumber, gatewayTransactionId, idempotencyKey, amount, currency, status } = body;

    if (!invoiceNumber || !idempotencyKey) {
      return NextResponse.json({ error: 'Missing invoice number or idempotency key' }, { status: 400 });
    }

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

    const paidAmount = Number(amount) || invoice.totalAmount;

    const payment = await prisma.payment.create({
      data: {
        receiptNumber: `SADI-REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        payerEmail: invoice.billedToEmail,
        invoiceId: invoice.id,
        amount: paidAmount,
        currency: currency || invoice.currency,
        paymentMethod: 'CREDIT_CARD_PAYFAST',
        transactionRef: gatewayTransactionId || `GATEWAY-TX-${Date.now()}`,
        idempotencyKey,
        status: status || 'COMPLETED',
      },
    });

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount,
        balanceDue: Math.max(0, invoice.totalAmount - paidAmount),
        status: paidAmount >= invoice.totalAmount ? 'PAID' : invoice.status,
      },
    });

    await logAuditEvent(
      'SYSTEM_PAYMENT_WEBHOOK',
      'PAYMENT_RECEIVED',
      'PAYMENT',
      `Payment of ${currency || invoice.currency} ${paidAmount} received for invoice ${invoiceNumber}`,
      undefined,
      payment.id
    );

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return NextResponse.json({ error: 'Failed to process payment webhook' }, { status: 500 });
  }
}
