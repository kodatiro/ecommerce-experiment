// Mock data for users and addresses
// Password for all users is "password123" hashed with bcrypt

export const mockUsers = [
  {
    id: 'demo-user-id',
    email: 'demo@example.com',
    password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // password123
    name: 'Demo User',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'admin-user-id',
    email: 'admin@example.com',
    password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // password123
    name: 'Admin User',
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const mockAddresses = [
  {
    id: '1',
    user_id: 'demo-user-id',
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'USA',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'demo-user-id',
    street: '456 Work Ave',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    country: 'USA',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    user_id: 'admin-user-id',
    street: '789 Admin Blvd',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
    created_at: '2024-01-01T00:00:00Z'
  }
];
