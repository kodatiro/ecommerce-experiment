import { NextRequest, NextResponse } from 'next/server';
import { trace } from '@opentelemetry/api';

const DATABASE_SERVICE_URL = process.env.DATABASE_SERVICE_URL || 'http://localhost:3004';
const tracer = trace.getTracer('order-service');

// Get cart for a user
export async function GET(request: NextRequest) {
  const span = tracer.startSpan('cart.get');
  try {
    span.setAttributes({
      'operation': 'get_cart',
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

    const fetchSpan = tracer.startSpan('cart.fetch_from_database');
    let cart;
    try {
      fetchSpan.setAttributes({
        'database.url': DATABASE_SERVICE_URL,
        'http.method': 'GET',
        'http.url': `${DATABASE_SERVICE_URL}/api/cart`,
        'user.id': userId,
      });

      const response = await fetch(`${DATABASE_SERVICE_URL}/api/cart?userId=${userId}`);
      cart = await response.json();

      fetchSpan.setAttributes({
        'http.status_code': response.status,
        'cart.item_count': Array.isArray(cart) ? cart.length : 0,
      });
    } finally {
      fetchSpan.end();
    }

    span.setAttributes({
      'success': true,
      'cart.item_count': Array.isArray(cart) ? cart.length : 0,
    });

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    span.setAttributes({
      'success': false,
      'error': error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  } finally {
    span.end();
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity } = body;

    if (!userId || !productId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await fetch(`${DATABASE_SERVICE_URL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity: parseInt(quantity) }),
    });

    const cartItem = await response.json();

    return NextResponse.json({ success: true, data: cartItem }, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// Update cart item
export async function PUT(request: NextRequest) {
  const span = tracer.startSpan('cart.update');
  try {
    span.setAttributes({
      'operation': 'update_cart_item',
      'service': 'order-service',
    });

    const body = await request.json();
    const { id, quantity, userId, productId } = body;

    if (quantity === undefined) {
      span.setAttributes({
        'success': false,
        'error': 'missing_quantity',
      });
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    span.setAttributes({
      'cart.quantity': parseInt(quantity),
      'user.id': userId || 'unknown',
      'product.id': productId || 'unknown',
    });

    // If quantity is 0, delete the item
    if (quantity <= 0 && id) {
      const deleteSpan = tracer.startSpan('cart.delete_item');
      try {
        deleteSpan.setAttributes({
          'operation': 'delete_cart_item',
          'cart.item_id': id,
          'reason': 'quantity_zero',
        });

        await fetch(`${DATABASE_SERVICE_URL}/api/cart?id=${id}`, {
          method: 'DELETE',
        });

        deleteSpan.setAttributes({
          'success': true,
        });
      } finally {
        deleteSpan.end();
      }

      span.setAttributes({
        'success': true,
        'action': 'deleted',
      });
      return NextResponse.json({ success: true, data: { deleted: true } });
    }

    const updateSpan = tracer.startSpan('cart.update_in_database');
    let cartItem;
    try {
      updateSpan.setAttributes({
        'database.url': DATABASE_SERVICE_URL,
        'http.method': 'PUT',
        'http.url': `${DATABASE_SERVICE_URL}/api/cart`,
        'cart.quantity': parseInt(quantity),
      });

      const response = await fetch(`${DATABASE_SERVICE_URL}/api/cart`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity: parseInt(quantity) }),
      });

      cartItem = await response.json();

      updateSpan.setAttributes({
        'http.status_code': response.status,
      });
    } finally {
      updateSpan.end();
    }

    span.setAttributes({
      'success': true,
      'action': 'updated',
    });

    return NextResponse.json({ success: true, data: cartItem });
  } catch (error) {
    console.error('Error updating cart:', error);
    span.setAttributes({
      'success': false,
      'error': error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  } finally {
    span.end();
  }
}

// Delete cart item or clear cart
export async function DELETE(request: NextRequest) {
  const span = tracer.startSpan('cart.delete');
  try {
    span.setAttributes({
      'operation': 'delete_cart',
      'service': 'order-service',
    });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');

    if (id) {
      // Delete specific cart item
      span.setAttributes({
        'cart.item_id': id,
        'action': 'delete_single_item',
      });

      const deleteSpan = tracer.startSpan('cart.delete_single_item');
      try {
        deleteSpan.setAttributes({
          'database.url': DATABASE_SERVICE_URL,
          'http.method': 'DELETE',
          'cart.item_id': id,
        });

        await fetch(`${DATABASE_SERVICE_URL}/api/cart?id=${id}`, {
          method: 'DELETE',
        });

        deleteSpan.setAttributes({
          'success': true,
        });
      } finally {
        deleteSpan.end();
      }

      span.setAttributes({
        'success': true,
      });
      return NextResponse.json({ success: true, message: 'Cart item removed' });
    }

    if (userId) {
      // Clear entire cart for user
      span.setAttributes({
        'user.id': userId,
        'action': 'clear_cart',
      });

      const fetchSpan = tracer.startSpan('cart.fetch_items_for_deletion');
      let cartItems;
      try {
        fetchSpan.setAttributes({
          'database.url': DATABASE_SERVICE_URL,
          'user.id': userId,
        });

        const cartResponse = await fetch(`${DATABASE_SERVICE_URL}/api/cart?userId=${userId}`);
        cartItems = await cartResponse.json();

        fetchSpan.setAttributes({
          'cart.item_count': Array.isArray(cartItems) ? cartItems.length : 0,
        });
      } finally {
        fetchSpan.end();
      }

      const clearSpan = tracer.startSpan('cart.delete_all_items');
      try {
        clearSpan.setAttributes({
          'cart.item_count': Array.isArray(cartItems) ? cartItems.length : 0,
        });

        // Delete each item
        await Promise.all(
          cartItems.map((item: any) =>
            fetch(`${DATABASE_SERVICE_URL}/api/cart?id=${item.id}`, { method: 'DELETE' })
          )
        );

        clearSpan.setAttributes({
          'success': true,
        });
      } finally {
        clearSpan.end();
      }

      span.setAttributes({
        'success': true,
        'cart.items_deleted': Array.isArray(cartItems) ? cartItems.length : 0,
      });

      return NextResponse.json({ success: true, message: 'Cart cleared' });
    }

    span.setAttributes({
      'success': false,
      'error': 'missing_user_id_or_item_id',
    });

    return NextResponse.json(
      { success: false, error: 'User ID or item ID is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error deleting from cart:', error);
    span.setAttributes({
      'success': false,
      'error': error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { success: false, error: 'Failed to delete from cart' },
      { status: 500 }
    );
  } finally {
    span.end();
  }
}
