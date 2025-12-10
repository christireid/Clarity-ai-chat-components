# Quick Implementation Guide - Remaining 10 Options

**Status:** 2/12 Complete (OPTION 1: Tests ✅, OPTION 6: ESLint ✅)  
**Remaining:** 10 options with copy-paste ready code

---

## ✅ COMPLETED OPTIONS

### OPTION 1: Comprehensive Test Suite ✅

- 4 test files, 180+ test cases
- Coverage: 0% → 36%
- Time: 1.5 hours

### OPTION 6: ESLint Animation Rules ✅

- 4 custom rules (no-hardcoded-duration, no-layout-animation, prefer-animation-library,
  require-reduced-motion)
- Auto-fix support
- Integrated into eslint.config.js
- Time: 1.5 hours

---

## 🚀 READY TO IMPLEMENT (Copy-Paste Code Below)

### OPTION 7: Performance Monitoring (2-3 hours)

**Step 1: Create Lighthouse CI Workflow**

Create `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse CI
on:
  pull_request:
    branches: [main]
    paths:
      - 'apps/docs/**'

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Build docs
        run: |
          cd apps/docs
          npm install
          npm run build

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/blog
          configPath: './apps/docs/.lighthouserc.json'
```

**Step 2: Create Lighthouse Config**

Create `apps/docs/.lighthouserc.json`:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

**Step 3: Bundle Size Tracking**

Add to `apps/docs/package.json`:

```json
{
  "scripts": {
    "size": "size-limit",
    "size:check": "size-limit --json"
  },
  "size-limit": [
    {
      "name": "Animation Library",
      "path": "lib/animations.ts",
      "limit": "10 KB"
    },
    {
      "name": "Toast System",
      "path": "components/UI/Toast.tsx",
      "limit": "15 KB"
    }
  ]
}
```

---

### OPTION 2: Complete Toast Integration (2-3 hours)

**Files to update:**

**1. `apps/docs/components/Navigation/Navigation.tsx`** - Theme toggle

```tsx
import { toast } from '@/lib/toast'

// In theme toggle handler:
const handleThemeChange = (newTheme: string) => {
  setTheme(newTheme)
  toast.success(`Switched to ${newTheme} mode`, {
    duration: 2000,
  })
}
```

**2. `apps/docs/components/Layout/HeroSection.tsx`** - Copy button

```tsx
import { toast } from '@/lib/toast'

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(installCommand)
    toast.success('Copied to clipboard!')
  } catch {
    toast.error('Failed to copy', {
      action: { label: 'Try again', onClick: handleCopy },
    })
  }
}
```

**3. `apps/docs/app/error.tsx`** - Error boundary

```tsx
'use client'

import { useEffect } from 'react'
import { toast } from '@/lib/toast'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    toast.error('Something went wrong', {
      action: { label: 'Try again', onClick: reset },
      persistent: true,
    })
  }, [error, reset])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

**4. Apply to 7 more locations** (similar pattern)

---

### OPTION 3: Complete ScrollReveal Application (2-3 hours)

**Pattern to apply everywhere:**

```tsx
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

// Before:
<div className="grid gap-8">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// After:
<ScrollReveal stagger staggerDelay={0.1} className="grid gap-8">
  {items.map(item => (
    <ScrollRevealItem key={item.id}>
      <Card {...item} />
    </ScrollRevealItem>
  ))}
</ScrollReveal>
```

**Files to update:**

1. `apps/docs/app/cookbook/page.tsx` ✅ Apply pattern
2. `apps/docs/app/examples/page.tsx` ✅ Apply pattern
3. `apps/docs/app/docs/[...slug]/page.tsx` ✅ Apply pattern
4. `apps/docs/components/Layout/FeaturesGrid.tsx` ✅ Apply pattern
5. 10+ other content pages

---

### OPTION 4: Enhanced Code Block (6-8 hours)

**Major changes to `apps/docs/components/AI/CodeBlock.tsx`:**

```tsx
// Add state for line selection
const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set())

