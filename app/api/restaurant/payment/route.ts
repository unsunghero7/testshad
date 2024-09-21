import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        branches: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // For this example, we'll assume the first branch. In a real app, you'd select the specific branch.
    const branchId = restaurant.branches[0].id;

    // Fetch the latest pending order for this restaurant's branch
    const order = await prisma.order.findFirst({
      where: {
        branchId: branchId,
        status: "PENDING",
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        coupon: true,
        customer: {
          include: {
            addresses: true,
            wallet: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "No pending order found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ restaurant, order });
  } catch (error) {
    console.error("Error fetching payment data:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment data" },
      { status: 500 }
    );
  }
}
