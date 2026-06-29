import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DriverJobsPage() {

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.roles?.[0];

  if (role !== "Driver") {
    redirect("/");
  }

  const deliveries = await prisma.delivery.findMany({

    where: {
      driverId: null,
      status: "Waiting Driver",
    },

    include: {
      order: {
        include: {
          user: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },

  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Available Jobs
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
            No Available Jobs
          </h2>

          <p className="text-gray-500 mt-3">
            Every delivery has already been accepted.
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

                <h2 className="text-xl font-semibold">
                  Order #{delivery.order.id}
                </h2>

                <p className="text-gray-500 mt-2">
                  Customer :
                  {" "}
                  {delivery.order.receiverName}
                </p>

                <p className="text-gray-500">
                  {delivery.order.city},
                  {" "}
                  {delivery.order.province}
                </p>

                <p className="mt-3 text-green-600 font-bold">
                  Earnings :
                  {" "}
                  Rp {delivery.earning.toLocaleString("id-ID")}
                </p>

              </div>

              <form
                action={`/api/driver/take/${delivery.id}`}
                method="POST"
              >

                <button
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl"
                >
                  Take Job
                </button>

              </form>

            </div>

          ))}

        </div>

      )}

    </div>
  );

}