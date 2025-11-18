# Mock Data Reference

All services are now running with a centralized database service - no external database needed!

## Architecture

The application uses a **centralized database service** that acts as a single source of truth for all data:
- **Database Service** (Port 3004): Stores all data in memory using HashMap/Map structures with globalThis persistence
- **Product Service** (Port 3001): Calls database service for product data
- **Order Service** (Port 3002): Calls database service for order and cart data
- **User Service** (Port 3003): Calls database service for user and address data
- **Frontend** (Port 3000): Calls the three service APIs

This architecture ensures data consistency - when you create or delete a product in the admin panel, the change is immediately visible everywhere because all services read from the same centralized data store.

## Access Information

### SSH Port Forwarding Command:
```bash
ssh -L 3000:localhost:3000 -L 3001:localhost:3001 -L 3002:localhost:3002 -L 3003:localhost:3003 -L 3004:localhost:3004 -l sy-user rohan_gcp_cloud
```

### URLs (Access from your local machine after SSH tunnel):
- **Frontend**: http://localhost:3000
- **Product Service API**: http://localhost:3001/api/products
- **Order Service API**: http://localhost:3002/api/orders
- **User Service API**: http://localhost:3003/api/auth/login
- **Database Service API**: http://localhost:3004/api (internal - called by other services)

## Mock User Accounts

### Demo User
- **Email**: `demo@example.com`
- **Password**: `password123`
- **User ID**: `demo-user-id`
- **Purpose**: Regular customer account with existing orders

### Admin User
- **Email**: `admin@example.com`
- **Password**: `password123`
- **User ID**: `admin-user-id`
- **Purpose**: Administrator account for product management

## Mock Products (12 Total)

### Electronics
1. **MacBook Pro 16"** - $2,499.99 (15 in stock)
2. **iPhone 15 Pro** - $999.99 (25 in stock)
3. **AirPods Pro** - $249.99 (50 in stock)
4. **Wireless Keyboard** - $149.99 (20 in stock)
5. **Smart Watch** - $299.99 (35 in stock)

### Clothing
6. **Designer Cotton T-Shirt** - $39.99 (100 in stock)
7. **Denim Jacket** - $89.99 (40 in stock)
8. **Running Shoes** - $129.99 (60 in stock)

### Books
9. **The Great Novel** - $24.99 (80 in stock)
10. **Programming Guide** - $49.99 (35 in stock)

### Home & Garden
11. **Ceramic Plant Pot** - $34.99 (45 in stock)
12. **Garden Tool Set** - $79.99 (30 in stock)

All products have professional Unsplash images.

## Mock Orders (Demo User)

### Order #1 - Delivered
- **Total**: $3,749.97
- **Items**: MacBook Pro, iPhone 15 Pro, AirPods Pro
- **Date**: January 15, 2024

### Order #2 - Shipped
- **Total**: $259.96
- **Items**: 2x Running Shoes
- **Date**: February 1, 2024

### Order #3 - Pending
- **Total**: $114.97
- **Items**: Plant Pot, Novel, Programming Guide
- **Date**: February 10, 2024

## Mock Addresses

### Demo User Addresses
1. **Home**: 123 Main Street, San Francisco, CA 94102, USA
2. **Work**: 456 Work Ave, San Francisco, CA 94103, USA

### Admin User Address
1. **Office**: 789 Admin Blvd, New York, NY 10001, USA

## Features to Test

### Homepage (/)
- View featured products
- Browse product catalog
- See product images and prices

### Products Page (/products)
- View all 12 products
- See different categories
- Click on products for details

### Product Detail Page (/products/[id])
- View product details
- See stock availability
- Add to cart (uses demo-user-id)

### Cart Page (/cart)
- View cart items
- Update quantities
- Remove items
- See total price
- Checkout button

### Orders Page (/orders)
- View order history (3 orders for demo user)
- See order status (delivered, shipped, pending)
- View order items

### Admin Page (/admin)
- View all products in table format
- Create new products
- Delete products
- Manage product catalog

## API Testing

You can test the APIs directly using curl or Postman:

### Get All Products
```bash
curl http://localhost:3001/api/products
```

### Get Single Product
```bash
curl http://localhost:3001/api/products/1
```

### Login
```bash
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'
```

### Add to Cart
```bash
curl -X POST http://localhost:3002/api/cart \
  -H "Content-Type: application/json" \
  -d '{"userId":"demo-user-id","productId":"1","quantity":1}'
```

### Get Cart
```bash
curl http://localhost:3002/api/cart?userId=demo-user-id
```

### Get Orders
```bash
curl http://localhost:3002/api/orders?userId=demo-user-id
```

## Notes

- All data is stored in memory (resets on server restart)
- No database connection required
- Perfect for development and testing
- All images are from Unsplash
- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt

## Next Steps

To use real databases in production:
1. Set up Vercel Postgres databases
2. Add connection strings to environment variables
3. Replace mock data imports with actual database calls
4. Deploy to Vercel

Enjoy testing your microservices ecommerce store! 🛍️
