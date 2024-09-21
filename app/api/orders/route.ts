import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        branch: true,
        orderItems: true,
        coupon: true,
        payment: true,
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await prisma.order.create({
      data: {
        customer: { connect: { id: body.customerId } },
        branch: { connect: { id: body.branchId } },
        totalAmount: body.totalAmount,
        status: body.status,
        type: body.type,
        coupon: body.couponId ? { connect: { id: body.couponId } } : undefined,
      },
      include: {
        customer: true,
        branch: true,
        orderItems: true,
        coupon: true,
        payment: true,
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const order = await prisma.order.update({
      where: { id },
      data: {
        totalAmount: data.totalAmount,
        status: data.status,
        type: data.type,
      },
      include: {
        customer: true,
        branch: true,
        orderItems: true,
        coupon: true,
        payment: true,
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.order.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
