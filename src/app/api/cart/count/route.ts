import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ count: 0 });
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId: Number(session.user.id),
    },
    include: {
      items: true,
    },
  });

  const count =
    cart?.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) ?? 0;

  return NextResponse.json({
    count,
  });
}