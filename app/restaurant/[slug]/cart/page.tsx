import React, { useState, useEffect } from "react";
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
import { useParams } from "next/navigation";

interface CartItem {
  id: string;
  menuItem: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  addons?: {
    id: string;
    name: string;
    price: number;
  }[];
}

interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
}

export default function MobileCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [specialRequest, setSpecialRequest] = useState("");
  const { slug } = useParams();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`/api/restaurant/${slug}/cart`);
        if (!response.ok) throw new Error("Failed to fetch cart");
        const data = await response.json();
        setCartItems(data.items);
        setDeliveryMethod(data.deliveryMethod);
        setSpecialRequest(data.specialRequest || "");
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [slug]);

  const updateQuantity = async (id: string, change: number) => {
    try {
      const response = await fetch(`/api/restaurant/${slug}/cart/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: change }),
      });
      if (!response.ok) throw new Error("Failed to update quantity");
      const updatedCart = await response.json();
      setCartItems(updatedCart.items);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const applyCoupon = async () => {
    try {
      const response = await fetch(
        `/api/restaurant/${slug}/cart/apply-coupon`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: couponCode }),
        }
      );
      if (!response.ok) throw new Error("Failed to apply coupon");
      const data = await response.json();
      setAppliedCoupon(data.coupon);
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  const updateSpecialRequest = async () => {
    try {
      const response = await fetch(
        `/api/restaurant/${slug}/cart/special-request`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ specialRequest }),
        }
      );
      if (!response.ok) throw new Error("Failed to update special request");
    } catch (error) {
      console.error("Error updating special request:", error);
    }
  };

  const itemsTotal = cartItems.reduce((sum, item) => {
    const itemTotal = item.menuItem.price * item.quantity;
    const addonTotal =
      item.addons?.reduce((acc, addon) => acc + addon.price, 0) || 0;
    return sum + itemTotal + addonTotal * item.quantity;
  }, 0);

  const deliveryCharges = deliveryMethod === "Delivery" ? 2.99 : 0;
  const processingFee = itemsTotal * 0.029 + 0.3;
  const platformFee = 1.99;
  const fulfillmentCharges = deliveryCharges + processingFee + platformFee;
  const discount = appliedCoupon
    ? appliedCoupon.discountType === "PERCENTAGE"
      ? itemsTotal * (appliedCoupon.discountValue / 100)
      : appliedCoupon.discountValue
    : 0;
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
            <span>You have selected: {deliveryMethod}</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Delivery Method</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Button
              variant={deliveryMethod === "Delivery" ? "default" : "outline"}
              onClick={() => setDeliveryMethod("Delivery")}
            >
              Delivery
            </Button>
            <Button
              variant={deliveryMethod === "Pickup" ? "default" : "outline"}
              onClick={() => setDeliveryMethod("Pickup")}
            >
              Pickup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{item.menuItem.name}</h3>
              <p className="text-sm text-muted-foreground">
                ${item.menuItem.price.toFixed(2)}
              </p>
              {item.addons &&
                item.addons.map((addon) => (
                  <p key={addon.id} className="text-sm text-muted-foreground">
                    + {addon.name} (${addon.price.toFixed(2)})
                  </p>
                ))}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item.id, -1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item.id, 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-20 text-right">
              $
              {(
                (item.menuItem.price +
                  (item.addons?.reduce((acc, addon) => acc + addon.price, 0) ||
                    0)) *
                item.quantity
              ).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Special Request */}
      <div className="p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {specialRequest
                ? "Special request"
                : "Add special request to order"}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Special Request</DialogTitle>
            </DialogHeader>
            <Textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Enter your special request here..."
              className="mt-4"
            />
            <Button onClick={updateSpecialRequest} className="mt-4">
              Save Request
            </Button>
          </DialogContent>
        </Dialog>
        {specialRequest && (
          <p className="mt-2 text-sm text-muted-foreground">{specialRequest}</p>
        )}
      </div>

      {/* Coupon Code */}
      <div className="p-4">
        <Label htmlFor="coupon">Coupon Code</Label>
        <div className="flex space-x-2 mt-1">
          <Input
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
          />
          <Button onClick={applyCoupon}>Apply</Button>
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
