import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const systemSettings = await prisma.systemSettings.findMany();
    return NextResponse.json(systemSettings);
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch system settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const systemSetting = await prisma.systemSettings.create({
      data: {
        key: body.key,
        value: body.value,
      },
    });
    return NextResponse.json(systemSetting, { status: 201 });
  } catch (error) {
    console.error("Error creating system setting:", error);
    return NextResponse.json(
      { error: "Failed to create system setting" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const systemSetting = await prisma.systemSettings.update({
      where: { id },
      data: {
        key: data.key,
        value: data.value,
      },
    });
    return NextResponse.json(systemSetting);
  } catch (error) {
    console.error("Error updating system setting:", error);
    return NextResponse.json(
      { error: "Failed to update system setting" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.systemSettings.delete({
      where: { id },
    });
    return NextResponse.json({
      message: "System setting deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting system setting:", error);
    return NextResponse.json(
      { error: "Failed to delete system setting" },
      { status: 500 }
    );
  }
}
