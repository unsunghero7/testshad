import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function UserCRUD() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/user");
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    } else {
      console.error("Failed to fetch users");
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/user`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, email, role }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUsers(users.map((u) => (u.id === id ? updatedUser : u)));
      setEditingId(null);
    } else {
      console.error("Failed to update user");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/user`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setUsers(users.filter((u) => u.id !== id));
    } else {
      console.error("Failed to delete user");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role }),
    });

    if (res.ok) {
      const newUser = await res.json();
      setUsers([...users, newUser]);
      setName("");
      setEmail("");
      setRole("");
    } else {
      console.error("Failed to create user");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Users</h2>
      {users.map((user) => (
        <Card key={user.id} className="mb-4">
          <CardContent>
            {editingId === user.id ? (
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
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mb-2"
                  placeholder="Role"
                />
                <Button onClick={() => handleSave(user.id)} className="mr-2">
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Role: {user.role}</p>
                <Button onClick={() => handleEdit(user)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(user.id)}
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
          <CardTitle>Create New User</CardTitle>
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
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mb-2"
            placeholder="Role"
          />
          <Button onClick={handleCreate}>Create User</Button>
        </CardContent>
      </Card>
    </div>
  );
}
