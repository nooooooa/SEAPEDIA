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

  const orderItems = await prisma.orderItem.findMany({
    where: {
      product: {
        sellerId,
      },
    },
    include: {
      order: {
        include: {
          user: true,
        },
      },
      product: true,
    },
    orderBy: {
      order: {
        createdAt: "desc",
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-8">
        Customer Orders
      </h1>

      {orderItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-2xl font-semibold">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Your products haven't been purchased yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {item.product.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  Buyer : {item.order.user.username}
                </p>

                <p className="text-gray-500">
                  Quantity : {item.quantity}
                </p>

                <p className="text-gray-500">
                  Order #{item.order.id}
                </p>

                <p className="text-gray-500">
                  {new Date(item.order.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-amber-600">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>

                <Link
                  href={`/orders/${item.order.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}