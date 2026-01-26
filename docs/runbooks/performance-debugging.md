# Performance Debugging Runbook

> **Operations Guide** | Wave 3.3+ | Last Updated: January 26, 2026

## Overview

This runbook provides step-by-step procedures for diagnosing and resolving performance issues in the Clarity AI Chat Components documentation site. Use this guide when investigating slow pages, high TTFB, or bundle size issues.

---

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Bundle Analysis](#bundle-analysis)
3. [ISR Caching Issues](#isr-caching-issues)
4. [TTFB Investigation](#ttfb-investigation)
5. [Client-Side Performance](#client-side-performance)
6. [Performance Budgets](#performance-budgets)
7. [Common Issues](#common-issues)

---

## Quick Diagnostics

### Check Performance Status

```bash
# 1. Check build size
pnpm build
du -sh .next/static/chunks/*

# 2. Check ISR configuration
grep -r "export const revalidate" apps/streamlined-docs/app

# 3. Check lazy loading
grep -r "useLazyBackground\|dynamic(" apps/streamlined-docs

# 4. Run Lighthouse
pnpm dlx lighthouse http://localhost:3000/ --only-categories=performance --view
```

### Performance Health Check

```bash
#!/bin/bash
# scripts/perf-health-check.sh

echo "=== Performance Health Check ==="
echo ""

# Bundle size
echo "📦 Bundle Size:"
BUNDLE_SIZE=$(du -sh .next/static/chunks | awk '{print $1}')
echo "Total: $BUNDLE_SIZE"
echo "Budget: <2MB"
echo ""

# ISR pages
echo "⚡ ISR Configuration:"
ISR_COUNT=$(grep -r "export const revalidate" apps/streamlined-docs/app | wc -l)
echo "Pages with ISR: $ISR_COUNT"
echo ""

# Lazy loaded components
echo "🔄 Lazy Loading:"
LAZY_COUNT=$(grep -r "dynamic(" apps/streamlined-docs/components | wc -l)
echo "Lazy components: $LAZY_COUNT"
echo ""

# TTFB
echo "⏱️  TTFB (requires running server):"
if curl -s http://localhost:3000/ > /dev/null 2>&1; then
  TTFB=$(curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/ | grep time_starttransfer | awk '{print $2}')
  echo "Homepage TTFB: ${TTFB}s"
  echo "Budget: <0.2s"
else
  echo "Server not running. Start with 'pnpm dev' or 'pnpm start'"
fi
echo ""

echo "=== End Health Check ==="
```

---

## Bundle Analysis

### Generate Bundle Report

```bash
# 1. Install analyzer
pnpm add -D @next/bundle-analyzer

# 2. Build with analysis
ANALYZE=true pnpm build

# 3. Open report
open .next/analyze/client.html
```

### Analyze Bundle Report

**Look for**:

1. **Large chunks** (>300 KB)
   - Check if properly code-split
   - Consider lazy loading

2. **Duplicate dependencies**
   - Multiple versions of same package
   - Fix with pnpm overrides

3. **Heavy libraries**
   - Can they be lazy-loaded?
   - Are they tree-shakeable?

### Troubleshooting Large Bundles

```bash
# Find largest files
find .next/static/chunks -type f -exec du -h {} + | sort -rh | head -20

# Check if Monaco is in main bundle (should be route-split)
grep -r "monaco" .next/static/chunks/pages-*.js

# Check if Three.js is in main bundle (should be lazy)
grep -r "three" .next/static/chunks/app-*.js

# Check for duplicate packages
pnpm why <package-name>
```

### Optimization Checklist

- [ ] Monaco Editor route-split to `/playground`
- [ ] Three.js lazy loaded and desktop-only
- [ ] Mermaid dynamically imported
- [ ] AI SDKs server-side only
- [ ] No duplicate dependencies
- [ ] All images optimized with Next.js `<Image>`
- [ ] No large JSON files in client bundle

---

## ISR Caching Issues

### Check ISR Status

```bash
# List all pages with ISR
grep -r "export const revalidate" apps/streamlined-docs/app

# Expected output:
# app/api/reference/hooks/page.tsx:export const revalidate = 3600
# app/api/reference/utilities/page.tsx:export const revalidate = 3600
# app/explore/demos/page.tsx:export const revalidate = 1800
# ... (8 pages total)
```

### Test ISR Functionality

```bash
#!/bin/bash
# scripts/test-isr.sh

echo "=== Testing ISR ==="

# Build
echo "Building..."
pnpm build

# Start server
echo "Starting server..."
pnpm start &
SERVER_PID=$!
sleep 5

# Test cache
echo ""
echo "Test 1: Initial request (cache miss)"
TIME1=$(curl -w "%{time_starttransfer}\n" -o /dev/null -s http://localhost:3000/api/reference/hooks)
echo "TTFB: ${TIME1}s"

echo ""
echo "Test 2: Second request (cache hit)"
TIME2=$(curl -w "%{time_starttransfer}\n" -o /dev/null -s http://localhost:3000/api/reference/hooks)
echo "TTFB: ${TIME2}s"

echo ""
echo "Expected: TIME2 << TIME1 (cache should be faster)"

# Cleanup
kill $SERVER_PID

echo ""
echo "=== ISR Test Complete ==="
```

### Verify Cache Headers

```bash
# Check cache headers
curl -I http://localhost:3000/api/reference/hooks

# Expected headers:
# Cache-Control: s-maxage=3600, stale-while-revalidate
# X-Nextjs-Cache: HIT (after first request)
```

### Common ISR Issues

#### Issue: Pages Not Caching

**Symptoms**:
- TTFB consistently high (>500ms)
- `X-Nextjs-Cache: MISS` on every request

**Diagnosis**:

```bash
# Check if revalidate is exported
grep "export const revalidate" apps/streamlined-docs/app/api/reference/hooks/page.tsx

# Check if page is dynamic
grep "export const dynamic" apps/streamlined-docs/app/api/reference/hooks/page.tsx
```

**Solutions**:

```tsx
// ✅ Correct: Export revalidate
export const revalidate = 3600

// ❌ Wrong: dynamic = 'force-dynamic' disables caching
export const dynamic = 'force-dynamic' // Remove this!
export const revalidate = 3600
```

#### Issue: Stale Content

**Symptoms**:
- Content updates not reflecting

**Solutions**:

```bash
# Option 1: Manual revalidation
curl -X POST 'http://localhost:3000/api/revalidate?secret=YOUR_SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"path":"/api/reference/hooks"}'

# Option 2: Reduce revalidation interval
# Change from 7200 (2 hours) to 1800 (30 minutes)
export const revalidate = 1800
```

---

## TTFB Investigation

### Measure TTFB

```bash
# Create curl timing format
cat > curl-format.txt << EOF
    time_namelookup:  %{time_namelookup}s\n
       time_connect:  %{time_connect}s\n
    time_appconnect:  %{time_appconnect}s\n
   time_pretransfer:  %{time_pretransfer}s\n
      time_redirect:  %{time_redirect}s\n
 time_starttransfer:  %{time_starttransfer}s (TTFB)\n
                    ----------\n
         time_total:  %{time_total}s\n
EOF

# Measure TTFB for page
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/reference/hooks
```

### TTFB Targets

| Page Type        | Target TTFB | Alert Threshold |
| ---------------- | ----------- | --------------- |
| ISR pages        | <100ms      | >150ms          |
| Dynamic pages    | <300ms      | >500ms          |
| API endpoints    | <50ms       | >100ms          |

### Diagnose High TTFB

```bash
# Step 1: Check if ISR is enabled
grep "export const revalidate" path/to/page.tsx

# Step 2: Check for expensive data fetching
# Look for:
# - Database queries without indexes
# - External API calls without caching
# - Large data transformations

# Step 3: Check middleware overhead
# Temporarily disable middleware to isolate issue
# Comment out middleware.ts and retest

# Step 4: Check server resources
# - CPU usage
# - Memory usage
# - Network latency
```

### Solutions for High TTFB

1. **Enable ISR** (if not already):
   ```tsx
   export const revalidate = 3600
   ```

2. **Add caching to data fetching**:
   ```tsx
   const data = await fetch('https://api.example.com/data', {
     next: { revalidate: 3600 },
   })
   ```

3. **Optimize database queries**:
   ```sql
   -- Add indexes for frequently queried fields
   CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
   ```

4. **Use CDN**:
   ```bash
   # Deploy to Vercel or Cloudflare for automatic CDN
   ```

---

## Client-Side Performance

### Measure Web Vitals

```tsx
// app/layout.tsx
import { WebVitals } from '@/components/WebVitals'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

```tsx
// components/WebVitals.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log metrics
    console.log(metric)

    // Check thresholds
    const thresholds = {
      FCP: 1800, // First Contentful Paint
      LCP: 2500, // Largest Contentful Paint
      FID: 100,  // First Input Delay
      CLS: 0.1,  // Cumulative Layout Shift
      TTFB: 200, // Time To First Byte
    }

    const threshold = thresholds[metric.name as keyof typeof thresholds]
    if (threshold && metric.value > threshold) {
      console.warn(`⚠️ ${metric.name} exceeded threshold: ${metric.value}ms > ${threshold}ms`)
    }
  })

  return null
}
```

### Diagnose Poor Web Vitals

#### High LCP (>2.5s)

**Causes**:
- Large images not optimized
- Font loading issues
- Heavy JavaScript blocking render

**Solutions**:

```tsx
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/hero.png"
  alt="Hero"
  width={800}
  height={600}
  priority // Load above-the-fold images immediately
/>

// Preload fonts
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })
```

#### High CLS (>0.1)

**Causes**:
- Missing dimensions on images
- Dynamic content loading without placeholders
- Web fonts causing layout shift

**Solutions**:

```tsx
// Always provide dimensions
<Image src="..." width={400} height={300} alt="..." />

// Use skeleton loaders
{isLoading ? <Skeleton className="h-64 w-full" /> : <Content />}

// Use font-display: swap
const inter = Inter({ subsets: ['latin'], display: 'swap' })
```

#### High FID (>100ms)

**Causes**:
- Heavy JavaScript on main thread
- Long tasks blocking interactions

**Solutions**:

```tsx
// Use React.lazy for heavy components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

// Debounce expensive operations
import { debounce } from '@/lib/utils'

const handleSearch = debounce((query) => {
  // Expensive search
}, 300)
```

### Profiling with React DevTools

```bash
# 1. Install React DevTools
# Chrome/Edge: Install from Web Store

# 2. Open DevTools -> Profiler tab

# 3. Click Record and perform actions

# 4. Look for:
# - Long component render times (>16ms)
# - Unnecessary re-renders
# - Large commit times
```

---

## Performance Budgets

### Budget Configuration

```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:3000/"]
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }],
        "speed-index": ["error", { "maxNumericValue": 3400 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Enforce Budgets in CI

```yaml
# .github/workflows/performance.yml
name: Performance Budget

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4

      - name: Install and build
        run: |
          pnpm install
          pnpm build

      - name: Run Lighthouse CI
        run: |
          pnpm dlx @lhci/cli@latest autorun --config=.lighthouserc.json

      - name: Check bundle size
        run: |
          BUNDLE_SIZE=$(du -sb .next/static/chunks | awk '{print $1}')
          MAX_SIZE=$((2 * 1024 * 1024)) # 2MB
          if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
            echo "Bundle size $BUNDLE_SIZE exceeds limit $MAX_SIZE"
            exit 1
          fi
```

### Current Budgets

| Metric               | Budget | Alert  | Current |
| -------------------- | ------ | ------ | ------- |
| Main Bundle          | 500 KB | 600 KB | 450 KB  |
| Largest Chunk        | 300 KB | 400 KB | 280 KB  |
| TTFB                 | 100ms  | 150ms  | 85ms    |
| LCP                  | 2.5s   | 3s     | 1.4s    |
| CLS                  | 0.1    | 0.15   | 0.02    |
| Lighthouse Score     | 85     | 80     | 78      |

---

## Common Issues

### Issue: Slow Page Loads

**Symptoms**: Pages take >3s to load

**Diagnosis**:

```bash
# Check bundle size
du -sh .next/static/chunks/*

# Check for unoptimized images
find public -name "*.png" -o -name "*.jpg" -exec du -h {} + | sort -rh | head -10

# Check lazy loading
grep -r "dynamic\|useLazyBackground" apps/streamlined-docs/components
```

**Solutions**:

1. Enable ISR
2. Optimize images
3. Lazy load heavy components
4. Enable CDN

### Issue: High Memory Usage

**Symptoms**: Build fails with "Out of memory"

**Solutions**:

```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" pnpm build

# Or in package.json
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
}
```

### Issue: Slow Development Server

**Symptoms**: Hot reload takes >5s

**Solutions**:

```bash
# Reduce TypeScript checking in dev
# next.config.ts
export default {
  typescript: {
    ignoreBuildErrors: true, // Only for dev
  },
}

# Use SWC instead of Babel (Next.js 12+ default)
# Ensure no .babelrc file exists

# Clear Next.js cache
rm -rf .next
pnpm dev
```

---

## Performance Monitoring Dashboard

### Setup Web Vitals Tracking

```typescript
// app/api/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface Metric {
  name: string
  value: number
  rating: string
  pathname: string
}

export async function POST(request: NextRequest) {
  const metric: Metric = await request.json()

  // Store in database or analytics service
  console.log('[Metric]', {
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
    path: metric.pathname,
  })

  // Alert on poor metrics
  if (metric.rating === 'poor') {
    console.warn(`⚠️ Poor ${metric.name}: ${metric.value}`)
    // Send alert to Slack, email, etc.
  }

  return NextResponse.json({ ok: true })
}
```

---

## Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Web Vitals](https://web.dev/vitals/)
- [Bundle Analysis Guide](../patterns/lazy-loading.md)
- [ISR Caching Guide](../patterns/isr-caching.md)

---

**Last Updated**: Wave 3.3 completion (January 26, 2026)
