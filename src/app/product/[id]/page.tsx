import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: Props) {
  const { id } = await params;

  const session = await auth();

  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const rating =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / product.reviews.length;

  return (
    <ProductDetail
      product={product}
      rating={rating}
      session={session}
    />
  );
}