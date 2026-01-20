import { NextRequest, NextResponse } from 'next/server';
import { trace } from '@opentelemetry/api';

const DATABASE_SERVICE_URL = process.env.DATABASE_SERVICE_URL || 'http://localhost:3004';
const tracer = trace.getTracer('order-service');

// Get orders for a user
export async function GET(request: NextRequest) {
  const span = tracer.startSpan('orders.list');
  try {
    span.setAttributes({
      'operation': 'list_orders',
      'service': 'order-service',
    });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      span.setAttributes({
        'success': false,
        'error': 'missing_user_id',
      });
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    span.setAttributes({
      'user.id': userId,
    });

    const fetchSpan = tracer.startSpan('orders.fetch_from_database');
    let orders;
    try {
      fetchSpan.setAttributes({
        'database.url': DATABASE_SERVICE_URL,
        'http.method': 'GET',
        'http.url': `${DATABASE_SERVICE_URL}/api/orders`,
        'user.id': userId,
      });

      const response = await fetch(`${DATABASE_SERVICE_URL}/api/orders?userId=${userId}`);
      orders = await response.json();

      fetchSpan.setAttributes({
        'http.status_code': response.status,
        'orders.count': Array.isArray(orders) ? orders.length : 0,
      });
    } finally {
      fetchSpan.end();
    }

    span.setAttributes({
      'success': true,
      'orders.count': Array.isArray(orders) ? orders.length : 0,
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    span.setAttributes({
      'success': false,
      'error': error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  } finally {
    span.end();
  }
}

// Create a new order
export async function POST(request: NextRequest) {
  const span = tracer.startSpan('orders.create');
  try {
    span.setAttributes({
      'operation': 'create_order',
      'service': 'order-service',
    });

    const body = await request.json();
    const { userId, items, total } = body;

    if (!userId || !items || !total) {
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
      'user.id': userId,
      'order.item_count': Array.isArray(items) ? items.length : 0,
      'order.total': parseFloat(total),
    });

    // Transform items for database
    const transformSpan = tracer.startSpan('orders.transform_items');
    let transformedItems;
    try {
      transformSpan.setAttributes({
        'items.count': Array.isArray(items) ? items.length : 0,
      });

      transformedItems = items.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      transformSpan.setAttributes({
        'success': true,
      });
    } finally {
      transformSpan.end();
    }

    // Create order in database
    const createSpan = tracer.startSpan('orders.create_in_database');
    let order;
    try {
      createSpan.setAttributes({
        'database.url': DATABASE_SERVICE_URL,
        'http.method': 'POST',
        'http.url': `${DATABASE_SERVICE_URL}/api/orders`,
        'user.id': userId,
        'order.total': parseFloat(total),
        'order.item_count': transformedItems.length,
      });

      const response = await fetch(`${DATABASE_SERVICE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          items: transformedItems,
          total,
        }),
      });

      order = await response.json();

      createSpan.setAttributes({
        'http.status_code': response.status,
        'order.id': order.id || 'unknown',
      });
    } finally {
      createSpan.end();
    }

    span.setAttributes({
      'success': true,
      'order.id': order.id || 'unknown',
      'order.status': order.status || 'unknown',
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    span.setAttributes({
      'success': false,
      'error': error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  } finally {
    span.end();
  }
}
