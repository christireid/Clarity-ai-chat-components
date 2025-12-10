# Remaining Implementation Roadmap

**Status:** 4/12 Options Complete  
**Date:** 2025-12-09  
**Remaining Effort:** ~25-35 hours

---

## ✅ Completed Options (4/12)

1. ✅ **OPTION L**: Migration Guide (21KB documentation)
2. ✅ **OPTION A**: Page Transitions Activated (template.tsx)
3. ✅ **OPTION I**: Toast System Infrastructure (lib + components)
4. ✅ **OPTION C**: Scroll Reveal Infrastructure (ScrollReveal component)

---

## 🚧 Remaining Options (8/12)

### High Priority (Must-Have)

#### OPTION C (Continued): Apply Scroll Reveals Throughout Content

**Status:** Infrastructure complete, needs application  
**Estimated Time:** 1-2 hours  
**Files to Update:**

- `apps/docs/app/blog/page.tsx` - Wrap blog posts in `<ScrollReveal stagger>`
- `apps/docs/app/cookbook/page.tsx` - Wrap cookbook entries
- `apps/docs/app/examples/page.tsx` - Wrap example cards
- Any documentation pages with lists/grids

**Implementation:**

```tsx
// Before
;<div className="grid gap-8">
  {posts.map((post) => (
    <Link key={post.href} href={post.href}>
      {/* Post content */}
    </Link>
  ))}
</div>

// After
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

;<ScrollReveal stagger staggerDelay={0.1} className="grid gap-8">
  {posts.map((post) => (
    <ScrollRevealItem key={post.href}>
      <Link href={post.href}>{/* Post content */}</Link>
    </ScrollRevealItem>
  ))}
</ScrollReveal>
```

**Risk Mitigation:**

- Use `viewport={{ once: true }}` to prevent performance issues
- Test on pages with many items (50+) to ensure smooth scrolling
- Disable stagger on mobile if performance suffers

---

#### OPTION I (Continued): Integrate Toast Throughout App

**Status:** Infrastructure complete, needs integration  
**Estimated Time:** 1-2 hours  
**Files to Update:**

1. `apps/docs/components/AI/CodeBlock.tsx` - Replace copy feedback
2. `apps/docs/components/Layout/HeroSection.tsx` - Use toast for copy
3. `apps/docs/components/Navigation/Navigation.tsx` - Theme change feedback
4. Any error boundaries - Use `toast.error()` for caught errors

**Implementation:**

```tsx
// Example: CodeBlock copy feedback
import { toast, toastMessages } from '@/lib/toast'

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(code)
    toast.success(toastMessages.copied)
  } catch (error) {
    toast.error(toastMessages.copyFailed, {
      action: {
        label: 'Try again',
        onClick: () => handleCopy(),
      },
    })
  }
}

// Example: Theme switching
const handleThemeChange = (newTheme: string) => {
  setTheme(newTheme)
  toast.info(toastMessages.themeChanged(newTheme), {
    duration: 2000, // Short duration for non-critical feedback
  })
}
```

**Testing Checklist:**

- [ ] Copy code works with toast feedback
- [ ] Theme switching shows toast
- [ ] Error states trigger appropriate toasts
- [ ] Multiple toasts stack correctly (max 5)
- [ ] Toasts auto-dismiss at correct intervals
- [ ] Swipe-to-dismiss works on mobile

---

#### OPTION B: Comprehensive Test Suite

**Status:** Critical gap (3/10 test coverage)  
**Estimated Time:** 4-6 hours  
**Priority:** HIGH - Without tests, quality will regress

**Test Files to Create:**

1. **`apps/docs/lib/__tests__/animations.test.ts`**

