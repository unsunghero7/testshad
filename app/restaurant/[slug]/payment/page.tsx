import React, { useState, useEffect } from "react";
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
import { useParams } from "next/navigation";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  type: string;
  customer: {
    name: string;
    addresses: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
    }[];
  };
}

interface Wallet {
  id: string;
  balance: number;
}

const paymentMethods = [
  { id: "CARD", name: "Credit Card", icon: CreditCard },
  { id: "WALLET", name: "Digital Wallet", icon: Wallet },
  { id: "MOBILE", name: "Mobile Payment", icon: Smartphone },
];

export default function MobilePaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState("CARD");
  const [order, setOrder] = useState<Order | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchOrderAndWallet = async () => {
      try {
        setLoading(true);
        // Fetch current order
        const orderResponse = await fetch(
          `/api/restaurant/${slug}/orders/current`
        );
        const orderData = await orderResponse.json();
        setOrder(orderData);

        // Fetch wallet balance
        const walletResponse = await fetch(`/api/wallets`);
        const walletData = await walletResponse.json();
        setWallet(walletData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchOrderAndWallet();
  }, [slug]);

  const handlePayment = async () => {
    try {
      const response = await fetch(`/api/restaurant/${slug}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order?.id,
          method: selectedMethod,
          // Add more payment details as needed
        }),
      });

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      const result = await response.json();
      console.log("Payment successful:", result);
      // Handle successful payment (e.g., show confirmation, redirect to order tracking)
    } catch (error) {
      console.error("Payment error:", error);
      // Handle payment error (e.g., show error message)
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>No active order found.</div>;
  }

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
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
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
        {selectedMethod === "CARD" && (
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
        )}

        {/* Wallet Balance (shown when wallet is selected) */}
        {selectedMethod === "WALLET" && wallet && (
          <Card>
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Current Balance: ${wallet.balance.toFixed(2)}</p>
              {wallet.balance < order.totalAmount && (
                <p className="text-red-500 mt-2">
                  Insufficient balance for this order.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Billing Address */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={order.customer.name} />
            </div>
            {order.customer.addresses[0] && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    defaultValue={order.customer.addresses[0].street}
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      defaultValue={order.customer.addresses[0].city}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      defaultValue={order.customer.addresses[0].postalCode}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    defaultValue={order.customer.addresses[0].state}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Type</span>
              <span>{order.type}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pay Now Button */}
      <div className="p-4 bg-background border-t">
        <Button className="w-full" onClick={handlePayment}>
          Pay ${order.totalAmount.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
