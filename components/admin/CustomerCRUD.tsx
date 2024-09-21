import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  loyaltyPoints: number;
}

export function CustomerCRUD() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch("/api/customers");
    if (res.ok) {
      const data = await res.json();
      setCustomers(data);
    } else {
      console.error("Failed to fetch customers");
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setName(customer.name);
    setEmail(customer.email);
    setPhoneNumber(customer.phoneNumber);
    setLoyaltyPoints(customer.loyaltyPoints.toString());
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/customers`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        email,
        phoneNumber,
        loyaltyPoints: parseInt(loyaltyPoints),
      }),
    });

    if (res.ok) {
      const updatedCustomer = await res.json();
      setCustomers(customers.map((c) => (c.id === id ? updatedCustomer : c)));
      setEditingId(null);
    } else {
      console.error("Failed to update customer");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/customers`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setCustomers(customers.filter((c) => c.id !== id));
    } else {
      console.error("Failed to delete customer");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phoneNumber,
        loyaltyPoints: parseInt(loyaltyPoints),
      }),
    });

    if (res.ok) {
      const newCustomer = await res.json();
      setCustomers([...customers, newCustomer]);
      setName("");
      setEmail("");
      setPhoneNumber("");
      setLoyaltyPoints("");
    } else {
      console.error("Failed to create customer");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Customers</h2>
      {customers.map((customer) => (
        <Card key={customer.id} className="mb-4">
          <CardContent>
            {editingId === customer.id ? (
              <>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-2"
                  placeholder="Name"
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-2"
                  placeholder="Email"
                />
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mb-2"
                  placeholder="Phone Number"
                />
                <Input
                  type="number"
                  value={loyaltyPoints}
                  onChange={(e) => setLoyaltyPoints(e.target.value)}
                  className="mb-2"
                  placeholder="Loyalty Points"
                />
                <Button
                  onClick={() => handleSave(customer.id)}
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
                <h3 className="text-lg font-semibold">{customer.name}</h3>
                <p className="text-gray-600">Email: {customer.email}</p>
                <p className="text-gray-600">Phone: {customer.phoneNumber}</p>
                <p className="text-gray-600">
                  Loyalty Points: {customer.loyaltyPoints}
                </p>
                <Button onClick={() => handleEdit(customer)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(customer.id)}
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
          <CardTitle>Create New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2"
            placeholder="Name"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2"
            placeholder="Email"
          />
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mb-2"
            placeholder="Phone Number"
          />
          <Input
            type="number"
            value={loyaltyPoints}
            onChange={(e) => setLoyaltyPoints(e.target.value)}
            className="mb-2"
            placeholder="Loyalty Points"
          />
          <Button onClick={handleCreate}>Create Customer</Button>
        </CardContent>
      </Card>
    </div>
  );
}
