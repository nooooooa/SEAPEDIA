import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
  
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
    <main className="min-h-screen bg-gray-100 py-12 px-4">

        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-[#131921]">
            My Profile
        </h1>

        <p className="text-gray-500 mt-1 mb-8">
            Welcome back, {user.username}
        </p>

        <div className="space-y-6">

            <div>
            <label className="text-gray-500 text-sm">
                Username
            </label>

            <p className="text-lg font-semibold">
                {user.username}
            </p>
            </div>

            <div>
            <label className="text-gray-500 text-sm">
                Email
            </label>

            <p className="text-lg font-semibold">
                {user.email}
            </p>
            </div>

            <div>
            <label className="text-gray-500 text-sm">
                Role
            </label>

            <p className="text-lg font-semibold">
                {user.userRoles[0]?.role.name}
            </p>
            </div>

            <div>
            <label className="text-gray-500 text-sm">
                Member Since
            </label>

            <p className="text-lg font-semibold">
                {user.createdAt.toLocaleDateString()}
            </p>
            </div>

        </div>

        <button
            className="mt-10 w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl transition"
        >
            Edit Profile
        </button>

        </div>

    </main>
    );
}