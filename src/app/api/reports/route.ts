import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId, patientId, content, imageUrl, statFlag, type, labValues } = body;

    const report = await prisma.diagnosticReport.create({
      data: {
        appointmentId,
        patientId,
        content,
        imageUrl,
        statFlag: statFlag || false,
        type: type || 'RADIOLOGY',
        labValues: labValues,
        resultId: `GRC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      },
    });

    // Update appointment status to completed
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'completed' },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
