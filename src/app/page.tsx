import Navbar from "./components/Navbar";
import products from "../data/products";
import ProductCard from "@/components/product/ProductCard";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto py-10 px-5">
          <h1 className="text-3xl font-bold text-[#131921] mb-8">
            Featured Products
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image ?? "/placeholder.png"}
                rating={4.8}
                reviews={128}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}