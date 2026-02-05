# Glassmorphism Performance Testing Guide

This guide walks you through comprehensive performance testing for glassmorphism effects using Chrome DevTools and automated scripts.

---

## Quick Start

### 1. Automated Browser Testing

Open component-showcase and run the browser-based performance analyzer:

```bash
# Start the showcase
cd apps/component-showcase
pnpm dev

# Open in browser: http://localhost:3100
# Then open DevTools Console (Cmd+Option+J / Ctrl+Shift+J)
```

Copy and paste the script from `/scripts/performance/measure-glass-performance.js` into the console, then run:

```javascript
measureGlassPerformance()
```

This will automatically measure:
- Glass element count
- Paint performance
- Frame rate (FPS)
- Memory usage
- Compositing layers
- Core Web Vitals

### 2. Bundle Size Analysis

```bash
# From repository root
./scripts/performance/analyze-bundle-size.sh
```

This analyzes:
- Total bundle size (JS + CSS)
- Glassmorphism-specific overhead
- Gzipped sizes
- Production build optimizations

---

## Manual Testing with Chrome DevTools

### Test 1: Paint Performance

**Goal**: Measure how long it takes to paint glass elements

1. Open DevTools (F12)
2. Go to **Performance** tab
3. Click **Record** (●)
4. Scroll the page with glass elements
5. Click **Stop**
6. Analyze the results:
   - Look for **Paint** events in the flame chart
   - Paint time should be < 16ms per frame (60fps)
   - Glass elements show up as purple bars

**Good**: Paint < 8ms per frame
**Acceptable**: Paint 8-16ms per frame
**Bad**: Paint > 16ms per frame (causes jank)

**How to check**:
```
1. Select a Paint event in the flame chart
2. Bottom panel shows duration
3. Look for "backdrop-filter" in the details
```

---

### Test 2: Frame Rate (FPS)

**Goal**: Verify smooth 60fps scrolling

1. Open DevTools (F12)
2. Go to **Rendering** tab (More Tools → Rendering)
3. Enable **Frame Rendering Stats**
4. Scroll the page
5. Watch the FPS counter in the top-right corner

**Good**: 60 fps consistent
**Acceptable**: 50-60 fps
**Bad**: < 50 fps

**Alternative method**:
```javascript
// Run in console
measureScrollPerformance()
// Then scroll for 5 seconds
```

---

### Test 3: Compositing Layers

**Goal**: Check if glass elements create excessive layers

1. Open DevTools (F12)
2. Go to **More Tools** → **Layers**
3. Inspect the layer tree
4. Count layers with "backdrop-filter"

**Good**: < 15 compositing layers
**Acceptable**: 15-30 layers
**Bad**: > 30 layers (memory intensive)

**Visual inspection**:
1. Go to **Rendering** tab
2. Enable **Layer borders**
3. Colored borders show compositing layers
4. Glass elements should have orange borders

---

### Test 4: GPU Usage

**Goal**: Verify GPU acceleration is active

1. Open DevTools (F12)
2. Go to **Performance** tab
3. Click the gear icon (⚙️)
4. Enable **Advanced paint instrumentation**
5. Record a session with scrolling
6. Look for "GPU" activity in the flame chart

**Good**: GPU bars present during glass rendering
**Bad**: No GPU activity (falling back to CPU)

**Check GPU acceleration**:
```javascript
// Run in console
const testDiv = document.createElement('div')
testDiv.style.backdropFilter = 'blur(10px)'
document.body.appendChild(testDiv)
const computed = window.getComputedStyle(testDiv)
console.log('GPU accelerated:', computed.backdropFilter === 'blur(10px)')
document.body.removeChild(testDiv)
```

---

### Test 5: Memory Leaks

**Goal**: Ensure no memory leaks from glass effects

1. Open DevTools (F12)
2. Go to **Memory** tab
3. Take a **Heap snapshot** (before)
4. Interact with the page for 2 minutes
5. Take another **Heap snapshot** (after)
6. Compare snapshots

**Good**: < 5 MB growth
**Acceptable**: 5-20 MB growth
**Bad**: > 20 MB growth (likely leak)

**Automated test**:
```javascript
// Run in console
testMemoryLeaks()
// Wait 10 seconds for results
```

---

### Test 6: Mobile Performance

**Goal**: Test on mobile viewport and throttled CPU

