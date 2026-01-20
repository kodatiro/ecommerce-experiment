# Vercel Deployment Guide - Monorepo Setup

This guide explains how to deploy this microservices monorepo to Vercel.

## Architecture Overview

This is a **monorepo** containing 4 separate Next.js applications:
- `product-service/` - Product catalog API
- `order-service/` - Orders and cart API
- `user-service/` - User authentication API
- `frontend/` - Customer-facing web app

Each service needs to be deployed as a **separate Vercel project**.

---

## Deployment Methods

### Method 1: Vercel Dashboard (Easiest)

#### Step 1: Push to GitHub

```bash
# If not already done
git remote add origin <your-github-repo-url>
git push -u origin master
```

#### Step 2: Import Repository 4 Times

Go to https://vercel.com/new and import your repository **4 separate times**:

**Import 1 - Product Service:**
- Repository: `your-repo`
- Project Name: `ecommerce-product-service`
- Root Directory: `product-service` ⚠️ **IMPORTANT**
- Click Deploy

**Import 2 - User Service:**
- Repository: `your-repo`
- Project Name: `ecommerce-user-service`
- Root Directory: `user-service` ⚠️ **IMPORTANT**
- Click Deploy

**Import 3 - Order Service:**
- Repository: `your-repo`
- Project Name: `ecommerce-order-service`
- Root Directory: `order-service` ⚠️ **IMPORTANT**
- Click Deploy

**Import 4 - Frontend:**
- Repository: `your-repo`
- Project Name: `ecommerce-frontend`
- Root Directory: `frontend` ⚠️ **IMPORTANT**
- Click Deploy

#### Step 3: Configure Environment Variables

After initial deployment, configure environment variables for each project:

**Product Service** → Settings → Environment Variables:
```
POSTGRES_URL=<your-vercel-postgres-url>
POSTGRES_PRISMA_URL=<your-vercel-postgres-url>?pgbouncer=true
POSTGRES_URL_NON_POOLING=<your-vercel-postgres-url>
```

**User Service** → Settings → Environment Variables:
```
POSTGRES_URL=<your-vercel-postgres-url>
POSTGRES_PRISMA_URL=<your-vercel-postgres-url>?pgbouncer=true
POSTGRES_URL_NON_POOLING=<your-vercel-postgres-url>
JWT_SECRET=<generate-random-secret>
```

**Order Service** → Settings → Environment Variables:
```
POSTGRES_URL=<your-vercel-postgres-url>
POSTGRES_PRISMA_URL=<your-vercel-postgres-url>?pgbouncer=true
POSTGRES_URL_NON_POOLING=<your-vercel-postgres-url>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
PRODUCT_SERVICE_URL=<product-service-url-from-step-2>
```

**Frontend** → Settings → Environment Variables:
```
NEXT_PUBLIC_PRODUCT_SERVICE_URL=<product-service-url>
NEXT_PUBLIC_ORDER_SERVICE_URL=<order-service-url>
NEXT_PUBLIC_USER_SERVICE_URL=<user-service-url>
NEXT_PUBLIC_AMPLITUDE_API_KEY=<your-amplitude-api-key>
```

#### Step 4: Redeploy After Setting Variables

After adding environment variables, go to each project's Deployments tab and redeploy:
- Click on the latest deployment
- Click "Redeploy"

---

### Method 2: Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
vercel login
```

#### Step 2: Use the Deployment Script

```bash
./deploy-to-vercel.sh
```

Or deploy manually:

```bash
# Deploy Product Service
cd product-service
vercel --prod
cd ..

# Deploy User Service
cd user-service
vercel --prod
cd ..

# Deploy Order Service
cd order-service
vercel --prod
cd ..

# Deploy Frontend
cd frontend
vercel --prod
cd ..
```

#### Step 3: Set Environment Variables via CLI

For each project:

```bash
# Product Service
vercel env add POSTGRES_URL production
vercel env add POSTGRES_PRISMA_URL production
vercel env add POSTGRES_URL_NON_POOLING production

# User Service
vercel env add POSTGRES_URL production
vercel env add POSTGRES_PRISMA_URL production
vercel env add POSTGRES_URL_NON_POOLING production
vercel env add JWT_SECRET production

