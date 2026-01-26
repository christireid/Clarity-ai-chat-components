# Wave 3.3 Agent 33: Lazy Loading Implementer

**Agent Type**: `frontend-developer:frontend-developer` **Priority**: P1 - High Impact **Target
Savings**: 2.4 MB **Estimated Time**: 6 hours **Risk Level**: Medium **Dependencies**: Agent 32
complete (Monaco already split)

---

## Mission Objective

Implement progressive enhancement through lazy loading of heavy visual components:

1. AnimatedBackground (Three.js) - 1.25 MB
2. MermaidDiagram - 950 KB
3. HeroParticles (TSParticles) - 200 KB

**Key Principle**: Core content loads first, enhancements load progressively based on viewport, user
preference, and network conditions.

---

## Task 1: Lazy Load AnimatedBackground (Target: -1.25 MB)

### Problem Analysis

- Three.js background (1.25 MB) loads on EVERY page
- Many users never see it (mobile, reduced motion, slow networks)
- It's a visual enhancement, not core functionality
- Current implementation blocks initial render

### Current State

**File**: `apps/streamlined-docs/components/Layout/AnimatedBackground.tsx`

```typescript
// Currently imported in root layout - loads immediately
import { AnimatedBackground } from '@/components/Layout/AnimatedBackground'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnimatedBackground /> {/* Loads Three.js immediately */}
        {children}
      </body>
    </html>
  )
}
```

### Implementation Strategy

#### Step 1.1: Create Lazy Load Hook

**File**: `apps/streamlined-docs/hooks/useLazyBackground.ts` (NEW)

```typescript
'use client'

import { useEffect, useState } from 'react'

interface LazyBackgroundOptions {
  minViewportWidth?: number
  checkReducedMotion?: boolean
  checkNetworkSpeed?: boolean
  delayMs?: number
}

export function useLazyBackground(options: LazyBackgroundOptions = {}) {
  const {
    minViewportWidth = 768,
    checkReducedMotion = true,
    checkNetworkSpeed = true,
    delayMs = 1000,
  } = options

  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Wait for initial render to complete
    const timer = setTimeout(() => {
      // Check viewport size
      if (window.innerWidth < minViewportWidth) {
        return
      }

      // Check reduced motion preference
      if (checkReducedMotion) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) {
          return
        }
      }

      // Check network speed (if supported)
      if (checkNetworkSpeed && 'connection' in navigator) {
        const connection = (navigator as any).connection
        const effectiveType = connection?.effectiveType

        // Skip on slow connections
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          return
        }
      }

      // All checks passed - load the background
      setShouldLoad(true)
    }, delayMs)

    return () => clearTimeout(timer)
  }, [minViewportWidth, checkReducedMotion, checkNetworkSpeed, delayMs])

  return shouldLoad
}
```

**Why This Works**:

- Defers loading until after initial render (1s delay)
- Respects user preferences (reduced motion)
- Adapts to network conditions
- Mobile users never download Three.js
- Progressive enhancement: site works without background

#### Step 1.2: Create Background Wrapper

**File**: `apps/streamlined-docs/components/Layout/LazyAnimatedBackground.tsx` (NEW)

```typescript
'use client'

import dynamic from 'next/dynamic'
import { useLazyBackground } from '@/hooks/useLazyBackground'

// Dynamic import - Three.js only loads when conditions are met
const AnimatedBackground = dynamic(
  () => import('./AnimatedBackground').then(mod => ({ default: mod.AnimatedBackground })),
  {
    ssr: false,
    loading: () => null // No skeleton - background is optional
  }
)

export function LazyAnimatedBackground() {
  const shouldLoad = useLazyBackground({
    minViewportWidth: 768,    // Desktop only
    checkReducedMotion: true, // Respect a11y
    checkNetworkSpeed: true,  // Skip on slow networks
    delayMs: 1000            // After initial render
  })

  if (!shouldLoad) {
    return null
  }

  return <AnimatedBackground />
}
```

#### Step 1.3: Update Root Layout

**File**: `apps/streamlined-docs/app/layout.tsx` (MODIFY)

