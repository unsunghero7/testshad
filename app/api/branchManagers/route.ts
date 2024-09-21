import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const branchManagers = await prisma.branchManager.findMany({
      include: { user: true, branch: true },
    });
    return NextResponse.json(branchManagers);
  } catch (error) {
    console.error("Error fetching branch managers:", error);
    return NextResponse.json(
      { error: "Failed to fetch branch managers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const branchManager = await prisma.branchManager.create({
      data: {
        user: { connect: { id: body.userId } },
        branch: { connect: { id: body.branchId } },
      },
      include: { user: true, branch: true },
    });
    return NextResponse.json(branchManager, { status: 201 });
  } catch (error) {
    console.error("Error creating branch manager:", error);
    return NextResponse.json(
      { error: "Failed to create branch manager" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const branchManager = await prisma.branchManager.update({
      where: { id },
      data: {
        user: data.userId ? { connect: { id: data.userId } } : undefined,
        branch: data.branchId ? { connect: { id: data.branchId } } : undefined,
      },
      include: { user: true, branch: true },
    });
    return NextResponse.json(branchManager);
  } catch (error) {
    console.error("Error updating branch manager:", error);
    return NextResponse.json(
      { error: "Failed to update branch manager" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.branchManager.delete({
      where: { id },
    });
    return NextResponse.json({
      message: "Branch manager deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting branch manager:", error);
    return NextResponse.json(
      { error: "Failed to delete branch manager" },
      { status: 500 }
    );
  }
}
