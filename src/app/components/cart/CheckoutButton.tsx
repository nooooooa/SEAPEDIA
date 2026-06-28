"use client";

import { useRouter } from "next/navigation";

export default function CheckoutButton() {
  const router = useRouter();

  const checkout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (res.ok) {
      alert("Checkout successful!");
      router.refresh();
    } else {
      alert(data.message);
    }
  };

  return (
    <button
      onClick={checkout}
      className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
    >
      Checkout
    </button>
  );
}