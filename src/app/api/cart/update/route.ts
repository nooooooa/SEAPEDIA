import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { cartItemId, action } = await req.json();

    if (!cartItemId || !action) {
      return NextResponse.json(
        { message: "Missing data." },
        { status: 400 }
      );
    }

    const item = await prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
    });

    if (!item) {
      return NextResponse.json(
        { message: "Cart item not found." },
        { status: 404 }
      );
    }

    if (action === "increase") {
      await prisma.cartItem.update({
        where: {
          id: cartItemId,
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      });
    }

    if (action === "decrease") {
      if (item.quantity <= 1) {
        await prisma.cartItem.delete({
          where: {
            id: cartItemId,
          },
        });
      } else {
        await prisma.cartItem.update({
          where: {
            id: cartItemId,
          },
          data: {
            quantity: {
              decrement: 1,
            },
          },
        });
      }
    }

    return NextResponse.json({
      message: "Cart updated.",
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}