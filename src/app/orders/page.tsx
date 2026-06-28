import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: Number(session.user.id),
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-5">

      <h1 className="text-3xl font-bold text-[#131921] mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">

          <h2 className="text-2xl font-semibold">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mt-3">
            You haven't placed any orders.
          </p>

          <Link
            href="/"
            className="inline-block mt-6 bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600"
          >
            Continue Shopping
          </Link>

        </div>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
            >

              <div>

                <h2 className="text-xl font-semibold">
                  Order #{order.id}
                </h2>

                <p className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("id-ID")}
                </p>

                <p className="mt-2">
                  Status :
                  <span className="font-semibold text-amber-600 ml-2">
                    {order.status}
                  </span>
                </p>

                <p className="mt-2">
                  {order.items.length} Item(s)
                </p>

                <p className="text-gray-500 mt-2">
                  {order.receiverName}
                </p>

                <p className="text-gray-500">
                  {order.city}, {order.province}
                </p>
              </div>

              <div className="text-right">

                <p className="text-2xl font-bold text-amber-600">
                  Rp {order.total.toLocaleString("id-ID")}
                </p>

                <Link
                  href={`/orders/${order.id}`}
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  View Details
                </Link>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}