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

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const sellerId = Number(session.user.id);

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product || product.sellerId !== sellerId) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: {
        id: product.id,
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

export async function PUT(
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

    const sellerId = Number(session.user.id);

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product || product.sellerId !== sellerId) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    const {
      name,
      description,
      price,
      stock,
      image,
    } = await req.json();

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        name,
        description,
        price,
        stock,
        image,
      },
    });

    return NextResponse.json({
      message: "Product updated successfully.",
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