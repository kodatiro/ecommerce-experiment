# OpenTelemetry Instrumentation Setup

## Status: FULLY CONFIGURED ✓

All services have been successfully deployed to Vercel with OpenTelemetry instrumentation enabled.

## Verification

Build logs confirm:
- ✓ OpenTelemetry dependency detected: `@vercel/otel@2.1.0`
- ✓ `instrumentationHook` experiment enabled in all services
- ✓ All deployments successful and ready

## Custom Metrics & Spans Implemented

### 1. Order Service - Checkout Flow (`/api/checkout`)

**Main Span:** `checkout.process`
- **Attributes:**
  - `checkout.userId` - User ID performing checkout
  - `checkout.itemCount` - Number of items in order
  - `checkout.total` - Total order amount
  - `checkout.success` - Boolean success status
  - `checkout.orderId` - Generated order ID
  - `checkout.error` - Error type if failed

**Child Spans:**
- `checkout.stripe.createPaymentIntent`
  - `stripe.paymentIntentId` - Stripe payment intent ID
  - `stripe.amount` - Payment amount in cents
- `checkout.createOrder`
  - `order.id` - Created order ID
- `checkout.addOrderItems`
  - `order.itemCount` - Number of items added
- `checkout.clearCart`

### 2. Order Service - Cart Operations

**Cart Retrieval:** `cart.get`
- **Attributes:**
  - `cart.operation` - Operation type (get)
  - `cart.userId` - User ID
  - `cart.itemCount` - Number of items in cart
  - `cart.success` - Boolean success status
  - `cart.error` - Error type if failed

**Add to Cart:** `cart.addItem`
- **Attributes:**
  - `cart.operation` - Operation type (addItem)
  - `cart.userId` - User ID
  - `cart.productId` - Product being added
  - `cart.quantity` - Quantity added
  - `cart.itemId` - Created cart item ID
  - `cart.success` - Boolean success status

### 3. Product Service

**List Products:** `products.list`
- **Attributes:**
  - `products.operation` - Operation type (list)
  - `products.count` - Number of products returned
  - `products.success` - Boolean success status
  - `products.error` - Error type if failed

**Create Product:** `products.create`
- **Attributes:**
  - `products.operation` - Operation type (create)
  - `products.name` - Product name
  - `products.price` - Product price
  - `products.stock` - Stock quantity
  - `products.id` - Created product ID
  - `products.success` - Boolean success status

### 4. User Service - Authentication

**Login:** `auth.login`
- **Attributes:**
  - `auth.operation` - Operation type (login)
  - `auth.email` - User email
  - `auth.success` - Boolean success status
  - `auth.userId` - User ID
  - `auth.error` - Error type (missing_credentials, invalid_credentials, invalid_password, login_failed)

**Child Spans:**
- `auth.fetchUser`
  - `auth.userId` - Fetched user ID
- `auth.verifyPassword`
  - `auth.passwordValid` - Boolean password validity
- `auth.generateToken`

## How to View Traces on Vercel

1. Log into your Vercel dashboard: https://vercel.com
2. Navigate to your project (e.g., order-service)
3. Go to the "Observability" or "Runtime Logs" tab
4. You will see:
   - Trace timelines showing span durations
   - Custom attributes for debugging
   - Error tracking with exceptions
   - Performance metrics for each operation

## Service URLs

- **Frontend:** https://frontend-seven-eosin-24.vercel.app
- **Product Service:** https://product-service-eight.vercel.app
- **Order Service:** https://order-service-three.vercel.app
- **User Service:** https://user-service-mocha.vercel.app

## Files Modified

### Each Service:
- ✓ `instrumentation.ts` - OTel registration with unique service name
- ✓ `next.config.js` - Enabled `instrumentationHook: true`
- ✓ `package.json` - Added `@opentelemetry/api` and `@vercel/otel`
- ✓ API routes - Added custom spans with attributes

## Example Trace Flow

When a user completes a checkout:

```
checkout.process (order-service)
├── checkout.stripe.createPaymentIntent
│   └── [External: Stripe API call]
├── checkout.createOrder
│   └── [Database: Insert order]
├── checkout.addOrderItems
│   └── [Database: Insert order items]
└── checkout.clearCart
    └── [Database: Delete cart items]
```

Each span includes timing, attributes, and error tracking for full observability.

## Next Steps

1. Visit Vercel dashboard to view traces
2. Trigger some API calls to generate trace data
3. Set up alerts based on span duration or error rates (Vercel settings)
4. Consider adding more custom spans to other routes as needed
