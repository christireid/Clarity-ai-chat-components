# Deployment Guide - Clarity Chat UI

## Quick Deploy (Recommended)

Both the docs site and storybook are production-ready and can be deployed immediately.

### Docs Site → Vercel (Recommended)

**One-Click Deploy:**
```bash
cd apps/docs-site
npm run build  # Verify it builds
vercel --prod   # Deploy
```

**Or via Vercel Dashboard:**
1. Connect GitHub repository
2. Select `apps/docs-site` as root directory
3. Build command: `npm run build`
4. Output directory: `.next`
5. Deploy!

**Environment Variables:** None required

### Storybook → Netlify/GitHub Pages (Recommended)

**Netlify Deploy:**
```bash
cd apps/storybook
npm run build
netlify deploy --prod --dir=storybook-static
```

**Or upload to any static host:**
```bash
cd apps/storybook
npm run build
# Upload storybook-static/ folder to:
# - GitHub Pages
# - Cloudflare Pages
# - AWS S3
# - Any CDN
```

## Detailed Deployment Instructions

### Prerequisites

✅ All verified and ready:
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git repository access
- Clean build (verified ✅)

### Docs Site Deployment

#### Option 1: Vercel (Easiest)

**CLI Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to docs site
cd apps/docs-site

# Deploy
vercel --prod
```

**Dashboard Deployment:**
1. Go to https://vercel.com
2. Import GitHub repository
3. Configure:
   - **Framework:** Next.js
   - **Root Directory:** `apps/docs-site`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
4. Click "Deploy"

**Custom Domain:**
```bash
vercel domains add yourdomain.com
```

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to docs site
cd apps/docs-site

# Build
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

**Configuration:**
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18+

#### Option 3: Docker

```dockerfile
# Dockerfile for docs-site
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t clarity-docs .
docker run -p 3000:3000 clarity-docs
```

### Storybook Deployment

#### Option 1: Netlify (Easiest)

```bash
cd apps/storybook

# Build storybook
npm run build

# Deploy
netlify deploy --prod --dir=storybook-static
```

**Or via Dashboard:**
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `storybook-static`
4. Deploy!

#### Option 2: GitHub Pages

```bash
cd apps/storybook

# Build
npm run build

# Deploy to gh-pages branch
npx gh-pages -d storybook-static
```

**Repository Settings:**
- Go to Settings → Pages
- Source: gh-pages branch
- Folder: / (root)
- Save

#### Option 3: Chromatic (Storybook Hosting)

```bash
# Install Chromatic
npm install -g chromatic

# Deploy
chromatic --project-token=YOUR_TOKEN
```

#### Option 4: AWS S3 + CloudFront

```bash
cd apps/storybook
npm run build

# Upload to S3
aws s3 sync storybook-static/ s3://your-bucket-name/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### React Package Publishing

**To NPM:**
```bash
cd packages/react

# Update version
npm version patch  # or minor, major

# Build
npm run build

# Publish
npm publish
```

**To GitHub Packages:**
```bash
# Already configured in package.json
npm publish --registry=https://npm.pkg.github.com
```

## Build Verification

Before deploying, verify all builds work:

```bash
# Docs Site
cd apps/docs-site
npm run build
# Expected: ✅ Compiled successfully

# Storybook  
cd apps/storybook
npm run build
# Expected: ✅ Built in 10s

# React Package
cd packages/react
npm run build
# Expected: ✅ Build success
```

All should pass ✅ (verified 2025-11-04)

## Environment Configuration

### Docs Site

**Required Environment Variables:** None

**Optional Environment Variables:**
```env
# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx

# Search (optional)
NEXT_PUBLIC_ALGOLIA_APP_ID=xxxxx
NEXT_PUBLIC_ALGOLIA_API_KEY=xxxxx
```

### Storybook

**No environment variables needed** - fully static site

## Performance Optimization

### Docs Site

Already optimized:
- ✅ Static generation enabled
- ✅ Image optimization configured
- ✅ CSS purging enabled
- ✅ Code splitting enabled
- ✅ Compression enabled

**CDN Recommendations:**
- Cloudflare (free tier)
- Vercel Edge Network (automatic)
- Netlify Edge (automatic)

### Storybook

Already optimized:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Asset optimization

## Custom Domains

### Vercel
```bash
vercel domains add docs.yourdomain.com
vercel domains add storybook.yourdomain.com
```

### Netlify
```bash
netlify domains:add docs.yourdomain.com
```

### DNS Configuration
```
# For docs.yourdomain.com
CNAME docs -> cname.vercel-dns.com

# For storybook.yourdomain.com
CNAME storybook -> your-site.netlify.app
```

## CI/CD Setup

### GitHub Actions (Automatic Deploy)

Create `.github/workflows/deploy-docs.yml`:
```yaml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - 'apps/docs-site/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build --workspace=@clarity-chat/docs-site
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./apps/docs-site
```

