import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      productId,
      rating,
      comment,
    } = await req.json();

    if (!productId || !rating) {
      return NextResponse.json(
        {
          message: "Product and rating are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          message: "Rating must be between 1 and 5.",
        },
        {
          status: 400,
        }
      );
    }

    const userId = Number(session.user.id);

    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        productId: Number(productId),
      },
    });

    if (existingReview) {
      await prisma.review.update({
        where: {
          id: existingReview.id,
        },
        data: {
          rating: Number(rating),
          comment,
        },
      });

      return NextResponse.json({
        message: "Review updated successfully.",
      });
    }

    await prisma.review.create({
      data: {
        userId,
        productId: Number(productId),
        rating: Number(rating),
        comment,
      },
    });

    return NextResponse.json({
      message: "Review added successfully.",
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