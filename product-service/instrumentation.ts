import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({
    serviceName: 'ecommerce-product-service',
  });
}
