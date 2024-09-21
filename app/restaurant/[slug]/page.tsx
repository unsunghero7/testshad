"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StartScreen from "./start/page";
import HomeScreen from "./home/page";
import BranchScreen from "./branch/page";
import CartScreen from "./cart/page";
import PaymentScreen from "./payment/page";
import TrackScreen from "./track/page";
import { prisma } from "@/lib/prisma";

type Screen = "start" | "home" | "branch" | "cart" | "payment" | "track";

export default function RestaurantPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("start");
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch(`/api/restaurant/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant data");
        }
        const data = await response.json();
        setRestaurantData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "start":
        return (
          <StartScreen
            restaurant={restaurantData}
            onContinue={() => setCurrentScreen("home")}
          />
        );
      case "home":
        return (
          <HomeScreen
            restaurant={restaurantData}
            onSelectBranch={(branchId) => setCurrentScreen("branch")}
          />
        );
      case "branch":
        return (
          <BranchScreen
            restaurant={restaurantData}
            onAddToCart={() => setCurrentScreen("cart")}
          />
        );
      case "cart":
        return (
          <CartScreen
            restaurant={restaurantData}
            onCheckout={() => setCurrentScreen("payment")}
          />
        );
      case "payment":
        return (
          <PaymentScreen
            restaurant={restaurantData}
            onPaymentComplete={() => setCurrentScreen("track")}
          />
        );
      case "track":
        return <TrackScreen restaurant={restaurantData} />;
      default:
        return <div>Invalid screen</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-foreground">
      {renderScreen()}
    </div>
  );
}
