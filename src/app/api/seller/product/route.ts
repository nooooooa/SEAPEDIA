import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const sellerId = Number(session.user.id);

    const {
      name,
      description,
      price,
      stock,
      image,
    } = await req.json();

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        image,
        sellerId,
      },
    });

    return NextResponse.json({
      message: "Product created successfully.",
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