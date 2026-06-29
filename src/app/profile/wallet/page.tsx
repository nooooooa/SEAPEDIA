import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function WalletPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(session.user.id),
    },
  });

  return (
    <div className="max-w-3xl mx-auto py-10 px-5">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          My Wallet
        </h1>

        <Link
          href="/profile"
          className="text-amber-600 hover:underline"
        >
          ← Back
        </Link>

      </div>

      <div className="bg-white rounded-xl shadow p-8">

        <h2 className="text-gray-500">
          Current Balance
        </h2>

        <p className="text-4xl font-bold text-green-600 mt-4">
            Rp {(user?.wallet ?? 0).toLocaleString("id-ID")}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-10">

          <form action="/api/wallet/topup" method="POST">
            <input type="hidden" name="amount" value="100000" />

            <button className="w-full bg-amber-500 text-white py-3 rounded-xl">
              Top Up Rp100.000
            </button>
          </form>

          <form action="/api/wallet/topup" method="POST">
            <input type="hidden" name="amount" value="500000" />

            <button className="w-full bg-green-600 text-white py-3 rounded-xl">
              Top Up Rp500.000
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}