import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Branch {
  id: string;
  name: string;
  address: string;
  contactPhone: string;
  restaurantId: string;
}

export function BranchesCRUD() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const res = await fetch("/api/branches");
    if (res.ok) {
      const data = await res.json();
      setBranches(data);
    } else {
      console.error("Failed to fetch branches");
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingId(branch.id);
    setName(branch.name);
    setAddress(branch.address);
    setContactPhone(branch.contactPhone);
    setRestaurantId(branch.restaurantId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/branches`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, address, contactPhone, restaurantId }),
    });

    if (res.ok) {
      const updatedBranch = await res.json();
      setBranches(branches.map((b) => (b.id === id ? updatedBranch : b)));
      setEditingId(null);
    } else {
      console.error("Failed to update branch");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/branches`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setBranches(branches.filter((b) => b.id !== id));
    } else {
      console.error("Failed to delete branch");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/branches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address, contactPhone, restaurantId }),
    });

    if (res.ok) {
      const newBranch = await res.json();
      setBranches([...branches, newBranch]);
      setName("");
      setAddress("");
      setContactPhone("");
      setRestaurantId("");
    } else {
      console.error("Failed to create branch");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Branches</h2>
      {branches.map((branch) => (
        <Card key={branch.id} className="mb-4">
          <CardContent>
            {editingId === branch.id ? (
              <>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-2"
                  placeholder="Branch Name"
                />
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mb-2"
                  placeholder="Address"
                />
                <Input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="mb-2"
                  placeholder="Contact Phone"
                />
                <Input
                  type="text"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="mb-2"
                  placeholder="Restaurant ID"
                />
                <Button onClick={() => handleSave(branch.id)} className="mr-2">
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{branch.name}</h3>
                <p className="text-gray-600">Address: {branch.address}</p>
                <p className="text-gray-600">Contact: {branch.contactPhone}</p>
                <p className="text-gray-600">
                  Restaurant ID: {branch.restaurantId}
                </p>
                <Button onClick={() => handleEdit(branch)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(branch.id)}
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
          <CardTitle>Create New Branch</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2"
            placeholder="Branch Name"
          />
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mb-2"
            placeholder="Address"
          />
          <Input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="mb-2"
            placeholder="Contact Phone"
          />
          <Input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mb-2"
            placeholder="Restaurant ID"
          />
          <Button onClick={handleCreate}>Create Branch</Button>
        </CardContent>
      </Card>
    </div>
  );
}
