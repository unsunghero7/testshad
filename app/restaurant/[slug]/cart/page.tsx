import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, Minus, Plus, ChevronRight, Info } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getCartData(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      branches: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  // For this example, we'll assume the first branch. In a real app, you'd select the specific branch.
  const branchId = restaurant.branches[0].id;

  // Fetch the latest pending order for this restaurant's branch
  const order = await prisma.order.findFirst({
    where: {
      branchId: branchId,
      status: "PENDING",
    },
    include: {
      orderItems: {
        include: {
          menuItem: true,
        },
      },
      coupon: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { restaurant, order };
}

export default async function MobileCartPage({
  params,
}: {
  params: { slug: string };
}) {
  const { restaurant, order } = await getCartData(params.slug);

  if (!order) {
    // Handle case when there's no pending order
    return (
      <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-foreground p-4">
        <h1 className="text-xl font-semibold mb-4">Your Cart</h1>
        <p>Your cart is empty. Add some items to get started!</p>
      </div>
    );
  }

  const itemsTotal = order.orderItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const deliveryCharges = 2.99;
  const processingFee = itemsTotal * 0.029 + 0.3;
  const platformFee = 1.99;
  const fulfillmentCharges = deliveryCharges + processingFee + platformFee;
  const discount = order.coupon ? Number(order.coupon.discountValue) : 0;
  const total = itemsTotal + fulfillmentCharges - discount;

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-foreground pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Cart</h1>
      </header>

      {/* Delivery Method */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="m-4 justify-between">
            <span>You have selected: {order.type}</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Delivery Method</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Button variant={order.type === "DELIVERY" ? "default" : "outline"}>
              Delivery
            </Button>
            <Button variant={order.type === "PICKUP" ? "default" : "outline"}>
              Pickup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-4">
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{item.menuItem.name}</h3>
              <p className="text-sm text-muted-foreground">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="outline">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-20 text-right">
              ${(Number(item.price) * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Special Request */}
      <div className="p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Add special request to order
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Special Request</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder="Enter your special request here..."
              className="mt-4"
            />
            <Button className="mt-4">Save Request</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Coupon Code */}
      <div className="p-4">
        <Label htmlFor="coupon">Coupon Code</Label>
        <div className="flex space-x-2 mt-1">
          <Input
            id="coupon"
            placeholder="Enter coupon code"
            value={order.coupon?.code || ""}
          />
          <Button>Apply</Button>
        </div>
      </div>

      {/* Bill Details */}
      <div className="p-4 bg-muted rounded-t-lg">
        <h2 className="text-lg font-semibold mb-4">Bill Details</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items Total</span>
            <span>${itemsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span>Fulfillment Charges</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delivery: ${deliveryCharges.toFixed(2)}</p>
                    <p>Payment Processing: ${processingFee.toFixed(2)}</p>
                    <p>Platform Fee: ${platformFee.toFixed(2)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span>${fulfillmentCharges.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Card className="fixed bottom-0 left-0 right-0 max-w-md mx-auto rounded-none">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">${total.toFixed(2)}</span>
          </div>
          <Button className="w-full">Proceed to Checkout</Button>
        </CardContent>
      </Card>
    </div>
  );
}
