import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    return NextResponse.json(logs);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user, action, module } = body;

    const log = await prisma.auditLog.create({
      data: { user, action, module },
    });

    return NextResponse.json(log, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}
