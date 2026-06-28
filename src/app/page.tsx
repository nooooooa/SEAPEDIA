import Navbar from "./components/Navbar";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";

type HomeProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function Home({
  searchParams,
}: HomeProps) {
  const { search } = await searchParams;

  const products = await prisma.product.findMany({
    where: search
      ? {
          name: {
            contains: search,
          },
        }
      : {},
    include: {
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <Navbar />
      <main className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto py-10 px-5">

          <h1 className="text-3xl font-bold text-[#131921] mb-8">
            {search
              ? `Search Result: "${search}"`
              : "Featured Products"}
          </h1>

          {products.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-10 text-center">

              <h2 className="text-2xl font-semibold">
                No products found
              </h2>

              <p className="text-gray-500 mt-2">
                Try searching with another keyword.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => {
                const rating =
                  product.reviews.length === 0
                    ? 0
                    : product.reviews.reduce(
                        (sum, review) => sum + review.rating,
                        0
                      ) / product.reviews.length;

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image ?? "/placeholder.png"}
                    rating={rating}
                    reviews={product.reviews.length}
                  />
                );
              })}
            </div>
          )}

        </div>
      </main>
    </>
  );
}