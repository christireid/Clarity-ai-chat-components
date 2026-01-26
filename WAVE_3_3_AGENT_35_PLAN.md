# Wave 3.3 Agent 35: ISR Cache Optimizer

**Agent Type**: `compound-engineering:review:performance-oracle` **Priority**: P2 - High Value
**Target**: 90% TTFB reduction (850ms → 85ms) **Estimated Time**: 7.5 hours **Risk Level**:
Low-Medium **Dependencies**: None (can run parallel with Agent 32-33)

---

## Mission Objective

Implement Incremental Static Regeneration (ISR) caching to dramatically reduce Time to First Byte
(TTFB) for static content:

1. Configure ISR for static documentation routes
2. Implement on-demand revalidation
3. Add stale-while-revalidate strategy
4. Set up edge caching with optimal cache headers

**Key Principle**: Serve pre-rendered HTML from edge cache, revalidate in background.

---

## Task 1: Implement ISR for API Documentation Routes

### Problem Analysis

- API documentation pages are static 99% of the time
- Currently server-rendered on every request (850ms TTFB)
- 25 API reference routes that could be pre-rendered
- Content changes only when code updates (deployments)

### Current State

**Files**: `apps/streamlined-docs/app/api/reference/[...slug]/page.tsx`

```typescript
// Current: Dynamic rendering on every request
export default async function ApiReferencePage({ params }) {
  const content = await fetchApiDocs(params.slug)
  return <ApiDocumentation content={content} />
}
```

### Implementation Strategy

#### Step 1.1: Add ISR Configuration to API Routes

**File**: `apps/streamlined-docs/app/api/reference/[...slug]/page.tsx` (MODIFY)

```typescript
// Add revalidate export for ISR
export const revalidate = 3600 // 1 hour

// Generate static params for common routes
export async function generateStaticParams() {
  // Pre-render high-traffic API docs at build time
  return [
    { slug: ['hooks', 'use-clarity-chat'] },
    { slug: ['hooks', 'use-token-budget'] },
    { slug: ['components', 'chat-window'] },
    { slug: ['components', 'message-list'] },
    { slug: ['utilities', 'dev-helpers'] },
    { slug: ['utilities', 'setup-wizard'] },
    // ... add top 20 most-visited pages
  ]
}

export default async function ApiReferencePage({ params }) {
  const content = await fetchApiDocs(params.slug)

  return (
    <>
      {/* Add revalidation timestamp for debugging */}
      <meta name="x-page-generated" content={new Date().toISOString()} />
      <ApiDocumentation content={content} />
    </>
  )
}
```

**Why This Works**:

- `revalidate: 3600` = page cached for 1 hour at edge
- `generateStaticParams()` = pre-render at build time
- First request after 1 hour triggers background revalidation
- Users always get fast cached response

#### Step 1.2: Configure ISR for Get Started Routes

**File**: `apps/streamlined-docs/app/get-started/[...slug]/page.tsx` (MODIFY)

```typescript
// Tutorial content changes infrequently
export const revalidate = 7200 // 2 hours (less volatile than API docs)

export async function generateStaticParams() {
  return [
    { slug: ['installation'] },
    { slug: ['quick-start'] },
    { slug: ['tutorial'] },
    { slug: ['concepts'] },
    { slug: ['architecture'] },
    { slug: ['guides'] },
    // All 13 get-started pages
  ]
}
```

#### Step 1.3: Configure ISR for Example Routes

**File**: `apps/streamlined-docs/app/explore/examples/page.tsx` (MODIFY)

```typescript
// Examples are static showcase pages
export const revalidate = 10800 // 3 hours

export default async function ExamplesPage() {
  // Pre-render examples at build time
  const examples = await getExamples()

  return <ExamplesShowcase examples={examples} />
}
```

### ISR Configuration Matrix

| Route Pattern       | Revalidate | Reason                         | Build Pre-render |
| ------------------- | ---------- | ------------------------------ | ---------------- |
| `/api/reference/*`  | 1 hour     | API changes with deploys       | Top 20 pages     |
| `/get-started/*`    | 2 hours    | Tutorials rarely change        | All 13 pages     |
| `/explore/examples` | 3 hours    | Static showcase                | Yes              |
| `/explore/themes`   | 3 hours    | Theme gallery static           | Yes              |
| `/` (home)          | 30 min     | High traffic, frequent updates | Yes              |
| `/about/*`          | 6 hours    | Company info rarely changes    | All pages        |

---

## Task 2: Implement On-Demand Revalidation

### Problem Analysis