# Order Service
vercel env add POSTGRES_URL production
vercel env add POSTGRES_PRISMA_URL production
vercel env add POSTGRES_URL_NON_POOLING production
vercel env add STRIPE_SECRET_KEY production
vercel env add PRODUCT_SERVICE_URL production

# Frontend
vercel env add NEXT_PUBLIC_PRODUCT_SERVICE_URL production
vercel env add NEXT_PUBLIC_ORDER_SERVICE_URL production
vercel env add NEXT_PUBLIC_USER_SERVICE_URL production
vercel env add NEXT_PUBLIC_AMPLITUDE_API_KEY production
```

---

## Database Setup

### Option 1: Vercel Postgres (Recommended)

1. Go to Vercel Dashboard → Storage → Create Database
2. Create **3 separate databases**:
   - `ecommerce-products`
   - `ecommerce-users`
   - `ecommerce-orders`

3. For each database:
   - Click on database → Settings → Copy connection strings
   - Add to respective service environment variables

4. Initialize tables by making first API call or running SQL in Vercel Postgres console

### Option 2: External Postgres (Supabase, Railway, etc.)

1. Create 3 separate databases
2. Copy connection strings to environment variables
3. Ensure databases are accessible from Vercel's IP addresses

---

## Environment Variable Reference

### Required Secrets

Generate these values:

```bash
# JWT Secret (random 32-character string)
openssl rand -base64 32

# Get Stripe keys from: https://dashboard.stripe.com/test/apikeys
# Get Amplitude key from: https://analytics.amplitude.com/
```

### Service URLs Format

After deploying each service, Vercel provides URLs like:
- `https://ecommerce-product-service.vercel.app`
- `https://ecommerce-user-service.vercel.app`
- `https://ecommerce-order-service.vercel.app`
- `https://ecommerce-frontend.vercel.app`

Use these URLs in your environment variables.

---

## Troubleshooting

### Issue: Build fails with "Cannot find module"

**Cause:** Root directory not set correctly

**Solution:** Ensure each Vercel project has the correct Root Directory set:
- Go to Project Settings → General → Root Directory
- Set to the service folder name

### Issue: Frontend can't connect to services

**Cause:** Missing or incorrect service URLs

**Solution:**
1. Check environment variables in Frontend project
2. Ensure `NEXT_PUBLIC_*` variables are set
3. URLs must start with `https://`

### Issue: API returns 500 errors

**Cause:** Missing database connection or environment variables

**Solution:**
1. Verify all environment variables are set in Vercel Dashboard
2. Check Vercel logs for specific errors
3. Ensure database is accessible

### Issue: CORS errors

**Cause:** Frontend and services on different domains

**Solution:** Services already have CORS headers configured in `middleware.ts`

---

## Post-Deployment Checklist

- [ ] All 4 services deployed successfully
- [ ] Environment variables configured for each service
- [ ] Database tables initialized
- [ ] Frontend can reach all API services
- [ ] Test product listing page
- [ ] Test cart functionality
- [ ] Test user registration/login
- [ ] Test order creation
- [ ] Amplitude tracking working (check console)

---

## Updating After Deployment

When you push changes to GitHub:
1. Vercel automatically detects changes in each service folder
2. Only affected services are redeployed
3. No action needed on your part

To force a rebuild:
```bash
vercel --prod --force
```

---

## Custom Domains (Optional)

To use custom domains:

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Update environment variables with new domain URLs

Example structure:
- `https://api-products.yourdomain.com` → Product Service
- `https://api-users.yourdomain.com` → User Service
- `https://api-orders.yourdomain.com` → Order Service
- `https://shop.yourdomain.com` → Frontend

---

## Cost Considerations

Vercel Free Tier includes:
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function execution limits

For production with higher traffic, consider:
- Vercel Pro ($20/month per user)
- Vercel Postgres (separate pricing)

---

## Questions?

If you encounter issues:
1. Check Vercel deployment logs
2. Review function logs in Vercel Dashboard
3. Verify all environment variables are set
4. Ensure databases are accessible
