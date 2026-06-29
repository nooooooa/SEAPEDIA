import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";


export default async function SellerDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(session.user.id),
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  const isSeller = user?.userRoles.some(
    (r) => r.role.name === "Seller"
  );

  if (!isSeller) {
    redirect("/");
  }

  const sellerId = Number(session.user.id);

  const totalProducts = await prisma.product.count({
    where: {
      sellerId,
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-5">
      <h1 className="text-4xl font-bold mb-10">
        Seller Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Total Products</h2>

          <p className="text-3xl font-bold mt-2">
            {totalProducts}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Total Orders</h2>

          <p className="text-3xl font-bold mt-2">
            Coming Soon
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Revenue</h2>

          <p className="text-3xl font-bold mt-2">
            Rp 0
          </p>
        </div>
      </div>

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