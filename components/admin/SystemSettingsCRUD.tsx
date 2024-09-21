import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
}

export function SystemSettingsCRUD() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await fetch("/api/systemSettings");
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
    } else {
      console.error("Failed to fetch system settings");
    }
  };

  const handleEdit = (setting: SystemSetting) => {
    setEditingId(setting.id);
    setKey(setting.key);
    setValue(setting.value);
    setDescription(setting.description);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/systemSettings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, key, value, description }),
    });

    if (res.ok) {
      const updatedSetting = await res.json();
      setSettings(settings.map((s) => (s.id === id ? updatedSetting : s)));
      setEditingId(null);
    } else {
      console.error("Failed to update system setting");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/systemSettings`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setSettings(settings.filter((s) => s.id !== id));
    } else {
      console.error("Failed to delete system setting");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/systemSettings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, description }),
    });

    if (res.ok) {
      const newSetting = await res.json();
      setSettings([...settings, newSetting]);
      setKey("");
      setValue("");
      setDescription("");
    } else {
      console.error("Failed to create system setting");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">System Settings</h2>
      {settings.map((setting) => (
        <Card key={setting.id} className="mb-4">
          <CardContent>
            {editingId === setting.id ? (
              <>
                <Input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="mb-2"
                  placeholder="Key"
                />
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="mb-2"
                  placeholder="Value"
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mb-2"
                  placeholder="Description"
                />
                <Button onClick={() => handleSave(setting.id)} className="mr-2">
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{setting.key}</h3>
                <p className="text-gray-600">Value: {setting.value}</p>
                <p className="text-gray-600">
                  Description: {setting.description}
                </p>
                <Button onClick={() => handleEdit(setting)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(setting.id)}
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
          <CardTitle>Create New System Setting</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="mb-2"
            placeholder="Key"
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mb-2"
            placeholder="Value"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2"
            placeholder="Description"
          />
          <Button onClick={handleCreate}>Create System Setting</Button>
        </CardContent>
      </Card>
    </div>
  );
}