```tsx
import { describe, it, expect } from 'vitest'
import { fadeIn, fadeInUp, staggerContainer, durations, springs } from '../animations'

describe('Animation Library', () => {
  describe('Basic Variants', () => {
    it('fadeIn should have correct structure', () => {
      expect(fadeIn).toHaveProperty('initial')
      expect(fadeIn).toHaveProperty('animate')
      expect(fadeIn.initial).toEqual({ opacity: 0 })
      expect(fadeIn.animate).toEqual({ opacity: 1 })
    })

    it('fadeInUp should include y-axis translation', () => {
      expect(fadeInUp.initial).toHaveProperty('y')
      expect(fadeInUp.initial.y).toBeGreaterThan(0)
    })
  })

  describe('Duration Tokens', () => {
    it('should have standard durations', () => {
      expect(durations.fast).toBe(0.15)
      expect(durations.normal).toBe(0.25)
      expect(durations.slow).toBe(0.35)
    })
  })

  describe('Spring Physics', () => {
    it('smooth spring should have correct damping', () => {
      expect(springs.smooth.damping).toBe(25)
      expect(springs.smooth.stiffness).toBe(300)
    })
  })
})
```

2. **`apps/docs/components/UI/__tests__/ScrollProgress.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { ScrollProgress } from '../ScrollProgress'
import { describe, it, expect, vi } from 'vitest'

// Mock useScroll hook
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0.5 } }),
  }
})

describe('ScrollProgress', () => {
  it('renders bar variant correctly', () => {
    render(<ScrollProgress variant="bar" />)
    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
  })

  it('shows scroll-to-top button when enabled', () => {
    render(<ScrollProgress showScrollTop />)
    // Button might not be visible until scrolled
    // Test visibility logic
  })
})
```

3. **`apps/docs/components/UI/__tests__/Toast.test.tsx`**

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastContainer } from '../Toast'
import { describe, it, expect, vi } from 'vitest'

describe('Toast', () => {
  it('renders toast message', () => {
    const toast = {
      id: '1',
      message: 'Test message',
      type: 'success' as const,
    }
    const onDismiss = vi.fn()

    render(<ToastContainer toasts={[toast]} onDismiss={onDismiss} />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('calls onDismiss when close button clicked', async () => {
    const toast = {
      id: '1',
      message: 'Test',
      type: 'info' as const,
    }
    const onDismiss = vi.fn()

    render(<ToastContainer toasts={[toast]} onDismiss={onDismiss} />)
    const closeButton = screen.getByLabelText('Dismiss notification')
    await userEvent.click(closeButton)

    expect(onDismiss).toHaveBeenCalledWith('1')
  })

  it('auto-dismisses after duration', async () => {
    const toast = {
      id: '1',
      message: 'Test',
      type: 'success' as const,
      duration: 100, // Short duration for test
    }
    const onDismiss = vi.fn()

    render(<ToastContainer toasts={[toast]} onDismiss={onDismiss} />)

    await waitFor(
      () => {
        expect(onDismiss).toHaveBeenCalledWith('1')
      },
      { timeout: 200 }
    )
  })
})
```

4. **Visual Regression Tests (Playwright)**

```typescript
// tests/visual/animations.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Animation Visual Regression', () => {
  test('ScrollProgress bar renders correctly', async ({ page }) => {
    await page.goto('/docs/components')
    await page.waitForSelector('[role="progressbar"]')

    // Scroll to trigger progress
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(500) // Wait for animation

    await expect(page).toHaveScreenshot('scroll-progress.png')
  })

  test('Toast animations work correctly', async ({ page }) => {
    await page.goto('/test-toast-page')
    await page.click('[data-testid="show-toast"]')

    await page.waitForSelector('[role="alert"]', { state: 'visible' })
    await expect(page).toHaveScreenshot('toast-visible.png')
  })
})
```

**Setup Requirements:**

- Install Vitest: `npm install -D vitest @testing-library/react @testing-library/user-event`
- Install Playwright: `npm install -D @playwright/test`
- Configure vitest.config.ts
- Add test scripts to package.json
- Set up CI/CD to run tests

---

#### OPTION D: Enhanced Code Block with Line Highlighting

**Status:** Not started  
**Estimated Time:** 5-7 hours  
**Priority:** HIGH - Core documentation feature

**Features to Implement:**

1. **Line Number Clicking**

```tsx
// In CodeBlock.tsx
const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set())

