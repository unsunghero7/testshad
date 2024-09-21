import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  try {
    const updatedOrderItem = await prisma.orderItem.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updatedOrderItem);
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
