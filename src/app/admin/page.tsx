import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.roles?.[0];

  if (role !== "Admin") {
    redirect("/");
  }

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    totalSellers,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.product.count(),

    prisma.order.count(),

    prisma.order.aggregate({
      _sum: {
        total: true,
      },
    }),

    prisma.userRole.count({
      where: {
        role: {
          name: "Seller",
        },
      },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <h1 className="text-4xl font-bold mb-10">
        Admin Dashboard
      </h1>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Users</h2>
          <p className="text-3xl font-bold mt-3">
            {totalUsers}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Sellers</h2>
          <p className="text-3xl font-bold mt-3">
            {totalSellers}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Products</h2>
          <p className="text-3xl font-bold mt-3">
            {totalProducts}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Orders</h2>
          <p className="text-3xl font-bold mt-3">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Revenue</h2>
          <p className="text-3xl font-bold mt-3 text-green-600">
            Rp {(totalRevenue._sum.total ?? 0).toLocaleString("id-ID")}
          </p>
        </div>

      </div>

      {/* Management */}
      <h2 className="text-3xl font-bold mt-12 mb-6">
        Management
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <Link
          href="/admin/users"
          className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition"
        >
          <h3 className="text-2xl font-bold">
            👥 Manage Users
          </h3>

          <p className="mt-2 text-gray-500">
            View and manage all users.
          </p>
        </Link>

        <Link
          href="/admin/products"
          className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition"
        >
          <h3 className="text-2xl font-bold">
            📦 Manage Products
          </h3>

          <p className="mt-2 text-gray-500">
            View all marketplace products.
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition"
        >
          <h3 className="text-2xl font-bold">
            🧾 Manage Orders
          </h3>

          <p className="mt-2 text-gray-500">
            View every customer order.
          </p>
        </Link>
        <Link
            href="/admin/reports"
            className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition">
            <h2 className="text-2xl font-bold">
                📈 Sales Report
            </h2>

            <p className="mt-2 text-gray-500">
                Marketplace analytics.
            </p>
        </Link>
       
      </div>
    </div>
  );
}