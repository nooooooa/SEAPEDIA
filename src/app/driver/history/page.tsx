import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DriverHistoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.roles?.[0];

  if (role !== "Driver") {
    redirect("/");
  }

  const driverId = Number(session.user.id);

  const deliveries = await prisma.delivery.findMany({
    where: {
      driverId,
      status: "Completed",
    },
    include: {
      order: true,
    },
    orderBy: {
      deliveredAt: "desc",
    },
  });

  const earnings = await prisma.delivery.aggregate({
    where: {
      driverId,
      status: "Completed",
    },
    _sum: {
      earning: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Delivery History
        </h1>

        <Link
          href="/driver"
          className="text-amber-600 hover:underline"
        >
          ← Dashboard
        </Link>

      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="text-xl font-bold">
          Total Earnings
        </h2>

        <p className="text-3xl font-bold text-green-600 mt-3">
          Rp {(earnings._sum.earning ?? 0).toLocaleString("id-ID")}
        </p>

        <p className="text-gray-500 mt-2">
          Completed Deliveries : {deliveries.length}
        </p>

      </div>

      {deliveries.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-8 text-center">

          <h2 className="text-2xl font-semibold">
            No Delivery History
          </h2>

          <p className="text-gray-500 mt-3">
            Complete a delivery to see your history.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {deliveries.map((delivery) => (

            <div
              key={delivery.id}
              className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
            >

              <div>

                <h2 className="text-xl font-bold">
                  Order #{delivery.order.id}
                </h2>

                <p className="mt-2">
                  Customer : {delivery.order.receiverName}
                </p>

                <p className="text-gray-500">
                  {delivery.order.city}, {delivery.order.province}
                </p>

                <p className="text-gray-500">
                  {delivery.deliveredAt?.toLocaleDateString("id-ID")}
                </p>

              </div>

              <div className="text-right">

                <p className="font-bold text-green-600 text-xl">
                  Rp {delivery.earning.toLocaleString("id-ID")}
                </p>

                <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Completed
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}