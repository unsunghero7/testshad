import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const menuItemAddons = await prisma.menuItemAddon.findMany({
      include: { menuItem: true, addon: true },
    });
    return NextResponse.json(menuItemAddons);
  } catch (error) {
    console.error("Error fetching menu item addons:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu item addons" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const menuItemAddon = await prisma.menuItemAddon.create({
      data: {
        menuItem: { connect: { id: body.menuItemId } },
        addon: { connect: { id: body.addonId } },
      },
      include: { menuItem: true, addon: true },
    });
    return NextResponse.json(menuItemAddon, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item addon:", error);
    return NextResponse.json(
      { error: "Failed to create menu item addon" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { menuItemId, addonId } = await request.json();
    await prisma.menuItemAddon.delete({
      where: {
        menuItemId_addonId: {
          menuItemId,
          addonId,
        },
      },
    });
    return NextResponse.json({
      message: "Menu item addon deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu item addon:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item addon" },
      { status: 500 }
    );
  }
}
