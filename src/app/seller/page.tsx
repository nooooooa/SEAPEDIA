import Link from "next/link";

export default function SellerDashboard() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-5">

      <h1 className="text-4xl font-bold mb-10">
        Seller Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        <Link
          href="/seller/products"
          className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-bold">
            My Products
          </h2>

          <p className="mt-2 text-gray-500">
            Manage your products.
          </p>
        </Link>

        <Link
          href="/seller/orders"
          className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-bold">
            Customer Orders
          </h2>

          <p className="mt-2 text-gray-500">
            View incoming orders.
          </p>
        </Link>

      </div>

    </div>
  );
}