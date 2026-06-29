import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DeleteUserButton from "./DeleteUserButton";
import Link from "next/link";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.roles?.includes("Admin")) {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">

      <h1 className="text-4xl font-bold mb-8">
        Manage Users
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Username
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-t"
              >

                <td className="p-4">
                  {user.username}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">

                  {user.userRoles
                    .map((r) => r.role.name)
                    .join(", ")}

                </td>

                <td className="p-4 text-center">

                  {user.userRoles.some(
                    (r) => r.role.name === "Admin"
                  ) ? (
                    <span className="text-gray-400">
                      Protected
                    </span>
                  ) : (
                    <DeleteUserButton
                      userId={user.id}
                    />
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>
             <div className="mb-6">
            <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
            >
                ← Back to Admin Dashboard
            </Link>
        </div>
      </div>

    </div>
  );
}