'use client';

import { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { trackCartViewed, trackCheckoutStarted, trackOrderCompleted, trackProductRemovedFromCart } from '@/lib/amplitude';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [products, setProducts] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const userId = 'demo-user-id'; // TODO: Get from auth

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const response = await ApiClient.getCart(userId);
    if (response.success && response.data) {
      setCartItems(response.data);

      // Fetch product details for each cart item
      const productMap = new Map();
      for (const item of response.data) {
        const productResponse = await ApiClient.getProduct(item.product_id);
        if (productResponse.success && productResponse.data) {
          productMap.set(item.product_id, productResponse.data);
        }
      }
      setProducts(productMap);

      // Track cart viewed
      const total = response.data.reduce((sum: number, item: any) => {
        const product = productMap.get(item.product_id);
        return sum + (product ? parseFloat(product.price) * item.quantity : 0);
      }, 0);
      trackCartViewed(total, response.data.length);
    }
    setLoading(false);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const response = await ApiClient.updateCartItem(userId, productId, quantity);
    if (response.success) {
      loadCart();
    }
  };

  const removeItem = async (productId: string) => {
    const product = products.get(productId);

    const response = await ApiClient.updateCartItem(userId, productId, 0);
    if (response.success) {
      // Track product removal
      if (product) {
        trackProductRemovedFromCart({
          id: productId,
          name: product.name,
        });
      }
      loadCart();
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.get(item.product_id);
      return total + (product ? parseFloat(product.price) * item.quantity : 0);
    }, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const total = calculateTotal();

    // Track checkout started
    trackCheckoutStarted(total, cartItems.length);

    const confirmed = window.confirm(
      `Are you sure you want to place this order for $${total.toFixed(2)}?`
    );

    if (!confirmed) return;

    try {
      // Prepare order items
      const orderItems = cartItems.map((item) => {
        const product = products.get(item.product_id);
        return {
          productId: item.product_id,
          quantity: item.quantity,
          price: product ? product.price : '0',
        };
      });

      // Create order
      const response = await ApiClient.createOrder(
        userId,
        orderItems,
        total.toFixed(2)
      );

      if (response.success) {
        // Track order completed with revenue
        trackOrderCompleted({
          orderId: response.data?.id || 'unknown',
          total: total,
          itemCount: cartItems.length,
          items: orderItems.map((item) => {
            const product = products.get(item.productId);
            return {
              productId: item.productId,
              productName: product?.name || 'Unknown',
              quantity: item.quantity,
              price: parseFloat(item.price),
            };
          }),
        });

        // Clear cart
        await ApiClient.clearCart(userId);
        alert('Order placed successfully! Your order is now pending.');
        // Reload cart
        loadCart();
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => {
              const product = products.get(item.product_id);
              if (!product) return null;

              return (
                <div key={item.id} className="flex gap-4 border-b py-4">
                  <div className="w-24 h-24 bg-gray-200 rounded">
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600">${parseFloat(product.price).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                        className="border rounded px-2 py-1 w-16"
                      />
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(parseFloat(product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
