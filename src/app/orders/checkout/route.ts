import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Pastikan alamat sudah diisi
    if (
      !user.fullName ||
      !user.phone ||
      !user.province ||
      !user.city ||
      !user.address ||
      !user.postalCode
    ) {
      return NextResponse.json(
        {
          message:
            "Please complete your shipping address first.",
        },
        {
          status: 400,
        }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        {
          message: "Cart is empty.",
        },
        {
          status: 400,
        }
      );
    }

    const subtotal = cart.items.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );

    const shippingFee =
      subtotal >= 500000 ? 0 : 20000;

    const total = subtotal + shippingFee;

    // Ambil data user terlebih dahulu
    await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,

        subtotal,
        shippingFee,
        total,

        receiverName: user.fullName!,
        phone: user.phone!,
        province: user.province!,
        city: user.city!,
        address: user.address!,
        postalCode: user.postalCode!,
      },
    });

    for (const item of cart.items) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });

      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
  });

    return NextResponse.json({
      message: "Checkout success.",
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