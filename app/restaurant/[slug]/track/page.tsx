import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  ChefHat,
} from "lucide-react";
import { useParams } from "next/navigation";

interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
  };
  branch: {
    name: string;
    address: string;
    contactPhone: string;
  };
  orderItems: {
    id: string;
    menuItem: {
      name: string;
    };
    quantity: number;
    price: number;
  }[];
}

enum OrderStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  PREPARING = "PREPARING",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

const orderStepMap = {
  [OrderStatus.PENDING]: { icon: Clock, label: "Order Placed" },
  [OrderStatus.ACCEPTED]: { icon: CheckCircle2, label: "Order Confirmed" },
  [OrderStatus.PREPARING]: { icon: ChefHat, label: "Preparing" },
  [OrderStatus.READY_FOR_PICKUP]: { icon: Package, label: "Ready for Pickup" },
  [OrderStatus.OUT_FOR_DELIVERY]: { icon: Truck, label: "On the Way" },
  [OrderStatus.DELIVERED]: { icon: MapPin, label: "Delivered" },
};

export default function OrderTrackingPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const { slug, orderId } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `/api/restaurant/${slug}/orders/${orderId}`
        );
        if (!response.ok) throw new Error("Failed to fetch order");
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [slug, orderId]);

  if (!order) return <div>Loading...</div>;

  const orderSteps = Object.entries(orderStepMap).map(([status, step]) => ({
    ...step,
    completed:
      Object.keys(orderStepMap).indexOf(order.status) >=
      Object.keys(orderStepMap).indexOf(status),
    time:
      status === order.status
        ? new Date(order.updatedAt).toLocaleTimeString()
        : "",
  }));

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Order #{order.id.slice(0, 8)}</h1>
        <Badge variant="secondary">{order.status.replace("_", " ")}</Badge>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Estimated Delivery Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estimated Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Date(
                new Date(order.createdAt).getTime() + 60 * 60 * 1000
              ).toLocaleTimeString()}
            </div>
            <p className="text-muted-foreground">
              Your order is {order.status.toLowerCase().replace("_", " ")}!
            </p>
          </CardContent>
        </Card>

        {/* Delivery Map Placeholder */}
        <Card className="overflow-hidden">
          <div className="h-48 bg-muted flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Map View</span>
          </div>
        </Card>

        {/* Restaurant Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage
                  src="/placeholder.svg?height=50&width=50"
                  alt="Restaurant"
                />
                <AvatarFallback>
                  {order.branch.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{order.branch.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {order.branch.address}
                </p>
              </div>
              <Button size="icon" variant="ghost">
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-muted-foreground/20 ml-3 space-y-6">
              {orderSteps.map((step, index) => (
                <li key={index} className="mb-10 ml-6">
                  <span
                    className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-background ${
                      step.completed
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                  </span>
                  <h3 className="font-medium leading-tight">{step.label}</h3>
                  <p className="text-sm text-muted-foreground">{step.time}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span>
                  {item.quantity}x {item.menuItem.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t max-w-md mx-auto">
        <Button className="w-full">Need Help?</Button>
      </div>
    </div>
  );
}
