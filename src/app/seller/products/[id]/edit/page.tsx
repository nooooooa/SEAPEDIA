import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sellerId = Number(session.user.id);

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!product || product.sellerId !== sellerId) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        Edit Product
      </h1>

      <EditProductForm product={product} />
    </div>
  );
}