import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/app/components/seller/DeleteProductButton";
export default async function SellerProductsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sellerId = Number(session.user.id);

  const products = await prisma.product.findMany({
    where: {
      sellerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          My Products
        </h1>

        <Link
          href="/seller/products/new"
          className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No Products Yet
          </h2>

          <p className="text-gray-500 mt-3">
            Start selling by adding your first product.
          </p>

          <Link
            href="/seller/products/new"
            className="inline-block mt-6 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {product.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  Stock : {product.stock}
                </p>

                <p className="text-amber-600 font-bold mt-2">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/seller/products/${product.id}/edit`}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Edit
                </Link>

                <DeleteProductButton
                    productId={product.id}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}