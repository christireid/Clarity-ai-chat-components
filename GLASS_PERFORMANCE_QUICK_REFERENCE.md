# Glass Performance Quick Reference Card

Fast reference for performance-conscious glass effect usage.

---

## Quick Checks

```bash
# 1. Browser console test
measureGlassPerformance()

# 2. Bundle analysis
./scripts/performance/analyze-bundle-size.sh

# 3. Lighthouse audit
# DevTools → Lighthouse → Run audit
```

---

## Performance Budgets

| Metric | Desktop | Mobile | Critical |
|--------|---------|--------|----------|
| FPS | 60 | 50+ | Yes |
| Paint time | < 8ms | < 12ms | Yes |
| LCP | < 2.5s | < 3.0s | Yes |
| Bundle +size | < 5 KB | < 5 KB | No |
| Memory | < 100 MB | < 80 MB | No |

---

## Glass Element Limits

```typescript
// Per page/viewport
const MAX_GLASS_ELEMENTS = {
  mobile: 10,    // ⚠️ Strict limit
  tablet: 15,    // ⚠️ Moderate limit
  desktop: 20    // ✅ Safe limit
}

// Use virtualization if exceeding limits
```

---

## Best Practices

### ✅ DO

```tsx
// 1. Use appropriate blur intensity
<div className="glass-subtle">       // Mobile-friendly
<div className="glass">              // Desktop default
<div className="glass-strong">       // Desktop hero sections only

// 2. Responsive blur reduction
<div className="backdrop-blur-md sm:backdrop-blur-lg lg:backdrop-blur-xl">

// 3. Single glass layer per card
<div className="glass-card">
  <div className="bg-white/10">     // No blur
    Content
  </div>
</div>

// 4. Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual'
const virtualizer = useVirtualizer({ count: items.length, ... })

// 5. Intersection Observer for off-screen glass
useEffect(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('glass', entry.isIntersecting)
    })
  })
  elements.forEach(el => observer.observe(el))
  return () => observer.disconnect()
}, [])
```

---

### ❌ DON'T

```tsx
// 1. Nested glass layers (expensive!)
<div className="glass-card">
  <div className="glass-panel">     // ❌ Nested blur
    <div className="glass">         // ❌ Triple nested!
      Content
    </div>
  </div>
</div>

// 2. Glass on every element
<div className="glass">
  <h1 className="glass">Title</h1>  // ❌ Unnecessary
  <p className="glass">Text</p>     // ❌ Too many layers
</div>

// 3. Animating blur value
<motion.div
  animate={{ backdropFilter: 'blur(0px) to blur(24px)' }} // ❌ Very expensive
>

// 4. Glass on long unvirtualized lists
{messages.map(msg => (
  <div className="glass-card" />   // ❌ 100+ glass elements
))}

// 5. Ignoring mobile performance
<div className="backdrop-blur-3xl">  // ❌ 64px blur on mobile
```

---

## Performance Patterns

### Pattern 1: Progressive Enhancement

```typescript
// Detect support
const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)')

// Fallback
if (!supportsBackdropFilter) {
  document.documentElement.classList.add('no-glass')
}
```

```css
/* Graceful degradation */
.glass {
  background: hsl(var(--card)); /* Fallback */
}

@supports (backdrop-filter: blur(10px)) {
  .glass {
    background: hsl(var(--card) / 0.6);
    backdrop-filter: blur(24px);
  }
}
```

---

### Pattern 2: Responsive Blur

```tsx
// Tailwind utility classes
<div className="
  backdrop-blur-sm        // 8px mobile
  sm:backdrop-blur-md     // 12px tablet
  lg:backdrop-blur-xl     // 24px desktop
">
```

---

### Pattern 3: Conditional Glass

```tsx
// Only apply glass on capable devices
const isLowEnd = navigator.hardwareConcurrency <= 4
const useGlass = !isLowEnd && supportsBackdropFilter

<div className={useGlass ? 'glass-card' : 'bg-card border'}>
```

