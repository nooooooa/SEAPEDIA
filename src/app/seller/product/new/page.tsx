"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/seller/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      router.push("/seller/products");
      router.refresh();
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-8 rounded-xl shadow"
      >
        <input
          placeholder="Product Name"
          className="w-full border rounded-lg p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full border rounded-lg p-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border rounded-lg p-3"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Stock"
          className="w-full border rounded-lg p-3"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input
          placeholder="Image URL"
          className="w-full border rounded-lg p-3"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}