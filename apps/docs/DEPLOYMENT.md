# 🚀 Documentation Site - Deployment Guide

**Target**: Production deployment of Clarity Chat documentation
**Last Updated**: 2025-11-17

---

## ✅ Pre-Deployment Checklist

### Content Readiness
- [x] Homepage is polished and engaging
- [x] Quick Start page is comprehensive
- [x] Navigation is clean and intuitive
- [ ] All pages return 200 (no 404s)
- [ ] All code examples are tested
- [ ] All links work correctly
- [ ] Images are optimized

### SEO & Performance
- [x] Meta tags configured
- [x] Sitemap generated (`/sitemap.xml`)
- [x] Robots.txt configured
- [ ] OG images for all major pages
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing

### Functionality
- [x] Search works (Cmd+K)
- [x] Dark mode works
- [x] Mobile navigation works
- [ ] All interactive demos work
- [ ] Code copy buttons work
- [ ] External links open in new tabs

### Analytics (Optional)
- [ ] Analytics provider chosen (Vercel/GA4/Plausible)
- [ ] Analytics tracking code added
- [ ] Events configured
- [ ] Privacy policy updated

---

## 🎯 Deployment Platforms

### Option 1: Vercel (Recommended)

**Why Vercel**:
- ✅ Built for Next.js
- ✅ Zero config deployment
- ✅ Automatic HTTPS
- ✅ Built-in analytics
- ✅ Edge functions
- ✅ Preview deployments

**Steps**:

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Deploy from docs directory
   cd apps/docs
   vercel
   ```

2. **Configure Project**
   - Framework: Next.js
   - Root Directory: `apps/docs`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Node Version: 18.x

3. **Environment Variables** (if needed)
   ```
   NEXT_PUBLIC_SITE_URL=https://docs.clarity-chat.dev
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX (optional)
   ```

4. **Custom Domain**
   - Add domain in Vercel dashboard
   - Update DNS records:
     - Type: CNAME
     - Name: docs (or @)
     - Value: cname.vercel-dns.com

5. **Deploy**
   ```bash
   vercel --prod
   ```

**Vercel Configuration** (`vercel.json` already exists):
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

### Option 2: Netlify

**Why Netlify**:
- ✅ Great CDN
- ✅ Form handling
- ✅ Split testing
- ✅ Generous free tier

**Steps**:

1. **Deploy via Git**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure:
     - Base directory: `apps/docs`
     - Build command: `npm run build`
     - Publish directory: `apps/docs/.next`
     - Node version: 18

2. **netlify.toml** (already configured):
   ```toml
   [build]
     base = "apps/docs"
     publish = ".next"
     command = "npm run build"

   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "SAMEORIGIN"
       X-Content-Type-Options = "nosniff"
   ```

3. **Environment Variables**
   Add in Netlify dashboard under Site settings → Environment variables

4. **Custom Domain**
   - Domain settings → Add custom domain
   - Follow DNS setup instructions

---

### Option 3: Cloudflare Pages

**Why Cloudflare**:
- ✅ Fast global CDN
- ✅ Unlimited bandwidth
- ✅ DDoS protection
- ✅ Free tier generous

**Steps**:

1. **Connect Repository**
   - Go to Cloudflare dashboard → Pages
   - Connect GitHub repository
   - Select repository: `Clarity-ai-chat-components`

2. **Build Settings**
   - Framework preset: Next.js
   - Build command: `cd apps/docs && npm run build`
   - Build output directory: `apps/docs/.next`
   - Root directory: (leave empty)
   - Node version: 18

3. **Environment Variables**
   ```
   NEXT_PUBLIC_SITE_URL=https://docs.clarity-chat.dev
   NODE_VERSION=18
   ```

4. **wrangler.toml** (already exists):
   ```toml
   name = "clarity-chat-docs"
   compatibility_date = "2024-01-01"

   [site]
   bucket = ".next"
   ```

---

## 🔧 Build & Test Locally

### Build for Production

```bash
# From root
npm run build --workspace=@clarity-chat/docs

# Or from docs directory
cd apps/docs
npm run build
npm run start
```

### Test Production Build

```bash
# Start production server locally
npm run start

# Check for:
# - All pages load correctly
# - No console errors
# - Images display properly
# - Search works
# - Navigation works
# - Dark mode toggles
```

### Performance Audit

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun --config=.lighthouserc.json

# Or use Chrome DevTools
# Open site → DevTools → Lighthouse → Run audit
```

**Target Scores**:
- Performance: > 90
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)

```tsx
// Already configured in layout.tsx if using Vercel
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Google Analytics 4 (Optional)

1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to environment variables
4. Add tracking code:

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
```

### Plausible Analytics (Privacy-Friendly Alternative)

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          defer
          data-domain="docs.clarity-chat.dev"
          src="https://plausible.io/js/script.js"
        />
      </body>
    </html>
  )
}
```

---

## 🔒 Security Headers

Already configured in `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ]
}
```

---

## 🌐 Custom Domain Setup

### DNS Configuration

#### For Vercel:
```
Type: CNAME
Name: docs (or @ for root)
Value: cname.vercel-dns.com
TTL: Auto
```

#### For Netlify:
```
Type: CNAME
Name: docs
Value: [your-site].netlify.app
TTL: 3600
```

#### For Cloudflare Pages:
```
Type: CNAME
Name: docs
Value: [your-site].pages.dev
Proxy: Enabled (orange cloud)
```

### SSL Certificate

All platforms provide free SSL certificates automatically via Let's Encrypt.

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Cannot find module '@clarity-chat/react'`
**Fix**: Ensure packages are built first
```bash
# From root
npm run build --workspace=@clarity-chat/react
npm run build --workspace=@clarity-chat/docs
```

**Error**: `ENOENT: no such file or directory`
**Fix**: Check file paths are correct, ensure all imports use proper casing

### Images Not Loading

**Error**: Images return 404
**Fix**:
- Ensure images are in `public/` directory
- Use `/image.png` not `./image.png` in Next.js
- Check image paths are correct

### Dark Mode Not Working

**Fix**:
- Ensure `next-themes` is installed
- Check `ThemeProvider` is in `app/providers.tsx`
- Verify `suppressHydrationWarning` is on `<html>` tag

### Search Not Working

**Fix**:
- Check search index is being built
- Verify Fuse.js is installed
- Ensure content is properly indexed

---

## 📋 Post-Deployment

### Verify Everything Works

- [ ] Visit homepage - loads correctly
- [ ] Test search (Cmd+K) - works
- [ ] Check mobile view - responsive
- [ ] Toggle dark mode - works
- [ ] Navigate between pages - smooth
- [ ] Click all major links - no 404s
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (iOS, Android)

### Submit to Search Engines

```bash
# Google Search Console
https://search.google.com/search-console

# Bing Webmaster Tools
https://www.bing.com/webmasters

# Submit sitemap
https://docs.clarity-chat.dev/sitemap.xml
```

### Monitor Performance

- Set up uptime monitoring (UptimeRobot, Better Uptime)
- Monitor Core Web Vitals (Vercel Analytics, Search Console)
- Track error rates (Sentry, LogRocket)
- Review analytics weekly

---

## 🎉 Success!

Your documentation site is now live and ready for the world!

**Next Steps**:
- Share on social media
- Add to README
- Submit to directories (Product Hunt, etc.)
- Gather user feedback
- Iterate and improve

---

**Deployment completed**: 2025-11-17
**Platform**: [Vercel/Netlify/Cloudflare]
**URL**: https://docs.clarity-chat.dev
**Status**: ✅ Live
