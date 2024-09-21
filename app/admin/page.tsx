"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AdminLayout from "@/components/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import all CRUD components
import { ContentPagesCRUD } from "@/components/admin/ContentPagesCRUD";
import { CouponsCRUD } from "@/components/admin/CouponsCRUD";
import { CustomerCRUD } from "@/components/admin/CustomerCRUD";
import { FavoritesCRUD } from "@/components/admin/FavoritesCRUD";
import { InventoryCRUD } from "@/components/admin/InventoryCRUD";
import { LocationsCRUD } from "@/components/admin/LocationsCRUD";
import { MenuItemAddonsCRUD } from "@/components/admin/MenuItemAddonsCRUD";
import { MenuItemsCRUD } from "@/components/admin/MenuItemsCRUD";
import { OrderItemsCRUD } from "@/components/admin/OrderItemsCRUD";
import { OrdersCRUD } from "@/components/admin/OrdersCRUD";
import { PaymentsCRUD } from "@/components/admin/PaymentsCRUD";
import { PromotionsCRUD } from "@/components/admin/PromotionsCRUD";
import { RestaurantAdminsCRUD } from "@/components/admin/RestaurantAdminsCRUD";
import { ReviewsCRUD } from "@/components/admin/ReviewsCRUD";
import { SystemSettingsCRUD } from "@/components/admin/SystemSettingsCRUD";
import { UserCRUD } from "@/components/admin/UserCRUD";
import { WalletsCRUD } from "@/components/admin/WalletsCRUD";
import { WalletTransactionsCRUD } from "@/components/admin/WalletTransactionsCRUD";
import { RestaurantCRUD } from "@/components/admin/RestaurantCRUD";

export default function AdminPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("restaurants");

  if (!session) {
    return <div>Access Denied</div>;
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="contentPages">Content Pages</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="menuItemAddons">Menu Item Addons</TabsTrigger>
          <TabsTrigger value="menuItems">Menu Items</TabsTrigger>
          <TabsTrigger value="orderItems">Order Items</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="restaurantAdmins">Restaurant Admins</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="systemSettings">System Settings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="walletTransactions">
            Wallet Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contentPages">
          <ContentPagesCRUD />
        </TabsContent>
        <TabsContent value="coupons">
          <CouponsCRUD />
        </TabsContent>
        <TabsContent value="customers">
          <CustomerCRUD />
        </TabsContent>
        <TabsContent value="favorites">
          <FavoritesCRUD />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryCRUD />
        </TabsContent>
        <TabsContent value="locations">
          <LocationsCRUD />
        </TabsContent>
        <TabsContent value="menuItemAddons">
          <MenuItemAddonsCRUD />
        </TabsContent>
        <TabsContent value="menuItems">
          <MenuItemsCRUD />
        </TabsContent>
        <TabsContent value="orderItems">
          <OrderItemsCRUD />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersCRUD />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentsCRUD />
        </TabsContent>
        <TabsContent value="promotions">
          <PromotionsCRUD />
        </TabsContent>
        <TabsContent value="restaurantAdmins">
          <RestaurantAdminsCRUD />
        </TabsContent>
        <TabsContent value="restaurants">
          <RestaurantCRUD />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewsCRUD />
        </TabsContent>
        <TabsContent value="systemSettings">
          <SystemSettingsCRUD />
        </TabsContent>
        <TabsContent value="users">
          <UserCRUD />
        </TabsContent>
        <TabsContent value="wallets">
          <WalletsCRUD />
        </TabsContent>
        <TabsContent value="walletTransactions">
          <WalletTransactionsCRUD />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
