import Link from "next/link";

export default function SellerDashboard() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-5">

      <h1 className="text-3xl font-bold mb-8">
        Seller Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Link
          href="/seller/products"
          className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold">
            My Products
          </h2>

          <p className="text-gray-500 mt-2">
            Manage all your products.
          </p>
        </Link>

        <Link
          href="/seller/orders"
          className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold">
            Orders
          </h2>

          <p className="text-gray-500 mt-2">
            View customer orders.
          </p>
        </Link>

      </div>

    </div>
  );
}