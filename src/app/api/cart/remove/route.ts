import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { cartItemId } = await req.json();

    if (!cartItemId) {
      return NextResponse.json(
        { message: "Cart item is required." },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return NextResponse.json({
      message: "Item removed successfully.",
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}