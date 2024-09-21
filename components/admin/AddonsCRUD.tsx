import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Addon {
  id: string;
  name: string;
  price: number;
  restaurantId: string;
}

export function AddonsCRUD() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    const res = await fetch("/api/addons");
    if (res.ok) {
      const data = await res.json();
      setAddons(data);
    } else {
      console.error("Failed to fetch addons");
    }
  };

  const handleEdit = (addon: Addon) => {
    setEditingId(addon.id);
    setName(addon.name);
    setPrice(addon.price.toString());
    setRestaurantId(addon.restaurantId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/addons`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        price: parseFloat(price),
        restaurantId,
      }),
    });

    if (res.ok) {
      const updatedAddon = await res.json();
      setAddons(addons.map((a) => (a.id === id ? updatedAddon : a)));
      setEditingId(null);
    } else {
      console.error("Failed to update addon");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/addons`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setAddons(addons.filter((a) => a.id !== id));
    } else {
      console.error("Failed to delete addon");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/addons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: parseFloat(price), restaurantId }),
    });

    if (res.ok) {
      const newAddon = await res.json();
      setAddons([...addons, newAddon]);
      setName("");
      setPrice("");
      setRestaurantId("");
    } else {
      console.error("Failed to create addon");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Addons</h2>
      {addons.map((addon) => (
        <Card key={addon.id} className="mb-4">
          <CardContent>
            {editingId === addon.id ? (
              <>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-2"
                  placeholder="Addon Name"
                />
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mb-2"
                  placeholder="Price"
                />
                <Input
                  type="text"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="mb-2"
                  placeholder="Restaurant ID"
                />
                <Button onClick={() => handleSave(addon.id)} className="mr-2">
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{addon.name}</h3>
                <p className="text-gray-600">Price: ${addon.price}</p>
                <p className="text-gray-600">
                  Restaurant ID: {addon.restaurantId}
                </p>
                <Button onClick={() => handleEdit(addon)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(addon.id)}
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
          <CardTitle>Create New Addon</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2"
            placeholder="Addon Name"
          />
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mb-2"
            placeholder="Price"
          />
          <Input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mb-2"
            placeholder="Restaurant ID"
          />
          <Button onClick={handleCreate}>Create Addon</Button>
        </CardContent>
      </Card>
    </div>
  );
}
