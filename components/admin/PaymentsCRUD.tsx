import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export function PaymentsCRUD() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const res = await fetch("/api/payments");
    if (res.ok) {
      const data = await res.json();
      setPayments(data);
    } else {
      console.error("Failed to fetch payments");
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingId(payment.id);
    setOrderId(payment.orderId);
    setAmount(payment.amount.toString());
    setPaymentMethod(payment.paymentMethod);
    setStatus(payment.status);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/payments`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        orderId,
        amount: parseFloat(amount),
        paymentMethod,
        status,
      }),
    });

    if (res.ok) {
      const updatedPayment = await res.json();
      setPayments(payments.map((p) => (p.id === id ? updatedPayment : p)));
      setEditingId(null);
    } else {
      console.error("Failed to update payment");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/payments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setPayments(payments.filter((p) => p.id !== id));
    } else {
      console.error("Failed to delete payment");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        amount: parseFloat(amount),
        paymentMethod,
        status,
      }),
    });

    if (res.ok) {
      const newPayment = await res.json();
      setPayments([...payments, newPayment]);
      setOrderId("");
      setAmount("");
      setPaymentMethod("");
      setStatus("");
    } else {
      console.error("Failed to create payment");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Payments</h2>
      {payments.map((payment) => (
        <Card key={payment.id} className="mb-4">
          <CardContent>
            {editingId === payment.id ? (
              <>
                <Input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="mb-2"
                  placeholder="Order ID"
                />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mb-2"
                  placeholder="Amount"
                />
                <Input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mb-2"
                  placeholder="Payment Method"
                />
                <Input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mb-2"
                  placeholder="Status"
                />
                <Button onClick={() => handleSave(payment.id)} className="mr-2">
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">
                  Payment ID: {payment.id}
                </h3>
                <p className="text-gray-600">Order ID: {payment.orderId}</p>
                <p className="text-gray-600">Amount: ${payment.amount}</p>
                <p className="text-gray-600">
                  Payment Method: {payment.paymentMethod}
                </p>
                <p className="text-gray-600">Status: {payment.status}</p>
                <p className="text-gray-600">
                  Created At: {new Date(payment.createdAt).toLocaleString()}
                </p>
                <Button onClick={() => handleEdit(payment)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(payment.id)}
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
          <CardTitle>Create New Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="mb-2"
            placeholder="Order ID"
          />
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-2"
            placeholder="Amount"
          />
          <Input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mb-2"
            placeholder="Payment Method"
          />
          <Input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mb-2"
            placeholder="Status"
          />
          <Button onClick={handleCreate}>Create Payment</Button>
        </CardContent>
      </Card>
    </div>
  );
}
