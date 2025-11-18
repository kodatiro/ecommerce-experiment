import * as amplitude from '@amplitude/unified';

// Custom event tracking helpers
export const trackEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    amplitude.track(eventName, eventProperties);
  }
};

// User identification
export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    amplitude.setUserId(userId);
    if (userProperties) {
      amplitude.identify(userProperties);
    }
  }
};

// Set user properties
export const setUserProperty = (property: string, value: any) => {
  if (typeof window !== 'undefined') {
    const props: Record<string, any> = {};
    props[property] = value;
    amplitude.identify(props);
  }
};

// Ecommerce Events
export const trackProductViewed = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
}) => {
  trackEvent('Product Viewed', {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    product_category: product.category,
  });
};

export const trackProductAddedToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  trackEvent('Product Added to Cart', {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    quantity: product.quantity,
    cart_value: product.price * product.quantity,
  });
};

export const trackProductRemovedFromCart = (product: {
  id: string;
  name: string;
}) => {
  trackEvent('Product Removed from Cart', {
    product_id: product.id,
    product_name: product.name,
  });
};

export const trackCartViewed = (cartTotal: number, itemCount: number) => {
  trackEvent('Cart Viewed', {
    cart_total: cartTotal,
    item_count: itemCount,
  });
};

export const trackCheckoutStarted = (orderTotal: number, itemCount: number) => {
  trackEvent('Checkout Started', {
    order_total: orderTotal,
    item_count: itemCount,
  });
};

export const trackOrderCompleted = (order: {
  orderId: string;
  total: number;
  itemCount: number;
  items: Array<{ productId: string; productName: string; quantity: number; price: number }>;
}) => {
  trackEvent('Order Completed', {
    order_id: order.orderId,
    order_total: order.total,
    item_count: order.itemCount,
    products: order.items.map(item => item.productName).join(', '),
    revenue: order.total, // Include revenue in event properties
  });

  // Track revenue using event properties
  if (typeof window !== 'undefined') {
    amplitude.track('Revenue', {
      productId: order.orderId,
      price: order.total,
      quantity: order.itemCount,
      revenueType: 'Purchase',
    });
  }
};

// Admin Events
export const trackProductCreated = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
}) => {
  trackEvent('Product Created (Admin)', {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    product_category: product.category,
  });
};

export const trackProductDeleted = (product: {
  id: string;
  name: string;
}) => {
  trackEvent('Product Deleted (Admin)', {
    product_id: product.id,
    product_name: product.name,
  });
};

export const trackProductUpdated = (product: {
  id: string;
  name: string;
}) => {
  trackEvent('Product Updated (Admin)', {
    product_id: product.id,
    product_name: product.name,
  });
};

// Search Events
export const trackSearch = (query: string, resultCount: number) => {
  trackEvent('Search Performed', {
    search_query: query,
    result_count: resultCount,
  });
};

// Page View Events (in addition to autocapture)
export const trackPageView = (pageName: string, properties?: Record<string, any>) => {
  trackEvent('Page Viewed', {
    page_name: pageName,
    ...properties,
  });
};
