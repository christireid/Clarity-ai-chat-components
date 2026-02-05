# Glassmorphism Performance Improvements Checklist

Track implementation of performance recommendations from the glassmorphism analysis.

---

## 🔴 High Priority (Before Mobile Release)

### 1. Reduce Blur Intensity on Mobile ⚠️ REQUIRED

**Status**: ❌ Not Started

**Effort**: 1 hour

**Impact**: 30-40% faster paint on mobile

**Implementation**:
```css
/* Update in: apps/component-showcase/app/globals.css */

/* Current */
.glass {
  @apply bg-white/60 dark:bg-white/5 backdrop-blur-xl;
}

/* Recommended */
.glass {
  @apply bg-white/60 dark:bg-white/5;
  @apply backdrop-blur-md sm:backdrop-blur-lg lg:backdrop-blur-xl;
}

.glass-card {
  @apply glass rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20;
  /* Inherits responsive blur from .glass */
}

.glass-panel {
  @apply backdrop-blur-sm sm:backdrop-blur-md lg:backdrop-blur-lg;
  @apply bg-white/40 dark:bg-white/[0.02] rounded-xl;
}
```

**Files to modify**:
- [ ] `apps/component-showcase/app/globals.css` (lines 246-264)
- [ ] Test on mobile devices
- [ ] Verify visual appearance acceptable

**Testing**:
```bash
# Start showcase
cd apps/component-showcase && pnpm dev

# Test on mobile
# 1. Use DevTools device emulation
# 2. Test on real iOS device (Safari)
# 3. Test on real Android device (Chrome)

# Run performance tests
# Open console and run: measureGlassPerformance()
# Verify FPS improved to 55-60 on mobile
```

**Acceptance Criteria**:
- [ ] Mobile FPS improves to 55-60 with 10 glass elements
- [ ] Mobile FPS maintains 50+ with 15 glass elements
- [ ] Visual appearance remains acceptable
- [ ] Desktop appearance unchanged

---

### 2. Limit Glass Elements Per Page ⚠️ REQUIRED

**Status**: ❌ Not Started

**Effort**: 2 hours

**Impact**: Maintain 60fps on all devices

**Implementation**:

Create a configuration file:
```typescript
// apps/component-showcase/lib/glass-config.ts
export const GLASS_LIMITS = {
  mobile: 10,
  tablet: 15,
  desktop: 20
} as const

export function getGlassLimit(): number {
  if (typeof window === 'undefined') return GLASS_LIMITS.desktop

  const width = window.innerWidth
  if (width < 768) return GLASS_LIMITS.mobile
  if (width < 1024) return GLASS_LIMITS.tablet
  return GLASS_LIMITS.desktop
}

export function useGlassLimit() {
  const [limit, setLimit] = useState(getGlassLimit())

  useEffect(() => {
    function handleResize() {
      setLimit(getGlassLimit())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return limit
}
```

Update showcase pages:
```typescript
// apps/component-showcase/app/page.tsx
import { useGlassLimit } from '@/lib/glass-config'

export default function HomePage() {
  const glassLimit = useGlassLimit()
  const visibleCategories = categories.slice(0, glassLimit)

  return (
    // ... existing code
    {visibleCategories.map(category => (
      <div className="feature-card" key={category.href}>
        {/* Card content */}
      </div>
    ))}
    {categories.length > glassLimit && (
      <div className="text-center mt-4 text-muted-foreground text-sm">
        Showing {glassLimit} of {categories.length} categories
        (optimized for {width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'})
      </div>
    )}
  )
}
```

**Files to modify**:
- [ ] Create `apps/component-showcase/lib/glass-config.ts`
- [ ] Update `apps/component-showcase/app/page.tsx` (Overview page)
- [ ] Update `apps/component-showcase/app/clones/page.tsx`
- [ ] Update other pages with many glass elements

**Pages to check**:
- [ ] `/` (Overview - 18 category cards)
- [ ] `/clones` (7 AI clones)
- [ ] `/core-chat` (Multiple demo sections)
- [ ] `/dashboards` (Multiple dashboard cards)
- [ ] `/features` (61 feature items)

**Testing**:
```bash
# Test responsive behavior
# 1. Open showcase in browser
# 2. Resize window from mobile → desktop
# 3. Verify glass element count changes
# 4. Run: document.querySelectorAll('[class*="glass"]').length

# Should show:
# Mobile (< 768px): ≤ 10 elements
# Tablet (768-1024px): ≤ 15 elements
# Desktop (> 1024px): ≤ 20 elements
```

