import { sql } from '@vercel/postgres';

// Initialize database tables
export async function initProductDb() {
  try {
    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        category_id UUID REFERENCES categories(id),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Product CRUD operations
export async function getAllProducts() {
  const { rows } = await sql`
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;
  return rows;
}

export async function getProductById(id: string) {
  const { rows } = await sql`
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ${id}
  `;
  return rows[0];
}

export async function createProduct(product: {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  image_url: string;
}) {
  const { rows } = await sql`
    INSERT INTO products (name, description, price, stock, category_id, image_url)
    VALUES (${product.name}, ${product.description}, ${product.price}, ${product.stock}, ${product.category_id}, ${product.image_url})
    RETURNING *
  `;
  return rows[0];
}

export async function updateProduct(id: string, product: Partial<{
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  image_url: string;
}>) {
  const fields = [];
  const values = [];

  if (product.name !== undefined) {
    fields.push('name');
    values.push(product.name);
  }
  if (product.description !== undefined) {
    fields.push('description');
    values.push(product.description);
  }
  if (product.price !== undefined) {
    fields.push('price');
    values.push(product.price);
  }
  if (product.stock !== undefined) {
    fields.push('stock');
    values.push(product.stock);
  }
  if (product.category_id !== undefined) {
    fields.push('category_id');
    values.push(product.category_id);
  }
  if (product.image_url !== undefined) {
    fields.push('image_url');
    values.push(product.image_url);
  }

  if (fields.length === 0) return null;

  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
  const { rows } = await sql.query(
    `UPDATE products SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );
  return rows[0];
}

export async function deleteProduct(id: string) {
  await sql`DELETE FROM products WHERE id = ${id}`;
  return { success: true };
}

// Category CRUD operations
export async function getAllCategories() {
  const { rows } = await sql`SELECT * FROM categories ORDER BY name`;
  return rows;
}

export async function getCategoryById(id: string) {
  const { rows } = await sql`SELECT * FROM categories WHERE id = ${id}`;
  return rows[0];
}

export async function createCategory(category: { name: string; slug: string }) {
  const { rows } = await sql`
    INSERT INTO categories (name, slug)
    VALUES (${category.name}, ${category.slug})
    RETURNING *
  `;
  return rows[0];
}
