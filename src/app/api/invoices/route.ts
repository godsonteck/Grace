import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(invoices);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, patientName, scanName, amount, branchName, branchId } = body;

    const invoice = await prisma.invoice.create({
      data: {
        id, // Custom GRC ID if provided
        patientName,
        scanName,
        amount,
        branchName,
        branchId,
        status: 'unpaid'
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(invoice);
  } catch {
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}
