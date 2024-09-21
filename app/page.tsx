import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bell, Search, MapPin, Home, Utensils, User } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getPromotions() {
  return await prisma.promotion.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { startDate: "desc" },
  });
}

async function getBranches() {
  return await prisma.branch.findMany({
    take: 3,
    include: { location: true },
  });
}

async function getCustomer() {
  // For demo purposes, we'll fetch the first customer
  return await prisma.customer.findFirst({
    include: { user: true },
  });
}

export default async function MobileHomePage() {
  const promotions = await getPromotions();
  const branches = await getBranches();
  const customer = await getCustomer();

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-foreground">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback>
              {customer?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-xl font-semibold">{customer?.name}</h1>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6" />
        </Button>
      </header>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search restaurants or dishes" />
        </div>
      </div>

      {/* Promotions & Discounts */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold px-4 mb-2">
          Promotions & Discounts
        </h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-4">
            {promotions.map((promo) => (
              <Card key={promo.id} className="w-[200px] flex-shrink-0">
                <CardContent className="p-0">
                  <Image
                    src="/placeholder.svg?height=100&width=200"
                    alt={promo.title}
                    width={200}
                    height={100}
                    className="rounded-t-lg"
                  />
                  <div className="p-2">
                    <p className="font-semibold">{promo.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Delivery or Pickup Toggle */}
      <div className="px-4 mb-6">
        <ToggleGroup
          type="single"
          defaultValue="delivery"
          className="justify-center"
        >
          <ToggleGroupItem value="delivery" aria-label="Toggle delivery">
            Delivery
          </ToggleGroupItem>
          <ToggleGroupItem value="pickup" aria-label="Toggle pickup">
            Pickup
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Restaurant Branches */}
      <div className="flex-1 px-4 mb-20">
        <h2 className="text-lg font-semibold mb-2">Nearby Branches</h2>
        <div className="space-y-4">
          {branches.map((branch) => (
            <Card key={branch.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-32">
                  <Image
                    src="/placeholder.svg?height=100&width=200"
                    alt={branch.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-sm">
                    {/* You might want to calculate the distance based on user's location */}
                    {`${branch.location.city}, ${branch.location.state}`}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{branch.name}</h3>
                    {/* You might want to add a status field to the Branch model */}
                    <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">
                      Open
                    </span>
                  </div>
                  <Button variant="outline" className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t max-w-md mx-auto">
        <div className="flex justify-around p-2">
          {[
            { icon: Home, label: "Home" },
            { icon: Search, label: "Search" },
            { icon: Utensils, label: "Orders" },
            { icon: User, label: "Profile" },
          ].map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex-col h-16 px-2"
              size="sm"
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
