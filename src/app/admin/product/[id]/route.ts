import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  req: Request,
  { params }: Props
) {
  try {

    const session = await auth();

    if (!session?.user?.roles?.includes("Admin")) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    const productId = Number(id);

    // Hapus relasi terlebih dahulu
    await prisma.cartItem.deleteMany({
      where: {
        productId,
      },
    });

    await prisma.review.deleteMany({
      where: {
        productId,
      },
    });

    await prisma.orderItem.deleteMany({
      where: {
        productId,
      },
    });

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({
      message: "Product deleted successfully.",
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