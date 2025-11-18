import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');

    let products = Array.from(dataStore.products.values());

    // Filter by category if provided
    if (categoryId) {
      products = products.filter(p => p.category_id === categoryId);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate new ID
    const id = `${Date.now()}`;

    const newProduct = {
      id,
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      category_id: body.category_id,
      category_name: body.category_name,
      image_url: body.image_url,
      created_at: new Date().toISOString(),
    };

    dataStore.products.set(id, newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
