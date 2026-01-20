import { registerOTel } from '@vercel/otel';

export function register() {
  console.log('[INSTRUMENTATION] Registering OpenTelemetry...');
  registerOTel({
    serviceName: 'ecommerce-product-service',
  });
  console.log('[INSTRUMENTATION] OpenTelemetry registered successfully');
}
