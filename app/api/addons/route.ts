import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const addons = await prisma.addon.findMany({
      include: { restaurant: true },
    });
    return NextResponse.json(addons);
  } catch (error) {
    console.error("Error fetching addons:", error);
    return NextResponse.json(
      { error: "Failed to fetch addons" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const addon = await prisma.addon.create({
      data: {
        name: body.name,
        price: body.price,
        restaurant: { connect: { id: body.restaurantId } },
      },
      include: { restaurant: true },
    });
    return NextResponse.json(addon, { status: 201 });
  } catch (error) {
    console.error("Error creating addon:", error);
    return NextResponse.json(
      { error: "Failed to create addon" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const addon = await prisma.addon.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        restaurant: data.restaurantId
          ? { connect: { id: data.restaurantId } }
          : undefined,
      },
      include: { restaurant: true },
    });
    return NextResponse.json(addon);
  } catch (error) {
    console.error("Error updating addon:", error);
    return NextResponse.json(
      { error: "Failed to update addon" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.addon.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Addon deleted successfully" });
  } catch (error) {
    console.error("Error deleting addon:", error);
    return NextResponse.json(
      { error: "Failed to delete addon" },
      { status: 500 }
    );
  }
}
