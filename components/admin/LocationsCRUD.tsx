import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  restaurantId: string;
}

export function LocationsCRUD() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const res = await fetch("/api/locations");
    if (res.ok) {
      const data = await res.json();
      setLocations(data);
    } else {
      console.error("Failed to fetch locations");
    }
  };

  const handleEdit = (location: Location) => {
    setEditingId(location.id);
    setName(location.name);
    setAddress(location.address);
    setLatitude(location.latitude.toString());
    setLongitude(location.longitude.toString());
    setRestaurantId(location.restaurantId);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/locations`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        restaurantId,
      }),
    });

    if (res.ok) {
      const updatedLocation = await res.json();
      setLocations(locations.map((l) => (l.id === id ? updatedLocation : l)));
      setEditingId(null);
    } else {
      console.error("Failed to update location");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/locations`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setLocations(locations.filter((l) => l.id !== id));
    } else {
      console.error("Failed to delete location");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/locations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        restaurantId,
      }),
    });

    if (res.ok) {
      const newLocation = await res.json();
      setLocations([...locations, newLocation]);
      setName("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      setRestaurantId("");
    } else {
      console.error("Failed to create location");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Locations</h2>
      {locations.map((location) => (
        <Card key={location.id} className="mb-4">
          <CardContent>
            {editingId === location.id ? (
              <>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-2"
                  placeholder="Location Name"
                />
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mb-2"
                  placeholder="Address"
                />
                <Input
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="mb-2"
                  placeholder="Latitude"
                />
                <Input
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="mb-2"
                  placeholder="Longitude"
                />
                <Input
                  type="text"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="mb-2"
                  placeholder="Restaurant ID"
                />
                <Button
                  onClick={() => handleSave(location.id)}
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
                <h3 className="text-lg font-semibold">{location.name}</h3>
                <p className="text-gray-600">Address: {location.address}</p>
                <p className="text-gray-600">
                  Coordinates: {location.latitude}, {location.longitude}
                </p>
                <p className="text-gray-600">
                  Restaurant ID: {location.restaurantId}
                </p>
                <Button onClick={() => handleEdit(location)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(location.id)}
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
          <CardTitle>Create New Location</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2"
            placeholder="Location Name"
          />
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mb-2"
            placeholder="Address"
          />
          <Input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="mb-2"
            placeholder="Latitude"
          />
          <Input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="mb-2"
            placeholder="Longitude"
          />
          <Input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mb-2"
            placeholder="Restaurant ID"
          />
          <Button onClick={handleCreate}>Create Location</Button>
        </CardContent>
      </Card>
    </div>
  );
}
