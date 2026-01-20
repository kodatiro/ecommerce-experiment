import { ApiClient } from '@/lib/api-client';
import ProductCard from '@/components/ProductCard';

// Disable caching for this page to get real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductsPage() {
  const response = await ApiClient.getProducts();
  const products = response.success && response.data ? (Array.isArray(response.data) ? response.data : []) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
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
      )}
    </div>
  );
}
