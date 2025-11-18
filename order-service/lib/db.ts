import { sql } from '@vercel/postgres';

// Initialize database tables
export async function initOrderDb() {
  try {
    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create order_items table
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create cart table
    await sql`
      CREATE TABLE IF NOT EXISTS cart (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        product_id UUID NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      )
    `;

    console.log('Order database tables initialized');
  } catch (error) {
    console.error('Error initializing order database:', error);
    throw error;
  }
}

// Cart operations
export async function getCart(userId: string) {
  const { rows } = await sql`
    SELECT * FROM cart WHERE user_id = ${userId}
  `;
  return rows;
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const { rows } = await sql`
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (${userId}, ${productId}, ${quantity})
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET quantity = cart.quantity + ${quantity}
    RETURNING *
  `;
  return rows[0];
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  if (quantity <= 0) {
    await sql`DELETE FROM cart WHERE user_id = ${userId} AND product_id = ${productId}`;
    return { deleted: true };
  }

  const { rows } = await sql`
    UPDATE cart
    SET quantity = ${quantity}
    WHERE user_id = ${userId} AND product_id = ${productId}
    RETURNING *
  `;
  return rows[0];
}

export async function clearCart(userId: string) {
  await sql`DELETE FROM cart WHERE user_id = ${userId}`;
  return { success: true };
}

// Order operations
export async function createOrder(userId: string, total: number) {
  const { rows } = await sql`
    INSERT INTO orders (user_id, total, status)
    VALUES (${userId}, ${total}, 'pending')
    RETURNING *
  `;
  return rows[0];
}

export async function addOrderItem(orderId: string, productId: string, quantity: number, price: number) {
  const { rows } = await sql`
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (${orderId}, ${productId}, ${quantity}, ${price})
    RETURNING *
  `;
  return rows[0];
}

export async function getOrderById(orderId: string) {
  const { rows: orders } = await sql`
    SELECT * FROM orders WHERE id = ${orderId}
  `;

  if (orders.length === 0) return null;

  const { rows: items } = await sql`
    SELECT * FROM order_items WHERE order_id = ${orderId}
  `;

  return {
    ...orders[0],
    items,
  };
}

export async function getOrdersByUserId(userId: string) {
  const { rows } = await sql`
    SELECT o.*,
           json_agg(json_build_object(
             'id', oi.id,
             'product_id', oi.product_id,
             'quantity', oi.quantity,
             'price', oi.price
           )) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ${userId}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  return rows;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { rows } = await sql`
    UPDATE orders
    SET status = ${status}
    WHERE id = ${orderId}
    RETURNING *
  `;
  return rows[0];
}
