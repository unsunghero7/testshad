import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  restaurantId: string;
}

export function MenuItemsCRUD() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const res = await fetch("/api/menuItems");
    if (res.ok) {
      const data = await res.json();
      setMenuItems(data);
    } else {
      console.error("Failed to fetch menu items");
    }
  };

  const handleEdit = (menuItem: MenuItem) => {
    setEditingId(menuItem.id);
    setName(menuItem.name);
    setDescription(menuItem.description);
    setPrice(menuItem.price.toString());
    setCategory(menuItem.category);
    setImage(menuItem.image);
    setRestaurantId(menuItem.restaurantId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/menuItems`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        description,
        price: parseFloat(price),
        category,
        image,
        restaurantId,
      }),
    });

    if (res.ok) {
      const updatedMenuItem = await res.json();
      setMenuItems(
        menuItems.map((mi) => (mi.id === id ? updatedMenuItem : mi))
      );
      setEditingId(null);
    } else {
      console.error("Failed to update menu item");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/menuItems`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setMenuItems(menuItems.filter((mi) => mi.id !== id));
    } else {
      console.error("Failed to delete menu item");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/menuItems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        category,
        image,
        restaurantId,
      }),
    });

    if (res.ok) {
      const newMenuItem = await res.json();
      setMenuItems([...menuItems, newMenuItem]);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage("");
      setRestaurantId("");
    } else {
      console.error("Failed to create menu item");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Menu Items</h2>
      {menuItems.map((menuItem) => (
        <Card key={menuItem.id} className="mb-4">
          <CardContent>
            {editingId === menuItem.id ? (
              <>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-2"
                  placeholder="Name"
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mb-2"
                  placeholder="Description"
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mb-2"
                  placeholder="Category"
                />
                <Input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="mb-2"
                  placeholder="Image URL"
                />
                <Input
                  type="text"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="mb-2"
                  placeholder="Restaurant ID"
                />
                <Button
                  onClick={() => handleSave(menuItem.id)}
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
                <h3 className="text-lg font-semibold">{menuItem.name}</h3>
                <p className="text-gray-600">{menuItem.description}</p>
                <p className="text-gray-600">Price: ${menuItem.price}</p>
                <p className="text-gray-600">Category: {menuItem.category}</p>
                <p className="text-gray-600">
                  Restaurant ID: {menuItem.restaurantId}
                </p>
                <Button onClick={() => handleEdit(menuItem)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(menuItem.id)}
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
          <CardTitle>Create New Menu Item</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2"
            placeholder="Name"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2"
            placeholder="Description"
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mb-2"
            placeholder="Category"
          />
          <Input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mb-2"
            placeholder="Image URL"
          />
          <Input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mb-2"
            placeholder="Restaurant ID"
          />
          <Button onClick={handleCreate}>Create Menu Item</Button>
        </CardContent>
      </Card>
    </div>
  );
}
