import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const inventory = await prisma.inventory.findMany({
      include: { branch: true },
    });
    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inventoryItem = await prisma.inventory.create({
      data: {
        item: body.item,
        quantity: body.quantity,
        unit: body.unit,
        branch: { connect: { id: body.branchId } },
      },
      include: { branch: true },
    });
    return NextResponse.json(inventoryItem, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { error: "Failed to create inventory item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const inventoryItem = await prisma.inventory.update({
      where: { id },
      data: {
        item: data.item,
        quantity: data.quantity,
        unit: data.unit,
      },
      include: { branch: true },
    });
    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { error: "Failed to update inventory item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.inventory.delete({
      where: { id },
    });
    return NextResponse.json({
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { error: "Failed to delete inventory item" },
      { status: 500 }
    );
  }
}
