import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useParams } from "next/navigation";

interface Branch {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  contactPhone: string;
  operatingHours: {
    [key: string]: { open: string; close: string };
  };
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function MobileBranchPage() {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const { slug, branchId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch branch details
        const branchRes = await fetch(`/api/branches/${branchId}`);
        if (!branchRes.ok) throw new Error("Failed to fetch branch details");
        const branchData = await branchRes.json();
        setBranch(branchData);

        // Fetch menu items
        const menuItemsRes = await fetch(
          `/api/menuItems?restaurantId=${branchData.restaurantId}`
        );
        if (!menuItemsRes.ok) throw new Error("Failed to fetch menu items");
        const menuItemsData = await menuItemsRes.json();
        setMenuItems(menuItemsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug, branchId]);

  const addToCart = (itemId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1,
    }));
  };

  const totalItems = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );
  const totalAmount = menuItems.reduce(
    (sum, item) => sum + (cart[item.id] || 0) * item.price,
    0
  );

  const menuCategories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  if (!branch) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-foreground">
      {/* Branch Image */}
      <div className="relative h-48">
        <Image
          src="/placeholder.svg?height=200&width=400"
          alt="Branch Header"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <h1 className="text-2xl font-bold text-white">{branch.name}</h1>
          <Badge
            variant={
              branch.operatingHours[
                new Date()
                  .toLocaleDateString("en-US", { weekday: "long" })
                  .toLowerCase()
              ]
                ? "default"
                : "secondary"
            }
          >
            {branch.operatingHours[
              new Date()
                .toLocaleDateString("en-US", { weekday: "long" })
                .toLowerCase()
            ]
              ? "Open"
              : "Closed"}
          </Badge>
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
                {Object.entries(branch.operatingHours).map(([day, hours]) => (
                  <li key={day} className="flex justify-between">
                    <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                    <span>
                      {hours.open} - {hours.close}
                    </span>
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
          <span>
            {branch.address}, {branch.postalCode}
          </span>
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
                          src={
                            item.image || "/placeholder.svg?height=80&width=80"
                          }
                          alt={item.name}
                          width={160}
                          height={160}
                          className="w-full"
                        />
                        {cart[item.id] && (
                          <Badge
                            variant="secondary"
                            className="absolute top-2 right-2"
                          >
                            {cart[item.id]}
                          </Badge>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <span>${item.price.toFixed(2)}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => addToCart(item.id)}
                          >
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
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <Button className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            View Cart ({totalItems} items) - ${totalAmount.toFixed(2)}
          </Button>
        </div>
      )}
    </div>
  );
}
