import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const branches = await prisma.branch.findMany({
      include: { location: true, restaurant: true },
    });
    return NextResponse.json(branches);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const branch = await prisma.branch.create({
      data: body,
      include: { location: true, restaurant: true },
    });
    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create branch" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const branch = await prisma.branch.update({
      where: { id },
      data,
      include: { location: true, restaurant: true },
    });
    return NextResponse.json(branch);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update branch" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.branch.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Branch deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete branch" },
      { status: 500 }
    );
  }
}
