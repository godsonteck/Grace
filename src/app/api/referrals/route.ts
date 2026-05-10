import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const referrals = await prisma.referralDoctor.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(referrals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, facility, phone, email } = body;

    const referral = await prisma.referralDoctor.create({
      data: { name, facility, phone, email },
    });

    return NextResponse.json(referral, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create referral' }, { status: 500 });
  }
}
