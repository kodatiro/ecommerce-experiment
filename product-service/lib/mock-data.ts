// Mock data for products and categories
// Using globalThis to persist data across hot reloads in development

const initialCategories = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Books',
    slug: 'books',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Home & Garden',
    slug: 'home-garden',
    created_at: '2024-01-01T00:00:00Z'
  }
];

const initialProducts = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    description: 'Powerful laptop with M3 Pro chip, 16GB RAM, 512GB SSD. Perfect for developers and creators.',
    price: '2499.99',
    stock: 15,
    category_id: '1',
    category_name: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
    price: '999.99',
    stock: 25,
    category_id: '1',
    category_name: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1592286927505-c5b0fe7e0329?w=500&q=80',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'AirPods Pro',
    description: 'Premium wireless earbuds with active noise cancellation and spatial audio.',
    price: '249.99',
    stock: 50,
    category_id: '1',
    category_name: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&q=80',
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Designer Cotton T-Shirt',
    description: 'Premium 100% organic cotton t-shirt. Comfortable fit with modern design.',
    price: '39.99',
    stock: 100,
    category_id: '2',
    category_name: 'Clothing',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    created_at: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Denim Jacket',
    description: 'Classic denim jacket with vintage wash. Perfect for any casual outfit.',
    price: '89.99',
    stock: 40,
    category_id: '2',
    category_name: 'Clothing',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
    created_at: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with excellent cushioning and breathable mesh.',
    price: '129.99',
    stock: 60,
    category_id: '2',
    category_name: 'Clothing',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    created_at: '2024-01-06T00:00:00Z'
  },
  {
    id: '7',
    name: 'The Great Novel',
    description: 'Bestselling fiction that captivated millions. A must-read masterpiece.',
    price: '24.99',
    stock: 80,
    category_id: '3',
    category_name: 'Books',
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
    created_at: '2024-01-07T00:00:00Z'
  },
  {
    id: '8',
    name: 'Programming Guide',
    description: 'Comprehensive guide to modern software development practices and patterns.',
    price: '49.99',
    stock: 35,
    category_id: '3',
    category_name: 'Books',
    image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80',
    created_at: '2024-01-08T00:00:00Z'
  },
  {
    id: '9',
    name: 'Ceramic Plant Pot',
    description: 'Handcrafted ceramic pot with drainage hole. Perfect for indoor plants.',
    price: '34.99',
    stock: 45,
    category_id: '4',
    category_name: 'Home & Garden',
    image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80',
    created_at: '2024-01-09T00:00:00Z'
  },
  {
    id: '10',
    name: 'Garden Tool Set',
    description: 'Complete 10-piece garden tool set with ergonomic handles and storage bag.',
    price: '79.99',
    stock: 30,
    category_id: '4',
    category_name: 'Home & Garden',
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80',
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '11',
    name: 'Wireless Keyboard',
    description: 'Mechanical wireless keyboard with RGB backlighting and long battery life.',
    price: '149.99',
    stock: 20,
    category_id: '1',
    category_name: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    created_at: '2024-01-11T00:00:00Z'
  },
  {
    id: '12',
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart rate monitor and GPS.',
    price: '299.99',
    stock: 35,
    category_id: '1',
    category_name: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    created_at: '2024-01-12T00:00:00Z'
  }
];


// Use globalThis to persist data across hot reloads in development
declare global {
  var mockProductsStore: typeof initialProducts | undefined;
  var mockCategoriesStore: typeof initialCategories | undefined;
}

// Initialize or retrieve from global store
if (!globalThis.mockProductsStore) {
  globalThis.mockProductsStore = [...initialProducts];
}

if (!globalThis.mockCategoriesStore) {
  globalThis.mockCategoriesStore = [...initialCategories];
}

// Export mutable references
export const mockProducts = globalThis.mockProductsStore;
export const mockCategories = globalThis.mockCategoriesStore;

