import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export function OrdersCRUD() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [status, setStatus] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    if (res.ok) {
      const data = await res.json();
      setOrders(data);
    } else {
      console.error("Failed to fetch orders");
    }
  };

  const handleEdit = (order: Order) => {
    setEditingId(order.id);
    setCustomerId(order.customerId);
    setRestaurantId(order.restaurantId);
    setStatus(order.status);
    setTotalAmount(order.totalAmount.toString());
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/orders`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        customerId,
        restaurantId,
        status,
        totalAmount: parseFloat(totalAmount),
      }),
    });

    if (res.ok) {
      const updatedOrder = await res.json();
      setOrders(orders.map((o) => (o.id === id ? updatedOrder : o)));
      setEditingId(null);
    } else {
      console.error("Failed to update order");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/orders`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setOrders(orders.filter((o) => o.id !== id));
    } else {
      console.error("Failed to delete order");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        restaurantId,
        status,
        totalAmount: parseFloat(totalAmount),
      }),
    });

    if (res.ok) {
      const newOrder = await res.json();
      setOrders([...orders, newOrder]);
      setCustomerId("");
      setRestaurantId("");
      setStatus("");
      setTotalAmount("");
    } else {
      console.error("Failed to create order");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Orders</h2>
      {orders.map((order) => (
        <Card key={order.id} className="mb-4">
          <CardContent>
            {editingId === order.id ? (
              <>
                <Input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="mb-2"
                  placeholder="Customer ID"
                />
                <Input
                  type="text"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="mb-2"
                  placeholder="Restaurant ID"
                />
                <Input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mb-2"
                  placeholder="Status"
                />
                <Input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="mb-2"
                  placeholder="Total Amount"
                />
                <Button onClick={() => handleSave(order.id)} className="mr-2">
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
                <p className="text-gray-600">Customer ID: {order.customerId}</p>
                <p className="text-gray-600">
                  Restaurant ID: {order.restaurantId}
                </p>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">
                  Total Amount: ${order.totalAmount}
                </p>
                <p className="text-gray-600">
                  Created At: {new Date(order.createdAt).toLocaleString()}
                </p>
                <Button onClick={() => handleEdit(order)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(order.id)}
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
          <CardTitle>Create New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="mb-2"
            placeholder="Customer ID"
          />
          <Input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mb-2"
            placeholder="Restaurant ID"
          />
          <Input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mb-2"
            placeholder="Status"
          />
          <Input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="mb-2"
            placeholder="Total Amount"
          />
          <Button onClick={handleCreate}>Create Order</Button>
        </CardContent>
      </Card>
    </div>
  );
}