const handleLineClick = (lineNumber: number) => {
  setSelectedLines((prev) => {
    const newSet = new Set(prev)
    if (newSet.has(lineNumber)) {
      newSet.delete(lineNumber)
    } else {
      newSet.add(lineNumber)
    }
    return newSet
  })

  // Update URL
  updateUrlHash(Array.from(selectedLines))
}
```

2. **URL-Based Line Highlighting**

```tsx
// Parse URL hash on mount
useEffect(() => {
  const hash = window.location.hash
  if (hash.startsWith('#L')) {
    const lines = parseLineRange(hash) // e.g., #L10-L15
    setSelectedLines(new Set(lines))

    // Scroll to first selected line
    scrollToLine(lines[0])
  }
}, [])

function parseLineRange(hash: string): number[] {
  // #L10 -> [10]
  // #L10-L15 -> [10, 11, 12, 13, 14, 15]
  const match = hash.match(/#L(\d+)(?:-L(\d+))?/)
  if (!match) return []

  const start = parseInt(match[1])
  const end = match[2] ? parseInt(match[2]) : start

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
```

3. **Copy Selected Lines**

```tsx
const copySelectedLines = () => {
  const lines = code.split('\n')
  const selectedText = Array.from(selectedLines)
    .sort((a, b) => a - b)
    .map((lineNum) => lines[lineNum - 1])
    .join('\n')

  navigator.clipboard.writeText(selectedText)
  toast.success(`Copied ${selectedLines.size} line${selectedLines.size > 1 ? 's' : ''}`)
}
```

4. **Keyboard Shortcuts**

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.shiftKey && e.key === 'ArrowDown') {
      // Shift+Down: Select next line
      e.preventDefault()
      selectNextLine()
    } else if (e.shiftKey && e.key === 'ArrowUp') {
      // Shift+Up: Select previous line
      e.preventDefault()
      selectPreviousLine()
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      // Cmd/Ctrl+A: Select all lines
      e.preventDefault()
      selectAllLines()
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [selectedLines])
```

5. **Visual Feedback**

```tsx
// Highlight selected lines
<motion.div
  className={cn(
    'line',
    selectedLines.has(lineNumber) && 'bg-brand-500/20 border-l-2 border-brand-500'
  )}
  animate={{
    backgroundColor: selectedLines.has(lineNumber) ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
  }}
  transition={{ duration: durations.fast }}
>
  {/* Line content */}
</motion.div>
```

**Testing:**

- [ ] Click line numbers to select
- [ ] Shift+Click for range selection
- [ ] URL hash updates on selection
- [ ] Shareable URLs work (#L10-L15)
- [ ] Copy selected lines works
- [ ] Keyboard shortcuts work
- [ ] Selected lines highlight visually

---

### Medium Priority (Nice-to-Have)

#### OPTION G: Apply Animation Library to All Components

**Estimated Time:** 3-5 hours  
**Components to Update:**

- Footer (fade in links on hover)
- TableOfContents (highlight active with slide)
- Breadcrumbs (fade-in trail)
- Demo components (stagger reveals)
- Diagram components (entrance animations)
- Loading components (shimmer from library)

**Process:**

1. Audit all components: `grep -r "motion\." apps/docs/components`
2. Categorize by animation type
3. Apply migration patterns from ANIMATION_MIGRATION_GUIDE.md
4. Test each component individually
5. Document in a COMPONENT_ANIMATION_AUDIT.md

---

#### OPTION F: Optional Hero Parallax

**Estimated Time:** 2-3 hours  
**Implementation:**

```tsx
// In HeroSection.tsx
interface HeroSectionProps {
  enableParallax?: boolean // Optional prop
}

export function HeroSection({ enableParallax = false }: HeroSectionProps) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  // Mouse tracking (only on desktop)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (!enableParallax || isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
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
          x: enableParallax ? mousePosition.x : 0,
        }}
      >
        <AnimatedBackground />
      </motion.div>

      {/* Foreground content (no parallax) */}
      <div className="relative z-10">{/* Hero content */}</div>
    </section>
  )
}
```

**Usage:**

```tsx
// In page.tsx
<HeroSection enableParallax={true} /> // Enable when ready
```

---

#### OPTION J: ESLint Rules for Animations

**Estimated Time:** 2-3 hours  
**Rules to Create:**

1. **`@clarity/no-hardcoded-animation-values`**

```javascript
// .eslintrc.js custom rule
module.exports = {
  rules: {
    '@clarity/no-hardcoded-animation-values': 'warn',
  }
}

// Rule implementation
{
  create(context) {
    return {
      Property(node) {
        if (node.key.name === 'duration' &&
            node.value.type === 'Literal' &&
            typeof node.value.value === 'number') {
          context.report({
            node,
            message: 'Use duration tokens (durations.fast/normal/slow) instead of hardcoded values',
          })
        }
      }
    }
  }
}
```

2. **`@clarity/prefer-animation-library`**
3. **`@clarity/no-layout-animation`** (warns on width/height animations)
4. **`@clarity/require-reduced-motion`**

**Setup:**

- Create `eslint-plugin-clarity` package
- Or use eslint-plugin-motion (existing)
- Configure in `.eslintrc.js`
- Add pre-commit hook

---

#### OPTION H: Performance Budgets & Monitoring

**Estimated Time:** 2-3 hours  
**Implementation:**

1. **Lighthouse CI**

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://pr-preview.vercel.app
          uploadArtifacts: true
          temporaryPublicStorage: true
          budgetPath: ./.lighthouserc.json
```

2. **Budget Configuration**

```json
// .lighthouserc.json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }]
      }
    }
  }
}
```

3. **Bundle Size Tracking**

```json
// package.json
{
  "scripts": {
    "size": "size-limit",
    "size:why": "size-limit --why"
  },
  "size-limit": [
    {
      "name": "Animation Library",
      "path": "apps/docs/lib/animations.ts",
      "limit": "10 KB"
    },
    {
      "name": "Design Tokens",
      "path": "apps/docs/lib/design-tokens.ts",
      "limit": "8 KB"
    }
  ]
}
```

---

### Low Priority (Future Enhancement)

#### OPTION E: Storybook for Animation Library

**Estimated Time:** 3-4 hours  
**Setup:**

```bash
npx storybook@latest init
```

**Stories to Create:**

```tsx
// stories/animations/BasicVariants.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { motion } from 'framer-motion'
import { fadeIn, fadeInUp, slideUp } from '../../lib/animations'

