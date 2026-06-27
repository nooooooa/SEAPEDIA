import Link from "next/link";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gray-100">

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

    </main>
  );
}