1. Open DevTools (F12)
2. Toggle **Device Toolbar** (Cmd+Shift+M / Ctrl+Shift+M)
3. Select a mobile device (e.g., iPhone 14 Pro)
4. Go to **Performance** tab
5. Set **CPU throttling** to "4x slowdown"
6. Record and analyze

**Good**: 50+ fps on 4x throttled CPU
**Acceptable**: 40-50 fps
**Bad**: < 40 fps

**Network throttling**:
1. Go to **Network** tab
2. Set throttling to "Fast 3G"
3. Reload page
4. Check load times

---

## Lighthouse Audits

### Desktop Audit

```bash
# From browser (Chrome only)
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select:
   - Mode: Navigation
   - Device: Desktop
   - Categories: Performance, Accessibility, Best Practices
4. Click "Analyze page load"
```

**Target scores**:
- Performance: > 90
- Accessibility: 100
- Best Practices: 100

---

### Mobile Audit

Same as desktop, but select **Device: Mobile**

**Target scores**:
- Performance: > 85 (mobile is typically lower)
- Accessibility: 100
- Best Practices: 100

---

## Core Web Vitals Testing

### 1. Largest Contentful Paint (LCP)

**Target**: < 2.5 seconds

**How to test**:
1. Open DevTools → Performance tab
2. Record page load
3. Look for "LCP" marker in timeline

**Console check**:
```javascript
new PerformanceObserver((list) => {
  const entries = list.getEntries()
  const lastEntry = entries[entries.length - 1]
  console.log('LCP:', Math.round(lastEntry.startTime), 'ms')
}).observe({ entryTypes: ['largest-contentful-paint'] })
```

---

### 2. First Input Delay (FID)

**Target**: < 100 milliseconds

**How to test**:
1. Load the page
2. Click/tap something immediately after load
3. Check console for FID value

**Console check**:
```javascript
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.name === 'first-input') {
      console.log('FID:', Math.round(entry.processingStart - entry.startTime), 'ms')
    }
  })
}).observe({ type: 'first-input', buffered: true })
```

---

### 3. Cumulative Layout Shift (CLS)

**Target**: < 0.1

**How to test**:
1. Load the page and scroll
2. Check for unexpected layout shifts
3. DevTools → Performance → Experience section shows CLS

**Console check**:
```javascript
let cls = 0
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (!entry.hadRecentInput) {
      cls += entry.value
      console.log('CLS:', cls.toFixed(3))
    }
  })
}).observe({ type: 'layout-shift', buffered: true })
```

---

## Performance Regression Testing

### Before/After Comparison

Test pages before and after glassmorphism updates:

**Pages to test**:
1. Overview page (`/`) - Many glass cards
2. Core Chat (`/core-chat`) - Glass chat window
3. Clones (`/clones`) - Multiple glass interfaces
4. Dashboards (`/dashboards`) - Glass panels with data

**Metrics to compare**:

| Metric | Before | After | Change | Status |
|--------|--------|-------|--------|--------|
| FPS (scrolling) | | | | |
| Paint time (ms) | | | | |
| LCP (ms) | | | | |
| Memory usage (MB) | | | | |
| Bundle size (KB) | | | | |

**How to test**:
1. Checkout previous commit (before glass)
2. Build and run showcase
3. Record baseline metrics
4. Checkout current commit (with glass)
5. Record new metrics
6. Compare and assess regressions

---

## Real Device Testing

### iOS Testing (iPhone)

1. Open Safari on iPhone
2. Enable Web Inspector:
   - Settings → Safari → Advanced → Web Inspector
3. Connect iPhone to Mac via USB
4. Mac Safari → Develop → [iPhone Name] → localhost:3100
5. Use Timeline profiler in Safari DevTools

**Tests**:
- Scroll performance
- Touch responsiveness
- Battery drain (Settings → Battery → Last 24 Hours)

---

### Android Testing

1. Enable USB debugging on Android device
2. Connect to computer
3. Chrome DevTools → Remote devices
4. Inspect page on device
5. Run performance audits

**Tests**:
- Scroll performance (aim for 50+ fps)
- Memory usage (< 100 MB for glass effects)
- Network performance on 3G

---

## Automated Performance Tests (CI/CD)

### Lighthouse CI

