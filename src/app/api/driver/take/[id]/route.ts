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

    const role = session.user.roles?.[0];

    if (role !== "Driver") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
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

    if (delivery.driverId !== null) {
      return NextResponse.json(
        { message: "Job already taken." },
        { status: 400 }
      );
    }

    await prisma.delivery.update({
      where: {
        id: delivery.id,
      },
      data: {
        driverId,
        status: "On Delivery",
        acceptedAt: new Date(),
      },
    });

    await prisma.order.update({
      where: {
        id: delivery.orderId,
      },
      data: {
        status: "On Delivery",
      },
    });

    return NextResponse.redirect(
      new URL("/driver/deliveries", req.url)
    );

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}