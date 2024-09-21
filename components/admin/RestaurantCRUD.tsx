import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
}

export function RestaurantCRUD() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch("/api/restaurant");
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      } else {
        throw new Error("Failed to fetch restaurants");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setName(restaurant.name);
    setSlug(restaurant.slug);
    setDescription(restaurant.description);
    setLogo(restaurant.logo);
  };

  const handleSave = async (id: string) => {
    try {
      const res = await fetch(`/api/restaurant`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, slug, description, logo }),
      });

      if (res.ok) {
        const updatedRestaurant = await res.json();
        setRestaurants(
          restaurants.map((r) => (r.id === id ? updatedRestaurant : r))
        );
        setEditingId(null);
      } else {
        throw new Error("Failed to update restaurant");
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/restaurant`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setRestaurants(restaurants.filter((r) => r.id !== id));
      } else {
        throw new Error("Failed to delete restaurant");
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(`/api/restaurant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description, logo }),
      });

      if (res.ok) {
        const newRestaurant = await res.json();
        setRestaurants([...restaurants, newRestaurant]);
        resetForm();
      } else {
        throw new Error("Failed to create restaurant");
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setLogo("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Restaurants</h2>
      {restaurants.map((restaurant) => (
        <Card key={restaurant.id} className="mb-4">
          <CardContent>
            {editingId === restaurant.id ? (
              <>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-2"
                  placeholder="Restaurant Name"
                />
                <Input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mb-2"
                  placeholder="Slug"
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mb-2"
                  placeholder="Description"
                />
                <Input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="mb-2"
                  placeholder="Logo URL"
                />
                <Button
                  onClick={() => handleSave(restaurant.id)}
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
                <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                <p className="text-gray-600">Slug: {restaurant.slug}</p>
                <p className="text-gray-600">
                  Description: {restaurant.description}
                </p>
                <p className="text-gray-600">Logo: {restaurant.logo}</p>
                <Button
                  onClick={() => handleEdit(restaurant)}
                  className="mr-2 mt-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(restaurant.id)}
                  variant="destructive"
                  className="mt-2"
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
          <CardTitle>Create New Restaurant</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2"
            placeholder="Restaurant Name"
          />
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mb-2"
            placeholder="Slug"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2"
            placeholder="Description"
          />
          <Input
            type="text"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="mb-2"
            placeholder="Logo URL"
          />
          <Button onClick={handleCreate}>Create Restaurant</Button>
        </CardContent>
      </Card>
    </div>
  );
}
