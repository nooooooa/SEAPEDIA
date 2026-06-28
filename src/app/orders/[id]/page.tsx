import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-5">

      <h1 className="text-3xl font-bold mb-8">
        Order #{order.id}
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <p>
          <span className="font-semibold">Status:</span>{" "}
          {order.status}
        </p>

        <p className="mt-2">
          <span className="font-semibold">Date:</span>{" "}
          {new Date(order.createdAt).toLocaleDateString("id-ID")}
        </p>

      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          Shipping Address
        </h2>
        <p>{order.receiverName}</p>
        <p>{order.phone}</p>
        <p>{order.address}</p>
        <p>
          {order.city}, {order.province}
        </p>
        <p>{order.postalCode}</p>
      </div>

      <div className="space-y-4">

        {order.items.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-xl shadow p-5 flex justify-between"
          >

            <div>
              <h2 className="font-semibold text-lg">
                {item.product.name}
              </h2>

              <p className="text-gray-500">
                Quantity: {item.quantity}
              </p>
            </div>

            <div className="font-bold text-amber-600">
              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
            </div>

          </div>

        ))}

      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-6 space-y-3">

        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>
            Rp {order.subtotal.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Shipping Fee</span>

          <span>
            Rp {order.shippingFee.toLocaleString("id-ID")}
          </span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-xl">

          <span>Total</span>

          <span className="text-amber-600">
            Rp {order.total.toLocaleString("id-ID")}
          </span>

        </div>

      </div>

    </div>
  );
}