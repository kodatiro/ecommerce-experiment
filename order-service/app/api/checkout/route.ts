import { NextRequest, NextResponse } from 'next/server';
import { createOrder, addOrderItem, getCart, clearCart } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, items, total } = body;

    if (!userId || !items || !total) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(total) * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId,
      },
    });

    // Create the order
    const order = await createOrder(userId, parseFloat(total));

    // Add order items
    for (const item of items) {
      await addOrderItem(
        order.id,
        item.productId,
        parseInt(item.quantity),
        parseFloat(item.price)
      );
    }

    // Clear the cart after successful order
    await clearCart(userId);

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        clientSecret: paymentIntent.client_secret,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing checkout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