- ISR revalidates on schedule, not on content changes
- When docs update, users see stale content for up to 1 hour
- Need way to manually trigger revalidation on deploy

### Implementation Strategy

#### Step 2.1: Create Revalidation API Route

**File**: `apps/streamlined-docs/app/api/revalidate/route.ts` (NEW)

```typescript
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Verify secret token
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const body = await request.json()
  const { path, tag } = body

  try {
    // Revalidate by path
    if (path) {
      await revalidatePath(path)
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now(),
      })
    }

    // Revalidate by tag
    if (tag) {
      await revalidateTag(tag)
      return NextResponse.json({
        revalidated: true,
        tag,
        now: Date.now(),
      })
    }

    return NextResponse.json({ error: 'Path or tag required' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: 'Error revalidating', details: err }, { status: 500 })
  }
}
```

#### Step 2.2: Add Cache Tags to Pages

**File**: `apps/streamlined-docs/app/api/reference/[...slug]/page.tsx` (ENHANCE)

```typescript
import { unstable_cache } from 'next/cache'

// Tag API docs for group revalidation
export default async function ApiReferencePage({ params }) {
  const content = await unstable_cache(
    async () => fetchApiDocs(params.slug),
    [`api-docs-${params.slug.join('-')}`],
    {
      tags: ['api-docs', `api-docs-${params.slug[0]}`], // 'api-docs-hooks', etc.
      revalidate: 3600
    }
  )()

  return <ApiDocumentation content={content} />
}
```

#### Step 2.3: Create Deployment Hook

**File**: `.github/workflows/deploy.yml` (MODIFY)

```yaml
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

      # Revalidate all API docs after deploy
      - name: Revalidate ISR Cache
        run: |
          curl -X POST \
            "${{ secrets.PROD_URL }}/api/revalidate?secret=${{ secrets.REVALIDATION_SECRET }}" \
            -H "Content-Type: application/json" \
            -d '{"tag": "api-docs"}'
```

#### Step 2.4: Create Manual Revalidation Script

**File**: `scripts/revalidate-cache.ts` (NEW)