**Acceptance Criteria**:
- [ ] Glass element count respects limits on all breakpoints
- [ ] UI gracefully handles limited elements (pagination or truncation)
- [ ] Performance improves to 55-60 fps on mobile
- [ ] Desktop experience not degraded

---

### 3. Implement Intersection Observer for Off-Screen Glass ⚠️ REQUIRED

**Status**: ❌ Not Started

**Effort**: 3 hours

**Impact**: 50% reduction in initial paint time

**Implementation**:

Create reusable hook:
```typescript
// apps/component-showcase/hooks/useLazyGlass.ts
import { useEffect, useRef, useState } from 'react'

interface UseLazyGlassOptions {
  rootMargin?: string
  threshold?: number
  enabled?: boolean
}

export function useLazyGlass(options: UseLazyGlassOptions = {}) {
  const {
    rootMargin = '100px',
    threshold = 0.1,
    enabled = true
  } = options

  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(!enabled)

  useEffect(() => {
    if (!enabled || !ref.current) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // Only observe once
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [enabled, rootMargin, threshold])

  return { ref, isVisible }
}
```

Usage example:
```typescript
// In component
import { useLazyGlass } from '@/hooks/useLazyGlass'
import { cn } from '@clarity-chat/primitives'

function CategoryCard({ category }) {
  const { ref, isVisible } = useLazyGlass()

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl p-6 border',
        isVisible ? 'glass-card' : 'bg-card'
      )}
    >
      {/* Card content */}
    </div>
  )
}
```

**Files to create**:
- [ ] `apps/component-showcase/hooks/useLazyGlass.ts`

**Files to modify**:
- [ ] `apps/component-showcase/app/page.tsx`
- [ ] `apps/component-showcase/app/clones/page.tsx`
- [ ] Other pages with scrollable glass content

**Testing**:
```bash
# Visual testing
# 1. Add temporary border to see when glass activates:
#    .glass-card { outline: 2px solid red; }
# 2. Scroll page slowly
# 3. Watch cards activate glass effect as they enter viewport

# Performance testing
# Open console and run:
measureGlassPerformance()
# Verify:
# - Initial paint time reduced by ~50%
# - FPS remains 60 during scroll
# - No visual glitches when glass activates
```

**Acceptance Criteria**:
- [ ] Glass only applied when element enters viewport
- [ ] 100px preload margin (elements activate before visible)
- [ ] No visual "pop-in" when glass activates
- [ ] Initial page load paint time reduced by 40-50%
- [ ] Scroll performance maintains 60fps

---

## 🟡 Medium Priority (Next Sprint)

### 4. Reduced Motion Support

**Status**: ❌ Not Started

**Effort**: 2 hours

**Implementation**:
```css
/* apps/component-showcase/app/globals.css */
@media (prefers-reduced-motion: reduce) {
  .glass,
  .glass-card,
  .glass-panel,
  .glass-subtle,
  .glass-strong {
    backdrop-filter: none;
    background: hsl(var(--card));
    transition: none;
  }

  .animate-float,
  .pulse-ring,
  .shine,
  .gradient-border::before {
    animation: none;
  }
}
```

**Acceptance Criteria**:
- [ ] Glass disabled when `prefers-reduced-motion: reduce`
- [ ] All animations disabled
- [ ] UI remains functional and attractive

---

### 5. Progressive Enhancement Fallbacks

**Status**: ❌ Not Started

**Effort**: 3 hours

**Implementation**:
```css
/* Automatic fallback */
.glass {
  background: hsl(var(--card)); /* Fallback */
  border: 1px solid hsl(var(--border));
}

@supports (backdrop-filter: blur(10px)) {
  .glass {
    background: hsl(var(--card) / 0.6);
    backdrop-filter: blur(24px);
    border-color: hsl(var(--border) / 0.2);
  }
}
```

**Acceptance Criteria**:
- [ ] Works on browsers without backdrop-filter support
- [ ] Graceful degradation to solid backgrounds
- [ ] No JavaScript feature detection required

---

### 6. Virtual Scrolling for Long Lists

**Status**: ❌ Not Started

**Effort**: 4 hours