Create `.github/workflows/deploy-storybook.yml`:
```yaml
name: Deploy Storybook

on:
  push:
    branches: [main]
    paths:
      - 'apps/storybook/**'
      - 'packages/react/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build --workspace=@clarity-chat/react
      - run: npm run build --workspace=@clarity-chat/storybook
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=apps/storybook/storybook-static
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

## Monitoring & Analytics

### Recommended Tools

**Docs Site:**
- Google Analytics (traffic)
- Vercel Analytics (performance)
- Sentry (error tracking)
- PostHog (product analytics)

**Storybook:**
- Chromatic (visual regression)
- Simple Analytics (privacy-friendly)

## SSL/HTTPS

**Automatic with:**
- ✅ Vercel (free SSL)
- ✅ Netlify (free SSL)
- ✅ Cloudflare Pages (free SSL)

**Manual Setup:**
- Let's Encrypt (free)
- CloudFlare (free)

## Rollback Procedure

If issues occur after deployment:

```bash
# Vercel
vercel rollback

# Netlify
netlify rollback

# GitHub Pages
git revert HEAD
git push origin main
```

## Health Checks

After deployment, verify:

**Docs Site:**
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Search works (if enabled)
- [ ] Dark mode toggles
- [ ] All pages accessible
- [ ] Styles render correctly
- [ ] No console errors

**Storybook:**
- [ ] Index page loads
- [ ] Stories navigate properly
- [ ] Interactive controls work
- [ ] Addons function correctly
- [ ] No console errors

## Production URLs

After deployment, your sites will be available at:

**Docs Site:**
- Vercel: `https://your-project.vercel.app`
- Custom: `https://docs.yourdomain.com`

**Storybook:**
- Netlify: `https://your-site.netlify.app`
- Custom: `https://storybook.yourdomain.com`

## Support

If you encounter issues:

1. Check build logs
2. Verify Node.js version (18+)
3. Clear cache: `npm run clean && npm run build`
4. Check platform status pages
5. Review error logs in platform dashboard

## Deployment Checklist

### Pre-Deployment
- [x] All builds successful locally
- [x] No TypeScript errors
- [x] No ESLint warnings
- [x] All tests passing
- [x] Git committed and pushed
- [x] Documentation complete

### During Deployment
- [ ] Choose hosting platform
- [ ] Configure build settings
- [ ] Set environment variables (if any)
- [ ] Deploy
- [ ] Verify build succeeds

### Post-Deployment
- [ ] Test all pages load
- [ ] Verify styles render
- [ ] Check navigation works
- [ ] Test on mobile
- [ ] Test in different browsers
- [ ] Set up custom domain (optional)
- [ ] Configure SSL (automatic on Vercel/Netlify)
- [ ] Set up monitoring (optional)

## Troubleshooting

### Build Fails on Platform

**Issue:** Build succeeds locally but fails on platform

**Solutions:**
1. Check Node.js version matches (18+)
2. Clear build cache on platform
3. Verify all dependencies in package.json
4. Check platform build logs for specific error

### Styles Not Rendering

**Issue:** Styles missing after deployment

**Solutions:**
1. Verify Tailwind CSS is configured
2. Check PostCSS is installed
3. Ensure CSS file is imported in layout
4. Clear browser cache

### 404 Errors

**Issue:** Pages return 404

**Solutions:**
1. Verify routing configuration
2. Check output directory setting
3. Ensure all page files exported properly
4. For Vercel: Check vercel.json configuration

## Cost Estimates

### Free Tier Options
- **Vercel:** Free for hobby projects
- **Netlify:** Free (100GB bandwidth/month)
- **GitHub Pages:** Free (unlimited for public repos)
- **Cloudflare Pages:** Free (unlimited bandwidth)

### Paid Options
- **Vercel Pro:** $20/month (team features)
- **Netlify Pro:** $19/month (advanced features)
- **Chromatic:** $149/month (visual testing)

## Recommended Setup

For production deployment:

1. **Docs Site** → Vercel
   - Automatic deployments
   - Edge network
   - Analytics included
   - Free SSL
   
2. **Storybook** → Netlify or GitHub Pages
   - Static hosting
   - Free tier sufficient
   - Easy setup

3. **Monitoring** → Vercel Analytics (free tier)

4. **Domain** → Your custom domain with SSL

## Next Steps

1. ✅ Verify builds (already done)
2. Choose hosting platforms
3. Deploy docs site
4. Deploy storybook
5. Configure custom domains (optional)
6. Set up monitoring (optional)
7. Test deployed sites
8. Share URLs with team!

## Current Status

✅ **Everything is ready to deploy RIGHT NOW**

- Docs site builds: ✅ Success
- Storybook builds: ✅ Success  
- All code committed: ✅ On main
- All tests passing: ✅ Verified
- Documentation: ✅ Complete

**Just choose a platform and deploy!** 🚀

---
*Guide created: 2025-11-04*
*All builds verified*
*Production ready*
*Deploy with confidence!*
