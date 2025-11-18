# Microservices Ecommerce Store on Vercel

A full-featured ecommerce store built with microservices architecture on Vercel. This project demonstrates how to build scalable, distributed applications using Next.js and serverless functions.

## Architecture

This application consists of 4 separate Next.js projects:

1. **Product Service** (port 3001) - Manages product catalog and inventory
2. **Order Service** (port 3002) - Handles shopping cart, orders, and checkout
3. **User Service** (port 3003) - Manages user authentication and profiles
4. **Frontend** (port 3000) - Customer-facing web application

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Vercel Postgres
- **Payment**: Stripe
- **Auth**: JWT + bcryptjs
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Local Development Setup

### Prerequisites

- Node.js 18+ installed
- PostgreSQL databases (or Vercel Postgres)
- Stripe account (for payment processing)

### Installation

1. **Clone the repository and install dependencies:**

```bash
# Install dependencies for all services
cd product-service && npm install
cd ../order-service && npm install
cd ../user-service && npm install
cd ../frontend && npm install
```

2. **Set up environment variables:**

Create `.env.local` files in each service directory based on the `.env.example` files:

**product-service/.env.local:**
```
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-postgres-url?pgbouncer=true"
POSTGRES_URL_NON_POOLING="your-postgres-url"
```

**order-service/.env.local:**
```
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-postgres-url?pgbouncer=true"
POSTGRES_URL_NON_POOLING="your-postgres-url"
STRIPE_SECRET_KEY="sk_test_..."
PRODUCT_SERVICE_URL="http://localhost:3001"
```

**user-service/.env.local:**
```
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-postgres-url?pgbouncer=true"
POSTGRES_URL_NON_POOLING="your-postgres-url"
JWT_SECRET="your-secret-key-here"
```

**frontend/.env.local:**
```
NEXT_PUBLIC_PRODUCT_SERVICE_URL="http://localhost:3001"
NEXT_PUBLIC_ORDER_SERVICE_URL="http://localhost:3002"
NEXT_PUBLIC_USER_SERVICE_URL="http://localhost:3003"
```

3. **Initialize databases:**

The database tables will be created automatically when you make the first API call to each service. Alternatively, you can run the SQL scripts manually.

4. **Start all services:**

Open 4 terminal windows and run:

```bash
# Terminal 1 - Product Service
cd product-service && npm run dev

# Terminal 2 - Order Service
cd order-service && npm run dev

# Terminal 3 - User Service
cd user-service && npm run dev

# Terminal 4 - Frontend
cd frontend && npm run dev
```

5. **Access the application:**

- Frontend: http://localhost:3000
- Product Service API: http://localhost:3001/api
- Order Service API: http://localhost:3002/api
- User Service API: http://localhost:3003/api

## Deploying to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy each service separately:**

```bash
# Deploy Product Service
cd product-service
vercel --prod

# Deploy Order Service
cd ../order-service
vercel --prod

# Deploy User Service
cd ../user-service
vercel --prod

# Deploy Frontend (deploy last, after getting service URLs)
cd ../frontend
vercel --prod
```

3. **Configure environment variables in Vercel:**

For each project, go to Vercel Dashboard → Project Settings → Environment Variables and add:

- Product Service: `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`
- Order Service: Same as product + `STRIPE_SECRET_KEY`, `PRODUCT_SERVICE_URL`
- User Service: Postgres vars + `JWT_SECRET`
- Frontend: `NEXT_PUBLIC_PRODUCT_SERVICE_URL`, `NEXT_PUBLIC_ORDER_SERVICE_URL`, `NEXT_PUBLIC_USER_SERVICE_URL`

### Option 2: Deploy via GitHub

1. **Push each service to separate Git repositories:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Import each repository in Vercel:**
   - Go to https://vercel.com/new
   - Import each Git repository
   - Configure environment variables
   - Deploy

### Database Setup on Vercel

1. **Create Vercel Postgres databases:**
   - Go to Vercel Dashboard → Storage → Create Database
   - Create 3 separate databases (product, order, user)
   - Copy connection strings to environment variables

2. **Initialize tables:**
   - Make API calls to trigger table creation
   - Or use Vercel Postgres SQL Editor to run CREATE TABLE statements

## API Documentation

### Product Service API

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin)

### Order Service API

- `GET /api/cart?userId=:id` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart?userId=:id` - Clear cart
- `GET /api/orders?userId=:id` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `POST /api/checkout` - Process checkout with Stripe

### User Service API

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/addresses` - Get user addresses
- `POST /api/users/:id/addresses` - Add address

## Project Structure

```
ecommerce-vercel/
├── product-service/       # Product microservice
│   ├── app/api/
│   │   ├── products/
│   │   └── categories/
│   ├── lib/
│   │   └── db.ts
│   ├── package.json
│   └── vercel.json
├── order-service/         # Order microservice
│   ├── app/api/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── checkout/
│   ├── lib/
│   │   └── db.ts
│   ├── package.json
│   └── vercel.json
├── user-service/          # User microservice
│   ├── app/api/
│   │   ├── auth/
│   │   └── users/
│   ├── lib/
│   │   ├── db.ts
│   │   └── auth.ts
│   ├── package.json
│   └── vercel.json
├── frontend/              # Frontend application
│   ├── app/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── admin/
│   ├── components/
│   ├── lib/
│   │   └── api-client.ts
│   ├── package.json
│   └── vercel.json
└── shared/
    └── types/
        └── index.ts       # Shared TypeScript types
```

## Features

- Product catalog with categories
- Shopping cart management
- Order processing
- Stripe payment integration
- User authentication (JWT)
- User profile management
- Admin product management
- Responsive UI with Tailwind CSS

## Future Enhancements

- [ ] Add proper authentication flow with session management
- [ ] Implement image upload (Vercel Blob)
- [ ] Add product search and filtering
- [ ] Implement order tracking
- [ ] Add email notifications
- [ ] Create user dashboard
- [ ] Add reviews and ratings
- [ ] Implement inventory management
- [ ] Add analytics and reporting
- [ ] Create mobile app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License
