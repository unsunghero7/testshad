import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const coupons = await prisma.coupon.findMany({
      include: { restaurant: true },
    });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const coupon = await prisma.coupon.create({
      data: {
        code: body.code,
        discountType: body.discountType,
        discountValue: body.discountValue,
        minOrderAmount: body.minOrderAmount,
        maxDiscountAmount: body.maxDiscountAmount,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        isActive: body.isActive || true,
        usageLimit: body.usageLimit,
        restaurant: body.restaurantId
          ? { connect: { id: body.restaurantId } }
          : undefined,
      },
      include: { restaurant: true },
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        isActive: data.isActive,
        usageLimit: data.usageLimit,
        usageCount: data.usageCount,
        restaurant: data.restaurantId
          ? { connect: { id: data.restaurantId } }
          : undefined,
      },
      include: { restaurant: true },
    });
    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.coupon.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
