import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const orderItems = await prisma.orderItem.findMany({
      include: { order: true, menuItem: true },
    });
    return NextResponse.json(orderItems);
  } catch (error) {
    console.error("Error fetching order items:", error);
    return NextResponse.json(
      { error: "Failed to fetch order items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderItem = await prisma.orderItem.create({
      data: {
        order: { connect: { id: body.orderId } },
        menuItem: { connect: { id: body.menuItemId } },
        quantity: body.quantity,
        price: body.price,
        addons: body.addons,
      },
      include: { order: true, menuItem: true },
    });
    return NextResponse.json(orderItem, { status: 201 });
  } catch (error) {
    console.error("Error creating order item:", error);
    return NextResponse.json(
      { error: "Failed to create order item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const orderItem = await prisma.orderItem.update({
      where: { id },
      data: {
        quantity: data.quantity,
        price: data.price,
        addons: data.addons,
      },
      include: { order: true, menuItem: true },
    });
    return NextResponse.json(orderItem);
  } catch (error) {
    console.error("Error updating order item:", error);
    return NextResponse.json(
      { error: "Failed to update order item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.orderItem.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Order item deleted successfully" });
  } catch (error) {
    console.error("Error deleting order item:", error);
    return NextResponse.json(
      { error: "Failed to delete order item" },
      { status: 500 }
    );
  }
}
