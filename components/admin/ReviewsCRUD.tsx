import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Review {
  id: string;
  customerId: string;
  restaurantId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function ReviewsCRUD() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await fetch("/api/reviews");
    if (res.ok) {
      const data = await res.json();
      setReviews(data);
    } else {
      console.error("Failed to fetch reviews");
    }
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setCustomerId(review.customerId);
    setRestaurantId(review.restaurantId);
    setRating(review.rating.toString());
    setComment(review.comment);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/reviews`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        customerId,
        restaurantId,
        rating: parseInt(rating),
        comment,
      }),
    });

    if (res.ok) {
      const updatedReview = await res.json();
      setReviews(reviews.map((r) => (r.id === id ? updatedReview : r)));
      setEditingId(null);
    } else {
      console.error("Failed to update review");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/reviews`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setReviews(reviews.filter((r) => r.id !== id));
    } else {
      console.error("Failed to delete review");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        restaurantId,
        rating: parseInt(rating),
        comment,
      }),
    });

    if (res.ok) {
      const newReview = await res.json();
      setReviews([...reviews, newReview]);
      setCustomerId("");
      setRestaurantId("");
      setRating("");
      setComment("");
    } else {
      console.error("Failed to create review");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Reviews</h2>
      {reviews.map((review) => (
        <Card key={review.id} className="mb-4">
          <CardContent>
            {editingId === review.id ? (
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
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="mb-2"
                  placeholder="Rating"
                  min="1"
                  max="5"
                />
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-2"
                  placeholder="Comment"
                />
                <Button onClick={() => handleSave(review.id)} className="mr-2">
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">
                  Review ID: {review.id}
                </h3>
                <p className="text-gray-600">
                  Customer ID: {review.customerId}
                </p>
                <p className="text-gray-600">
                  Restaurant ID: {review.restaurantId}
                </p>
                <p className="text-gray-600">Rating: {review.rating}</p>
                <p className="text-gray-600">Comment: {review.comment}</p>
                <p className="text-gray-600">
                  Created At: {new Date(review.createdAt).toLocaleString()}
                </p>
                <Button onClick={() => handleEdit(review)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(review.id)}
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
          <CardTitle>Create New Review</CardTitle>
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
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="mb-2"
            placeholder="Rating"
            min="1"
            max="5"
          />
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-2"
            placeholder="Comment"
          />
          <Button onClick={handleCreate}>Create Review</Button>
        </CardContent>
      </Card>
    </div>
  );
}
