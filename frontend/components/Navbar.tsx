import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              EcomStore
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-blue-600">
              Products
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-blue-600">
              Cart
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-blue-600">
              Orders
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-blue-600">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
