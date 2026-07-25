import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      include: { branch: true }
    });
    return NextResponse.json(equipment);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch equipment' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, branchId, lastMaintenance, status } = body;

    const item = await prisma.equipment.create({
      data: {
        name,
        type,
        branchId,
        lastMaintenance: new Date(lastMaintenance),
        status: status || 'operational'
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create equipment' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, type, branchId, lastMaintenance, status } = body;

    const item = await prisma.equipment.update({
      where: { id },
      data: {
        name,
        type,
        branchId,
        lastMaintenance: new Date(lastMaintenance),
        status
      },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Failed to update equipment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) throw new Error();

    await prisma.equipment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete equipment' }, { status: 500 });
  }
}
