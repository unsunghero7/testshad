import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const addresses = await prisma.address.findMany({
      include: { customer: true },
    });
    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const address = await prisma.address.create({
      data: {
        street: body.street,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        isDefault: body.isDefault || false,
        customer: { connect: { id: body.customerId } },
      },
      include: { customer: true },
    });
    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const address = await prisma.address.update({
      where: { id },
      data: {
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        isDefault: data.isDefault,
      },
      include: { customer: true },
    });
    return NextResponse.json(address);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.address.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
