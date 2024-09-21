import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  customerId: string;
}

export function AddressesCRUD() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const res = await fetch("/api/addresses");
    if (res.ok) {
      const data = await res.json();
      setAddresses(data);
    } else {
      console.error("Failed to fetch addresses");
    }
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setStreet(address.street);
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postalCode);
    setCustomerId(address.customerId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/addresses`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, street, city, state, postalCode, customerId }),
    });

    if (res.ok) {
      const updatedAddress = await res.json();
      setAddresses(addresses.map((a) => (a.id === id ? updatedAddress : a)));
      setEditingId(null);
    } else {
      console.error("Failed to update address");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/addresses`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setAddresses(addresses.filter((a) => a.id !== id));
    } else {
      console.error("Failed to delete address");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ street, city, state, postalCode, customerId }),
    });

    if (res.ok) {
      const newAddress = await res.json();
      setAddresses([...addresses, newAddress]);
      setStreet("");
      setCity("");
      setState("");
      setPostalCode("");
      setCustomerId("");
    } else {
      console.error("Failed to create address");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Addresses</h2>
      {addresses.map((address) => (
        <Card key={address.id} className="mb-4">
          <CardContent>
            {editingId === address.id ? (
              <>
                <Input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="mb-2"
                  placeholder="Street"
                />
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mb-2"
                  placeholder="City"
                />
                <Input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mb-2"
                  placeholder="State"
                />
                <Input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="mb-2"
                  placeholder="Postal Code"
                />
                <Input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="mb-2"
                  placeholder="Customer ID"
                />
                <Button onClick={() => handleSave(address.id)} className="mr-2">
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{address.street}</h3>
                <p className="text-gray-600">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-gray-600">
                  Customer ID: {address.customerId}
                </p>
                <Button onClick={() => handleEdit(address)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(address.id)}
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
          <CardTitle>Create New Address</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="mb-2"
            placeholder="Street"
          />
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mb-2"
            placeholder="City"
          />
          <Input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mb-2"
            placeholder="State"
          />
          <Input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="mb-2"
            placeholder="Postal Code"
          />
          <Input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="mb-2"
            placeholder="Customer ID"
          />
          <Button onClick={handleCreate}>Create Address</Button>
        </CardContent>
      </Card>
    </div>
  );
}
