# 🚀 Storybook Deployment Guide

Complete guide for deploying your Clarity Chat Storybook to production.

---

## Table of Contents

1. [Quick Deployment](#quick-deployment)
2. [Deployment Platforms](#deployment-platforms)
3. [Build Configuration](#build-configuration)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Performance Optimization](#performance-optimization)
6. [Troubleshooting](#troubleshooting)

---

## Quick Deployment

### Prerequisites

```bash
# Ensure you're on main branch
git checkout main
git pull origin main

# Install dependencies
npm install

# Build Storybook
npm run storybook:build
```

Build output: `apps/storybook/storybook-static` (8.1 MB)

---

## Deployment Platforms

### 1. Vercel (Recommended) ⭐

**Why Vercel?**
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Free tier available

**Deploy Steps:**

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Navigate to Storybook directory
cd apps/storybook

# Build Storybook
npm run build

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

#### Option B: GitHub Integration

1. Visit [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `apps/storybook`
   - **Build Command**: `npm run build`
   - **Output Directory**: `storybook-static`
5. Click "Deploy"

**Custom Configuration** (`apps/storybook/vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "storybook-static",
  "framework": null,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### 2. Netlify

**Why Netlify?**
- ✅ Simple deployment
- ✅ Form handling
- ✅ Serverless functions
- ✅ Split testing

**Deploy Steps:**

#### Option A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to Storybook directory
cd apps/storybook

# Build Storybook
npm run build

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### Option B: Drag & Drop

1. Visit [app.netlify.com](https://app.netlify.com)
2. Build locally: `npm run storybook:build`
3. Drag `apps/storybook/storybook-static` folder to Netlify

#### Option C: Git Integration

1. Visit [app.netlify.com](https://app.netlify.com)
2. Click "New site from Git"
3. Connect repository
4. Configure:
   - **Base directory**: `apps/storybook`
   - **Build command**: `npm run build`
   - **Publish directory**: `apps/storybook/storybook-static`

**Custom Configuration** (`apps/storybook/netlify.toml`):

```toml
[build]
  base = "apps/storybook"
  command = "npm run build"
  publish = "storybook-static"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. GitHub Pages

**Why GitHub Pages?**
- ✅ Free hosting
- ✅ Direct from repository
- ✅ Custom domain support

**Deploy Steps:**

```bash
cd /workspace

# Install gh-pages
npm install --save-dev gh-pages

# Add deployment script to package.json
```

Add to `apps/storybook/package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d storybook-static"
  }
}
```

```bash
# Deploy
cd apps/storybook
npm run deploy
```

**GitHub Repository Settings:**
1. Go to repository Settings
2. Navigate to Pages
3. Source: `gh-pages` branch
4. Click Save

Your Storybook will be available at:
```
https://[username].github.io/[repository-name]/
```

**Custom Domain Setup:**

1. Add `CNAME` file in `apps/storybook/public/`:
   ```
   storybook.yourdomain.com
   ```

2. Configure DNS:
   ```
   Type: CNAME
   Name: storybook
   Value: [username].github.io
   ```

---

### 4. AWS S3 + CloudFront

**Why AWS?**
- ✅ Enterprise-grade
- ✅ High scalability
- ✅ Fine-grained control

**Deploy Steps:**

```bash
# Build Storybook
npm run storybook:build

# Install AWS CLI
brew install awscli  # macOS
# or
sudo apt-get install awscli  # Linux

# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://clarity-chat-storybook

# Enable static website hosting
aws s3 website s3://clarity-chat-storybook \
  --index-document index.html \
  --error-document index.html

# Upload files
cd apps/storybook
aws s3 sync storybook-static/ s3://clarity-chat-storybook \
  --acl public-read \
  --cache-control "max-age=31536000,public,immutable"

# Create CloudFront distribution (optional for CDN)
aws cloudfront create-distribution \
  --origin-domain-name clarity-chat-storybook.s3.amazonaws.com
```

**Automated Deployment Script** (`deploy-aws.sh`):

```bash
#!/bin/bash
set -e

echo "Building Storybook..."
npm run storybook:build

echo "Uploading to S3..."
aws s3 sync apps/storybook/storybook-static/ s3://clarity-chat-storybook \
  --delete \
  --acl public-read \
  --cache-control "max-age=31536000,public,immutable"

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
echo "URL: https://YOUR_CLOUDFRONT_DOMAIN"
```

---

### 5. Docker + Any Host

**Why Docker?**
- ✅ Consistent environment
- ✅ Deploy anywhere
- ✅ Easy scaling

**Dockerfile** (`apps/storybook/Dockerfile`):

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/storybook/package*.json ./apps/storybook/

# Install dependencies
RUN npm ci --workspace=@clarity-chat/storybook

# Copy source
COPY . .

# Build Storybook
RUN npm run storybook:build

# Production image
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/apps/storybook/storybook-static /usr/share/nginx/html

# Copy nginx config
COPY apps/storybook/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Nginx Configuration** (`apps/storybook/nginx.conf`):

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Build and Deploy:**

```bash
# Build Docker image
docker build -t clarity-chat-storybook -f apps/storybook/Dockerfile .

# Run locally
docker run -p 8080:80 clarity-chat-storybook

# Push to registry
docker tag clarity-chat-storybook:latest your-registry/clarity-chat-storybook:latest
docker push your-registry/clarity-chat-storybook:latest

# Deploy to your platform (ECS, Kubernetes, etc.)
```

---

## Build Configuration

### Environment Variables

Create `apps/storybook/.env`:

```env
# Storybook configuration
STORYBOOK_BASE_URL=https://storybook.yourdomain.com

# Optional: Analytics
STORYBOOK_GOOGLE_ANALYTICS=UA-XXXXXXXXX-X
```

### Optimize Build

**Update `apps/storybook/.storybook/main.ts`:**

```typescript
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  // ... existing config
  
  viteFinal: async (config) => {
    return {
      ...config,
      build: {
        ...config.build,
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'storybook-vendor': ['@storybook/react', '@storybook/blocks'],
            },
          },
        },
      },
    }
  },
}

export default config
```

---

## Custom Domain Setup

### DNS Configuration

**For Vercel/Netlify:**

```
Type: CNAME
Name: storybook (or @)
Value: cname.vercel-dns.com (or netlify app domain)
TTL: 3600
```

**For CloudFront:**

```
Type: A (Alias)
Name: storybook (or @)
Value: [CloudFront distribution domain]
TTL: 3600
```

### SSL/HTTPS

Most platforms provide automatic SSL:

- **Vercel**: Automatic
- **Netlify**: Automatic
- **GitHub Pages**: Automatic for custom domains
- **CloudFront**: Use AWS Certificate Manager

---

## Performance Optimization

### 1. Enable Compression

Most platforms enable gzip automatically. For custom servers:

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

**Apache:**
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript
</IfModule>
```

### 2. Cache Headers

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN Integration

Use platforms with built-in CDN:
- ✅ Vercel (Automatic)
- ✅ Netlify (Automatic)
- ✅ CloudFront (AWS)
- ✅ Cloudflare (Can be added to any)

### 4. Bundle Analysis

```bash
# Analyze bundle size
cd apps/storybook
npm run build

# Check output
ls -lh storybook-static/assets/*.js
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy-storybook.yml`:

```yaml
name: Deploy Storybook

on:
  push:
    branches: [main]
    paths:
      - 'apps/storybook/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Storybook
        run: npm run storybook:build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/storybook
          vercel-args: '--prod'
```

---

## Monitoring

### Add Analytics

**Google Analytics** (`apps/storybook/.storybook/manager-head.html`):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

**Sentry Integration:**

```typescript
// apps/storybook/.storybook/preview.ts
import * as Sentry from '@sentry/react'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: 'storybook-production',
  })
}
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules
rm -rf apps/storybook/storybook-static
npm install
npm run storybook:build
```

### Assets Not Loading

Check `base` path in `apps/storybook/.storybook/main.ts`:

```typescript
const config: StorybookConfig = {
  // For subdirectory deployments
  staticDirs: ['../public'],
}
```

### Large Bundle Size

```bash
# Analyze what's in the bundle
npx vite-bundle-visualizer apps/storybook/storybook-static
```

Then optimize imports:

```typescript
// Instead of
import { Button, Card, Input } from '@clarity-chat/primitives'

// Use tree-shaking friendly imports
import Button from '@clarity-chat/primitives/Button'
```

---

## Security Checklist

Before deploying to production:

- [ ] Enable HTTPS
- [ ] Set security headers (CSP, X-Frame-Options)
- [ ] Remove development dependencies
- [ ] Enable rate limiting (if applicable)
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Test all stories in production build
- [ ] Verify accessibility in production
- [ ] Check mobile responsiveness
- [ ] Test loading performance

---

## Quick Reference

### Deployment URLs

After deployment, your Storybook will be available at:

| Platform | URL Format |
|----------|------------|
| Vercel | `https://[project-name].vercel.app` |
| Netlify | `https://[site-name].netlify.app` |
| GitHub Pages | `https://[username].github.io/[repo]` |
| Custom Domain | `https://storybook.yourdomain.com` |

### Useful Commands

```bash
# Local development
npm run storybook

# Production build
npm run storybook:build

# Preview production build
npx http-server apps/storybook/storybook-static

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod

# Deploy to GitHub Pages
npm run deploy
```

---

## Next Steps

After deploying:

1. ✅ Share the URL with your team
2. ✅ Add to project README
3. ✅ Set up automatic deployments
4. ✅ Configure monitoring
5. ✅ Add to documentation
6. ✅ Create deployment badge

---

## Resources

- [Storybook Deployment Docs](https://storybook.js.org/docs/sharing/publish-storybook)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Pages Guide](https://pages.github.com)
- [AWS S3 Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

---

**🎉 Your Storybook is ready for the world!**

Choose your platform and deploy in minutes!
