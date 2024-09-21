import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all locations
export async function GET() {
  try {
    const locations = await prisma.location.findMany();
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.error();
  }
}

// POST a new location
export async function POST(request: Request) {
  const data = await request.json();

  try {
    const location = await prisma.location.create({
      data: {
        city: data.city,
        state: data.state,
        country: data.country,
      },
    });
    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    return NextResponse.error();
  }
}

// GET a specific location by ID
export async function GET_BY_ID(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const location = await prisma.location.findUnique({
      where: { id },
    });
    if (!location) {
      return NextResponse.json(
        { message: "Location not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.error();
  }
}

// PUT (update) a location by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await request.json();

  try {
    const location = await prisma.location.update({
      where: { id },
      data: {
        city: data.city,
        state: data.state,
        country: data.country,
      },
    });
    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.error();
  }
}

// DELETE a location by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.location.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Location deleted" }, { status: 204 });
  } catch (error) {
    return NextResponse.error();
  }
}
