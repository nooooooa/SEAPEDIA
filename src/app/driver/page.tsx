import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DriverDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.roles?.[0];

  if (role !== "Driver") {
    redirect("/");
  }

  const driverId = Number(session.user.id);

  const totalDeliveries = await prisma.delivery.count({
    where: {
      driverId,
    },
  });

  const completedDeliveries = await prisma.delivery.count({
    where: {
      driverId,
      status: "Completed",
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
      <h1 className="text-4xl font-bold mb-10">
        Driver Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            Total Deliveries
          </h2>

          <p className="text-3xl font-bold mt-3">
            {totalDeliveries}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            Completed
          </h2>

          <p className="text-3xl font-bold mt-3">
            {completedDeliveries}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            Earnings
          </h2>

          <p className="text-3xl font-bold mt-3 text-green-600">
            Rp {(earnings._sum.earning ?? 0).toLocaleString("id-ID")}
          </p>
        </div>

      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6">

        <Link
          href="/driver/jobs"
          className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-bold">
            Available Jobs
          </h2>

          <p className="mt-2 text-gray-500">
            Accept new deliveries.
          </p>
        </Link>

        <Link
          href="/driver/deliveries"
          className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-bold">
            My Deliveries
          </h2>

          <p className="mt-2 text-gray-500">
            View active deliveries.
          </p>
        </Link>

        <Link
          href="/driver/history"
          className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-bold">
            Delivery History
          </h2>

          <p className="mt-2 text-gray-500">
            View completed deliveries.
          </p>
        </Link>

      </div>
    </div>
  );
}