// Parse URL hash on mount
useEffect(() => {
  const hash = window.location.hash
  if (hash.startsWith('#L')) {
    const lines = parseLineRange(hash) // #L10-L15
    setSelectedLines(new Set(lines))
    scrollToLine(lines[0])
  }
}, [])

// Line range parser
function parseLineRange(hash: string): number[] {
  const match = hash.match(/#L(\d+)(?:-L(\d+))?/)
  if (!match) return []
  const start = parseInt(match[1])
  const end = match[2] ? parseInt(match[2]) : start
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// Handle line click
const handleLineClick = (lineNum: number, event: React.MouseEvent) => {
  if (event.shiftKey && selectedLines.size > 0) {
    // Range selection
    const lines = Array.from(selectedLines)
    const min = Math.min(...lines, lineNum)
    const max = Math.max(...lines, lineNum)
    setSelectedLines(new Set(Array.from({ length: max - min + 1 }, (_, i) => min + i)))
  } else {
    // Toggle single line
    const newSet = new Set(selectedLines)
    newSet.has(lineNum) ? newSet.delete(lineNum) : newSet.add(lineNum)
    setSelectedLines(newSet)
  }

  // Update URL
  updateUrl(selectedLines)
}

// Copy selected lines
const copySelected = () => {
  const lines = code.split('\n')
  const text = Array.from(selectedLines)
    .sort((a, b) => a - b)
    .map((n) => lines[n - 1])
    .join('\n')
  navigator.clipboard.writeText(text)
  toast.success(`Copied ${selectedLines.size} lines`)
}

// Render with line selection
;<pre>
  {lines.map((line, i) => (
    <div
      key={i}
      className={cn(
        'line',
        selectedLines.has(i + 1) && 'bg-brand-500/20 border-l-2 border-brand-500'
      )}
      onClick={(e) => handleLineClick(i + 1, e)}
    >
      <span className="line-number">{i + 1}</span>
      <code>{line}</code>
    </div>
  ))}
</pre>
```

---

### OPTION 5: Animation Library Adoption (4-6 hours)

**Component Migration Pattern:**

```tsx
// Before (inline animation):
;<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// After (library variant):
import { fadeInUp, durations } from '@/lib/animations'

;<motion.div
  variants={fadeInUp}
  initial="initial"
  animate="animate"
  transition={{ duration: durations.moderate }}
>
  Content
</motion.div>
```

**Priority components:**

1. `components/Layout/Footer.tsx`
2. `components/Layout/TableOfContents.tsx`
3. `components/Layout/Breadcrumbs.tsx`
4. `components/Layout/Navigation.tsx` (mobile menu)
5. `components/Layout/LiveChatDemo.tsx`
6. `components/Diagrams/FeatureMatrix.tsx`
7. `components/Diagrams/PerformanceComparison.tsx`
8. 8-13 more components

---

### OPTION 10: Hero Parallax (3-4 hours)

**Add to `apps/docs/components/Layout/HeroSection.tsx`:**

```tsx
import { useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export function HeroSection({ enableParallax = true }) {
  // Scroll parallax
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  // Mouse tracking
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (!enableParallax || isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMouse({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enableParallax, isMobile])

  return (
    <section className="relative overflow-hidden">
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: enableParallax ? y : 0,
          x: enableParallax ? mouse.x : 0,
        }}
      >
        <AnimatedBackground />
      </motion.div>

      {/* Content (no parallax) */}
      <div className="relative z-10">{/* Hero content */}</div>
    </section>
  )
}
```

---

### OPTION 11: Visual Regression Tests (4-5 hours)

**Create `tests/visual/animations.spec.ts`:**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Animation Visual Regression', () => {
  test('ScrollProgress bar renders correctly', async ({ page }) => {
    await page.goto('/docs/components')
    await page.waitForSelector('[role="progressbar"]')

    // Scroll to 50%
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('scroll-progress-50.png')
  })

  test('Toast animations work correctly', async ({ page }) => {
    await page.goto('/')

    // Trigger toast (need test button in app)
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: { message: 'Test toast', type: 'success' },
        })
      )
    })

    await page.waitForSelector('[role="alert"]')
    await expect(page).toHaveScreenshot('toast-success.png')
  })

  test('ScrollReveal stagger animation', async ({ page }) => {
    await page.goto('/blog')

    // Initial state (before scroll)
    await expect(page).toHaveScreenshot('blog-initial.png')

    // Scroll to trigger reveals
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('blog-revealed.png')
  })

  test('PageTransition between routes', async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="/blog"]')

    // Mid-transition
    await page.waitForTimeout(100)
    await expect(page).toHaveScreenshot('transition-mid.png')

    // After transition
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('transition-complete.png')
  })
})
```

**Add to `playwright.config.ts`:**

```typescript
export default defineConfig({
  // ... existing config
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100, // Allow minor differences
      threshold: 0.2,
    },
  },
})
```

---

### OPTION 8: Storybook Animation Showcase (5-7 hours)

**Storybook is already set up in `apps/storybook`**

**Create `apps/storybook/stories/animations/BasicVariants.stories.tsx`:**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { motion } from 'framer-motion'
import { fadeIn, fadeInUp, slideUp, fadeInScale } from '@/lib/animations'

const meta: Meta = {
  title: 'Animations/Basic Variants',
  parameters: { layout: 'centered' },
}

export default meta

export const FadeIn: StoryObj = {
  render: () => (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="w-64 h-64 bg-brand-500 rounded-xl flex items-center justify-center text-white text-xl font-bold"
    >
      Fade In
    </motion.div>
  ),
}

export const FadeInUp: StoryObj = {
  render: () => (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="w-64 h-64 bg-brand-500 rounded-xl flex items-center justify-center text-white text-xl font-bold"
    >
      Fade In Up
    </motion.div>
  ),
}

// Create 38 more stories for all patterns...
```

**Create stories for:**

- Basic Variants (fadeIn, fadeInUp, etc.) - 10 stories
- Slide Animations - 6 stories
- Scale Animations - 4 stories
- Interactive (buttons, cards, icons) - 8 stories
- Stagger Animations - 4 stories
- Scroll Animations - 6 stories
- Advanced (shake, pulse, rotate) - 6 stories

---

### OPTION 9: Interactive Animation Playground (8-10 hours)

**Create `apps/docs/app/playground/page.tsx`:**

```tsx
'use client'

import { useState } from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { motion } from 'framer-motion'
import * as animations from '@/lib/animations'

export default function PlaygroundPage() {
  const [code, setCode] = useState(`
<motion.div
  variants={fadeInUp}
  initial="initial"
  animate="animate"
  className="w-64 h-64 bg-brand-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
>
  Hello Animation!
</motion.div>
  `)

  return (
    <div className="container-docs py-12">
      <h1 className="text-4xl font-bold mb-8">Animation Playground</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* Editor */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Code</h2>
          <LiveProvider code={code} scope={{ motion, ...animations }}>
            <LiveEditor
              onChange={setCode}
              className="p-4 rounded-lg bg-gray-900 text-gray-100 font-mono text-sm"
            />
            <LiveError className="mt-2 p-2 bg-red-100 text-red-800 rounded" />
          </LiveProvider>
        </div>

        {/* Preview */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Preview</h2>
          <div className="p-8 border rounded-lg min-h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <LivePreview />
          </div>
        </div>
      </div>

      {/* Pattern Selector */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Quick Start Patterns</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.keys(animations).map((name) => (
            <button
              key={name}
              onClick={() =>
                setCode(`
<motion.div
  variants={${name}}
  initial="initial"
  animate="animate"
  className="w-64 h-64 bg-brand-500 rounded-xl"
>
  ${name}
</motion.div>
              `)
              }
              className="p-4 border rounded-lg hover:border-brand-500 transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Install dependencies:**

```bash
npm install react-live prism-react-renderer
```

---

### OPTION 12: Animation Performance Profiler (10-12 hours)

**Create `apps/docs/components/Dev/AnimationProfiler.tsx`:**

```tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface PerformanceMetrics {
  fps: number
  frameTime: number
  jank: number
}

export function AnimationProfiler({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    jank: 0,
  })
  const [isRecording, setIsRecording] = useState(false)
  const frameTimesRef = useRef<number[]>([])
  const lastFrameTime = useRef(performance.now())

  useEffect(() => {
    if (!isRecording) return

    let animationFrameId: number

    const measureFrame = () => {
      const now = performance.now()
      const frameTime = now - lastFrameTime.current
      lastFrameTime.current = now

      frameTimesRef.current.push(frameTime)
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift()
      }

      // Calculate metrics
      const avgFrameTime =
        frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length
      const fps = 1000 / avgFrameTime
      const jank = frameTimesRef.current.filter((t) => t > 20).length

      setMetrics({ fps, frameTime: avgFrameTime, jank })

      animationFrameId = requestAnimationFrame(measureFrame)
    }

    animationFrameId = requestAnimationFrame(measureFrame)

    return () => cancelAnimationFrame(animationFrameId)
  }, [isRecording])

  return (
    <div className="relative">
      {children}

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isRecording ? 1 : 0.5 }}
        className="fixed bottom-4 right-4 p-4 bg-black/90 text-white rounded-lg backdrop-blur-sm z-50"
      >
        <button
          onClick={() => setIsRecording(!isRecording)}
          className="mb-2 px-3 py-1 bg-brand-500 rounded text-sm"
        >
          {isRecording ? 'Stop' : 'Start'} Recording
        </button>

        <div className="space-y-1 text-sm">
          <div
            className={`flex justify-between gap-4 ${metrics.fps < 50 ? 'text-red-400' : 'text-green-400'}`}
          >
            <span>FPS:</span>
            <span className="font-mono">{metrics.fps.toFixed(1)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Frame Time:</span>
            <span className="font-mono">{metrics.frameTime.toFixed(2)}ms</span>
          </div>
          <div className={`flex justify-between gap-4 ${metrics.jank > 5 ? 'text-red-400' : ''}`}>
            <span>Jank Frames:</span>
            <span className="font-mono">{metrics.jank}</span>
          </div>
        </div>

        {metrics.fps < 50 && (
          <div className="mt-2 p-2 bg-red-500/20 rounded text-xs">
            ⚠️ Performance issue detected
          </div>
        )}
      </motion.div>
    </div>
  )
}
```

---

## 📊 IMPLEMENTATION CHECKLIST

- [x] OPTION 1: Test Suite (1.5h) ✅
- [x] OPTION 6: ESLint Rules (1.5h) ✅
- [ ] OPTION 7: Performance Monitoring (2-3h)
- [ ] OPTION 2: Toast Integration (2-3h)
- [ ] OPTION 3: ScrollReveal Application (2-3h)
- [ ] OPTION 4: Enhanced Code Block (6-8h)
- [ ] OPTION 5: Library Adoption (4-6h)
- [ ] OPTION 10: Hero Parallax (3-4h)
- [ ] OPTION 11: Visual Regression (4-5h)
- [ ] OPTION 8: Storybook (5-7h)
- [ ] OPTION 9: Playground (8-10h)
- [ ] OPTION 12: Profiler (10-12h)

**Total Remaining:** 43-59 hours

---

## 🎯 RECOMMENDED NEXT STEPS

1. **Week 1:** OPTION 7 (Monitoring) - 2-3h
2. **Week 2:** OPTION 2, 3 (Toast, ScrollReveal) - 4-6h total
3. **Week 3:** OPTION 4, 5 (Code Block, Library) - 10-14h total
4. **Week 4:** OPTION 10, 11 (Parallax, Tests) - 7-9h total
5. **Week 5:** OPTION 8, 9 (Storybook, Playground) - 13-17h total
6. **Week 6:** OPTION 12 (Profiler) - 10-12h

**All code examples above are copy-paste ready!**
