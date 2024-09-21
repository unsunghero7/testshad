import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  description: string;
  createdAt: string;
}

export function WalletTransactionsCRUD() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/walletTransactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      } else {
        throw new Error("Failed to fetch wallet transactions");
      }
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
    }
  };

  const handleEdit = (transaction: WalletTransaction) => {
    setEditingId(transaction.id);
    setWalletId(transaction.walletId);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setDescription(transaction.description);
  };

  const handleSave = async (id: string) => {
    try {
      const res = await fetch(`/api/walletTransactions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          walletId,
          amount: parseFloat(amount),
          type,
          description,
        }),
      });

      if (res.ok) {
        const updatedTransaction = await res.json();
        setTransactions(
          transactions.map((t) => (t.id === id ? updatedTransaction : t))
        );
        setEditingId(null);
      } else {
        throw new Error("Failed to update wallet transaction");
      }
    } catch (error) {
      console.error("Error updating wallet transaction:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/walletTransactions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setTransactions(transactions.filter((t) => t.id !== id));
      } else {
        throw new Error("Failed to delete wallet transaction");
      }
    } catch (error) {
      console.error("Error deleting wallet transaction:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(`/api/walletTransactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletId,
          amount: parseFloat(amount),
          type,
          description,
        }),
      });

      if (res.ok) {
        const newTransaction = await res.json();
        setTransactions([...transactions, newTransaction]);
        resetForm();
      } else {
        throw new Error("Failed to create wallet transaction");
      }
    } catch (error) {
      console.error("Error creating wallet transaction:", error);
    }
  };

  const resetForm = () => {
    setWalletId("");
    setAmount("");
    setType("CREDIT");
    setDescription("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Wallet Transactions</h2>
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="mb-4">
          <CardContent>
            {editingId === transaction.id ? (
              <>
                <Input
                  type="text"
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="mb-2"
                  placeholder="Wallet ID"
                />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mb-2"
                  placeholder="Amount"
                />
                <Select
                  value={type}
                  onValueChange={(value) =>
                    setType(value as "CREDIT" | "DEBIT")
                  }
                >
                  <SelectTrigger className="mb-2">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREDIT">Credit</SelectItem>
                    <SelectItem value="DEBIT">Debit</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mb-2"
                  placeholder="Description"
                />
                <Button
                  onClick={() => handleSave(transaction.id)}
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
                  Transaction ID: {transaction.id}
                </h3>
                <p className="text-gray-600">
                  Wallet ID: {transaction.walletId}
                </p>
                <p className="text-gray-600">
                  Amount: ${transaction.amount.toFixed(2)}
                </p>
                <p className="text-gray-600">Type: {transaction.type}</p>
                <p className="text-gray-600">
                  Description: {transaction.description}
                </p>
                <p className="text-gray-600">
                  Created At: {new Date(transaction.createdAt).toLocaleString()}
                </p>
                <Button
                  onClick={() => handleEdit(transaction)}
                  className="mr-2 mt-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(transaction.id)}
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
          <CardTitle>Create New Wallet Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            className="mb-2"
            placeholder="Wallet ID"
          />
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-2"
            placeholder="Amount"
          />
          <Select
            value={type}
            onValueChange={(value) => setType(value as "CREDIT" | "DEBIT")}
          >
            <SelectTrigger className="mb-2">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CREDIT">Credit</SelectItem>
              <SelectItem value="DEBIT">Debit</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2"
            placeholder="Description"
          />
          <Button onClick={handleCreate}>Create Wallet Transaction</Button>
        </CardContent>
      </Card>
    </div>
  );
}
