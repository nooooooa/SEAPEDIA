import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StatusSelect from "./StatusSelect";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.roles?.includes("Admin")) {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">

      <h1 className="text-4xl font-bold">
        Manage Orders
      </h1>

      <div className="mb-6 mt-3">
        <Link
          href="/admin"
          className="text-amber-600 hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>

      <div className="space-y-5">

        {orders.map((order)=>(

          <div
            key={order.id}
            className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
          >

            <div>

              <h2 className="text-2xl font-bold">
                Order #{order.id}
              </h2>

              <p className="text-gray-500 mt-2">
                Buyer : {order.user.username}
              </p>

              <p className="text-gray-500">
                {order.items.length} item(s)
              </p>

              <p className="font-bold text-green-600 mt-2">
                Rp {order.total.toLocaleString("id-ID")}
              </p>

            </div>

            <div className="text-right">

              <StatusSelect
                orderId={order.id}
                status={order.status}
              />

              <Link
                href={`/orders/${order.id}`}
                className="block mt-4 text-blue-600 hover:underline"
              >
                View Detail
              </Link>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}