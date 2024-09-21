import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Favorite {
  id: string;
  restaurant: {
    id: string;
    name: string;
    description: string;
  };
}

export function FavoritesCRUD() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState("");
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const res = await fetch("/api/favorites");
    if (res.ok) {
      const data = await res.json();
      setFavorites(data);
    } else {
      console.error("Failed to fetch favorites");
    }
  };

  const handleEdit = (favorite: Favorite) => {
    setEditingId(favorite.id);
    setRestaurantId(favorite.restaurant.id);
    // Note: We're assuming customerId is part of the Favorite object
    // setCustomerId(favorite.customerId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/favorites`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, restaurantId, customerId }),
    });

    if (res.ok) {
      const updatedFavorite = await res.json();
      setFavorites(favorites.map((f) => (f.id === id ? updatedFavorite : f)));
      setEditingId(null);
    } else {
      console.error("Failed to update favorite");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/favorites`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setFavorites(favorites.filter((f) => f.id !== id));
    } else {
      console.error("Failed to delete favorite");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, customerId }),
    });

    if (res.ok) {
      const newFavorite = await res.json();
      setFavorites([...favorites, newFavorite]);
      setRestaurantId("");
      setCustomerId("");
    } else {
      console.error("Failed to create favorite");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Favorites</h2>
      {favorites.map((favorite) => (
        <Card key={favorite.id} className="mb-4">
          <CardContent>
            {editingId === favorite.id ? (
              <>
                <Input
                  type="text"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="mb-2"
                  placeholder="Restaurant ID"
                />
                <Input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="mb-2"
                  placeholder="Customer ID"
                />
                <Button
                  onClick={() => handleSave(favorite.id)}
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
                <h3 className="text-lg font-semibold">
                  {favorite.restaurant.name}
                </h3>
                <p className="text-gray-600">
                  {favorite.restaurant.description}
                </p>
                <Button onClick={() => handleEdit(favorite)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(favorite.id)}
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
          <CardTitle>Create New Favorite</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mb-2"
            placeholder="Restaurant ID"
          />
          <Input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="mb-2"
            placeholder="Customer ID"
          />
          <Button onClick={handleCreate}>Create Favorite</Button>
        </CardContent>
      </Card>
    </div>
  );
}