```typescript
// BEFORE
import { AnimatedBackground } from '@/components/Layout/AnimatedBackground'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnimatedBackground />
        {children}
      </body>
    </html>
  )
}

// AFTER
import { LazyAnimatedBackground } from '@/components/Layout/LazyAnimatedBackground'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LazyAnimatedBackground />
        {children}
      </body>
    </html>
  )
}
```

#### Step 1.4: Add Analytics Tracking

**File**: `apps/streamlined-docs/hooks/useLazyBackground.ts` (MODIFY)

```typescript
// Add tracking when background loads/skips
useEffect(() => {
  const timer = setTimeout(() => {
    // ... conditions checks ...

    if (shouldLoad) {
      // Track successful load
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'background_loaded', {
          viewport_width: window.innerWidth,
          network_type: connection?.effectiveType || 'unknown'
        })
      }
    } else {
      // Track why it was skipped
      window.gtag?.('event', 'background_skipped', {
        reason: /* determine reason */
      })
    }
  }, delayMs)
}, [])
```

### Testing Checklist

- [ ] Desktop (>768px) loads background after 1s
- [ ] Mobile (<768px) never loads background
- [ ] Reduced motion users never see background
- [ ] 2G network users never download Three.js
- [ ] Main content renders immediately
- [ ] No CLS (Cumulative Layout Shift)
- [ ] Background appears smoothly (no jarring pop-in)

### Success Criteria

✅ Three.js isolated to desktop/fast network users only ✅ 1.25 MB saved for mobile users (estimated
40% of traffic) ✅ Main content renders 1.2s faster on slow networks ✅ Respects user preferences

---

## Task 2: Dynamic Import Mermaid (Target: -950 KB)

### Problem Analysis

- Mermaid (950 KB) loads on all MDX pages
- Only ~30% of docs pages actually have diagrams
- Currently bundled globally via MDX component config
- 70% of users pay the cost for diagrams they don't see

### Current State

**File**: `apps/streamlined-docs/components/MDX/mdx-components.tsx`

```typescript
// Mermaid imported globally
import mermaid from 'mermaid'

export const mdxComponents = {
  // ... other components
  Mermaid: ({ children }) => {
    // Renders diagram immediately
    return <div className="mermaid">{children}</div>
  }
}
```

### Implementation Strategy

#### Step 2.1: Create Lazy Mermaid Component

**File**: `apps/streamlined-docs/components/MDX/LazyMermaid.tsx` (NEW)

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { MermaidSkeleton } from './MermaidSkeleton'

interface LazyMermaidProps {
  children: string
  className?: string
}

