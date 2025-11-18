const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3001';
const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:3002';
const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3003';

export class ApiClient {
  private static async request<T>(
    url: string,
    options?: RequestInit
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, error: 'Request failed' };
    }
  }

  // Product Service
  static async getProducts() {
    return this.request(`${PRODUCT_SERVICE_URL}/api/products`);
  }

  static async getProduct(id: string) {
    return this.request(`${PRODUCT_SERVICE_URL}/api/products/${id}`);
  }

  static async createProduct(product: any) {
    return this.request(`${PRODUCT_SERVICE_URL}/api/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  static async updateProduct(id: string, product: any) {
    return this.request(`${PRODUCT_SERVICE_URL}/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  static async deleteProduct(id: string) {
    return this.request(`${PRODUCT_SERVICE_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  static async getCategories() {
    return this.request(`${PRODUCT_SERVICE_URL}/api/categories`);
  }

  // Order Service
  static async getCart(userId: string) {
    return this.request(`${ORDER_SERVICE_URL}/api/cart?userId=${userId}`);
  }

  static async addToCart(userId: string, productId: string, quantity: number) {
    return this.request(`${ORDER_SERVICE_URL}/api/cart`, {
      method: 'POST',
      body: JSON.stringify({ userId, productId, quantity }),
    });
  }

  static async updateCartItem(userId: string, productId: string, quantity: number) {
    return this.request(`${ORDER_SERVICE_URL}/api/cart`, {
      method: 'PUT',
      body: JSON.stringify({ userId, productId, quantity }),
    });
  }

  static async clearCart(userId: string) {
    return this.request(`${ORDER_SERVICE_URL}/api/cart?userId=${userId}`, {
      method: 'DELETE',
    });
  }

  static async getOrders(userId: string) {
    return this.request(`${ORDER_SERVICE_URL}/api/orders?userId=${userId}`);
  }

  static async getOrder(id: string) {
    return this.request(`${ORDER_SERVICE_URL}/api/orders/${id}`);
  }

  static async createOrder(userId: string, items: any[], total: string) {
    return this.request(`${ORDER_SERVICE_URL}/api/orders`, {
      method: 'POST',
      body: JSON.stringify({ userId, items, total }),
    });
  }

  static async checkout(userId: string, items: any[], total: number) {
    return this.request(`${ORDER_SERVICE_URL}/api/checkout`, {
      method: 'POST',
      body: JSON.stringify({ userId, items, total }),
    });
  }

  // User Service
  static async register(email: string, password: string, name: string) {
    return this.request(`${USER_SERVICE_URL}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  static async login(email: string, password: string) {
    return this.request(`${USER_SERVICE_URL}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async getUser(id: string) {
    return this.request(`${USER_SERVICE_URL}/api/users/${id}`);
  }

  static async updateUser(id: string, updates: any) {
    return this.request(`${USER_SERVICE_URL}/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  static async getAddresses(userId: string) {
    return this.request(`${USER_SERVICE_URL}/api/users/${userId}/addresses`);
  }

  static async createAddress(userId: string, address: any) {
    return this.request(`${USER_SERVICE_URL}/api/users/${userId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }
}
