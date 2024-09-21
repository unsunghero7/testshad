import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string; branchId: string } }
) {
  const { slug, branchId } = params;

  try {
    const branch = await prisma.branch.findFirst({
      where: {
        id: branchId,
        restaurant: {
          slug: slug,
        },
      },
      include: {
        restaurant: true,
        location: true,
      },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const menuItems = await prisma.menuItem.findMany({
      where: {
        restaurantId: branch.restaurantId,
        isAvailable: true,
      },
      include: {
        addons: {
          include: {
            addon: true,
          },
        },
      },
    });

    return NextResponse.json({ branch, menuItems });
  } catch (error) {
    console.error("Error fetching branch data:", error);
    return NextResponse.json(
      { error: "Failed to fetch branch data" },
      { status: 500 }
    );
  }
}
