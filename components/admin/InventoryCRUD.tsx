import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface InventoryItem {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  branchId: string;
}

export function InventoryCRUD() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [branchId, setBranchId] = useState("");

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    const res = await fetch("/api/inventory");
    if (res.ok) {
      const data = await res.json();
      setInventoryItems(data);
    } else {
      console.error("Failed to fetch inventory items");
    }
  };

  const handleEdit = (inventoryItem: InventoryItem) => {
    setEditingId(inventoryItem.id);
    setItem(inventoryItem.item);
    setQuantity(inventoryItem.quantity.toString());
    setUnit(inventoryItem.unit);
    setBranchId(inventoryItem.branchId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/inventory`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        item,
        quantity: parseFloat(quantity),
        unit,
        branchId,
      }),
    });

    if (res.ok) {
      const updatedInventoryItem = await res.json();
      setInventoryItems(
        inventoryItems.map((i) => (i.id === id ? updatedInventoryItem : i))
      );
      setEditingId(null);
    } else {
      console.error("Failed to update inventory item");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/inventory`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setInventoryItems(inventoryItems.filter((i) => i.id !== id));
    } else {
      console.error("Failed to delete inventory item");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item,
        quantity: parseFloat(quantity),
        unit,
        branchId,
      }),
    });

    if (res.ok) {
      const newInventoryItem = await res.json();
      setInventoryItems([...inventoryItems, newInventoryItem]);
      setItem("");
      setQuantity("");
      setUnit("");
      setBranchId("");
    } else {
      console.error("Failed to create inventory item");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Inventory</h2>
      {inventoryItems.map((inventoryItem) => (
        <Card key={inventoryItem.id} className="mb-4">
          <CardContent>
            {editingId === inventoryItem.id ? (
              <>
                <Input
                  type="text"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="mb-2"
                  placeholder="Item Name"
                />
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mb-2"
                  placeholder="Quantity"
                />
                <Input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="mb-2"
                  placeholder="Unit"
                />
                <Input
                  type="text"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="mb-2"
                  placeholder="Branch ID"
                />
                <Button
                  onClick={() => handleSave(inventoryItem.id)}
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
                <h3 className="text-lg font-semibold">{inventoryItem.item}</h3>
                <p className="text-gray-600">
                  Quantity: {inventoryItem.quantity} {inventoryItem.unit}
                </p>
                <p className="text-gray-600">
                  Branch ID: {inventoryItem.branchId}
                </p>
                <Button
                  onClick={() => handleEdit(inventoryItem)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(inventoryItem.id)}
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
          <CardTitle>Create New Inventory Item</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="mb-2"
            placeholder="Item Name"
          />
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mb-2"
            placeholder="Quantity"
          />
          <Input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="mb-2"
            placeholder="Unit"
          />
          <Input
            type="text"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="mb-2"
            placeholder="Branch ID"
          />
          <Button onClick={handleCreate}>Create Inventory Item</Button>
        </CardContent>
      </Card>
    </div>
  );
}
