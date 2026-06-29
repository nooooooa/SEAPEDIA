import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DeleteProductButton from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.roles?.includes("Admin")) {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    include: {
      seller: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">

      <h1 className="text-4xl font-bold">
        Manage Products
      </h1>

      <div className="mb-6 mt-3">
        <Link
          href="/admin"
          className="text-amber-600 hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Seller
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Stock
              </th>

              <th className="p-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {products.map((product) => (

              <tr
                key={product.id}
                className="border-t"
              >

                <td className="p-4">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.seller.username}
                </td>

                <td className="p-4">
                  Rp {product.price.toLocaleString("id-ID")}
                </td>

                <td className="p-4">
                  {product.stock}
                </td>

                <td className="p-4 text-center">

                  <DeleteProductButton
                    productId={product.id}
                  />

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}