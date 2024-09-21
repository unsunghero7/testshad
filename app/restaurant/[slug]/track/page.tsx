import React from "react";
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
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getOrderData(slug: string, orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      branch: {
        include: {
          restaurant: {
            where: { slug },
          },
          location: true,
        },
      },
      orderItems: {
        include: {
          menuItem: true,
        },
      },
      payment: true,
    },
  });

  if (!order || !order.branch.restaurant) {
    notFound();
  }

  return order;
}

const orderSteps = [
  { status: "PENDING", icon: CheckCircle2, label: "Order Confirmed" },
  { status: "ACCEPTED", icon: ChefHat, label: "Preparing" },
  { status: "READY_FOR_PICKUP", icon: Package, label: "Ready for Pickup" },
  { status: "OUT_FOR_DELIVERY", icon: Truck, label: "On the Way" },
  { status: "DELIVERED", icon: MapPin, label: "Delivered" },
];

export default async function OrderTrackingPage({
  params,
}: {
  params: { slug: string; orderId: string };
}) {
  const order = await getOrderData(params.slug, params.orderId);

  const currentStepIndex = orderSteps.findIndex(
    (step) => step.status === order.status
  );

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Order #{order.id.slice(-6)}</h1>
        <Badge variant="secondary">{order.status}</Badge>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Estimated Delivery Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estimated Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Date(order.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <p className="text-muted-foreground">
              Your order is {orderSteps[currentStepIndex].label}
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

        {/* Delivery Person Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src="/placeholder.svg" alt="Delivery Person" />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">Delivery Partner</h3>
                <p className="text-sm text-muted-foreground">
                  Your order will be delivered soon
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
                      index <= currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                  </span>
                  <h3 className="font-medium leading-tight">{step.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {index <= currentStepIndex
                      ? new Date(order.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Pending"}
                  </p>
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
                <span>${Number(item.price).toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>${Number(order.totalAmount).toFixed(2)}</span>
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
