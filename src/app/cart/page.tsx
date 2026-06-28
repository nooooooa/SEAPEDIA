import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CartItem from "../components/cart/CartItem";
import CheckoutButton from "../components/cart/CheckoutButton";

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
      <div className="min-h-[70vh] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          {/* Empty cart illustration */}
          <div className="mx-auto mb-8 w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Looks like you haven't added anything yet. Start exploring and find
            something you'll love.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
  (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingFee =
    subtotal >= 500000
      ? 0
      : 20000;

  const total = subtotal + shippingFee;

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto py-12 px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="mt-1 text-sm text-gray-500">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {/* Cart items */}
      <div className="space-y-3">
        {cart.items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Divider */}
      <div className="my-8 border-t border-gray-100" />

      {/* Order summary card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
        <h2 className="text-xl font-bold mb-6">
          Order Summary
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">
              Rp {subtotal.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="font-semibold">
              {shippingFee === 0
                ? "FREE"
                : `Rp ${shippingFee.toLocaleString("id-ID")}`}
            </span>
          </div>

          <hr />

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Total
            </h2>

            <h2 className="text-2xl font-bold text-amber-600">
              Rp {total.toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="pt-4">
            <CheckoutButton />
          </div>
        </div>
      </div>

      {/* Back to shopping link */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-amber-600 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}