import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, MapPin, Clock, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getBranchData(slug: string, branchId: string) {
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
    notFound();
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

  return { branch, menuItems };
}

export default async function MobileBranchPage({
  params,
}: {
  params: { slug: string; branchId: string };
}) {
  const { branch, menuItems } = await getBranchData(
    params.slug,
    params.branchId
  );

  const operatingHours = branch.operatingHours as {
    day: string;
    hours: string;
  }[];
  const menuCategories = [...new Set(menuItems.map((item) => item.category))];

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-foreground">
      {/* Branch Image */}
      <div className="relative h-48">
        <Image
          src={branch.restaurant.logo || "/placeholder.svg"}
          alt="Branch Header"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <h1 className="text-2xl font-bold text-white">{branch.name}</h1>
          <Badge variant="default">Open</Badge>
        </div>
      </div>

      {/* Branch Details */}
      <div className="p-4 space-y-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="hours">
            <AccordionTrigger>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Opening Hours
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {operatingHours.map((day, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{day.day}</span>
                    <span>{day.hours}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex items-center">
          <Phone className="mr-2 h-4 w-4" />
          <span>{branch.contactPhone}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4" />
          <span>{`${branch.address}, ${branch.location.city}, ${branch.location.state} ${branch.postalCode}`}</span>
        </div>
      </div>

      {/* Menu Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search menu items" />
        </div>
      </div>

      {/* Menu Categories Scroll Area */}
      <ScrollArea className="w-full whitespace-nowrap mb-4">
        <div className="flex w-max space-x-4 p-4">
          {menuCategories.map((category, index) => (
            <Button key={index} variant="outline" size="sm">
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Menu Items */}
      <div className="flex-1 px-4 space-y-6 mb-20">
        {menuCategories.map((category, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold mb-2">{category}</h2>
            <div className="grid grid-cols-2 gap-4">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={160}
                          height={160}
                          className="w-full"
                        />
                      </div>
                      <div className="p-2">
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <span>${item.price.toFixed(2)}</span>
                          <Button size="sm" variant="ghost">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* View Cart Button */}
      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <Button className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" />
          View Cart (0 items) - $0.00
        </Button>
      </div>
    </div>
  );
}
