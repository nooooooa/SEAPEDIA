"use client";

import { useRouter } from "next/navigation";

type Props = {
  productId: number;
};

export default function DeleteProductButton({
  productId,
}: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    const res = await fetch(
      `/api/seller/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
    >
      Delete
    </button>
  );
}