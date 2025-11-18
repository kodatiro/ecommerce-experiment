import { NextRequest, NextResponse } from 'next/server';

const DATABASE_SERVICE_URL = process.env.DATABASE_SERVICE_URL || 'http://localhost:3004';

// Get cart for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${DATABASE_SERVICE_URL}/api/cart?userId=${userId}`);
    const cart = await response.json();
    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
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
  try {
    const body = await request.json();
    const { id, quantity, userId, productId } = body;

    if (quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If quantity is 0, delete the item
    if (quantity <= 0 && id) {
      await fetch(`${DATABASE_SERVICE_URL}/api/cart?id=${id}`, {
        method: 'DELETE',
      });
      return NextResponse.json({ success: true, data: { deleted: true } });
    }

    const response = await fetch(`${DATABASE_SERVICE_URL}/api/cart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity: parseInt(quantity) }),
    });

    const cartItem = await response.json();
    return NextResponse.json({ success: true, data: cartItem });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// Delete cart item or clear cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');

    if (id) {
      // Delete specific cart item
      await fetch(`${DATABASE_SERVICE_URL}/api/cart?id=${id}`, {
        method: 'DELETE',
      });
      return NextResponse.json({ success: true, message: 'Cart item removed' });
    }

    if (userId) {
      // Clear entire cart for user
      // Get all cart items for user first
      const cartResponse = await fetch(`${DATABASE_SERVICE_URL}/api/cart?userId=${userId}`);
      const cartItems = await cartResponse.json();

      // Delete each item
      await Promise.all(
        cartItems.map((item: any) =>
          fetch(`${DATABASE_SERVICE_URL}/api/cart?id=${item.id}`, { method: 'DELETE' })
        )
      );

      return NextResponse.json({ success: true, message: 'Cart cleared' });
    }

    return NextResponse.json(
      { success: false, error: 'User ID or item ID is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error deleting from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete from cart' },
      { status: 500 }
    );
  }
}
