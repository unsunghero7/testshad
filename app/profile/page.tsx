"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  CreditCard,
  Lock,
  LogOut,
  ChevronRight,
  Wallet,
  Heart,
  Home,
  Plus,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  loyaltyPoints: number;
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
}

interface Favorite {
  id: string;
  restaurant: {
    id: string;
    name: string;
    description: string;
  };
}

interface Wallet {
  id: string;
  balance: number;
}

export default function UserProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const customerResponse = await fetch("/api/customer");
        const customerData = await customerResponse.json();
        setCustomer(customerData);

        const addressesResponse = await fetch("/api/addresses");
        const addressesData = await addressesResponse.json();
        setAddresses(addressesData);

        const ordersResponse = await fetch("/api/orders");
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);

        const favoritesResponse = await fetch("/api/favorites");
        const favoritesData = await favoritesResponse.json();
        setFavorites(favoritesData);

        const walletResponse = await fetch("/api/wallets");
        const walletData = await walletResponse.json();
        setWallet(walletData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!customer || !wallet) return <div>Error loading profile</div>;

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">My Profile</h1>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
            <AvatarFallback>
              {customer.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{customer.name}</h2>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={customer.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={customer.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={customer.phoneNumber} />
            </div>
          </CardContent>
        </Card>

        {/* Wallet */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <span>Balance</span>
              </div>
              <span className="font-semibold">
                ${wallet.balance.toFixed(2)}
              </span>
            </div>
            <Button className="w-full">Add Funds</Button>
          </CardContent>
        </Card>

        {/* Favorite Restaurants */}
        <Card>
          <CardHeader>
            <CardTitle>Favorite Restaurants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{favorite.restaurant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {favorite.restaurant.description}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Addresses */}
        <Card>
          <CardHeader>
            <CardTitle>My Addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">
                      {address.isDefault ? "Default" : "Other"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.street}, {address.city}, {address.state}{" "}
                      {address.postalCode}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span>Notifications</span>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span>Payment Methods</span>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <span>Change Password</span>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">${order.totalAmount.toFixed(2)}</span>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Loyalty Points */}
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {customer.loyaltyPoints} points
            </p>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button variant="destructive" className="w-full">
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