```typescript
#!/usr/bin/env node

const PROD_URL = process.env.PROD_URL || 'https://clarity-ai-chat.vercel.app'
const SECRET = process.env.REVALIDATION_SECRET

async function revalidate(pathOrTag: string, type: 'path' | 'tag' = 'path') {
  const body = type === 'path' ? { path: pathOrTag } : { tag: pathOrTag }

  const response = await fetch(`${PROD_URL}/api/revalidate?secret=${SECRET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Revalidation failed: ${response.statusText}`)
  }

  const data = await response.json()
  console.log(`✅ Revalidated:`, data)
}

// Usage examples:
// npm run revalidate -- --path=/api/reference/hooks
// npm run revalidate -- --tag=api-docs
const args = process.argv.slice(2)
const path = args[args.indexOf('--path') + 1]
const tag = args[args.indexOf('--tag') + 1]

if (path) {
  revalidate(path, 'path')
} else if (tag) {
  revalidate(tag, 'tag')
} else {
  console.error('Usage: npm run revalidate -- --path=/some/path OR --tag=some-tag')
  process.exit(1)
}
```

---

## Task 3: Optimize Cache Headers

### Problem Analysis

- Current cache headers not optimized for edge caching
- No stale-while-revalidate strategy
- CDN might not cache responses optimally

### Implementation Strategy

#### Step 3.1: Add Middleware for Cache Headers

**File**: `apps/streamlined-docs/middleware.ts` (MODIFY or CREATE)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Determine cache strategy by path
  const path = request.nextUrl.pathname

  // Static assets - aggressive caching
  if (path.startsWith('/_next/static/') || path.match(/\.(jpg|jpeg|png|svg|ico|woff2)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    return response
  }

  // API documentation - stale-while-revalidate
  if (path.startsWith('/api/reference/')) {
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return response
  }

  // Get started pages - longer cache
  if (path.startsWith('/get-started/')) {
    response.headers.set('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400')
    return response
  }

  // Home page - shorter cache, high traffic
  if (path === '/') {
    response.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
    return response
  }

  // Default - moderate caching
  response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

**Cache Strategy Explanation**:

- `s-maxage` = edge cache duration
- `stale-while-revalidate` = serve stale while fetching fresh
- Static assets = immutable (never change)
- Dynamic pages = stale-while-revalidate (always fast, eventually fresh)

#### Step 3.2: Add Next.js Config for Headers

**File**: `apps/streamlined-docs/next.config.ts` (MODIFY)

```typescript
const nextConfig: NextConfig = {
  // ... existing config

  // Custom headers for static pages
  async headers() {
    return [
      {
        source: '/about/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=21600, stale-while-revalidate=86400', // 6 hour cache
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=21600', // Vercel/Cloudflare specific
          },
        ],
      },
      {
        source: '/explore/themes',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=10800, stale-while-revalidate=86400', // 3 hour cache
          },
        ],
      },
    ]
  },
}
```

---

## Task 4: Add Performance Monitoring

### Implementation Strategy

#### Step 4.1: Create TTFB Monitoring Component

**File**: `apps/streamlined-docs/components/Monitoring/TTFBMonitor.tsx` (NEW)

```typescript
'use client'

import { useEffect } from 'react'
import { onTTFB } from 'web-vitals'

export function TTFBMonitor() {
  useEffect(() => {
    onTTFB((metric) => {
      // Log TTFB metrics
      console.log('TTFB:', metric.value, 'ms')

      // Send to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: 'TTFB',
          value: Math.round(metric.value),
          non_interaction: true,
        })
      }

      // Track if page was served from cache
      if (performance.getEntriesByType) {
        const navEntry = performance.getEntriesByType('navigation')[0] as any
        const fromCache = navEntry?.deliveryType === 'cache'

        console.log('Served from cache:', fromCache)
        window.gtag?.('event', 'cache_status', {
          from_cache: fromCache,
          ttfb: Math.round(metric.value),
        })
      }
    })
  }, [])

  return null
}
```

#### Step 4.2: Add to Root Layout

**File**: `apps/streamlined-docs/app/layout.tsx` (MODIFY)

```typescript
import { TTFBMonitor } from '@/components/Monitoring/TTFBMonitor'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TTFBMonitor />
        {children}
      </body>
    </html>
  )
}
```

#### Step 4.3: Create Performance Dashboard

**File**: `apps/streamlined-docs/app/admin/performance/page.tsx` (NEW)

```typescript
// Admin-only page to view ISR performance
export default async function PerformanceAdminPage() {
  // Fetch from analytics API
  const metrics = await fetch('/api/analytics/performance').then(r => r.json())

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">ISR Performance Metrics</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Avg TTFB"
          value={`${metrics.avgTTFB}ms`}
          target="<100ms"
          status={metrics.avgTTFB < 100 ? 'good' : 'needs-work'}
        />
        <MetricCard
          title="Cache Hit Rate"
          value={`${metrics.cacheHitRate}%`}
          target=">95%"
          status={metrics.cacheHitRate > 95 ? 'good' : 'needs-work'}
        />
        <MetricCard
          title="Revalidations/Day"
          value={metrics.revalidationsPerDay}
          target="<50"
          status={metrics.revalidationsPerDay < 50 ? 'good' : 'needs-work'}
        />
      </div>

      <CacheHitRateChart data={metrics.cacheHitRateOverTime} />
      <TTFBDistributionChart data={metrics.ttfbDistribution} />
    </div>
  )
}
```

---

## Task 5: Testing & Validation

### Step 5.1: Test ISR Functionality

**Test Script**: `scripts/test-isr.ts` (NEW)

```typescript
import { chromium } from 'playwright'

async function testISR() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log('Test 1: First request (cache miss)')
  const response1 = await page.goto('http://localhost:3000/api/reference/hooks')
  const ttfb1 = await page.evaluate(() => {
    const [navEntry] = performance.getEntriesByType('navigation')
    return (navEntry as any).responseStart - (navEntry as any).requestStart
  })
  console.log('TTFB (miss):', ttfb1, 'ms')
  console.log('Age header:', response1?.headers()['age'] || 'none')

  // Wait 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log('\nTest 2: Second request (cache hit)')
  const response2 = await page.goto('http://localhost:3000/api/reference/hooks')
  const ttfb2 = await page.evaluate(() => {
    const [navEntry] = performance.getEntriesByType('navigation')
    return (navEntry as any).responseStart - (navEntry as any).requestStart
  })
  console.log('TTFB (hit):', ttfb2, 'ms')
  console.log('Age header:', response2?.headers()['age'] || 'none')
  console.log('Improvement:', Math.round(((ttfb1 - ttfb2) / ttfb1) * 100), '%')

  await browser.close()

  // Assert improvement
  if (ttfb2 < ttfb1 * 0.3) {
    console.log('\n✅ ISR working - cache hit is >70% faster')
  } else {
    console.log('\n❌ ISR not working optimally')
  }
}

testISR()
```

### Step 5.2: Verify Cache Headers

```bash
# Check cache headers on production
curl -I https://clarity-ai-chat.vercel.app/api/reference/hooks

# Expected headers:
# Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
# Age: 120 (seconds since last generation)
# X-Vercel-Cache: HIT (or MISS on first request)
```

### Step 5.3: Load Test

```bash
# Use k6 for load testing
npm run perf:load-test -- \
  --vus=50 \
  --duration=30s \
  --url=https://clarity-ai-chat.vercel.app/api/reference/hooks

# Verify:
# - 95%+ cache hit rate
# - TTFB <100ms for cached requests
# - No errors during high load
```

---

## Success Metrics

### TTFB Targets

| Route Type  | Before ISR | After ISR | Improvement |
| ----------- | ---------- | --------- | ----------- |
| API Docs    | 850ms      | <85ms     | 90% ✅      |
| Get Started | 620ms      | <65ms     | 89.5% ✅    |
| Examples    | 920ms      | <90ms     | 90.2% ✅    |
| Home        | 720ms      | <75ms     | 89.6% ✅    |

### Cache Performance Targets

| Metric              | Target    | Measurement                  |
| ------------------- | --------- | ---------------------------- |
| Cache Hit Rate      | >95%      | Monitor via Vercel Analytics |
| TTFB P50            | <100ms    | Web Vitals tracking          |
| TTFB P95            | <300ms    | Web Vitals tracking          |
| Edge Cache Duration | 1-6 hours | Verify via Age header        |

### Expected Impact

- **95% of requests** served from edge cache (<100ms TTFB)
- **5% of requests** trigger revalidation (still fast due to stale-while-revalidate)
- **Zero impact** on content freshness (revalidates within 1-6 hours)
- **50%+ reduction** in origin server load

---

## Rollback Plan

### If ISR Causes Stale Content Issues

```typescript
// Remove revalidate exports
// apps/streamlined-docs/app/api/reference/[...slug]/page.tsx
// export const revalidate = 3600 // REMOVE THIS LINE

// Force dynamic rendering
export const dynamic = 'force-dynamic'
```

### If Cache Headers Cause Issues

```typescript
// middleware.ts - disable cache headers
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  // REMOVE cache header logic
  return response
}
```

### If On-Demand Revalidation Fails

```bash
# Manual full rebuild
vercel deploy --prod --force

# Or disable revalidation endpoint
# Remove app/api/revalidate/route.ts
```

---

## Deliverables

### Files Created

1. `app/api/revalidate/route.ts` - On-demand revalidation API
2. `scripts/revalidate-cache.ts` - Manual revalidation tool
3. `middleware.ts` - Cache header optimization
4. `components/Monitoring/TTFBMonitor.tsx` - Performance tracking
5. `app/admin/performance/page.tsx` - Admin dashboard
6. `scripts/test-isr.ts` - ISR testing script

### Files Modified

1. `app/api/reference/[...slug]/page.tsx` - Add ISR config
2. `app/get-started/[...slug]/page.tsx` - Add ISR config
3. `app/explore/examples/page.tsx` - Add ISR config
4. `app/layout.tsx` - Add TTFB monitor
5. `next.config.ts` - Add custom headers
6. `.github/workflows/deploy.yml` - Add revalidation hook

### Environment Variables Required

```bash
# .env.production
REVALIDATION_SECRET=<generate-with-openssl-rand-hex-32>
PROD_URL=https://clarity-ai-chat.vercel.app
```

### Reports Generated

1. ISR configuration audit
2. TTFB improvement report (before/after)
3. Cache hit rate analysis
4. Agent 35 completion report (`WAVE_3_3_AGENT_35_COMPLETE.md`)

---

## Coordination

### Pre-Flight

```bash
# 1. Verify current TTFB baseline
npm run perf:measure-ttfb

# 2. Check Vercel Edge Network status
curl -I https://clarity-ai-chat.vercel.app/

# 3. Ensure no active caching already enabled
grep -r "revalidate" apps/streamlined-docs/app/
```

### During Execution

- [ ] Deploy to staging first
- [ ] Verify ISR works on Vercel preview
- [ ] Test manual revalidation
- [ ] Monitor edge cache behavior
- [ ] Check Age headers

### After Completion

- [ ] Enable production monitoring
- [ ] Set up alerts for cache hit rate <90%
- [ ] Document revalidation procedures for team
- [ ] Update deployment runbook

---

**Agent 35 Status**: 📋 PLANNED **Ready for Execution**: ✅ YES **Dependencies**: None (independent
of Agent 32-33) **Next Phase**: Wave 3.4 (Quality & Security)
