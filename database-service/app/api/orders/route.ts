import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

// GET /api/orders?userId=xxx - Get orders for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const orders = Array.from(dataStore.orders.values()).filter(
      order => order.user_id === userId
    );

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, items, total } = body;

    // Create order
    const orderId = `order-${Date.now()}`;
    const newOrder = {
      id: orderId,
      user_id: userId,
      status: 'pending',
      total,
      created_at: new Date().toISOString(),
    };

    dataStore.orders.set(orderId, newOrder);

    // Create order items
    if (items && Array.isArray(items)) {
      items.forEach((item: any, index: number) => {
        const orderItemId = `oi-${Date.now()}-${index}`;
        const orderItem = {
          id: orderItemId,
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          created_at: new Date().toISOString(),
        };
        dataStore.orderItems.set(orderItemId, orderItem);
      });
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
