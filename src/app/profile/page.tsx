import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(session.user.id),
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <main>
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#131921]">My Profile</h1>

        <p className="text-gray-500 mt-1 mb-8">
          Welcome back, {user.username}
        </p>

        <div className="space-y-6">
          <div>
            <label className="text-gray-500 text-sm">Username</label>
            <p className="text-lg font-semibold">{user.username}</p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Email</label>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
          <h2 className="font-semibold mt-8 mb-3">
            Shipping Address
          </h2>

          <div className="space-y-2">

          <p>
            <b>Full Name:</b> {user.fullName ?? "-"}
          </p>

          <p>
            <b>Phone:</b> {user.phone ?? "-"}
          </p>

          <p>
            <b>Province:</b> {user.province ?? "-"}
          </p>

          <p>
            <b>City:</b> {user.city ?? "-"}
          </p>

          <p>
            <b>Postal Code:</b> {user.postalCode ?? "-"}
          </p>

          <p>
          <b>Address:</b><br/>
            {user.address ?? "-"}
          </p>

          </div>
          <div>
            <label className="text-gray-500 text-sm">Role</label>
            <p className="text-lg font-semibold">
              {user.userRoles[0]?.role.name}
            </p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Member Since</label>
            <p className="text-lg font-semibold">
              {user.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        <Link
          href="/profile/edit"
          className="mt-10 block w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl transition"
        >
          Edit Profile
        </Link>
        <div className="mt-8 text-center text-gray-600">
          <Link
              href="/"
              className="mt-4 inline-block text-gray-500 hover:text-[#131921]"
            >
              ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}