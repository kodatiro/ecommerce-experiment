import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({
    serviceName: 'ecommerce-order-service',
    instrumentationConfig: {
      fetch: {
        propagateContextUrls: [
          'database-service',
          'vercel.app',
        ],
      },
    },
  });
}
