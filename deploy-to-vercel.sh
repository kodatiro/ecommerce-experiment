#!/bin/bash

# Deploy script for microservices to Vercel
# This script deploys each service as a separate Vercel project

set -e

echo "🚀 Deploying E-commerce Microservices to Vercel"
echo "================================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Step 1: Deploying Product Service${NC}"
cd product-service
vercel --prod --yes
PRODUCT_URL=$(vercel ls --prod 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || echo "")
cd ..
echo -e "${GREEN}✅ Product Service deployed${NC}"
echo ""

echo -e "${YELLOW}📦 Step 2: Deploying User Service${NC}"
cd user-service
vercel --prod --yes
USER_URL=$(vercel ls --prod 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || echo "")
cd ..
echo -e "${GREEN}✅ User Service deployed${NC}"
echo ""

echo -e "${YELLOW}📦 Step 3: Deploying Order Service${NC}"
cd order-service
vercel --prod --yes
ORDER_URL=$(vercel ls --prod 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || echo "")
cd ..
echo -e "${GREEN}✅ Order Service deployed${NC}"
echo ""

echo -e "${YELLOW}📦 Step 4: Deploying Frontend${NC}"
cd frontend
vercel --prod --yes
FRONTEND_URL=$(vercel ls --prod 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || echo "")
cd ..
echo -e "${GREEN}✅ Frontend deployed${NC}"
echo ""

echo "================================================"
echo -e "${GREEN}🎉 All services deployed successfully!${NC}"
echo ""
echo "Service URLs:"
echo "  Product Service: ${PRODUCT_URL}"
echo "  User Service: ${USER_URL}"
echo "  Order Service: ${ORDER_URL}"
echo "  Frontend: ${FRONTEND_URL}"
echo ""
echo "⚠️  IMPORTANT: You need to configure environment variables in Vercel Dashboard:"
echo ""
echo "1. Product Service - Set these environment variables:"
echo "   - POSTGRES_URL"
echo "   - POSTGRES_PRISMA_URL"
echo "   - POSTGRES_URL_NON_POOLING"
echo ""
echo "2. User Service - Set these environment variables:"
echo "   - POSTGRES_URL"
echo "   - POSTGRES_PRISMA_URL"
echo "   - POSTGRES_URL_NON_POOLING"
echo "   - JWT_SECRET"
echo ""
echo "3. Order Service - Set these environment variables:"
echo "   - POSTGRES_URL"
echo "   - POSTGRES_PRISMA_URL"
echo "   - POSTGRES_URL_NON_POOLING"
echo "   - STRIPE_SECRET_KEY"
echo "   - PRODUCT_SERVICE_URL=${PRODUCT_URL}"
echo ""
echo "4. Frontend - Set these environment variables:"
echo "   - NEXT_PUBLIC_PRODUCT_SERVICE_URL=${PRODUCT_URL}"
echo "   - NEXT_PUBLIC_ORDER_SERVICE_URL=${ORDER_URL}"
echo "   - NEXT_PUBLIC_USER_SERVICE_URL=${USER_URL}"
echo ""
echo "After setting environment variables, redeploy each service:"
echo "  vercel --prod --force"
