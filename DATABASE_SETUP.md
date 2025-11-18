# Database Setup Guide

This guide will help you set up the database tables for each microservice.

## Database Schemas

### Product Service Database

```sql
-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sample data
INSERT INTO categories (name, slug) VALUES
  ('Electronics', 'electronics'),
  ('Clothing', 'clothing'),
  ('Books', 'books'),
  ('Home & Garden', 'home-garden');

INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
  ('Laptop', 'High-performance laptop', 999.99, 10, (SELECT id FROM categories WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'),
  ('T-Shirt', 'Comfortable cotton t-shirt', 19.99, 50, (SELECT id FROM categories WHERE slug = 'clothing'), 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'),
  ('Novel', 'Bestselling fiction novel', 14.99, 30, (SELECT id FROM categories WHERE slug = 'books'), 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'),
  ('Plant Pot', 'Ceramic plant pot', 24.99, 20, (SELECT id FROM categories WHERE slug = 'home-garden'), 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500');
```

### Order Service Database

```sql
-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

### User Service Database

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Setup Methods

### Method 1: Automatic Initialization

The database tables will be created automatically when you make the first API call to each service. The application includes initialization functions that run when needed.

### Method 2: Manual Setup via Vercel Postgres Dashboard

1. Go to your Vercel Dashboard
2. Navigate to Storage → Your Database
3. Click on "Query" or "SQL Editor"
4. Copy and paste the SQL statements above for each database
5. Execute the queries

### Method 3: Using a Database Client

1. Use a tool like pgAdmin, DBeaver, or TablePlus
2. Connect using your Postgres connection string
3. Run the SQL statements above

### Method 4: API Endpoints (Coming Soon)

You can create initialization endpoints:

```typescript
// Example: /api/init endpoint
export async function GET() {
  await initProductDb();
  return NextResponse.json({ success: true });
}
```

## Verification

After setup, verify your tables:

```sql
-- Check all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Check data
SELECT * FROM products;
SELECT * FROM categories;
SELECT * FROM users;
```

## Troubleshooting

**Issue: Tables not created**
- Check database connection string
- Verify database user has CREATE TABLE permissions
- Check application logs for errors

**Issue: Foreign key constraints failing**
- Ensure parent tables are created first (categories before products)
- Verify UUID extension is enabled: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

**Issue: Connection pooling errors**
- Use `POSTGRES_PRISMA_URL` for pooled connections
- Use `POSTGRES_URL_NON_POOLING` for direct connections
