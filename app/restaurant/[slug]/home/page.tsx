import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bell, Search, MapPin, Home, Utensils, User } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  restaurantId: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  contactPhone: string;
  restaurantId: string;
}

export default function MobileHomePage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurant
        const restaurantRes = await fetch(`/api/restaurant/${slug}`);
        if (!restaurantRes.ok) throw new Error("Failed to fetch restaurant");
        const restaurantData = await restaurantRes.json();
        setRestaurant(restaurantData);

        // Fetch promotions
        const promotionsRes = await fetch(
          `/api/promotions?restaurantId=${restaurantData.id}`
        );
        if (!promotionsRes.ok) throw new Error("Failed to fetch promotions");
        const promotionsData = await promotionsRes.json();
        setPromotions(promotionsData);

        // Fetch branches
        const branchesRes = await fetch(
          `/api/branches?restaurantId=${restaurantData.id}`
        );
        if (!branchesRes.ok) throw new Error("Failed to fetch branches");
        const branchesData = await branchesRes.json();
        setBranches(branchesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug]);

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-foreground">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={restaurant.logo || "/placeholder.svg?height=40&width=40"}
              alt={restaurant.name}
            />
            <AvatarFallback>
              {restaurant.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">Welcome to</p>
            <h1 className="text-xl font-semibold">{restaurant.name}</h1>
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
          <Input className="pl-10" placeholder="Search dishes" />
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
        <h2 className="text-lg font-semibold mb-2">Our Branches</h2>
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
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{branch.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {branch.address}
                  </p>
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
