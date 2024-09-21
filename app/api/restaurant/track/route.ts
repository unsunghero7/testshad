import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string; orderId: string } }
) {
  const { slug, orderId } = params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        branch: {
          include: {
            restaurant: {
              where: { slug },
            },
            location: true,
          },
        },
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        payment: true,
      },
    });

    if (!order || !order.branch.restaurant) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order data:", error);
    return NextResponse.json(
      { error: "Failed to fetch order data" },
      { status: 500 }
    );
  }
}
