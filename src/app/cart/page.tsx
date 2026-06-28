import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CartItem from "../components/cart/CartItem";

export default async function CartPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId: Number(session.user.id),
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-5">
        <h1 className="text-3xl font-bold text-[#131921] mb-10">
          Shopping Cart
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Your cart is empty
          </h2>

          <p className="mt-3 text-gray-500">
            Looks like you haven't added anything yet.
          </p>

          <Link
            href="/"
            className="inline-block mt-8 px-8 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-5">
      <h1 className="text-3xl font-bold text-[#131921] mb-10">
        Shopping Cart
      </h1>

      <div className="space-y-5">
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
          />
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Total
        </h2>

        <h2 className="text-2xl font-bold text-amber-600">
          Rp {total.toLocaleString("id-ID")}
        </h2>
      </div>
    </div>
  );
}