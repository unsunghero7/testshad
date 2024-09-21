import { prisma } from "@/lib/prisma";

export async function getRestaurants() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        logo: true,
        description: true,
      },
    });
    return restaurants;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw new Error("Failed to fetch restaurants");
  }
}
