// Mock data for orders and cart

export const mockCart: any[] = [];

export const mockOrders = [
  {
    id: '1',
    user_id: 'demo-user-id',
    total: '3749.97',
    status: 'delivered',
    created_at: '2024-01-15T10:30:00Z',
    items: [
      {
        id: '1',
        order_id: '1',
        product_id: '1',
        quantity: 1,
        price: '2499.99'
      },
      {
        id: '2',
        order_id: '1',
        product_id: '2',
        quantity: 1,
        price: '999.99'
      },
      {
        id: '3',
        order_id: '1',
        product_id: '3',
        quantity: 1,
        price: '249.99'
      }
    ]
  },
  {
    id: '2',
    user_id: 'demo-user-id',
    total: '259.96',
    status: 'shipped',
    created_at: '2024-02-01T14:20:00Z',
    items: [
      {
        id: '4',
        order_id: '2',
        product_id: '6',
        quantity: 2,
        price: '129.98'
      }
    ]
  },
  {
    id: '3',
    user_id: 'demo-user-id',
    total: '114.97',
    status: 'pending',
    created_at: '2024-02-10T09:15:00Z',
    items: [
      {
        id: '5',
        order_id: '3',
        product_id: '9',
        quantity: 1,
        price: '34.99'
      },
      {
        id: '6',
        order_id: '3',
        product_id: '7',
        quantity: 1,
        price: '24.99'
      },
      {
        id: '7',
        order_id: '3',
        product_id: '8',
        quantity: 1,
        price: '49.99'
      }
    ]
  }
];
