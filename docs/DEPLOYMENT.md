# Deployment Guide

This document provides deployment instructions for the Clarity Chat documentation site and component library.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Build Process](#build-process)
- [Deployment Options](#deployment-options)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 20+ installed
- pnpm 10+ installed
- Access to your deployment platform credentials
- All environment variables configured

### Required System Dependencies

```bash
# Verify Node.js version
node --version  # Should be >= 20.0.0

# Verify pnpm version
pnpm --version  # Should be >= 10.0.0

# Install Playwright browsers (for smoke tests)
npx playwright install chromium
```

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in `apps/docs/` with the following variables:

```bash
# Required for AI features (if enabled)
OPENAI_API_KEY=your_openai_api_key

# Optional - Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key

# Optional - Error Tracking
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Optional - Vector Store (for RAG features)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
```

### Production Build Environment

```bash
# Set production environment
NODE_ENV=production

# Increase memory for large builds
NODE_OPTIONS='--max-old-space-size=4096'
```

## Build Process

### 1. Install Dependencies

```bash
# From repository root
pnpm install
```

### 2. Build Packages

```bash
# Build all packages (required before docs)
pnpm build:packages
```

### 3. Build Documentation Site

```bash
# Build docs app
pnpm docs:build
```

### 4. Run Pre-Deployment Checks

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Unit tests
pnpm test

# Smoke tests (requires running dev server or use CI mode)
cd apps/docs && npx playwright test --config=playwright.smoke.config.ts
```

### Build Output

The production build will be output to:

```
apps/docs/.next/          # Next.js build output
apps/docs/.next/static/   # Static assets
apps/docs/out/            # Static export (if using `next export`)
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best experience for Next.js applications.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (from apps/docs directory)
cd apps/docs
vercel --prod
```

**Vercel Configuration (`vercel.json`):**

```json
{
  "buildCommand": "cd ../.. && pnpm build:packages && cd apps/docs && pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.21.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/docs ./apps/docs

# Install and build
RUN pnpm install --frozen-lockfile
RUN pnpm build:packages
RUN pnpm --filter @clarity-chat/docs build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/docs/.next/standalone ./
COPY --from=builder /app/apps/docs/.next/static ./apps/docs/.next/static
COPY --from=builder /app/apps/docs/public ./apps/docs/public

EXPOSE 3000
CMD ["node", "apps/docs/server.js"]
```

```bash
# Build and run
docker build -t clarity-docs .
docker run -p 3000:3000 clarity-docs
```

### Option 3: Static Export (for static hosting)

If your docs site can be statically exported:

```bash
# In apps/docs/next.config.ts, add:
# output: 'export'

# Build static export
pnpm --filter @clarity-chat/docs build

# Output will be in apps/docs/out/
```

Deploy `apps/docs/out/` to any static hosting:

- AWS S3 + CloudFront
- Netlify
- GitHub Pages
- Cloudflare Pages

### Option 4: AWS (EC2/ECS)

```bash
# Build production image
docker build -t clarity-docs .

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker tag clarity-docs:latest $ECR_REGISTRY/clarity-docs:latest
docker push $ECR_REGISTRY/clarity-docs:latest

# Deploy to ECS (update task definition)
aws ecs update-service --cluster production --service clarity-docs --force-new-deployment
```

## Post-Deployment Verification

### Automated Smoke Tests

```bash
# Run against production URL
BASE_URL=https://your-domain.com npx playwright test --config=apps/docs/playwright.smoke.config.ts
```

### Manual Verification Checklist

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Search functionality works
- [ ] Code examples render with syntax highlighting
- [ ] Dark mode toggle works
- [ ] Mobile responsive layout
- [ ] All images load
- [ ] No console errors in browser
- [ ] Analytics tracking (if configured)

### Health Check Endpoints

Verify these endpoints return 200:

```bash
# Homepage
curl -I https://your-domain.com/

# API health (if applicable)
curl https://your-domain.com/api/health

# Specific pages
curl -I https://your-domain.com/guides/getting-started
curl -I https://your-domain.com/reference
curl -I https://your-domain.com/cookbook
```

## Troubleshooting

### Build Failures

**Issue: Out of memory during build**

```bash
# Increase Node memory
NODE_OPTIONS='--max-old-space-size=8192' pnpm build
```

**Issue: Package resolution errors**

```bash
# Clear caches and reinstall
rm -rf node_modules
rm -rf apps/docs/.next
pnpm install
```

### Runtime Errors

**Issue: Missing environment variables**

- Verify `.env.local` exists and contains all required variables
- Check Vercel/hosting platform environment variable configuration

**Issue: API routes returning 500**

- Check server logs for detailed error messages
- Verify API keys are correctly set
- Check rate limits on external services

### Performance Issues

**Issue: Slow initial load**

- Enable ISR (Incremental Static Regeneration) for dynamic pages
- Check bundle size with `pnpm --filter @clarity-chat/docs perf:analyze`
- Optimize images using Next.js Image component

**Issue: High TTFB**

- Consider edge deployment (Vercel Edge Functions)
- Enable caching headers for static assets
- Use CDN for static assets

## Rollback Procedure

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Docker/ECS

```bash
# Rollback ECS to previous task definition
aws ecs update-service --cluster production --service clarity-docs --task-definition clarity-docs:PREVIOUS_VERSION
```

## Security Considerations

1. **Environment Variables**: Never commit secrets to git
2. **Headers**: Configure security headers in `next.config.ts`
3. **CSP**: Implement Content Security Policy
4. **Rate Limiting**: Configure rate limiting for API routes
5. **HTTPS**: Ensure HTTPS is enforced

## Support

For deployment issues:

- **Email**: support@codeclarity.ai
- **Enterprise**: enterprise@codeclarity.ai
- **GitHub Issues**: https://github.com/christireid/Clarity-ai-chat-components/issues
