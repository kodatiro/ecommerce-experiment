# Amplitude Tracking Guide

## Overview

Your ecommerce application now has comprehensive Amplitude Analytics with Session Replay enabled. All tracking functions are available in `/frontend/lib/amplitude.ts`.

## What's Already Tracking

### Automatic (Autocapture)
- ✅ All clicks
- ✅ All page views
- ✅ Form submissions
- ✅ Button clicks
- ✅ Session replays (100% of sessions)

### Custom Events Implemented

#### Cart Page (`/cart`)
- ✅ **Cart Viewed** - Tracks when user views their cart with total and item count
- ✅ **Product Removed from Cart** - Tracks when items are removed
- ✅ **Checkout Started** - Tracks when user clicks "Proceed to Checkout"
- ✅ **Order Completed** - Tracks successful orders with revenue data

## Available Tracking Functions

### General Events
```typescript
import { trackEvent } from '@/lib/amplitude';

trackEvent('Custom Event Name', {
  property1: 'value1',
  property2: 'value2'
});
```

### Ecommerce Events

#### Product Viewed
```typescript
import { trackProductViewed } from '@/lib/amplitude';

trackProductViewed({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category
});
```

#### Add to Cart
```typescript
import { trackProductAddedToCart } from '@/lib/amplitude';

trackProductAddedToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  quantity: quantity
});
```

#### Remove from Cart (Already implemented)
```typescript
trackProductRemovedFromCart({
  id: productId,
  name: productName
});
```

#### Cart Viewed (Already implemented)
```typescript
trackCartViewed(cartTotal, itemCount);
```

#### Checkout Started (Already implemented)
```typescript
trackCheckoutStarted(orderTotal, itemCount);
```

#### Order Completed with Revenue (Already implemented)
```typescript
trackOrderCompleted({
  orderId: 'order-123',
  total: 99.99,
  itemCount: 3,
  items: [
    {
      productId: '1',
      productName: 'MacBook Pro',
      quantity: 1,
      price: 2499.99
    }
  ]
});
```

### Admin Events

#### Product Created
```typescript
import { trackProductCreated } from '@/lib/amplitude';

trackProductCreated({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category
});
```

#### Product Deleted
```typescript
import { trackProductDeleted } from '@/lib/amplitude';

trackProductDeleted({
  id: product.id,
  name: product.name
});
```

#### Product Updated
```typescript
import { trackProductUpdated } from '@/lib/amplitude';

trackProductUpdated({
  id: product.id,
  name: product.name
});
```

### User Identification

#### Set User ID
```typescript
import { identifyUser } from '@/lib/amplitude';

// When user logs in
identifyUser('user-123', {
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'premium',
  signup_date: '2024-01-01'
});
```

#### Set User Properties
```typescript
import { setUserProperty } from '@/lib/amplitude';

setUserProperty('total_orders', 5);
setUserProperty('lifetime_value', 499.99);
setUserProperty('favorite_category', 'Electronics');
```

### Search Events
```typescript
import { trackSearch } from '@/lib/amplitude';

trackSearch('macbook pro', 12);  // query, resultCount
```

### Page Views
```typescript
import { trackPageView } from '@/lib/amplitude';

trackPageView('Product Detail Page', {
  product_id: '123',
  category: 'Electronics'
});
```

## Where to Add Tracking Next

### Product Pages
Add to `/app/products/[id]/page.tsx`:
- `trackProductViewed()` when product loads
- `trackProductAddedToCart()` when "Add to Cart" button clicked

### Admin Page
Add to `/app/admin/page.tsx`:
- `trackProductCreated()` when admin creates product
- `trackProductDeleted()` when admin deletes product

### Search (If you add it)
- `trackSearch()` when user searches

### User Authentication (If you add it)
- `identifyUser()` when user logs in
- Set user properties for personalization

## Viewing Your Data

1. Go to your Amplitude dashboard
2. Navigate to "Events" to see all tracked events
3. Check "Session Replay" to watch user sessions
4. Use "Revenue LTV" to track purchase analytics
5. Create funnels for checkout conversion analysis

## Revenue Tracking

Revenue is automatically tracked when `trackOrderCompleted()` is called. You'll see:
- Total revenue
- Revenue per user
- Average order value
- Purchase frequency
- Customer lifetime value

## Best Practices

1. **Product Views**: Track when users view products to understand what's popular
2. **Add to Cart**: Track add-to-cart actions to measure product interest
3. **Checkout Funnel**: Already tracking Cart → Checkout → Order Complete
4. **User Identification**: Identify users after login for better analytics
5. **Admin Actions**: Track admin actions for operational insights

## Example: Complete Checkout Funnel

Your app already tracks:
1. Product Viewed → (todo)
2. Product Added to Cart → (todo)
3. **Cart Viewed** ✅
4. **Checkout Started** ✅
5. **Order Completed** ✅ (with revenue)

Complete the funnel by adding product tracking!