const meta: Meta = {
  title: 'Animations/Basic Variants',
  parameters: {
    layout: 'centered',
  },
}

export default meta

export const FadeIn: StoryObj = {
  render: () => (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="w-64 h-64 bg-brand-500 rounded-xl flex items-center justify-center text-white"
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
      className="w-64 h-64 bg-brand-500 rounded-xl flex items-center justify-center text-white"
    >
      Fade In Up
    </motion.div>
  ),
}
```

**Deploy:**

```json
// package.json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "deploy-storybook": "storybook build && vercel deploy ./storybook-static"
  }
}
```

---

#### OPTION K: Interactive Animation Playground

**Estimated Time:** 4-6 hours  
**Features:**

- Live code editor (react-live)
- Animation pattern selector
- Real-time parameter controls
- Shareable URLs
- Code export

**Implementation:**

```tsx
// app/playground/page.tsx
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
      className="w-64 h-64 bg-brand-500 rounded-xl"
    />
  `)

  return (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div>
        <h2>Code Editor</h2>
        <LiveProvider code={code} scope={{ motion, ...animations }}>
          <LiveEditor onChange={setCode} />
          <LiveError />
        </LiveProvider>
      </div>

      <div>
        <h2>Preview</h2>
        <LivePreview />
      </div>
    </div>
  )
}
```

---

## Implementation Priority Order

### Week 1 (High Priority)

