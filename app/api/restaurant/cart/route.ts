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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ restaurant, order });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart data" },
      { status: 500 }
    );
  }
}
