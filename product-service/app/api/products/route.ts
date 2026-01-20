import { NextRequest, NextResponse } from 'next/server';
import { trace } from '@opentelemetry/api';

const DATABASE_SERVICE_URL = process.env.DATABASE_SERVICE_URL || 'http://localhost:3004';
const tracer = trace.getTracer('product-service');

export async function GET() {
  const span = tracer.startSpan('products.list');
  try {
    span.setAttributes({
      'operation': 'list_products',
      'service': 'product-service',
    });

    const fetchSpan = tracer.startSpan('products.fetch_from_database');
    let products;
    try {
      fetchSpan.setAttributes({
        'database.url': DATABASE_SERVICE_URL,
        'http.method': 'GET',
        'http.url': `${DATABASE_SERVICE_URL}/api/products`,
      });

      const response = await fetch(`${DATABASE_SERVICE_URL}/api/products`);
      products = await response.json();

      fetchSpan.setAttributes({
        'http.status_code': response.status,
        'products.count': Array.isArray(products) ? products.length : 0,
      });
    } finally {
      fetchSpan.end();
    }

    span.setAttributes({
      'success': true,
      'products.count': Array.isArray(products) ? products.length : 0,
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    span.setAttributes({
      'success': false,
      'error': error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  } finally {
    span.end();
  }
}

export async function POST(request: NextRequest) {
  const span = tracer.startSpan('products.create');
  try {
    span.setAttributes({
      'operation': 'create_product',
      'service': 'product-service',
    });

    const body = await request.json();
    const { name, description, price, stock, category_id, image_url } = body;

    if (!name || !price || stock === undefined) {
      span.setAttributes({
        'success': false,
        'error': 'missing_required_fields',
      });
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    span.setAttributes({
      'product.name': name,
      'product.price': parseFloat(price),
      'product.stock': parseInt(stock),
    });

    const createSpan = tracer.startSpan('products.create_in_database');
    let product;
    try {
      createSpan.setAttributes({
        'database.url': DATABASE_SERVICE_URL,
        'http.method': 'POST',
        'http.url': `${DATABASE_SERVICE_URL}/api/products`,
        'product.name': name,
      });

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

      product = await response.json();

      createSpan.setAttributes({
        'http.status_code': response.status,
        'product.id': product.id || 'unknown',
      });
    } finally {
      createSpan.end();
    }

    span.setAttributes({
      'success': true,
      'product.id': product.id || 'unknown',
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    span.setAttributes({
      'success': false,
      'error': error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  } finally {
    span.end();
  }
}
