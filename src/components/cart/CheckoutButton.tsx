"use client";

import { useRouter } from "next/navigation";

export default function CheckoutButton() {
  const router = useRouter();

  const handleCheckout = async () => {
    const res = await fetch("/api/order/checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);

      router.push("/orders");
      router.refresh();
    } else {
      alert(data.message);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold transition"
    >
      Checkout
    </button>
  );
}