import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MapPin, Navigation } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getRestaurantData(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      branches: {
        include: {
          location: true,
        },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
}

export default async function MobileRestaurantPage({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await getRestaurantData(params.slug);

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-background text-foreground overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={restaurant.logo || "/placeholder.svg?height=800&width=400"}
          alt="Restaurant background"
          layout="fill"
          objectFit="cover"
          className="opacity-50"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Restaurant Logo and Name */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white shadow-lg mb-4">
            <Image
              src={restaurant.logo || "/placeholder.svg?height=128&width=128"}
              alt="Restaurant logo"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-center text-white shadow-text">
            {restaurant.name}
          </h1>
        </div>

        {/* Bottom Card */}
        <Card className="rounded-t-3xl shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="w-full" variant="default">
                    <MapPin className="mr-2 h-4 w-4" />
                    View Locations
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="fixed inset-x-0 bottom-0 mt-24 rounded-t-[10px] max-w-md mx-auto">
                  <div className="bg-background p-4 max-h-[80vh] overflow-y-auto">
                    <div className="w-12 h-1.5 bg-muted mx-auto mb-4 rounded-full" />
                    <h2 className="text-lg font-semibold mb-4">
                      Our Locations
                    </h2>
                    <div className="space-y-2">
                      {restaurant.branches.map((branch) => (
                        <Button
                          key={branch.id}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          {`${branch.name} - ${branch.location.city}, ${branch.location.state}`}
                        </Button>
                      ))}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
              <Button className="w-full" variant="outline">
                <Navigation className="mr-2 h-4 w-4" />
                Locate by GPS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
