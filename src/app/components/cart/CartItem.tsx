"use client";

import { useRouter } from "next/navigation";

type CartItemProps = {
  item: {
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
    };
  };
};

export default function CartItem({ item }: CartItemProps) {
  const router = useRouter();

  const updateQuantity = async (
    action: "increase" | "decrease"
  ) => {
    const res = await fetch("/api/cart/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItemId: item.id,
        action,
      }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to update cart.");
    }
  };
  const removeItem = async () => {
  const res = await fetch("/api/cart/remove", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cartItemId: item.id,
    }),
  });

  if (res.ok) {
    router.refresh();
  } else {
    alert("Failed to remove item.");
  }
};

  return (
    <div className="bg-white rounded-2xl shadow p-8 flex justify-between items-center">

      <div>

        <h2 className="text-2xl font-semibold">
          {item.product.name}
        </h2>

        <div className="flex items-center gap-3 mt-3">

          <button
            onClick={() => updateQuantity("decrease")}
            className="w-8 h-8 rounded-lg border hover:bg-gray-100"
          >
            -
          </button>

          <span className="font-semibold">
            {item.quantity}
          </span>

          <button
            onClick={() => updateQuantity("increase")}
            className="w-8 h-8 rounded-lg border hover:bg-gray-100"
          >
            +
          </button>
          <button
            onClick={removeItem}
            className="mt-4 text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Remove
          </button>

        </div>

      </div>

      <div className="text-right">

        <p className="font-bold text-amber-600 text-lg">
          Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
        </p>

      </div>

    </div>
  );
}