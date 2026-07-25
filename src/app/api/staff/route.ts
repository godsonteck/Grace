import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      include: { branch: true }
    });
    return NextResponse.json(staff);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, branchId, phone, email, status } = body;

    const member = await prisma.staff.create({
      data: { name, role, branchId, phone, email, status: status || 'active' },
    });

    return NextResponse.json(member, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create staff member' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, branchId, phone, email, status } = body;

    const member = await prisma.staff.update({
      where: { id },
      data: { name, role, branchId, phone, email, status },
    });

    return NextResponse.json(member);
  } catch {
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) throw new Error();

    await prisma.staff.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 });
  }
}
