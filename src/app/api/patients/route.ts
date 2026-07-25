import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(patients);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, dob, gender, bloodGroup } = body;

    const patient = await prisma.patient.upsert({
      where: { email },
      update: { name, phone, dob: new Date(dob), gender, bloodGroup },
      create: { name, email, phone, dob: new Date(dob), gender, bloodGroup },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save patient' }, { status: 500 });
  }
}
