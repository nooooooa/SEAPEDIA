"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

type ProductDetailProps = {
  session: any;
  rating: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | null;
    reviews: {
      id: number;
      rating: number;
      comment: string | null;
      createdAt: Date;
      user: {
        username: string;
      };
    }[];
  };
};

export default function ProductDetail({
  product,
  rating,
  session,
}: ProductDetailProps) {
  const router = useRouter();

  const [selectedRating, setSelectedRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleAddToCart = async () => {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product.id,
      }),
    });

    if (res.ok) {
      alert("Product added to cart!");
      router.refresh();
    } else {
      alert("Failed to add product.");
    }
  };

  const handleReview = async () => {
    const res = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product.id,
        rating: selectedRating,
        comment,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      setComment("");
      router.refresh();
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-5">

      <div className="grid md:grid-cols-2 gap-10">

        <div>
          <img
            src={product.image ?? "/placeholder.png"}
            alt={product.name}
            className="rounded-2xl shadow-lg w-full"
          />
        </div>

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-4">

            <Star
              size={22}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="font-semibold">
              {rating.toFixed(1)}
            </span>

            <span className="text-gray-500">
              ({product.reviews.length} Reviews)
            </span>

          </div>

          <p className="text-3xl text-amber-600 font-bold mt-5">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <p className="mt-5 text-gray-700">
            {product.description}
          </p>

          <p className="mt-5 font-semibold">
            Stock : {product.stock}
          </p>

          <button
            onClick={handleAddToCart}
            className="mt-8 flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>

        </div>

      </div>

      <div className="mt-14">

        <h2 className="text-3xl font-bold mb-6">
          Customer Reviews
        </h2>

        {product.reviews.length === 0 ? (
          <p className="text-gray-500">
            No reviews yet.
          </p>
        ) : (
          <div className="space-y-5">

            {product.reviews.map((review) => (

              <div
                key={review.id}
                className="bg-white rounded-xl shadow p-5"
              >

                <div className="flex items-center gap-1">

                  {Array.from({
                    length: review.rating,
                  }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}

                </div>

                <p className="mt-3">
                  {review.comment}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  by {review.user.username}
                </p>

              </div>

            ))}

          </div>
        )}

      </div>

      {session && (

        <div className="mt-14">

          <h2 className="text-3xl font-bold mb-5">
            Write a Review
          </h2>

          <div className="flex gap-2 mb-5">

            {[1, 2, 3, 4, 5].map((star) => (

              <Star
                key={star}
                size={34}
                onClick={() => setSelectedRating(star)}
                className={`cursor-pointer ${
                  star <= selectedRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />

            ))}

          </div>

          <textarea
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full border rounded-xl p-4"
          />

          <button
            onClick={handleReview}
            className="mt-5 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl"
          >
            Submit Review
          </button>

        </div>

      )}

    </div>
  );
}