import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CreditCard, Wallet, Smartphone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const paymentMethods = [
  { id: "CARD", name: "Credit Card", icon: CreditCard },
  { id: "WALLET", name: "Digital Wallet", icon: Wallet },
  { id: "CASH", name: "Cash on Delivery", icon: Smartphone },
];

async function getPaymentData(slug: string) {
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
      customer: {
        include: {
          addresses: true,
          wallet: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!order) {
    notFound();
  }

  return { restaurant, order };
}

export default async function MobilePaymentPage({
  params,
}: {
  params: { slug: string };
}) {
  const { restaurant, order } = await getPaymentData(params.slug);

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
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Payment</h1>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Payment Method Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Select Payment Method</h2>
          <RadioGroup defaultValue="CARD">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label
                  htmlFor={method.id}
                  className="flex items-center cursor-pointer"
                >
                  <method.icon className="h-5 w-5 mr-2" />
                  {method.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Credit Card Details (shown when card is selected) */}
        <Card>
          <CardHeader>
            <CardTitle>Card Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" placeholder="MM/YY" />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" placeholder="John Doe" />
            </div>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                defaultValue={order.customer.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Select defaultValue={order.customer.addresses[0]?.id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an address" />
                </SelectTrigger>
                <SelectContent>
                  {order.customer.addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id}>
                      {`${address.street}, ${address.city}, ${address.state} ${address.postalCode}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fulfillment Charges</span>
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
          </CardContent>
        </Card>
      </div>

      {/* Pay Now Button */}
      <div className="p-4 bg-background border-t">
        <Button className="w-full">Pay ${total.toFixed(2)}</Button>
      </div>
    </div>
  );
}
