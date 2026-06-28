"use client";

import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  reviews,
}: ProductCardProps) {
  const router = useRouter();

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: id,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      router.refresh();
    } else {
      alert(data.message);
    }
  };

  return (
    <Link
      href={`/product/${id}`}
      className="group bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden border border-gray-200"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      {/* Content */}
      <div className="p-4">

        <h2 className="font-semibold text-[#131921] line-clamp-2">
          {name}
        </h2>

        <p className="mt-2 text-amber-600 font-bold text-xl">
          Rp {price.toLocaleString("id-ID")}
        </p>

        <div className="flex items-center gap-1 mt-2">
          <Star
            size={17}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="text-sm font-medium">
            {rating}
          </span>

          <span className="text-sm text-gray-500">
            ({reviews})
          </span>

          <button
            onClick={handleAddToCart}
            className="ml-auto p-2 rounded-full hover:bg-amber-100 hover:text-amber-500 transition"
          >
            <ShoppingCart size={22} />
          </button>
        </div>

      </div>
    </Link>
  );
}