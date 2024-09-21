import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Wallet {
  id: string;
  userId: string;
  balance: number;
}

export function WalletsCRUD() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    const res = await fetch("/api/wallets");
    if (res.ok) {
      const data = await res.json();
      setWallets(data);
    } else {
      console.error("Failed to fetch wallets");
    }
  };

  const handleEdit = (wallet: Wallet) => {
    setEditingId(wallet.id);
    setUserId(wallet.userId);
    setBalance(wallet.balance.toString());
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/wallets`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId, balance: parseFloat(balance) }),
    });

    if (res.ok) {
      const updatedWallet = await res.json();
      setWallets(wallets.map((w) => (w.id === id ? updatedWallet : w)));
      setEditingId(null);
    } else {
      console.error("Failed to update wallet");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/wallets`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setWallets(wallets.filter((w) => w.id !== id));
    } else {
      console.error("Failed to delete wallet");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/wallets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, balance: parseFloat(balance) }),
    });

    if (res.ok) {
      const newWallet = await res.json();
      setWallets([...wallets, newWallet]);
      setUserId("");
      setBalance("");
    } else {
      console.error("Failed to create wallet");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Wallets</h2>
      {wallets.map((wallet) => (
        <Card key={wallet.id} className="mb-4">
          <CardContent>
            {editingId === wallet.id ? (
              <>
                <Input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="mb-2"
                  placeholder="User ID"
                />
                <Input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="mb-2"
                  placeholder="Balance"
                />
                <Button onClick={() => handleSave(wallet.id)} className="mr-2">
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">
                  Wallet ID: {wallet.id}
                </h3>
                <p className="text-gray-600">User ID: {wallet.userId}</p>
                <p className="text-gray-600">
                  Balance: ${wallet.balance.toFixed(2)}
                </p>
                <Button onClick={() => handleEdit(wallet)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(wallet.id)}
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
          <CardTitle>Create New Wallet</CardTitle>
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
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="mb-2"
            placeholder="Balance"
          />
          <Button onClick={handleCreate}>Create Wallet</Button>
        </CardContent>
      </Card>
    </div>
  );
}
