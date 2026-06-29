import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SalesReportPage() {

    const session = await auth();

    if(!session?.user){
        redirect("/login");
    }

    if(!session.user.roles?.includes("Admin")){
        redirect("/");
    }

    const [
        revenue,
        totalOrders,
        totalUsers,
        totalProducts
    ] = await Promise.all([

        prisma.order.aggregate({
            _sum:{
                total:true
            }
        }),

        prisma.order.count(),

        prisma.user.count(),

        prisma.product.count(),

    ]);

    const topProducts = await prisma.orderItem.groupBy({

        by:["productId"],

        _sum:{
            quantity:true,
        },

        orderBy:{
            _sum:{
                quantity:"desc"
            }
        },

        take:5

    });

    const productIds = topProducts.map(p=>p.productId);

    const products = await prisma.product.findMany({

        where:{
            id:{
                in:productIds
            }
        }

    });

    return(
        <div className="max-w-7xl mx-auto py-10 px-5">
            <h1 className="text-4xl font-bold">
                Sales Report
            </h1>

        <div className="mt-3 mb-6">
        <Link
            href="/admin"
            className="text-amber-600 hover:underline"
            >
            ← Back to Admin Dashboard
        </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-gray-500">
                    Revenue
                </h2>

                <p className="text-3xl font-bold text-green-600 mt-3">
                    Rp {(revenue._sum.total ?? 0).toLocaleString("id-ID")}
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-gray-500">
                    Orders
                </h2>
                <p className="text-3xl font-bold mt-3">
                    {totalOrders}
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-gray-500">
                    Users
                </h2>

                <p className="text-3xl font-bold mt-3">
                    {totalUsers}
                </p>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-gray-500">
                    Products
                </h2>

                <p className="text-3xl font-bold mt-3">
                    {totalProducts}
                </p>

            </div>

        </div>

        <div className="bg-white rounded-xl shadow mt-10 p-8">
            <h2 className="text-2xl font-bold mb-6">
                Top Selling Products
            </h2>

            <div className="space-y-4">
                {topProducts.map((item)=>{
                    const product=products.find(
                    p=>p.id===item.productId
                ); return(
                    <div
                        key={item.productId}
                        className="flex justify-between border-b pb-3">
                        <span>
                            {product?.name}
                        </span>

                        <span className="font-bold">
                            {item._sum.quantity} Sold
                        </span>
                    </div>
                    )
                })}
            </div>
        </div>
    </div>
    )
}