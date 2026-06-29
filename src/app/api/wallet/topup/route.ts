import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const formData = await req.formData();

  const amount = Number(formData.get("amount"));

  await prisma.user.update({
    where: {
      id: Number(session.user.id),
    },
    data: {
      wallet: {
        increment: amount,
      },
    },
  });

  return NextResponse.redirect(
    new URL("/profile/wallet", req.url)
  );
}