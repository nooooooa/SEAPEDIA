import { Star } from "lucide-react";
import Link from "next/link";

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
    
  return (
    <Link
      href={`/product/${id}`}
      className="group bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden border border-gray-200"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

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

        </div>
      </div>
    </Link>
  );
}