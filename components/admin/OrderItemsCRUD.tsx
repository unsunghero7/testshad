import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
}

export function OrderItemsCRUD() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState("");
  const [menuItemId, setMenuItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchOrderItems();
  }, []);

  const fetchOrderItems = async () => {
    const res = await fetch("/api/orderItems");
    if (res.ok) {
      const data = await res.json();
      setOrderItems(data);
    } else {
      console.error("Failed to fetch order items");
    }
  };

  const handleEdit = (orderItem: OrderItem) => {
    setEditingId(orderItem.id);
    setOrderId(orderItem.orderId);
    setMenuItemId(orderItem.menuItemId);
    setQuantity(orderItem.quantity.toString());
    setPrice(orderItem.price.toString());
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/orderItems`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        orderId,
        menuItemId,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      }),
    });

    if (res.ok) {
      const updatedOrderItem = await res.json();
      setOrderItems(
        orderItems.map((oi) => (oi.id === id ? updatedOrderItem : oi))
      );
      setEditingId(null);
    } else {
      console.error("Failed to update order item");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/orderItems`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setOrderItems(orderItems.filter((oi) => oi.id !== id));
    } else {
      console.error("Failed to delete order item");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/orderItems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        menuItemId,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      }),
    });

    if (res.ok) {
      const newOrderItem = await res.json();
      setOrderItems([...orderItems, newOrderItem]);
      setOrderId("");
      setMenuItemId("");
      setQuantity("");
      setPrice("");
    } else {
      console.error("Failed to create order item");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Order Items</h2>
      {orderItems.map((orderItem) => (
        <Card key={orderItem.id} className="mb-4">
          <CardContent>
            {editingId === orderItem.id ? (
              <>
                <Input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="mb-2"
                  placeholder="Order ID"
                />
                <Input
                  type="text"
                  value={menuItemId}
                  onChange={(e) => setMenuItemId(e.target.value)}
                  className="mb-2"
                  placeholder="Menu Item ID"
                />
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mb-2"
                  placeholder="Quantity"
                />
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mb-2"
                  placeholder="Price"
                />
                <Button
                  onClick={() => handleSave(orderItem.id)}
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
                  Order Item ID: {orderItem.id}
                </h3>
                <p className="text-gray-600">Order ID: {orderItem.orderId}</p>
                <p className="text-gray-600">
                  Menu Item ID: {orderItem.menuItemId}
                </p>
                <p className="text-gray-600">Quantity: {orderItem.quantity}</p>
                <p className="text-gray-600">Price: ${orderItem.price}</p>
                <Button onClick={() => handleEdit(orderItem)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(orderItem.id)}
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
          <CardTitle>Create New Order Item</CardTitle>
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
            type="text"
            value={menuItemId}
            onChange={(e) => setMenuItemId(e.target.value)}
            className="mb-2"
            placeholder="Menu Item ID"
          />
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mb-2"
            placeholder="Quantity"
          />
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mb-2"
            placeholder="Price"
          />
          <Button onClick={handleCreate}>Create Order Item</Button>
        </CardContent>
      </Card>
    </div>
  );
}