Add to GitHub Actions workflow:

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      http://localhost:3100
      http://localhost:3100/core-chat
      http://localhost:3100/clones
    budgetPath: ./lighthouse-budget.json
    uploadArtifacts: true
```

**lighthouse-budget.json**:
```json
{
  "performance": 90,
  "accessibility": 100,
  "best-practices": 100,
  "seo": 90
}
```

---

## Common Performance Issues & Fixes

### Issue 1: Low FPS on Mobile

**Symptoms**: < 50 fps when scrolling on mobile

**Diagnosis**:
```javascript
// Check glass element count
document.querySelectorAll('[class*="glass"]').length
```

**Fix**:
```css
/* Reduce blur intensity on mobile */
@media (max-width: 768px) {
  .glass {
    backdrop-filter: blur(12px) !important; /* Reduced from 24px */
  }
}
```

---

### Issue 2: High Paint Times

**Symptoms**: Paint events > 16ms in Performance timeline

**Diagnosis**: Too many nested glass layers

**Fix**:
```jsx
// ❌ Bad: Nested glass
<div className="glass-card">
  <div className="glass-panel">
    <div className="glass">Content</div>
  </div>
</div>

// ✅ Good: Single glass layer
<div className="glass-card">
  <div className="bg-white/10">
    <div>Content</div>
  </div>
</div>
```

---

### Issue 3: Memory Leaks

**Symptoms**: Memory usage grows > 20MB after interactions

**Diagnosis**: Check for detached DOM nodes

**Fix**:
```javascript
// Ensure cleanup in React components
useEffect(() => {
  const observer = new IntersectionObserver(/* ... */)
  // ... setup

  return () => {
    observer.disconnect() // ✅ Cleanup
  }
}, [])
```

---

### Issue 4: GPU Overload

**Symptoms**: GPU usage at 90-100%, device gets hot

**Diagnosis**: Too many compositing layers

**Fix**:
```typescript
// Limit glass elements to 20 per page
const MAX_GLASS = 20
const items = allItems.slice(0, MAX_GLASS)
```

Or use virtualization:
```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
// Render only visible glass elements
```

---

## Performance Monitoring Dashboard

### Key Metrics to Track

1. **Page Load Performance**
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)

2. **Runtime Performance**
   - Scroll FPS (target: 60 fps)
   - Paint time (target: < 8ms)
   - Memory usage (target: < 100 MB)

3. **User Experience**
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)
   - Interaction to Next Paint (INP)

4. **Bundle Size**
   - Total JS size (gzipped)
   - Total CSS size (gzipped)
   - Glass-specific overhead

---

## Testing Checklist

### Before Merge

- [ ] Lighthouse score > 90 (desktop)
- [ ] Lighthouse score > 85 (mobile)
- [ ] All Core Web Vitals pass
- [ ] 60 fps scrolling on desktop
- [ ] 50+ fps scrolling on mobile
- [ ] No console errors
- [ ] No memory leaks (< 5 MB growth)
- [ ] Bundle size increase < 10 KB
- [ ] GPU acceleration active
- [ ] Compositing layers < 30
- [ ] Works on Safari, Firefox, Chrome
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome

### After Deployment

- [ ] Monitor real-user metrics (RUM)
- [ ] Check error rate in analytics
- [ ] Verify no performance regressions
- [ ] Monitor battery drain reports
- [ ] Check slow device performance

---

## Tools & Resources

### Browser DevTools
- Chrome DevTools Performance Panel
- Chrome DevTools Rendering Tools
- Safari Web Inspector (for iOS)
- Firefox Performance Tools

### Testing Tools
- Lighthouse CLI: `npm install -g lighthouse`
- WebPageTest: https://webpagetest.org
- Chrome User Experience Report: https://developers.google.com/web/tools/chrome-user-experience-report

### Monitoring
- Google Analytics (Core Web Vitals)
- Sentry Performance Monitoring
- New Relic Browser
- LogRocket

### Scripts
- `/scripts/performance/measure-glass-performance.js` - Browser-based analyzer
- `/scripts/performance/analyze-bundle-size.sh` - Bundle size analysis

---

## Further Reading

- [Web Performance Optimization](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Compositing and Layers](https://www.html5rocks.com/en/tutorials/speed/layers/)
- [CSS Backdrop Filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [GPU Acceleration](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)

---

**Last Updated**: 2026-02-04
