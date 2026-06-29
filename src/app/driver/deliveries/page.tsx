import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DriverDeliveriesPage() {
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
      status: "On Delivery",
    },
    include: {
      order: true,
    },
    orderBy: {
      acceptedAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          My Deliveries
        </h1>

        <Link
          href="/driver"
          className="text-amber-600 hover:underline"
        >
          ← Dashboard
        </Link>

      </div>

      {deliveries.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-8 text-center">

          <h2 className="text-2xl font-semibold">
            No Active Deliveries
          </h2>

          <p className="text-gray-500 mt-3">
            Accept a delivery job first.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

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
                  Customer :
                  {" "}
                  {delivery.order.receiverName}
                </p>

                <p className="text-gray-500">
                  {delivery.order.address}
                </p>

                <p className="text-gray-500">
                  {delivery.order.city},{" "}
                  {delivery.order.province}
                </p>

                <p className="mt-3 text-green-600 font-bold">
                  Earnings :
                  Rp {delivery.earning.toLocaleString("id-ID")}
                </p>

              </div>

              <form
                action={`/api/driver/complete/${delivery.id}`}
                method="POST"
              >

                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                >
                  Complete Delivery
                </button>

              </form>
              

            </div>

          ))}

        </div>

      )}

    </div>
  );
}