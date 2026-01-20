import Link from 'next/link';
import { ApiClient } from '@/lib/api-client';
import ProductCard from '@/components/ProductCard';

// Disable caching for this page to get real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const response = await ApiClient.getProducts();
  const products = response.success && response.data ? response.data : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to EcomStore
        </h1>
        <p className="text-xl text-gray-600">
          Discover amazing products at great prices
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(products) && products.slice(0, 8).map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={parseFloat(product.price)}
              image_url={product.image_url}
            />
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}
