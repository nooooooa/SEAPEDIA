import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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

  const isSeller = user?.userRoles.some(
    (r) => r.role.name === "Seller"
  );

  if (!isSeller) {
    redirect("/");
  }

  return <>{children}</>;
}