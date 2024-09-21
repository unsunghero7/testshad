import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
}

export function ContentPagesCRUD() {
  const [contentPages, setContentPages] = useState<ContentPage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    fetchContentPages();
  }, []);

  const fetchContentPages = async () => {
    const res = await fetch("/api/contentPages");
    if (res.ok) {
      const data = await res.json();
      setContentPages(data);
    } else {
      console.error("Failed to fetch content pages");
    }
  };

  const handleEdit = (contentPage: ContentPage) => {
    setEditingId(contentPage.id);
    setTitle(contentPage.title);
    setSlug(contentPage.slug);
    setContent(contentPage.content);
    setIsPublished(contentPage.isPublished);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/contentPages`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, slug, content, isPublished }),
    });

    if (res.ok) {
      const updatedContentPage = await res.json();
      setContentPages(
        contentPages.map((cp) => (cp.id === id ? updatedContentPage : cp))
      );
      setEditingId(null);
    } else {
      console.error("Failed to update content page");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/contentPages`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setContentPages(contentPages.filter((cp) => cp.id !== id));
    } else {
      console.error("Failed to delete content page");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/contentPages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content, isPublished }),
    });

    if (res.ok) {
      const newContentPage = await res.json();
      setContentPages([...contentPages, newContentPage]);
      setTitle("");
      setSlug("");
      setContent("");
      setIsPublished(false);
    } else {
      console.error("Failed to create content page");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Content Pages</h2>
      {contentPages.map((contentPage) => (
        <Card key={contentPage.id} className="mb-4">
          <CardContent>
            {editingId === contentPage.id ? (
              <>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mb-2"
                  placeholder="Title"
                />
                <Input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mb-2"
                  placeholder="Slug"
                />
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mb-2"
                  placeholder="Content"
                />
                <div className="flex items-center mb-2">
                  <Switch
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                    className="mr-2"
                  />
                  <span>Published</span>
                </div>
                <Button
                  onClick={() => handleSave(contentPage.id)}
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
                <h3 className="text-lg font-semibold">{contentPage.title}</h3>
                <p className="text-gray-600">Slug: {contentPage.slug}</p>
                <p className="text-gray-600">
                  Published: {contentPage.isPublished ? "Yes" : "No"}
                </p>
                <Button
                  onClick={() => handleEdit(contentPage)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(contentPage.id)}
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
          <CardTitle>Create New Content Page</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2"
            placeholder="Title"
          />
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mb-2"
            placeholder="Slug"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-2"
            placeholder="Content"
          />
          <div className="flex items-center mb-2">
            <Switch
              checked={isPublished}
              onCheckedChange={setIsPublished}
              className="mr-2"
            />
            <span>Published</span>
          </div>
          <Button onClick={handleCreate}>Create Content Page</Button>
        </CardContent>
      </Card>
    </div>
  );
}
