import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  restaurantId: string;
}

export function PromotionsCRUD() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    const res = await fetch("/api/promotions");
    if (res.ok) {
      const data = await res.json();
      setPromotions(data);
    } else {
      console.error("Failed to fetch promotions");
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingId(promotion.id);
    setTitle(promotion.title);
    setDescription(promotion.description);
    setDiscountPercentage(promotion.discountPercentage.toString());
    setStartDate(promotion.startDate);
    setEndDate(promotion.endDate);
    setRestaurantId(promotion.restaurantId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/promotions`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title,
        description,
        discountPercentage: parseFloat(discountPercentage),
        startDate,
        endDate,
        restaurantId,
      }),
    });

    if (res.ok) {
      const updatedPromotion = await res.json();
      setPromotions(
        promotions.map((p) => (p.id === id ? updatedPromotion : p))
      );
      setEditingId(null);
    } else {
      console.error("Failed to update promotion");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/promotions`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setPromotions(promotions.filter((p) => p.id !== id));
    } else {
      console.error("Failed to delete promotion");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/promotions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        discountPercentage: parseFloat(discountPercentage),
        startDate,
        endDate,
        restaurantId,
      }),
    });

    if (res.ok) {
      const newPromotion = await res.json();
      setPromotions([...promotions, newPromotion]);
      setTitle("");
      setDescription("");
      setDiscountPercentage("");
      setStartDate("");
      setEndDate("");
      setRestaurantId("");
    } else {
      console.error("Failed to create promotion");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Promotions</h2>
      {promotions.map((promotion) => (
        <Card key={promotion.id} className="mb-4">
          <CardContent>
            {editingId === promotion.id ? (
              <>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mb-2"
                  placeholder="Title"
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mb-2"
                  placeholder="Description"
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
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="text"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="mb-2"
                  placeholder="Restaurant ID"
                />
                <Button
                  onClick={() => handleSave(promotion.id)}
                  className="mr-2"
                >
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{promotion.title}</h3>
                <p className="text-gray-600">{promotion.description}</p>
                <p className="text-gray-600">
                  Discount: {promotion.discountPercentage}%
                </p>
                <p className="text-gray-600">
                  Start Date:{" "}
                  {new Date(promotion.startDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  End Date: {new Date(promotion.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Restaurant ID: {promotion.restaurantId}
                </p>
                <Button onClick={() => handleEdit(promotion)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(promotion.id)}
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
          <CardTitle>Create New Promotion</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2"
            placeholder="Title"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2"
            placeholder="Description"
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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mb-2"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mb-2"
          />
          <Input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mb-2"
            placeholder="Restaurant ID"
          />
          <Button onClick={handleCreate}>Create Promotion</Button>
        </CardContent>
      </Card>
    </div>
  );
}
