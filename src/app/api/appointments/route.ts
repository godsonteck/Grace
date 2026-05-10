import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { AppointmentSchema } from '@/lib/validations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branchId = searchParams.get('branchId');

  try {
    const appointments = await prisma.appointment.findMany({
      where: branchId ? { branchId } : {},
      include: {
        patient: true,
        branch: true,
        report: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = AppointmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data', details: validation.error.format() }, { status: 400 });
    }

    const {
      patientId,
      branchId,
      scanId,
      scanName,
      date,
      time,
      priority,
      referringDoctor,
      notes
    } = validation.data;

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        branchId,
        scanId,
        scanName,
        date,
        time,
        priority,
        referringDoctor,
        notes,
        status: 'pending',
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
