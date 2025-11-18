import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

// GET /api/cart?userId=xxx - Get cart items for a user
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

    const cartItems = Array.from(dataStore.cartItems.values()).filter(
      item => item.user_id === userId
    );

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity } = body;

    // Check if item already exists in cart
    const existingItem = Array.from(dataStore.cartItems.values()).find(
      item => item.user_id === userId && item.product_id === productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
      dataStore.cartItems.set(existingItem.id, existingItem);
      return NextResponse.json(existingItem);
    }

    // Create new cart item
    const id = `cart-${Date.now()}`;
    const newItem = {
      id,
      user_id: userId,
      product_id: productId,
      quantity,
      created_at: new Date().toISOString(),
    };

    dataStore.cartItems.set(id, newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// PUT /api/cart/:id - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, quantity } = body;

    const cartItem = dataStore.cartItems.get(id);

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    cartItem.quantity = quantity;
    dataStore.cartItems.set(id, cartItem);

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/:id - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    const cartItem = dataStore.cartItems.get(id);

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    dataStore.cartItems.delete(id);

    return NextResponse.json({ message: 'Cart item removed' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