**Implementation**:
```typescript
// Install dependency
pnpm add @tanstack/react-virtual

// Usage in message list
import { useVirtualizer } from '@tanstack/react-virtual'

function MessageList({ messages }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5
  })

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            className="glass-card"
            style={{
              height: virtualRow.size,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            {messages[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Pages to update**:
- [ ] `/core-chat` (message lists)
- [ ] Any page with 50+ items

**Acceptance Criteria**:
- [ ] Lists with 100+ items render only visible elements
- [ ] Scroll performance remains 60fps
- [ ] Memory usage stays constant regardless of item count

---

## 🟢 Low Priority (Future Enhancement)

### 7. Performance Monitoring

**Status**: ❌ Not Started

**Effort**: 4 hours

**Implementation**:
```typescript
// apps/component-showcase/lib/analytics.ts
export function trackPerformance() {
  if (typeof window === 'undefined') return

  // Track LCP
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    analytics.track('lcp', { value: lastEntry.startTime })
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // Track slow paints
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 16.67) {
        analytics.track('slow-paint', {
          duration: entry.duration,
          page: window.location.pathname
        })
      }
    })
  }).observe({ entryTypes: ['paint'] })
}
```

**Acceptance Criteria**:
- [ ] Real-user metrics collected
- [ ] Slow paint events tracked
- [ ] Core Web Vitals monitored
- [ ] Dashboard for performance trends

---

### 8. Battery-Saver Mode

**Status**: ❌ Not Started

**Effort**: 3 hours

**Implementation**:
```typescript
// apps/component-showcase/hooks/useBatterySaver.ts
export function useBatterySaver() {
  const [batterySaver, setBatterySaver] = useState(false)

  useEffect(() => {
    async function checkBattery() {
      if (!('getBattery' in navigator)) return

      const battery = await navigator.getBattery()
      const shouldSave = battery.level < 0.2 && !battery.charging
      setBatterySaver(shouldSave)

      battery.addEventListener('levelchange', () => {
        const shouldSave = battery.level < 0.2 && !battery.charging
        setBatterySaver(shouldSave)
      })
    }

    checkBattery()
  }, [])

  return batterySaver
}
```

```css
/* Reduced glass on low battery */
body.battery-saver .glass {
  backdrop-filter: blur(8px); /* Reduced from 24px */
}
```

**Acceptance Criteria**:
- [ ] Detects low battery state (< 20%)
- [ ] Reduces blur intensity automatically
- [ ] Improves battery life by 20-30%

---

## Testing Checklist

### Before Merge
- [ ] Run Lighthouse audit (desktop): Score > 90
- [ ] Run Lighthouse audit (mobile): Score > 85
- [ ] All Core Web Vitals passing
- [ ] 60 fps scrolling on desktop
- [ ] 50+ fps scrolling on mobile
- [ ] No console errors
- [ ] No memory leaks (< 5 MB growth)
- [ ] Bundle size increase < 10 KB
- [ ] GPU acceleration verified
- [ ] Works on Chrome, Firefox, Safari
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome

### Performance Scripts
```bash
# Bundle size analysis
./scripts/performance/analyze-bundle-size.sh

# Browser performance test (in console)
measureGlassPerformance()

# Scroll performance test (in console)
measureScrollPerformance()

# Memory leak test (in console)
testMemoryLeaks()
```

---

## Implementation Timeline

### Week 1 (High Priority)
- Day 1: Reduce blur intensity on mobile (1h)
- Day 2: Limit glass elements per page (2h)
- Day 3-4: Intersection Observer implementation (3h)
- Day 5: Testing and verification (2h)

**Total Week 1**: 8 hours

### Week 2 (Medium Priority)
- Day 1: Reduced motion support (2h)
- Day 2: Progressive enhancement (3h)
- Day 3-4: Virtual scrolling (4h)
- Day 5: Testing and documentation (2h)

**Total Week 2**: 11 hours

### Future (Low Priority)
- Performance monitoring (4h)
- Battery-saver mode (3h)

**Total Future**: 7 hours

---

## Success Metrics

### Performance Targets

**Desktop**:
- [ ] FPS: 60 sustained
- [ ] Paint time: < 8ms
- [ ] Lighthouse: > 90
- [ ] LCP: < 2.5s

**Mobile**:
- [ ] FPS: 55+ sustained
- [ ] Paint time: < 12ms
- [ ] Lighthouse: > 85
- [ ] LCP: < 3.0s
- [ ] Battery drain: < 6% per hour

**Bundle**:
- [ ] Total increase: < 10 KB
- [ ] Gzipped increase: < 3 KB

---

## Notes

- Glass effects are GPU-accelerated when properly implemented
- Mobile devices have 40-60% lower GPU performance than desktop
- Limiting element count is the most effective optimization
- Intersection Observer reduces initial paint time by 40-50%
- All high priority items are required before mobile release

---

**Last Updated**: 2026-02-04
**Next Review**: After implementation (1 week)
