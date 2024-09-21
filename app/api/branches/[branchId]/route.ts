import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { branchId: string } }
) {
  const { branchId } = params;
  try {
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { restaurant: true, location: true },
    });
    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }
    return NextResponse.json(branch);
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { branchId: string } }
) {
  const { branchId } = params;
  const body = await request.json();
  try {
    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: body,
    });
    return NextResponse.json(updatedBranch);
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { branchId: string } }
) {
  const { branchId } = params;
  try {
    await prisma.branch.delete({
      where: { id: branchId },
    });
    return NextResponse.json({ message: "Branch deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
