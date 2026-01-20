/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  instrumentationHook: true,
  env: {
    PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
    ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || 'http://localhost:3002',
    USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://localhost:3003',
  },
}

module.exports = nextConfig
