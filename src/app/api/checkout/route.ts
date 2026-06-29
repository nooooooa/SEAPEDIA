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

    // Ambil user
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

    // Cek alamat
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

    // Ambil cart
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
        { message: "Cart is empty." },
        { status: 400 }
      );
    }

    // Cek stok
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          {
            message: `${item.product.name} does not have enough stock.`,
          },
          {
            status: 400,
          }
        );
      }
    }

    // Hitung subtotal
    const subtotal = cart.items.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );
    // Shipping
    const shippingFee =
      subtotal >= 500000 ? 0 : 20000;

    // Driver selalu dibayar Rp20.000
    const driverFee = 20000;

    const total = subtotal + shippingFee;

    // Wallet
    if (user.wallet < total) {
      return NextResponse.json(
        {
          message: "Insufficient wallet balance.",
        },
        {
          status: 400,
        }
      );
    }

    // Kurangi wallet
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        wallet: {
          decrement: total,
        },
      },
    });

    // Order
    const order = await prisma.order.create({
      data: {
        userId,

        receiverName: user.fullName!,
        phone: user.phone!,
        province: user.province!,
        city: user.city!,
        address: user.address!,
        postalCode: user.postalCode!,

        subtotal,
        shippingFee,
        total,

        status: "Waiting Driver",
      },
    });

    // Delivery
    await prisma.delivery.create({
      data: {
        orderId: order.id,
        earning: driverFee,
      },
    });

    // Order Items
    for (const item of cart.items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });

      await prisma.product.update({
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

    // Hapus cart
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });


    return NextResponse.json({
      message: "Checkout successful.",
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