import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MenuItemAddon {
  id: string;
  menuItemId: string;
  addonId: string;
}

export function MenuItemAddonsCRUD() {
  const [menuItemAddons, setMenuItemAddons] = useState<MenuItemAddon[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuItemId, setMenuItemId] = useState("");
  const [addonId, setAddonId] = useState("");

  useEffect(() => {
    fetchMenuItemAddons();
  }, []);

  const fetchMenuItemAddons = async () => {
    const res = await fetch("/api/menuItemAddons");
    if (res.ok) {
      const data = await res.json();
      setMenuItemAddons(data);
    } else {
      console.error("Failed to fetch menu item addons");
    }
  };

  const handleEdit = (menuItemAddon: MenuItemAddon) => {
    setEditingId(menuItemAddon.id);
    setMenuItemId(menuItemAddon.menuItemId);
    setAddonId(menuItemAddon.addonId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/menuItemAddons`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, menuItemId, addonId }),
    });

    if (res.ok) {
      const updatedMenuItemAddon = await res.json();
      setMenuItemAddons(
        menuItemAddons.map((mia) =>
          mia.id === id ? updatedMenuItemAddon : mia
        )
      );
      setEditingId(null);
    } else {
      console.error("Failed to update menu item addon");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/menuItemAddons`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setMenuItemAddons(menuItemAddons.filter((mia) => mia.id !== id));
    } else {
      console.error("Failed to delete menu item addon");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/menuItemAddons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, addonId }),
    });

    if (res.ok) {
      const newMenuItemAddon = await res.json();
      setMenuItemAddons([...menuItemAddons, newMenuItemAddon]);
      setMenuItemId("");
      setAddonId("");
    } else {
      console.error("Failed to create menu item addon");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Menu Item Addons</h2>
      {menuItemAddons.map((menuItemAddon) => (
        <Card key={menuItemAddon.id} className="mb-4">
          <CardContent>
            {editingId === menuItemAddon.id ? (
              <>
                <Input
                  type="text"
                  value={menuItemId}
                  onChange={(e) => setMenuItemId(e.target.value)}
                  className="mb-2"
                  placeholder="Menu Item ID"
                />
                <Input
                  type="text"
                  value={addonId}
                  onChange={(e) => setAddonId(e.target.value)}
                  className="mb-2"
                  placeholder="Addon ID"
                />
                <Button
                  onClick={() => handleSave(menuItemAddon.id)}
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
                  Menu Item Addon ID: {menuItemAddon.id}
                </h3>
                <p className="text-gray-600">
                  Menu Item ID: {menuItemAddon.menuItemId}
                </p>
                <p className="text-gray-600">
                  Addon ID: {menuItemAddon.addonId}
                </p>
                <Button
                  onClick={() => handleEdit(menuItemAddon)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(menuItemAddon.id)}
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
          <CardTitle>Create New Menu Item Addon</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={menuItemId}
            onChange={(e) => setMenuItemId(e.target.value)}
            className="mb-2"
            placeholder="Menu Item ID"
          />
          <Input
            type="text"
            value={addonId}
            onChange={(e) => setAddonId(e.target.value)}
            className="mb-2"
            placeholder="Addon ID"
          />
          <Button onClick={handleCreate}>Create Menu Item Addon</Button>
        </CardContent>
      </Card>
    </div>
  );
}
