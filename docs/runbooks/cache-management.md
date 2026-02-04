# Cache Management Runbook

> **Operations Guide** | Wave 3.3+ | Last Updated: January 26, 2026

## Overview

This runbook provides procedures for managing ISR (Incremental Static Regeneration) cache,
troubleshooting cache issues, and performing cache-related operations for the Clarity AI Chat
Components documentation site.

---

## Table of Contents

1. [Cache Architecture](#cache-architecture)
2. [Cache Operations](#cache-operations)
3. [Troubleshooting](#troubleshooting)
4. [Cache Warming](#cache-warming)
5. [Monitoring](#monitoring)
6. [Maintenance](#maintenance)

---

## Cache Architecture

### Cache Layers

```
┌─────────────────────────────────────────────────────┐
│                    CDN Cache                         │
│              (Vercel/Cloudflare Edge)                │
│                  TTL: 1 hour                         │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Next.js ISR Cache                       │
│               (Server-side)                          │
│           Revalidate: 3600s (1 hour)                 │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Data Sources                            │
│        (Database, CMS, File System)                  │
└─────────────────────────────────────────────────────┘
```

### Cached Pages

| Route                    | Revalidate | Strategy         | Priority |
| ------------------------ | ---------- | ---------------- | -------- |
| `/`                      | 3600s      | Time + On-demand | High     |
| `/api/reference/*`       | 3600s      | Time + On-demand | High     |
| `/get-started/*`         | 7200s      | Time only        | Medium   |
| `/explore/demos`         | 1800s      | Time + On-demand | High     |
| `/explore/themes`        | 3600s      | Time only        | Medium   |
| `/about/performance`     | 7200s      | Time only        | Low      |
| `/api`                   | 3600s      | Time + On-demand | High     |
| `/api/reference/hooks/*` | 3600s      | Time + On-demand | High     |
| `/api/reference/utils/*` | 3600s      | Time only        | Medium   |

### Cache Tags

```typescript
// Cache organization by tags
const cacheTags = {
  'api-docs': ['/api', '/api/reference/*'],
  hooks: ['/api/reference/hooks/*'],
  utilities: ['/api/reference/utilities/*'],
  guides: ['/get-started/*'],
  demos: ['/explore/demos'],
  themes: ['/explore/themes'],
}
```

---

## Cache Operations

### Manual Cache Revalidation

#### Revalidate Single Path

```bash
#!/bin/bash
# scripts/revalidate-path.sh

PATH_TO_REVALIDATE=$1
SECRET=${REVALIDATION_SECRET:-"your-secret-here"}

if [ -z "$PATH_TO_REVALIDATE" ]; then
  echo "Usage: ./revalidate-path.sh <path>"
  echo "Example: ./revalidate-path.sh /api/reference/hooks"
  exit 1
fi

echo "Revalidating: $PATH_TO_REVALIDATE"

curl -X POST "http://localhost:3000/api/revalidate?secret=$SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"path\":\"$PATH_TO_REVALIDATE\"}"

echo ""
echo "Revalidation triggered successfully"
```

#### Revalidate by Tag

```bash
#!/bin/bash
# scripts/revalidate-tag.sh

TAG=$1
SECRET=${REVALIDATION_SECRET:-"your-secret-here"}

if [ -z "$TAG" ]; then
  echo "Usage: ./revalidate-tag.sh <tag>"
  echo "Example: ./revalidate-tag.sh api-docs"
  echo ""
  echo "Available tags:"
  echo "  - api-docs: All API documentation"
  echo "  - hooks: Hook reference pages"
  echo "  - utilities: Utility reference pages"
  echo "  - guides: Getting started guides"
  echo "  - demos: Demo pages"
  echo "  - themes: Theme showcase pages"
  exit 1
fi

echo "Revalidating tag: $TAG"

curl -X POST "http://localhost:3000/api/revalidate?secret=$SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"tag\":\"$TAG\"}"

echo ""
echo "Tag revalidation triggered successfully"
```

#### Revalidate Multiple Paths

```bash
#!/bin/bash
# scripts/revalidate-multiple.sh

SECRET=${REVALIDATION_SECRET:-"your-secret-here"}

PATHS=(
  "/api/reference/hooks"
  "/api/reference/utilities"
  "/api"
  "/"
)

echo "Revalidating ${#PATHS[@]} paths..."
echo ""

for path in "${PATHS[@]}"; do
  echo "Revalidating: $path"
  curl -s -X POST "http://localhost:3000/api/revalidate?secret=$SECRET" \
    -H "Content-Type: application/json" \
    -d "{\"path\":\"$path\"}" > /dev/null

  if [ $? -eq 0 ]; then
    echo "✓ Success"
  else
    echo "✗ Failed"
  fi
  echo ""
done

echo "Revalidation complete"
```

### Programmatic Revalidation

```typescript
// lib/cache/revalidate.ts
export async function revalidatePath(path: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/revalidate?secret=${process.env.REVALIDATION_SECRET}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    })

    return response.ok
  } catch (error) {
    console.error('Revalidation failed:', error)
    return false
  }
}

export async function revalidateTag(tag: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/revalidate?secret=${process.env.REVALIDATION_SECRET}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag }),
    })

    return response.ok
  } catch (error) {
    console.error('Tag revalidation failed:', error)
    return false
  }
}
```

### Webhook Integration

```typescript
// app/api/webhooks/content-update/route.ts
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  // 1. Verify webhook signature
  const signature = request.headers.get('x-webhook-signature')
  const body = await request.text()

  if (!verifySignature(signature, body)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // 2. Parse payload
  const payload = JSON.parse(body)
  const { contentType, paths, tags } = payload

  // 3. Revalidate appropriate content
  const results = []

  if (paths) {
    for (const path of paths) {
      revalidatePath(path)
      results.push({ type: 'path', value: path, revalidated: true })
    }
  }

  if (tags) {
    for (const tag of tags) {
      revalidateTag(tag)
      results.push({ type: 'tag', value: tag, revalidated: true })
    }
  }

  // 4. Log revalidation
  console.log('[Webhook] Content updated:', {
    contentType,
    timestamp: new Date().toISOString(),
    results,
  })

  return NextResponse.json({
    success: true,
    revalidated: results,
    timestamp: Date.now(),
  })
}

function verifySignature(signature: string | null, body: string): boolean {
  if (!signature) return false

  const secret = process.env.WEBHOOK_SECRET
  if (!secret) {
    console.error('WEBHOOK_SECRET not configured')
    return false
  }

  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex')

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}
```

---

## Troubleshooting

### Cache Not Invalidating

**Symptoms**:

- Updated content not showing
- Old data persisting beyond revalidation period

**Diagnosis**:

```bash
# 1. Check revalidation configuration
grep "export const revalidate" apps/streamlined-docs/app/**/page.tsx

# 2. Check cache headers
curl -I http://localhost:3000/api/reference/hooks

# 3. Check for dynamic forcing
grep "export const dynamic = 'force-dynamic'" apps/streamlined-docs/app/**/page.tsx
```

**Solutions**:

```tsx
// ✅ Correct: Export revalidate at page level
export const revalidate = 3600

// ❌ Wrong: Missing revalidate export
// (Page defaults to static without revalidation)

// ❌ Wrong: Dynamic forces no caching
export const dynamic = 'force-dynamic'
```

### Cache Hit Rate Low

**Symptoms**:

- `X-Nextjs-Cache: MISS` on most requests
- High server CPU usage

**Diagnosis**:

```bash
# Check cache hit rate
for i in {1..10}; do
  curl -I http://localhost:3000/api/reference/hooks 2>&1 | grep -i "x-nextjs-cache"
  sleep 1
done

# Expected: Mostly HIT after first request
# Actual: Mostly MISS indicates problem
```

**Possible Causes**:

1. **Dynamic rendering forced**:

   ```tsx
   // Remove this if present:
   export const dynamic = 'force-dynamic'
   ```

2. **Cookies or headers causing dynamic render**:

   ```tsx
   // Remove if not needed:
   const cookieStore = cookies()
   const headersList = headers()
   ```

3. **CDN bypassing cache**:
   ```bash
   # Check CDN configuration
   # Ensure cache headers are respected
   ```

### Stale Content Persisting

**Symptoms**:

- Content outdated despite revalidation
- Manual revalidation not working

**Diagnosis**:

```bash
# 1. Test revalidation endpoint
curl -X POST 'http://localhost:3000/api/revalidate?secret=YOUR_SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"path":"/api/reference/hooks"}'

# 2. Check response
# Expected: {"revalidated":true,"path":"/api/reference/hooks","now":1234567890}
# If error: Check REVALIDATION_SECRET environment variable

# 3. Verify cache cleared
curl -I http://localhost:3000/api/reference/hooks
# Should show X-Nextjs-Cache: MISS on next request
```

**Solutions**:

```bash
# Option 1: Force rebuild
rm -rf .next
pnpm build
pnpm start

# Option 2: Clear CDN cache (if using Vercel)
vercel deployment purge <deployment-url>

# Option 3: Restart server
# Kills server and restarts with fresh cache
pkill -f "next start"
pnpm start
```

### Cache Size Too Large

**Symptoms**:

- Disk space filling up
- Slow builds

**Diagnosis**:

```bash
# Check cache size
du -sh .next/cache

# Check individual cache entries
du -sh .next/cache/**/*
```

**Solutions**:

```bash
# Clean cache
rm -rf .next/cache

# Configure cache size limits (next.config.ts)
export default {
  experimental: {
    isrMemoryCacheSize: 50 * 1024 * 1024, // 50MB
  },
}
```

---

## Cache Warming

### What is Cache Warming?

Proactively requesting pages to populate cache before user traffic arrives.

### When to Warm Cache

- After deployments
- After manual revalidations
- During low-traffic periods
- Before expected traffic spikes

### Cache Warming Script

```bash
#!/bin/bash
# scripts/warm-cache.sh

echo "=== Cache Warming Started ==="
echo ""

BASE_URL=${1:-"http://localhost:3000"}

# Critical pages to warm
PAGES=(
  "/"
  "/api"
  "/api/reference/hooks"
  "/api/reference/utilities"
  "/get-started"
  "/explore/demos"
  "/explore/themes"
  "/about/performance"
)

echo "Warming $BASE_URL"
echo "Pages to warm: ${#PAGES[@]}"
echo ""

for page in "${PAGES[@]}"; do
  echo -n "Warming: $page ... "

  # Make request (discard output)
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$page")

  if [ "$STATUS" -eq 200 ]; then
    echo "✓ ($STATUS)"
  else
    echo "✗ ($STATUS)"
  fi

  # Small delay to avoid overwhelming server
  sleep 0.5
done

echo ""
echo "=== Cache Warming Complete ==="
```

### Automated Cache Warming

```yaml
# .github/workflows/deploy.yml
name: Deploy & Warm Cache

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        run: vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

      - name: Warm cache
        run: ./scripts/warm-cache.sh https://your-domain.com
```

### Dynamic Route Warming

```typescript
// scripts/warm-dynamic-routes.ts
import { fetchAllHooks } from './lib/docs'

async function warmDynamicRoutes() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

  // Get all dynamic hook routes
  const hooks = await fetchAllHooks()

  console.log(`Warming ${hooks.length} hook pages...`)

  for (const hook of hooks) {
    const url = `${baseUrl}/api/reference/hooks/${hook.slug}`
    console.log(`Warming: ${url}`)

    try {
      const response = await fetch(url)
      console.log(`✓ ${response.status}`)
    } catch (error) {
      console.error(`✗ ${url} failed:`, error)
    }

    // Rate limit to avoid overwhelming server
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log('Cache warming complete')
}

warmDynamicRoutes()
```

---

## Monitoring

### Cache Metrics

```typescript
// lib/cache/metrics.ts
interface CacheMetrics {
  hits: number
  misses: number
  hitRate: number
  avgTTFB: number
  revalidations: number
}

class CacheMonitor {
  private metrics: Map<string, CacheMetrics> = new Map()

  recordHit(path: string) {
    const metric = this.getOrCreate(path)
    metric.hits++
    this.updateHitRate(path)
  }

  recordMiss(path: string) {
    const metric = this.getOrCreate(path)
    metric.misses++
    this.updateHitRate(path)
  }

  recordTTFB(path: string, ttfb: number) {
    const metric = this.getOrCreate(path)
    const currentAvg = metric.avgTTFB
    const total = metric.hits + metric.misses
    metric.avgTTFB = (currentAvg * (total - 1) + ttfb) / total
  }

  recordRevalidation(path: string) {
    const metric = this.getOrCreate(path)
    metric.revalidations++
  }

  getMetrics(path: string): CacheMetrics | undefined {
    return this.metrics.get(path)
  }

  private getOrCreate(path: string): CacheMetrics {
    if (!this.metrics.has(path)) {
      this.metrics.set(path, {
        hits: 0,
        misses: 0,
        hitRate: 0,
        avgTTFB: 0,
        revalidations: 0,
      })
    }
    return this.metrics.get(path)!
  }

  private updateHitRate(path: string) {
    const metric = this.metrics.get(path)!
    const total = metric.hits + metric.misses
    metric.hitRate = total > 0 ? metric.hits / total : 0
  }
}

export const cacheMonitor = new CacheMonitor()
```

### Cache Dashboard API

```typescript
// app/api/cache-stats/route.ts
import { NextResponse } from 'next/server'
import { cacheMonitor } from '@/lib/cache/metrics'

export async function GET() {
  const paths = [
    '/',
    '/api',
    '/api/reference/hooks',
    '/api/reference/utilities',
    '/get-started',
    '/explore/demos',
  ]

  const stats = paths.map((path) => ({
    path,
    metrics: cacheMonitor.getMetrics(path),
  }))

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    stats,
  })
}
```

### Alerting

```typescript
// lib/cache/alerts.ts
export async function checkCacheHealth() {
  const stats = await fetch('/api/cache-stats').then((r) => r.json())

  for (const { path, metrics } of stats.stats) {
    // Alert on low hit rate
    if (metrics.hitRate < 0.7) {
      console.warn(`⚠️ Low cache hit rate for ${path}: ${(metrics.hitRate * 100).toFixed(1)}%`)
      // Send alert (email, Slack, etc.)
    }

    // Alert on high TTFB
    if (metrics.avgTTFB > 200) {
      console.warn(`⚠️ High TTFB for ${path}: ${metrics.avgTTFB.toFixed(0)}ms`)
      // Send alert
    }

    // Alert on excessive revalidations
    if (metrics.revalidations > 100) {
      console.warn(`⚠️ Excessive revalidations for ${path}: ${metrics.revalidations}`)
      // Send alert
    }
  }
}

// Run health check every 5 minutes
setInterval(checkCacheHealth, 5 * 60 * 1000)
```

---

## Maintenance

### Regular Maintenance Tasks

#### Daily

```bash
# Check cache health
curl http://localhost:3000/api/cache-stats | jq '.stats[] | select(.metrics.hitRate < 0.7)'
```

#### Weekly

```bash
# Audit cache configuration
grep -r "export const revalidate" apps/streamlined-docs/app

# Check cache size
du -sh .next/cache

# Review revalidation logs
grep "Revalidation" logs/*.log | tail -100
```

#### Monthly

```bash
# Full cache clear and rebuild
rm -rf .next
pnpm build
pnpm start

# Warm cache
./scripts/warm-cache.sh

# Review cache metrics
# Check for pages with low hit rates or high TTFB
```

### Cache Cleanup

```bash
#!/bin/bash
# scripts/cache-cleanup.sh

echo "=== Cache Cleanup ==="

# Remove Next.js cache
echo "Removing .next/cache..."
rm -rf .next/cache

# Remove node_modules cache (if needed)
echo "Removing node_modules/.cache..."
rm -rf node_modules/.cache

# Remove pnpm cache (optional)
echo "Cleaning pnpm cache..."
pnpm store prune

echo "Cache cleanup complete"
```

### Emergency Cache Clear

```bash
#!/bin/bash
# scripts/emergency-cache-clear.sh

echo "🚨 EMERGENCY CACHE CLEAR"
echo "This will:"
echo "  1. Stop the server"
echo "  2. Delete all cache"
echo "  3. Rebuild application"
echo "  4. Restart server"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Stopping server..."
  pkill -f "next start" || true

  echo "Removing cache..."
  rm -rf .next

  echo "Rebuilding..."
  pnpm build

  echo "Starting server..."
  pnpm start &

  echo "Warming cache..."
  sleep 5
  ./scripts/warm-cache.sh

  echo "✅ Emergency cache clear complete"
else
  echo "Aborted"
fi
```

---

## Best Practices

### 1. Use Appropriate Revalidation Intervals

```tsx
// ✅ Good: Frequent updates
export const revalidate = 1800 // 30 min for news/blog

// ✅ Good: Moderate updates
export const revalidate = 3600 // 1 hour for API docs

// ✅ Good: Infrequent updates
export const revalidate = 7200 // 2 hours for guides

// ❌ Bad: Too aggressive
export const revalidate = 60 // 1 minute (wastes resources)
```

### 2. Combine Time-Based and On-Demand

```tsx
// Best of both worlds
export const revalidate = 3600 // Hourly fallback

export default async function Page() {
  const data = await fetch('...', {
    next: { tags: ['content'] }, // Allows on-demand revalidation
  })
  // ...
}
```

### 3. Monitor Cache Performance

```typescript
// Track cache metrics
import { cacheMonitor } from '@/lib/cache/metrics'

cacheMonitor.recordHit('/api/reference/hooks')
cacheMonitor.recordTTFB('/api/reference/hooks', 85)
```

### 4. Document Cache Strategy

```typescript
// Document why each page uses specific revalidation
export const revalidate = 3600 // API docs updated with code deploys (hourly)

// OR
export const revalidate = 7200 // Guides rarely change (2 hours sufficient)
```

---

## Resources

- [ISR Caching Patterns](../patterns/isr-caching.md)
- [Performance Debugging](./performance-debugging.md)
- [Next.js ISR Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

---

**Last Updated**: Wave 3.3 completion (January 26, 2026)
