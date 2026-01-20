import { NextRequest, NextResponse } from 'next/server';

const DATABASE_SERVICE_URL = process.env.DATABASE_SERVICE_URL || 'http://localhost:3004';

export async function GET() {
  try {
    console.log('[GET /api/products] Fetching products...');
    const response = await fetch(`${DATABASE_SERVICE_URL}/api/products`);
    const products = await response.json();
    console.log('[GET /api/products] Success:', Array.isArray(products) ? products.length : 0, 'products');

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('[GET /api/products] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[POST /api/products] Creating product...');
    const body = await request.json();
    const { name, description, price, stock, category_id, image_url } = body;

    if (!name || !price || stock === undefined) {
      console.log('[POST /api/products] Validation failed: missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await fetch(`${DATABASE_SERVICE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        price,
        stock,
        category_id,
        category_name: 'Uncategorized',
        image_url,
      }),
    });

    const product = await response.json();
    console.log('[POST /api/products] Success:', product.id);

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/products] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