export function LazyMermaid({ children, className }: LazyMermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadAndRenderMermaid() {
      try {
        // Dynamic import - Mermaid only loads when diagram component renders
        const mermaid = (await import('mermaid')).default

        if (!mounted) return

        // Initialize Mermaid with theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'strict',
          fontFamily: 'inherit'
        })

        // Render diagram
        const { svg } = await mermaid.render(
          `mermaid-${Date.now()}`,
          children
        )

        if (!mounted || !containerRef.current) return

        containerRef.current.innerHTML = svg
        setIsLoading(false)
      } catch (err) {
        if (mounted) {
          console.error('Mermaid render error:', err)
          setError(err instanceof Error ? err.message : 'Failed to render diagram')
          setIsLoading(false)
        }
      }
    }

    loadAndRenderMermaid()

    return () => {
      mounted = false
    }
  }, [children])

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          Failed to render diagram: {error}
        </p>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-red-500">
            Show diagram code
          </summary>
          <pre className="mt-2 text-xs">{children}</pre>
        </details>
      </div>
    )
  }

  if (isLoading) {
    return <MermaidSkeleton />
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-diagram ${className || ''}`}
      data-diagram-type="mermaid"
    />
  )
}
```

#### Step 2.2: Create Diagram Skeleton

**File**: `apps/streamlined-docs/components/MDX/MermaidSkeleton.tsx` (NEW)

```typescript
export function MermaidSkeleton() {
  return (
    <div className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-8 animate-pulse">
      <div className="space-y-4">
        {/* Simulate diagram nodes */}
        <div className="flex justify-center">
          <div className="w-32 h-12 bg-neutral-200 rounded" />
        </div>
        <div className="flex justify-center gap-8">
          <div className="w-24 h-12 bg-neutral-200 rounded" />
          <div className="w-24 h-12 bg-neutral-200 rounded" />
        </div>
        <div className="flex justify-center">
          <div className="w-32 h-12 bg-neutral-200 rounded" />
        </div>
        <div className="text-center text-sm text-neutral-500 mt-4">
          Loading diagram...
        </div>
      </div>
    </div>
  )
}
```

#### Step 2.3: Update MDX Components Config

**File**: `apps/streamlined-docs/components/MDX/mdx-components.tsx` (MODIFY)

```typescript
// BEFORE
import mermaid from 'mermaid'

export const mdxComponents = {
  Mermaid: ({ children }) => <div className="mermaid">{children}</div>
}

// AFTER
import { LazyMermaid } from './LazyMermaid'

export const mdxComponents = {
  Mermaid: LazyMermaid, // Now lazy loads
  // ... other components
}
```

#### Step 2.4: Add Intersection Observer (Optional Enhancement)

**File**: `apps/streamlined-docs/components/MDX/LazyMermaid.tsx` (ENHANCE)

```typescript
// Only load Mermaid when diagram enters viewport
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

export function LazyMermaid({ children, className }: LazyMermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(containerRef, { threshold: 0.1 })

  useEffect(() => {
    // Only load when visible
    if (!isVisible) return

    async function loadAndRenderMermaid() {
      // ... existing code
    }

    loadAndRenderMermaid()
  }, [isVisible, children])

  return <div ref={containerRef}>...</div>
}
```

### Testing Checklist

- [ ] Pages without diagrams never load Mermaid
- [ ] Pages with diagrams load Mermaid only when needed
- [ ] Diagrams render correctly (flowchart, sequence, class)
- [ ] Skeleton appears before diagram loads
- [ ] Error states display gracefully
- [ ] No CLS when diagram appears
- [ ] Dark mode theming works

### Success Criteria

✅ Mermaid (950 KB) only loads on pages with diagrams ✅ 70% of doc pages never download Mermaid ✅
Diagrams still render correctly ✅ Graceful error handling

---

## Task 3: Lazy Load HeroParticles (Target: -200 KB)

### Problem Analysis

- TSParticles (200 KB) loads on home page
- Mobile users often can't see particles (small screen)
- Particles are decorative - not core content
- Currently loads immediately, blocking FCP

### Current State

**File**: `apps/streamlined-docs/app/page.tsx`

```typescript
import { HeroParticles } from '@/components/hero/HeroParticles'

export default function HomePage() {
  return (
    <div>
      <HeroParticles /> {/* Loads immediately */}
      <HeroContent />
    </div>
  )
}
```

### Implementation Strategy

#### Step 3.1: Create Intersection Observer Hook

**File**: `apps/streamlined-docs/hooks/useIntersectionObserver.ts` (NEW or VERIFY)

```typescript
import { useEffect, useState, RefObject } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): boolean {
  const { threshold = 0, rootMargin = '0px', triggerOnce = true } = options
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.disconnect()
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [elementRef, threshold, rootMargin, triggerOnce])

  return isVisible
}
```

#### Step 3.2: Create Lazy Particles Wrapper

**File**: `apps/streamlined-docs/components/hero/LazyHeroParticles.tsx` (NEW)

```typescript
'use client'

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

const HeroParticles = dynamic(
  () => import('./HeroParticles').then(mod => ({ default: mod.HeroParticles })),
  {
    ssr: false,
    loading: () => null
  }
)

export function LazyHeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(containerRef, {
    threshold: 0.1,
    rootMargin: '100px' // Start loading slightly before visible
  })

  const [shouldRender, setShouldRender] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    setIsMobile(window.innerWidth < 768)

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Only render if:
    // 1. Visible in viewport
    // 2. Not mobile
    // 3. No reduced motion preference
    if (isVisible && !isMobile && !prefersReducedMotion) {
      setShouldRender(true)
    }
  }, [isVisible])

  return (
    <div ref={containerRef} className="hero-particles-container">
      {shouldRender && <HeroParticles />}
    </div>
  )
}
```

#### Step 3.3: Update Home Page

**File**: `apps/streamlined-docs/app/page.tsx` (MODIFY)

```typescript
// BEFORE
import { HeroParticles } from '@/components/hero/HeroParticles'

export default function HomePage() {
  return (
    <div>
      <HeroParticles />
      <HeroContent />
    </div>
  )
}

// AFTER
import { LazyHeroParticles } from '@/components/hero/LazyHeroParticles'

export default function HomePage() {
  return (
    <div>
      <LazyHeroParticles />
      <HeroContent />
    </div>
  )
}
```

### Testing Checklist

- [ ] Desktop users see particles when hero section visible
- [ ] Mobile users never load particles
- [ ] Reduced motion users never see particles
- [ ] Particles don't block hero content render
- [ ] No CLS when particles appear
- [ ] Intersection Observer works correctly

### Success Criteria

✅ TSParticles (200 KB) only loads for desktop users ✅ Mobile users save 200 KB ✅ Particles appear
smoothly without blocking content ✅ Respects reduced motion preference

---

## Task 4: Create Reusable Lazy Load Utilities

### Consolidate Patterns

**File**: `apps/streamlined-docs/lib/lazy-load.ts` (NEW)

```typescript
export interface LazyLoadOptions {
  minViewportWidth?: number
  checkReducedMotion?: boolean
  checkNetworkSpeed?: boolean
  delayMs?: number
  intersectionThreshold?: number
  intersectionRootMargin?: string
}

export const DEFAULT_LAZY_OPTIONS: LazyLoadOptions = {
  minViewportWidth: 768,
  checkReducedMotion: true,
  checkNetworkSpeed: true,
  delayMs: 1000,
  intersectionThreshold: 0.1,
  intersectionRootMargin: '100px',
}

export function shouldLazyLoad(options: LazyLoadOptions = {}): boolean {
  const opts = { ...DEFAULT_LAZY_OPTIONS, ...options }

  // Check viewport
  if (window.innerWidth < (opts.minViewportWidth || 768)) {
    return false
  }

  // Check reduced motion
  if (opts.checkReducedMotion) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return false
  }

  // Check network speed
  if (opts.checkNetworkSpeed && 'connection' in navigator) {
    const connection = (navigator as any).connection
    const effectiveType = connection?.effectiveType
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return false
    }
  }

  return true
}
```

---

## Task 5: Verification & Performance Testing

### Step 5.1: Bundle Analysis

```bash
# Compare bundle sizes
ANALYZE=true npm run build

# Check that lazy-loaded components are in separate chunks
ls -lh .next/static/chunks/ | grep -E "three|mermaid|tsparticles"
```

**Expected Output**:

```
three-[hash].js          1.0M  (lazy chunk)
mermaid-[hash].js        950K  (lazy chunk)
tsparticles-[hash].js    200K  (lazy chunk)
```

### Step 5.2: Visual Regression Testing

```bash
# Take screenshots before/after
npm run test:visual -- --update-baseline

# Compare with baseline
npm run test:visual -- --compare
```

**Critical Pages to Test**:

- `/` (home with particles)
- `/api/reference/hooks` (doc page with diagrams)
- `/api/reference/components` (doc page without diagrams)
- `/explore` (with animated background)

### Step 5.3: Performance Benchmarks

**Create Test Script**: **File**: `scripts/measure-lazy-load-impact.ts` (NEW)

```typescript
import { chromium } from 'playwright'

async function measurePageLoad(url: string, viewport: 'mobile' | 'desktop') {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: viewport === 'mobile' ? { width: 375, height: 667 } : { width: 1920, height: 1080 },
  })

  const page = await context.newPage()

  // Measure load times
  await page.goto(url, { waitUntil: 'networkidle' })

  const metrics = await page.evaluate(() => ({
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
    lcp: 0, // Would need PerformanceObserver
    jsSize: performance
      .getEntriesByType('resource')
      .filter((r) => r.name.includes('.js'))
      .reduce((sum, r) => sum + (r.transferSize || 0), 0),
  }))

  await browser.close()
  return metrics
}

// Run tests
const results = await Promise.all([
  measurePageLoad('http://localhost:3000/', 'desktop'),
  measurePageLoad('http://localhost:3000/', 'mobile'),
  measurePageLoad('http://localhost:3000/api/reference/hooks', 'desktop'),
])

console.table(results)
```

### Step 5.4: Real User Monitoring Setup

```typescript
// Add to app/layout.tsx
'use client'

import { useEffect } from 'react'
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'

export function PerformanceMonitoring() {
  useEffect(() => {
    // Track lazy load effectiveness
    onLCP((metric) => {
      console.log('LCP:', metric.value)
      // Send to analytics
    })

    onFCP((metric) => {
      console.log('FCP:', metric.value)
      // Send to analytics
    })
  }, [])

  return null
}
```

---

## Rollback Plan

### If AnimatedBackground Causes CLS

```typescript
// Revert to immediate load
import { AnimatedBackground } from '@/components/Layout/AnimatedBackground'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnimatedBackground /> {/* Back to immediate */}
        {children}
      </body>
    </html>
  )
}
```

### If Mermaid Diagrams Break

```bash
# Revert MDX components
git checkout HEAD -- apps/streamlined-docs/components/MDX/mdx-components.tsx

# Remove lazy component
rm apps/streamlined-docs/components/MDX/LazyMermaid.tsx

# Rebuild
npm run build
```

### If Particles Cause Issues

```bash
# Revert to immediate load
git checkout HEAD -- apps/streamlined-docs/app/page.tsx
git checkout HEAD -- apps/streamlined-docs/components/hero/
```

---

## Success Metrics

### Bundle Size Targets

| Component                   | Before | After      | Savings        |
| --------------------------- | ------ | ---------- | -------------- |
| AnimatedBackground (mobile) | Loaded | Not loaded | -1.25 MB ✅    |
| Mermaid (no diagram pages)  | Loaded | Not loaded | -950 KB ✅     |
| HeroParticles (mobile)      | Loaded | Not loaded | -200 KB ✅     |
| **Total Reduction**         | -      | -          | **-2.4 MB** ✅ |

### User Experience Targets

| Metric        | Desktop | Mobile  | Target Met |
| ------------- | ------- | ------- | ---------- |
| FCP           | <1.8s   | <1.2s   | ✅         |
| LCP           | <2.5s   | <1.8s   | ✅         |
| CLS           | <0.1    | <0.1    | ✅         |
| JS Downloaded | -1.0 MB | -2.4 MB | ✅         |

### Coverage Targets

- [ ] 100% of mobile users skip AnimatedBackground
- [ ] 100% of mobile users skip HeroParticles
- [ ] 70% of doc pages skip Mermaid
- [ ] 100% of reduced motion users skip animations
- [ ] 0% regression in functionality

---

## Deliverables

### Files Created

1. `hooks/useLazyBackground.ts` - Background lazy load logic
2. `hooks/useIntersectionObserver.ts` - Viewport detection
3. `components/Layout/LazyAnimatedBackground.tsx` - Background wrapper
4. `components/MDX/LazyMermaid.tsx` - Mermaid wrapper
5. `components/MDX/MermaidSkeleton.tsx` - Loading skeleton
6. `components/hero/LazyHeroParticles.tsx` - Particles wrapper
7. `lib/lazy-load.ts` - Shared utilities
8. `scripts/measure-lazy-load-impact.ts` - Performance testing

### Files Modified

1. `app/layout.tsx` - Use lazy background
2. `app/page.tsx` - Use lazy particles
3. `components/MDX/mdx-components.tsx` - Use lazy Mermaid

### Reports Generated

1. Visual regression test results
2. Bundle size comparison (before/after)
3. Performance benchmark report
4. Agent 33 completion report (`WAVE_3_3_AGENT_33_COMPLETE.md`)

---

## Coordination

### Pre-Flight Checks

```bash
# 1. Verify Agent 32 complete
git log --oneline | head -5 | grep "Agent 32"

# 2. Check bundle baseline
cat .bundle-baseline.json

# 3. Take visual snapshots
npm run test:visual -- --update-baseline

# 4. Measure current performance
npm run perf:baseline
```

### During Execution

- [ ] Commit after each component (3 commits total)
- [ ] Run visual tests between tasks
- [ ] Monitor bundle size after each change
- [ ] Test on actual mobile device

### After Completion

- [ ] Generate completion report with metrics
- [ ] Update Wave 3.3 progress tracker
- [ ] Prepare for Agent 35 (ISR Caching)

---

**Agent 33 Status**: 📋 PLANNED **Ready for Execution**: ✅ YES (after Agent 32) **Dependencies**:
Agent 32 complete **Next Agent**: Agent 35 (ISR Cache Optimizer)