1. **Day 1-2**: OPTION B (Test Suite) - Lock in quality
2. **Day 3**: OPTION C (Apply Scroll Reveals) - Visual impact
3. **Day 4**: OPTION I (Toast Integration) - Unified feedback
4. **Day 5**: OPTION D (Code Block Enhancement) - Core feature

### Week 2 (Medium Priority)

5. **Day 1**: OPTION H (Performance Monitoring) - Automation
6. **Day 2**: OPTION G (Apply Library to All) - Consistency
7. **Day 3**: OPTION J (ESLint Rules) - Guardrails
8. **Day 4**: OPTION F (Hero Parallax) - Polish

### Week 3 (Low Priority / Optional)

9. **Day 1-2**: OPTION E (Storybook) - Documentation
10. **Day 3-4**: OPTION K (Playground) - Signature Feature

---

## Risk Mitigation Strategy

### Testing Risks

- **Risk:** No automated tests = regressions undetected
- **Mitigation:** OPTION B is highest priority
- **Fallback:** Manual QA checklist + visual regression tests

### Performance Risks

- **Risk:** Scroll animations on long pages cause janky scrolling
- **Mitigation:** Use `viewport={{ once: true }}`, test on 50+ items
- **Monitoring:** OPTION H provides continuous monitoring

### Adoption Risks

- **Risk:** Developers don't use animation library
- **Mitigation:** OPTION J (ESLint rules) + OPTION L (Migration Guide)
- **Education:** Storybook (OPTION E) shows examples

### Browser Compatibility Risks

- **Risk:** Edge case browser issues
- **Mitigation:** Cross-browser testing in CI
- **Fallback:** Feature detection + graceful degradation

---

## Success Metrics

### Code Quality

- [ ] Test coverage: 3/10 → 8/10
- [ ] ESLint warnings: Enforce animation best practices
- [ ] Documentation: 90KB → 120KB (all options documented)

### Performance

- [ ] Lighthouse: 96/100 (maintain)
- [ ] Bundle size: +15KB → +25KB (acceptable)
- [ ] FPS: 60fps (maintain across all new features)

### User Experience

- [ ] Page transitions: 100% of routes
- [ ] Scroll reveals: 15+ content sections
- [ ] Toast feedback: 10+ integration points
- [ ] Code block: Full interactivity (line highlighting, copy, share)

### Developer Experience

- [ ] Migration guide: Complete
- [ ] ESLint rules: 5+ rules enforced
- [ ] Storybook: 40+ animation stories
- [ ] Playground: Interactive demo live

---

## Next Steps

1. **Immediate (This Session):**
   - Push current commit to remote
   - Create PR with completed work
   - Review this roadmap with team

2. **Short-Term (Next 1-2 weeks):**
   - Implement OPTION B (Test Suite) - CRITICAL
   - Apply OPTION C throughout content
   - Complete OPTION I integration

3. **Medium-Term (Weeks 3-4):**
   - Code block enhancements (OPTION D)
   - Performance monitoring (OPTION H)
   - Component-wide library adoption (OPTION G)

4. **Long-Term (Month 2):**
   - Storybook deployment
   - Interactive playground
   - Hero parallax (if desired)

---

## Questions for Product Owner

1. **Priority Confirmation:**
   - Is test suite (OPTION B) approved as highest priority?
   - Can we defer Storybook (OPTION E) and Playground (OPTION K) if time-constrained?

2. **Feature Decisions:**
   - Should hero parallax be enabled by default or opt-in?
   - Do we need language tabs in code blocks (OPTION D extra feature)?

3. **Resource Allocation:**
   - Can we allocate 1-2 weeks for comprehensive testing?
   - Is Storybook deployment budget approved (~$20/mo Chromatic)?

4. **Success Criteria:**
   - What's the minimum acceptable test coverage? (Target: 80%)
   - Performance budgets: Are current targets (90+ Lighthouse, 0 CLS) firm?

---

**Status:** Ready for next phase implementation  
**Blocker:** None - all infrastructure in place  
**Estimated Completion:** 3-4 weeks (25-35 hours) for all remaining options