---

### Pattern 4: Lazy Glass

```tsx
// Apply glass only when in viewport
const [isVisible, setIsVisible] = useState(false)
const ref = useRef<HTMLDivElement>(null)

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting),
    { rootMargin: '50px' }
  )
  if (ref.current) observer.observe(ref.current)
  return () => observer.disconnect()
}, [])

return (
  <div
    ref={ref}
    className={isVisible ? 'glass-card' : 'bg-card'}
  >
    Content
  </div>
)
```

---

## Debugging Checklist

### Slow Performance?

1. **Count glass elements**: `document.querySelectorAll('[class*="glass"]').length`
   - If > 20: Reduce or virtualize

2. **Check DevTools Performance tab**:
   - Paint time > 16ms? → Too many glass layers
   - GPU bars missing? → No GPU acceleration
   - Long Paint events? → Reduce blur intensity

3. **Check memory growth**:
   ```javascript
   testMemoryLeaks() // Wait 10s
   ```
   - If > 20 MB: Memory leak (check cleanup)

4. **Mobile FPS < 50?**:
   - Use `glass-subtle` or reduce blur
   - Limit to 10 glass elements
   - Consider disabling glass on low-end devices

---

## Browser DevTools Shortcuts

| Tool | Shortcut | Use Case |
|------|----------|----------|
| Performance Panel | Cmd+Shift+E | Record & analyze |
| Layers Panel | Cmd+Shift+P → "Layers" | Check compositing |
| Rendering Settings | Cmd+Shift+P → "Rendering" | FPS counter, layer borders |
| Memory Snapshot | Cmd+Shift+P → "Memory" | Find leaks |
| Lighthouse | Cmd+Shift+P → "Lighthouse" | Audit performance |

---

## Performance Testing URLs

```
# Test on these pages
http://localhost:3100/                    # Overview (many glass cards)
http://localhost:3100/core-chat           # Glass chat window
http://localhost:3100/clones              # Multiple glass interfaces
http://localhost:3100/dashboards          # Glass data panels

# Add ?perf=true for auto-testing
http://localhost:3100/?perf=true
```

---

## Emergency Fixes

### Issue: Page is janky/slow

**Quick Fix**:
```css
/* Temporarily disable glass */
.glass,
.glass-card,
.glass-panel {
  backdrop-filter: none !important;
  background: hsl(var(--card)) !important;
}
```

### Issue: Mobile battery drain

**Quick Fix**:
```css
/* Reduce blur on mobile */
@media (max-width: 768px) {
  .glass { backdrop-filter: blur(8px) !important; }
  .glass-card { backdrop-filter: blur(12px) !important; }
}
```

### Issue: Too many glass elements

**Quick Fix**:
```typescript
// Limit rendering
const GLASS_LIMIT = 15
const visibleItems = items.slice(0, GLASS_LIMIT)
```

---

## Key Metrics

```
✅ GOOD
Paint:    < 8ms
FPS:      60 fps
Memory:   < 80 MB
LCP:      < 2.5s
Layers:   < 15

⚠️ ACCEPTABLE
Paint:    8-16ms
FPS:      50-60 fps
Memory:   80-100 MB
LCP:      2.5-4.0s
Layers:   15-30

❌ BAD
Paint:    > 16ms
FPS:      < 50 fps
Memory:   > 100 MB
LCP:      > 4.0s
Layers:   > 30
```

---

## Resources

- Full Analysis: `GLASSMORPHISM_PERFORMANCE_ANALYSIS.md`
- Testing Guide: `PERFORMANCE_TESTING_GUIDE.md`
- Browser Script: `scripts/performance/measure-glass-performance.js`
- Bundle Script: `scripts/performance/analyze-bundle-size.sh`

---

**Remember**: Glass effects are GPU-accelerated and efficient when used correctly. Follow the limits and patterns above for optimal performance.

---

**Last Updated**: 2026-02-04
