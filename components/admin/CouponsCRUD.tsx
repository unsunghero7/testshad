import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  expirationDate: string;
  restaurantId: string;
}

export function CouponsCRUD() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await fetch("/api/coupons");
    if (res.ok) {
      const data = await res.json();
      setCoupons(data);
    } else {
      console.error("Failed to fetch coupons");
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setCode(coupon.code);
    setDiscountPercentage(coupon.discountPercentage.toString());
    setExpirationDate(coupon.expirationDate);
    setRestaurantId(coupon.restaurantId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/coupons`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        code,
        discountPercentage: parseFloat(discountPercentage),
        expirationDate,
        restaurantId,
      }),
    });

    if (res.ok) {
      const updatedCoupon = await res.json();
      setCoupons(coupons.map((c) => (c.id === id ? updatedCoupon : c)));
      setEditingId(null);
    } else {
      console.error("Failed to update coupon");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/coupons`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setCoupons(coupons.filter((c) => c.id !== id));
    } else {
      console.error("Failed to delete coupon");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/coupons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        discountPercentage: parseFloat(discountPercentage),
        expirationDate,
        restaurantId,
      }),
    });

    if (res.ok) {
      const newCoupon = await res.json();
      setCoupons([...coupons, newCoupon]);
      setCode("");
      setDiscountPercentage("");
      setExpirationDate("");
      setRestaurantId("");
    } else {
      console.error("Failed to create coupon");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Coupons</h2>
      {coupons.map((coupon) => (
        <Card key={coupon.id} className="mb-4">
          <CardContent>
            {editingId === coupon.id ? (
              <>
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mb-2"
                  placeholder="Coupon Code"
                />
                <Input
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="mb-2"
                  placeholder="Discount Percentage"
                />
                <Input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="text"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="mb-2"
                  placeholder="Restaurant ID"
                />
                <Button onClick={() => handleSave(coupon.id)} className="mr-2">
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{coupon.code}</h3>
                <p className="text-gray-600">
                  Discount: {coupon.discountPercentage}%
                </p>
                <p className="text-gray-600">
                  Expires:{" "}
                  {new Date(coupon.expirationDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Restaurant ID: {coupon.restaurantId}
                </p>
                <Button onClick={() => handleEdit(coupon)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(coupon.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader>
          <CardTitle>Create New Coupon</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mb-2"
            placeholder="Coupon Code"
          />
          <Input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="mb-2"
            placeholder="Discount Percentage"
          />
          <Input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="mb-2"
          />
          <Input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mb-2"
            placeholder="Restaurant ID"
          />
          <Button onClick={handleCreate}>Create Coupon</Button>
        </CardContent>
      </Card>
    </div>
  );
}
