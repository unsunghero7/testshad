import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RestaurantAdmin {
  id: string;
  userId: string;
  restaurantId: string;
}

export function RestaurantAdminsCRUD() {
  const [restaurantAdmins, setRestaurantAdmins] = useState<RestaurantAdmin[]>(
    []
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    fetchRestaurantAdmins();
  }, []);

  const fetchRestaurantAdmins = async () => {
    const res = await fetch("/api/restaurantAdmins");
    if (res.ok) {
      const data = await res.json();
      setRestaurantAdmins(data);
    } else {
      console.error("Failed to fetch restaurant admins");
    }
  };

  const handleEdit = (admin: RestaurantAdmin) => {
    setEditingId(admin.id);
    setUserId(admin.userId);
    setRestaurantId(admin.restaurantId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/restaurantAdmins`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId, restaurantId }),
    });

    if (res.ok) {
      const updatedAdmin = await res.json();
      setRestaurantAdmins(
        restaurantAdmins.map((a) => (a.id === id ? updatedAdmin : a))
      );
      setEditingId(null);
    } else {
      console.error("Failed to update restaurant admin");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/restaurantAdmins`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setRestaurantAdmins(restaurantAdmins.filter((a) => a.id !== id));
    } else {
      console.error("Failed to delete restaurant admin");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/restaurantAdmins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, restaurantId }),
    });

    if (res.ok) {
      const newAdmin = await res.json();
      setRestaurantAdmins([...restaurantAdmins, newAdmin]);
      setUserId("");
      setRestaurantId("");
    } else {
      console.error("Failed to create restaurant admin");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Restaurant Admins</h2>
      {restaurantAdmins.map((admin) => (
        <Card key={admin.id} className="mb-4">
          <CardContent>
            {editingId === admin.id ? (
              <>
                <Input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="mb-2"
                  placeholder="User ID"
                />
                <Input
                  type="text"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="mb-2"
                  placeholder="Restaurant ID"
                />
                <Button onClick={() => handleSave(admin.id)} className="mr-2">
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">Admin ID: {admin.id}</h3>
                <p className="text-gray-600">User ID: {admin.userId}</p>
                <p className="text-gray-600">
                  Restaurant ID: {admin.restaurantId}
                </p>
                <Button onClick={() => handleEdit(admin)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(admin.id)}
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
          <CardTitle>Create New Restaurant Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mb-2"
            placeholder="User ID"
          />
          <Input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mb-2"
            placeholder="Restaurant ID"
          />
          <Button onClick={handleCreate}>Create Restaurant Admin</Button>
        </CardContent>
      </Card>
    </div>
  );
}
