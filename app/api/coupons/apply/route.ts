import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { code, restaurantSlug } = await request.json();
  try {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code,
        restaurant: { slug: restaurantSlug },
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });
    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid or expired coupon" },
        { status: 400 }
      );
    }
    return NextResponse.json({ coupon });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
