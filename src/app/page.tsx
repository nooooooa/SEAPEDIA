import Navbar from "./components/Navbar";
import ProductCard from "../components/product/ProductCard";
import products from "../data/products";

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
                {...product}
              />
            ))}
          </div>

        </div>

      </main>
    </>
  );
}