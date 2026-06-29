import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SellerOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sellerId = Number(session.user.id);

  const orders = await prisma.order.findMany({
    where: {
        items: {
        some: {
            product: {
            sellerId,
            },
        },
        },
    },
    include: {
        user: true,
        items: {
        where: {
            product: {
            sellerId,
            },
        },
        include: {
            product: true,
        },
        },
    },
    orderBy: {
        createdAt: "desc",
    },
    });

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-8">
        Customer Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-2xl font-semibold">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Your products haven't been purchased yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
            {orders.map((order) => {
                const sellerTotal = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
                );

                return (
                <div
                    key={order.id}
                    className="bg-white rounded-xl shadow p-6"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">
                        Order #{order.id}
                        </h2>

                        <p className="text-gray-500 mt-1">
                        Buyer: {order.user.username}
                        </p>

                        <p className="text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                        </p>

                        <p className="mt-2">
                        Status:
                        <span className="ml-2 font-semibold text-amber-600">
                            {order.status}
                        </span>
                        </p>
                    </div>

                    <Link
                        href={`/orders/${order.id}`}
                        className="text-blue-600 hover:underline"
                    >
                        View Order
                    </Link>
                    </div>

                    <hr className="my-5" />

                    {/* Products */}
                    <div className="space-y-4">
                    {order.items.map((item) => (
                        <div
                        key={item.id}
                        className="flex justify-between items-center"
                        >
                        <div>
                            <h3 className="font-semibold text-lg">
                            {item.product.name}
                            </h3>

                            <p className="text-gray-500">
                            Qty : {item.quantity}
                            </p>

                            <p className="text-gray-500">
                            Price :
                            {" "}
                            Rp {item.price.toLocaleString("id-ID")}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="font-bold text-amber-600 text-lg">
                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </p>
                        </div>
                        </div>
                    ))}
                    </div>

                    <hr className="my-5" />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        Seller Revenue
                    </span>

                    <span className="text-2xl font-bold text-green-600">
                        Rp {sellerTotal.toLocaleString("id-ID")}
                    </span>
                    </div>
                </div>
                );
            })}
        </div>
      )}
    </div>
  );
}