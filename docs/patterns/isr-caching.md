# ISR Caching Patterns

> **Wave 3.3 Feature** | Stable | TTFB: 850ms → 85ms (-90%)

## Overview

Incremental Static Regeneration (ISR) dramatically reduces Time To First Byte (TTFB) for documentation pages by serving pre-rendered static content while automatically revalidating stale data in the background.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Implementation](#implementation)
3. [Revalidation Strategies](#revalidation-strategies)
4. [Performance Monitoring](#performance-monitoring)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Core Concepts

### What is ISR?

ISR combines the benefits of static generation and server-side rendering:

1. **Initial Build**: Pages pre-rendered at build time
2. **Serve Cached**: Subsequent requests serve cached HTML (fast!)
3. **Background Revalidation**: Stale pages regenerated in background
4. **Automatic Updates**: New version served to next visitor

### Why Use ISR?

- **Speed**: Serve pre-rendered HTML (sub-100ms TTFB)
- **Freshness**: Content updates automatically
- **Scalability**: No server rendering overhead
- **Cost**: Reduced compute costs

### Stale-While-Revalidate

```
┌─────────────────────────────────────────────────────────────────┐
│ Request Timeline                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Request 1 (t=0)     → Serve cached (85ms)                      │
│                                                                  │
│ Request 2 (t=3601)  → Serve stale cache (85ms)                 │
│                       ↓ Trigger revalidation in background      │
│                       ↓ (takes 850ms, user doesn't wait)        │
│                       ↓ Cache updated                           │
│                                                                  │
│ Request 3 (t=3602)  → Serve fresh cache (85ms)                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation

### Basic ISR Configuration

Add `revalidate` export to any page:

```tsx
// app/docs/page.tsx
export const revalidate = 3600 // Revalidate every 1 hour

export default async function DocsPage() {
  const docs = await fetchDocumentation()
  return <DocsLayout docs={docs} />
}
```

### Route Configuration Matrix

| Route                     | Revalidate | Reason                        |
| ------------------------- | ---------- | ----------------------------- |
| `/`                       | 3600       | Homepage (updated hourly)     |
| `/api/reference/*`        | 3600       | API docs (updated with code)  |
| `/get-started/*`          | 7200       | Tutorials (rarely change)     |
| `/explore/demos`          | 1800       | Demos (updated frequently)    |
| `/explore/themes`         | 3600       | Themes (updated occasionally) |
| `/about/performance`      | 7200       | Performance docs (stable)     |
| `/api`                    | 3600       | API index (updated with code) |
| `/api/reference/hooks/*`  | 3600       | Hook docs (updated with code) |
| `/api/reference/utils/*`  | 3600       | Utility docs (stable)         |
| `/explore/themes/*/demo`  | dynamic    | Live demos (no caching)       |
| `/playground`             | dynamic    | Interactive (no caching)      |
| `/api/docs-assistant`     | dynamic    | AI endpoint (no caching)      |
| `/api/ai/*`               | dynamic    | AI APIs (no caching)          |

### Implementation in Next.js 15

#### Page-Level ISR

```tsx
// app/api/reference/hooks/page.tsx
import { HooksReference } from '@/components/HooksReference'

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

export default async function HooksPage() {
  // Data fetching happens at build time and every revalidation
  const hooks = await fetchHooksDocumentation()
  const examples = await fetchCodeExamples()

  return <HooksReference hooks={hooks} examples={examples} />
}
```

#### Dynamic Segments with ISR

```tsx
// app/api/reference/hooks/[slug]/page.tsx

// Generate static params at build time
export async function generateStaticParams() {
  const hooks = await fetchAllHooks()
  return hooks.map((hook) => ({ slug: hook.slug }))
}

// Enable ISR
export const revalidate = 3600

export default async function HookDetailPage({ params }: { params: { slug: string } }) {
  const hook = await fetchHook(params.slug)
  return <HookDetail hook={hook} />
}
```

---

## Revalidation Strategies

### 1. Time-Based Revalidation

Automatically revalidate after a specified interval.

```tsx
// Revalidate every hour
export const revalidate = 3600

// Revalidate every 30 minutes
export const revalidate = 1800

// Revalidate every 2 hours
export const revalidate = 7200
```

**When to use**:

- Content updates on predictable schedule
- Want automatic freshness without manual triggers
- Acceptable for content to be slightly stale

### 2. On-Demand Revalidation

Manually trigger revalidation via API.

#### Create Revalidation API Route

```tsx
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Verify secret token
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // Get revalidation target
  const body = await request.json()
  const { path, tag } = body

  try {
    if (path) {
      // Revalidate specific path
      revalidatePath(path)
      return NextResponse.json({ revalidated: true, path })
    } else if (tag) {
      // Revalidate by tag
      revalidateTag(tag)
      return NextResponse.json({ revalidated: true, tag })
    }

    return NextResponse.json({ error: 'Missing path or tag' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
```

#### Trigger Revalidation

```bash
# Revalidate specific path
curl -X POST 'http://localhost:3000/api/revalidate?secret=YOUR_SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"path":"/api/reference/hooks"}'

# Revalidate by tag
curl -X POST 'http://localhost:3000/api/revalidate?secret=YOUR_SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"tag":"api-docs"}'
```

#### Using Tags

```tsx
// app/api/reference/hooks/page.tsx
export const revalidate = 3600 // Still use time-based as fallback

export default async function HooksPage() {
  const hooks = await fetch('https://api.example.com/hooks', {
    next: { tags: ['api-docs', 'hooks'] },
  }).then((res) => res.json())

  return <HooksReference hooks={hooks} />
}
```

**When to use**:

- Content updates triggered by events (e.g., Git push, CMS update)
- Need immediate revalidation
- Want granular control over cache invalidation

### 3. Mixed Strategy (Recommended)

Combine time-based and on-demand revalidation.

```tsx
// Time-based fallback + on-demand via tags
export const revalidate = 3600 // Hourly fallback

export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { tags: ['content'], revalidate: 3600 },
  }).then((res) => res.json())

  return <Content data={data} />
}
```

**Benefits**:

- Automatic freshness (time-based)
- Manual control (on-demand)
- Resilient to forgotten revalidations

---

## Performance Monitoring

### Measuring TTFB

#### Using cURL

```bash
# Create curl timing format file
cat > curl-format.txt << EOF
time_namelookup:  %{time_namelookup}s\n
time_connect:     %{time_connect}s\n
time_starttransfer: %{time_starttransfer}s\n
time_total:       %{time_total}s\n
EOF

# Measure TTFB
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/reference/hooks
```

#### Using Web Vitals

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
    // Log to analytics
    console.log(metric)

    // Send to backend
    fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(metric),
    })
  })

  return null
}
```

### Performance Dashboard

```tsx
// app/api/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const metric = await request.json()

  // Log Web Vitals
  console.log({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    path: request.headers.get('referer'),
  })

  // Store in database or analytics service
  // await db.metrics.create({ data: metric })

  return NextResponse.json({ ok: true })
}
```

### Key Metrics

| Metric | Target  | ISR Impact  | Wave 3.3 Result |
| ------ | ------- | ----------- | --------------- |
| TTFB   | <200ms  | -90%        | 85ms            |
| FCP    | <1.8s   | -60%        | 0.8s            |
| LCP    | <2.5s   | -40%        | 1.4s            |
| CLS    | <0.1    | 0 (no jump) | 0.02            |
| FID    | <100ms  | No impact   | 45ms            |

---

## Best Practices

### 1. Choose Appropriate Revalidation Intervals

```tsx
// ✅ Good: Appropriate intervals based on content update frequency
export const revalidate = 3600 // Hourly for API docs (updated with deploys)
export const revalidate = 7200 // 2 hours for guides (rarely change)
export const revalidate = 1800 // 30 min for news/blog (frequent updates)

// ❌ Bad: Too aggressive (wastes resources)
export const revalidate = 60 // Every minute (unnecessary for docs)

// ❌ Bad: Too lenient (stale content)
export const revalidate = 86400 // 24 hours for frequently updated content
```

### 2. Use `dynamic` for Real-Time Data

```tsx
// ✅ Good: Disable caching for real-time data
export const dynamic = 'force-dynamic'

export default async function LiveDashboard() {
  const liveData = await fetchRealTimeMetrics()
  return <Dashboard data={liveData} />
}

// ❌ Bad: ISR for real-time data (will be stale)
export const revalidate = 60 // Still stale for real-time use case
```

### 3. Implement Cache Headers

```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add cache headers for ISR pages
  if (request.nextUrl.pathname.startsWith('/api/reference')) {
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  }

  return response
}
```

### 4. Monitor Cache Hit Rates

```tsx
// app/api/cache-stats/route.ts
export async function GET() {
  const stats = {
    hits: getCacheHits(),
    misses: getCacheMisses(),
    hitRate: (getCacheHits() / (getCacheHits() + getCacheMisses())) * 100,
    avgTTFB: getAverageTTFB(),
  }

  return Response.json(stats)
}
```

### 5. Use Tags for Granular Invalidation

```tsx
// ✅ Good: Tags allow targeted invalidation
const hooks = await fetch('/api/hooks', {
  next: { tags: ['hooks', 'api-docs'] },
})

const components = await fetch('/api/components', {
  next: { tags: ['components', 'api-docs'] },
})

// Invalidate only hooks
revalidateTag('hooks')

// Invalidate all API docs
revalidateTag('api-docs')
```

### 6. Test ISR Behavior

```bash
# Test ISR revalidation
npm run build
npm start

# Make request (cache miss)
curl http://localhost:3000/api/reference/hooks

# Make request again (cache hit - should be fast)
curl http://localhost:3000/api/reference/hooks

# Wait for revalidation interval + 1 second
sleep 3601

# Make request (serves stale, triggers revalidation)
curl http://localhost:3000/api/reference/hooks

# Make request again (fresh cache)
curl http://localhost:3000/api/reference/hooks
```

---

## Examples

### Example 1: API Documentation with ISR

```tsx
// app/api/reference/hooks/page.tsx
import { HooksAPI } from '@/components/HooksAPI'
import { fetchHooksDocumentation } from '@/lib/docs'

// ISR: Revalidate every hour
export const revalidate = 3600

// Generate metadata
export async function generateMetadata() {
  return {
    title: 'Hooks API Reference',
    description: 'Complete reference for Clarity Chat hooks',
  }
}

export default async function HooksPage() {
  // Fetch at build time + every revalidation
  const hooks = await fetchHooksDocumentation()

  return (
    <div>
      <h1>Hooks API Reference</h1>
      <HooksAPI hooks={hooks} />
    </div>
  )
}
```

### Example 2: Dynamic Routes with ISR

```tsx
// app/blog/[slug]/page.tsx

// Generate all blog post paths at build time
export async function generateStaticParams() {
  const posts = await fetchAllBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

// ISR: Revalidate every 30 minutes
export const revalidate = 1800

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchBlogPost(params.slug)
  return <BlogPostLayout post={post} />
}
```

### Example 3: On-Demand Revalidation from Webhook

```tsx
// app/api/webhooks/content-update/route.ts
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Verify webhook signature (important for security!)
  const signature = request.headers.get('x-webhook-signature')
  if (!verifyWebhookSignature(signature, await request.text())) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Parse webhook payload
  const { contentType, id } = await request.json()

  // Revalidate appropriate content
  if (contentType === 'blog-post') {
    revalidateTag('blog')
  } else if (contentType === 'api-docs') {
    revalidateTag('api-docs')
  }

  return NextResponse.json({ revalidated: true, contentType })
}
```

---

## Troubleshooting

### Issue: Pages Not Revalidating

**Symptom**: Content remains stale after revalidation interval.

**Causes**:

1. `revalidate` not exported from page
2. Build not running in production mode
3. CDN caching overriding ISR

**Solutions**:

```tsx
// ✅ Ensure revalidate is exported
export const revalidate = 3600 // Must be at top level

// ✅ Build in production mode
NODE_ENV=production npm run build

// ✅ Configure CDN to respect Cache-Control headers
```

### Issue: Slow First Request After Revalidation

**Symptom**: First request after revalidation is slow.

**Cause**: Page regeneration happens on-demand.

**Solution**: Use background revalidation or warming script.

```bash
# scripts/warm-cache.sh
#!/bin/bash

# Warm cache for all critical pages
curl -s http://localhost:3000/ > /dev/null
curl -s http://localhost:3000/api/reference/hooks > /dev/null
curl -s http://localhost:3000/get-started > /dev/null

echo "Cache warmed"
```

### Issue: Excessive Revalidations

**Symptom**: High server load, frequent regenerations.

**Cause**: Revalidation interval too short.

**Solution**: Increase revalidation interval.

```tsx
// ❌ Bad: Too frequent
export const revalidate = 60 // Every minute

// ✅ Good: Appropriate interval
export const revalidate = 3600 // Hourly
```

---

## Related Documentation

- [Lazy Loading Patterns](./lazy-loading.md)
- [Performance Runbook](../runbooks/performance.md)
- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

---

**Last Updated**: Wave 3.3 completion (January 26, 2026)
