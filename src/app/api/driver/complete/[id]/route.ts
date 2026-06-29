import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  req: Request,
  { params }: Props
) {
  try {

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const driverId = Number(session.user.id);

    const { id } = await params;

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!delivery) {
      return NextResponse.json(
        { message: "Delivery not found." },
        { status: 404 }
      );
    }

    if (delivery.driverId !== driverId) {
      return NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx) => {
        await tx.delivery.update({
            where: {
            id: delivery.id,
            },
            data: {
            status: "Completed",
            deliveredAt: new Date(),
            },
        });

        await tx.order.update({
            where: {
            id: delivery.orderId,
            },
            data: {
            status: "Completed",
            },
        });

        // Driver menerima earning
        await tx.user.update({
            where: {
            id: delivery.driverId!,
            },
            data: {
            wallet: {
                increment: delivery.earning,
            },
            },
        });

        // Ambil seluruh item order beserta seller
        const orderItems = await tx.orderItem.findMany({
            where: {
            orderId: delivery.orderId,
            },
            include: {
            product: true,
            },
        });

        // Seller menerima 90%
        for (const item of orderItems) {

            const sellerIncome =
            item.price * item.quantity * 0.9;

            await tx.user.update({
            where: {
                id: item.product.sellerId,
            },
            data: {
                wallet: {
                increment: sellerIncome,
                },
            },
            });

        }

        });

    return NextResponse.redirect(
      new URL("/driver/history", req.url)
    );

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );

  }
}