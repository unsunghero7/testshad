import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BranchManager {
  id: string;
  userId: string;
  branchId: string;
}

export function BranchManagersCRUD() {
  const [branchManagers, setBranchManagers] = useState<BranchManager[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [branchId, setBranchId] = useState("");

  useEffect(() => {
    fetchBranchManagers();
  }, []);

  const fetchBranchManagers = async () => {
    const res = await fetch("/api/branchManagers");
    if (res.ok) {
      const data = await res.json();
      setBranchManagers(data);
    } else {
      console.error("Failed to fetch branch managers");
    }
  };

  const handleEdit = (branchManager: BranchManager) => {
    setEditingId(branchManager.id);
    setUserId(branchManager.userId);
    setBranchId(branchManager.branchId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/branchManagers`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId, branchId }),
    });

    if (res.ok) {
      const updatedBranchManager = await res.json();
      setBranchManagers(
        branchManagers.map((bm) => (bm.id === id ? updatedBranchManager : bm))
      );
      setEditingId(null);
    } else {
      console.error("Failed to update branch manager");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/branchManagers`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setBranchManagers(branchManagers.filter((bm) => bm.id !== id));
    } else {
      console.error("Failed to delete branch manager");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/branchManagers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, branchId }),
    });

    if (res.ok) {
      const newBranchManager = await res.json();
      setBranchManagers([...branchManagers, newBranchManager]);
      setUserId("");
      setBranchId("");
    } else {
      console.error("Failed to create branch manager");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Branch Managers</h2>
      {branchManagers.map((branchManager) => (
        <Card key={branchManager.id} className="mb-4">
          <CardContent>
            {editingId === branchManager.id ? (
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
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="mb-2"
                  placeholder="Branch ID"
                />
                <Button
                  onClick={() => handleSave(branchManager.id)}
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
                  Branch Manager ID: {branchManager.id}
                </h3>
                <p className="text-gray-600">User ID: {branchManager.userId}</p>
                <p className="text-gray-600">
                  Branch ID: {branchManager.branchId}
                </p>
                <Button
                  onClick={() => handleEdit(branchManager)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(branchManager.id)}
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
          <CardTitle>Create New Branch Manager</CardTitle>
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
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="mb-2"
            placeholder="Branch ID"
          />
          <Button onClick={handleCreate}>Create Branch Manager</Button>
        </CardContent>
      </Card>
    </div>
  );
}
