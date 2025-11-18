import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function ProductCard({ id, name, description, price, image_url }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square bg-gray-200 rounded-md mb-4 overflow-hidden">
          {image_url ? (
            <img src={image_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        <p className="text-xl font-bold text-blue-600">${price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
