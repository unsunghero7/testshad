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
        branches: {
          include: {
            location: true,
          },
        },
        promotions: {
          where: {
            isActive: true,
            endDate: {
              gte: new Date(),
            },
          },
          orderBy: {
            startDate: "desc",
          },
          take: 4,
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurant data" },
      { status: 500 }
    );
  }
}
