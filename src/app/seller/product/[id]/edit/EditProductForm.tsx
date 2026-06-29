"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
};

export default function EditProductForm({
  product,
}: {
  product: Product;
}) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [image, setImage] = useState(product.image ?? "");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const res = await fetch(
      `/api/seller/products/${product.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price,
          stock,
          image,
        }),
      }
    );

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      router.push("/seller/products");
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-8 space-y-5"
    >
      <input
        className="w-full border rounded-lg p-3"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <textarea
        className="w-full border rounded-lg p-3"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <input
        type="number"
        className="w-full border rounded-lg p-3"
        value={price}
        onChange={(e) =>
          setPrice(Number(e.target.value))
        }
      />

      <input
        type="number"
        className="w-full border rounded-lg p-3"
        value={stock}
        onChange={(e) =>
          setStock(Number(e.target.value))
        }
      />

      <input
        className="w-full border rounded-lg p-3"
        value={image}
        onChange={(e) =>
          setImage(e.target.value)
        }
      />

      <button
        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl"
      >
        Save Changes
      </button>
    </form>
  );
}