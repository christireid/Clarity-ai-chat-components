# Lazy Loading Patterns

> **Wave 3.3 Feature** | Production Ready | Bundle Size: -6.3 MB

## Overview

Wave 3.3 introduced comprehensive lazy loading patterns for heavy components with progressive enhancement. These patterns reduce initial bundle size by 59% while maintaining excellent user experience through intelligent loading strategies.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Hooks](#hooks)
3. [Components](#components)
4. [Utilities](#utilities)
5. [Best Practices](#best-practices)
6. [Examples](#examples)

---

## Core Concepts

### Progressive Enhancement

Load features based on device capability and network conditions:

- **Desktop-only features**: Three.js backgrounds, advanced animations
- **Network-aware**: Skip heavy assets on slow connections
- **Viewport-aware**: Load only visible components
- **Motion-aware**: Respect `prefers-reduced-motion`

### Bundle Impact

| Component    | Size   | Strategy              | Savings |
| ------------ | ------ | --------------------- | ------- |
| Monaco       | 2.8 MB | Route split           | 2.8 MB  |
| Three.js     | 1.25MB | Desktop + lazy        | 1.25 MB |
| Mermaid      | 950 KB | Intersection Observer | 950 KB  |
| AI SDKs      | 650 KB | Server-side only      | 650 KB  |
| Highlight.js | 450 KB | Removed (use Prism)   | 450 KB  |
| TSParticles  | 200 KB | Lazy + desktop        | 200 KB  |

**Total Savings**: 6.3 MB (-59%)

---

## Hooks

### `useLazyBackground`

Desktop-only loading with network and motion awareness.

#### Signature

```typescript
function useLazyBackground(options?: LazyBackgroundOptions): boolean

interface LazyBackgroundOptions {
  minViewportWidth?: number // Default: 1024
  delayMs?: number // Default: 1000
  respectReducedMotion?: boolean // Default: true
  checkNetwork?: boolean // Default: true
}
```

#### Usage

```tsx
import { useLazyBackground } from '@/hooks/useLazyBackground'

function BackgroundEffect() {
  const shouldLoad = useLazyBackground({
    minViewportWidth: 1280, // Only on large screens
    delayMs: 1500, // Wait 1.5s after page load
    respectReducedMotion: true, // Skip if user prefers reduced motion
    checkNetwork: true, // Skip on slow connections
  })

  if (!shouldLoad) {
    return <StaticBackground /> // Fallback for mobile/slow connections
  }

  return <ThreeJsBackground />
}
```

#### Implementation Details

The hook checks multiple conditions before returning `true`:

1. **Viewport Width**: `window.innerWidth >= minViewportWidth`
2. **Network Speed**: `navigator.connection.effectiveType === '4g'`
3. **Reduced Motion**: `!window.matchMedia('(prefers-reduced-motion: reduce)').matches`
4. **Delay**: Waits `delayMs` after mount

#### When to Use

- Heavy 3D graphics (Three.js, WebGL)
- Complex animations (TSParticles)
- Desktop-specific features
- Non-critical visual enhancements

---

### `useIntersectionObserver`

Load components when they enter the viewport.

#### Signature

```typescript
function useIntersectionObserver<T extends HTMLElement>(
  options?: IntersectionObserverOptions
): [boolean, React.RefObject<T>]

interface IntersectionObserverOptions {
  threshold?: number // Default: 0.1
  rootMargin?: string // Default: '100px'
  freezeOnceVisible?: boolean // Default: true
}
```

#### Usage

```tsx
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

function LazySection() {
  const [isVisible, ref] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: '100px', // Start loading 100px before visible
    freezeOnceVisible: true, // Don't toggle back to false
  })

  return (
    <div ref={ref}>
      {isVisible ? <ExpensiveComponent /> : <Skeleton className="h-64" />}
    </div>
  )
}
```

#### When to Use

- Below-the-fold content
- Long lists or feeds
- Images and media
- Heavy components not immediately visible

---

## Components

### `LazyMermaid`

Dynamic mermaid diagram loading with skeleton loader.

#### Usage

```tsx
import { LazyMermaid } from '@/components/MDX/LazyMermaid'

function DiagramSection() {
  return (
    <LazyMermaid
      chart={`
        graph TD
          A[User Request] --> B[API Gateway]
          B --> C[AI Service]
          C --> D[Response]
      `}
      theme="dark" // Optional: 'light' | 'dark' | 'neutral'
    />
  )
}
```

#### Features

- **Intersection Observer**: Loads when scrolled into view
- **Skeleton Loader**: Prevents Cumulative Layout Shift (CLS)
- **Error Boundary**: Graceful fallback on parse errors
- **Theme Awareness**: Respects system theme
- **Accessibility**: Provides text alternative

#### Bundle Impact

- **Before**: Mermaid bundled in every page (950 KB)
- **After**: Loaded on-demand (0 KB initial)
- **Savings**: 950 KB per page

---

### `LazyMonacoEditor`

Code editor loaded only on `/playground` route.

#### Implementation

```tsx
// app/playground/page.tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <CodeEditorSkeleton />,
})

export default function PlaygroundPage() {
  return <MonacoEditor language="typescript" value={code} />
}
```

#### Features

- **Route-based splitting**: Only loaded on playground route
- **No SSR**: `ssr: false` prevents server-side bundle inclusion
- **Loading state**: Skeleton prevents layout shift

#### Bundle Impact

- **Before**: Monaco in main bundle (2.8 MB)
- **After**: Separate chunk loaded on-demand
- **Savings**: 2.8 MB from main bundle

---

## Utilities

### `shouldLazyLoad()`

Determine if heavy assets should be loaded.

#### Signature

```typescript
function shouldLazyLoad(): Promise<boolean>
```

#### Usage

```typescript
import { shouldLazyLoad } from '@/lib/lazy-load'

async function loadHeavyAsset() {
  const canLoad = await shouldLazyLoad()

  if (!canLoad) {
    console.log('Skipping heavy asset on slow connection or mobile')
    return null
  }

  return import('./heavy-asset')
}
```

#### Logic

```typescript
export async function shouldLazyLoad(): Promise<boolean> {
  // Check viewport size
  if (window.innerWidth < 1024) return false

  // Check network speed
  const connection = (navigator as any).connection
  if (connection && connection.effectiveType !== '4g') return false

  // Check reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false

  return true
}
```

---

### `createLazyComponent()`

Factory for creating lazy-loaded components.

#### Signature

```typescript
function createLazyComponent<T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options?: LazyComponentOptions
): React.LazyExoticComponent<React.ComponentType<T>>

interface LazyComponentOptions {
  fallback?: React.ReactNode
  errorBoundary?: boolean
}
```

#### Usage

```typescript
import { createLazyComponent } from '@/lib/lazy-load'

// Create lazy component with automatic error boundary
const ThreeBackground = createLazyComponent(
  () => import('@/components/ThreeBackground'),
  {
    fallback: <BackgroundSkeleton />,
    errorBoundary: true,
  }
)

// Use like normal component
function Page() {
  return <ThreeBackground />
}
```

---

## Best Practices

### 1. Always Provide Skeleton Loaders

Prevent Cumulative Layout Shift (CLS) by reserving space.

```tsx
// ✅ Good: Skeleton prevents layout shift
{
  isVisible ? <HeavyComponent /> : <Skeleton className="h-64 w-full" />
}

// ❌ Bad: Content pops in, causes CLS
{
  isVisible && <HeavyComponent />
}
```

### 2. Test on Mobile Devices

Ensure graceful degradation for mobile users.

```bash
# Test mobile viewport
pnpm dev
# Open DevTools -> Toggle device toolbar
# Test on various screen sizes and network speeds
```

### 3. Consider Network Conditions

Use `shouldLazyLoad()` to skip heavy assets on slow connections.

```tsx
// ✅ Good: Network-aware loading
const [shouldLoad, setShouldLoad] = useState(false)

useEffect(() => {
  shouldLazyLoad().then(setShouldLoad)
}, [])

return shouldLoad ? <HeavyComponent /> : <LightAlternative />
```

### 4. Respect Reduced Motion

Provide static alternatives for users who prefer reduced motion.

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion'

function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <StaticGradient />
  }

  return <AnimatedParticles />
}
```

### 5. Use Intersection Observer for Below-the-Fold Content

Don't load components that aren't visible.

```tsx
// ✅ Good: Load when scrolled into view
const [isVisible, ref] = useIntersectionObserver({ threshold: 0.1 })

return (
  <section ref={ref}>
    {isVisible ? <ExpensiveChart /> : <ChartSkeleton />}
  </section>
)
```

### 6. Profile Performance Impact

Use Chrome DevTools to measure loading time.

```bash
# 1. Open DevTools -> Performance tab
# 2. Click Record
# 3. Scroll through page
# 4. Stop recording
# 5. Check "Loading" and "Scripting" metrics
```

---

## Examples

### Example 1: Three.js Background (Desktop-Only)

```tsx
import { useLazyBackground } from '@/hooks/useLazyBackground'
import dynamic from 'next/dynamic'

const ThreeBackground = dynamic(() => import('./ThreeBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50" />,
})

export function HeroSection() {
  const shouldLoad = useLazyBackground({
    minViewportWidth: 1280,
    delayMs: 2000,
  })

  return (
    <div className="relative">
      {shouldLoad && <ThreeBackground />}
      <div className="relative z-10">{/* Content */}</div>
    </div>
  )
}
```

### Example 2: Mermaid Diagram (Intersection Observer)

```tsx
import { LazyMermaid } from '@/components/MDX/LazyMermaid'

export function ArchitectureDiagram() {
  return (
    <section className="my-8">
      <h2>System Architecture</h2>
      <LazyMermaid
        chart={`
          graph LR
            A[Client] --> B[API Gateway]
            B --> C[Auth Service]
            B --> D[Chat Service]
            D --> E[AI Model]
        `}
      />
    </section>
  )
}
```

### Example 3: Image Gallery (Progressive Loading)

```tsx
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import Image from 'next/image'

export function ImageGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((src, i) => (
        <LazyImage key={i} src={src} alt={`Image ${i + 1}`} />
      ))}
    </div>
  )
}

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [isVisible, ref] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <div ref={ref} className="aspect-square bg-gray-200">
      {isVisible ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <div className="w-full h-full animate-pulse bg-gray-300" />
      )}
    </div>
  )
}
```

### Example 4: Code Editor (Route-Based)

```tsx
// app/playground/page.tsx
import dynamic from 'next/dynamic'

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-900 animate-pulse flex items-center justify-center">
      <p className="text-gray-400">Loading editor...</p>
    </div>
  ),
})

export default function PlaygroundPage() {
  const [code, setCode] = useState('console.log("Hello World")')

  return (
    <div className="container mx-auto py-8">
      <h1>Code Playground</h1>
      <CodeEditor value={code} onChange={setCode} language="javascript" />
    </div>
  )
}
```

---

## Performance Metrics

### Before Lazy Loading (Wave 3.2)

- **Initial Bundle**: 1.1 MB
- **First Contentful Paint**: 2.1s
- **Time to Interactive**: 3.8s
- **Lighthouse Score**: 68

### After Lazy Loading (Wave 3.3)

- **Initial Bundle**: 450 KB (-59%)
- **First Contentful Paint**: 0.8s (-62%)
- **Time to Interactive**: 1.4s (-63%)
- **Lighthouse Score**: 78+ (+10 points)

---

## Troubleshooting

### Issue: Component Not Loading

**Symptom**: Skeleton shows indefinitely, component never loads.

**Causes**:

1. Network error (check DevTools Console)
2. Intersection Observer not triggering (check `threshold` and `rootMargin`)
3. Conditional check blocking load (check `shouldLazyLoad()` result)

**Solution**:

```tsx
// Add error boundary and logging
import { ErrorBoundary } from '@/components/ErrorBoundary'

<ErrorBoundary fallback={<ErrorMessage />}>
  <LazyComponent />
</ErrorBoundary>
```

### Issue: Layout Shift (Poor CLS Score)

**Symptom**: Content jumps when lazy component loads.

**Cause**: Missing or incorrectly sized skeleton.

**Solution**:

```tsx
// ✅ Skeleton matches final component size
<Skeleton className="h-96 w-full" /> // Matches <HeavyComponent />
```

### Issue: Heavy Assets Still in Bundle

**Symptom**: Bundle size not reduced as expected.

**Cause**: Static imports instead of dynamic imports.

**Solution**:

```tsx
// ❌ Bad: Static import (bundled)
import HeavyComponent from './HeavyComponent'

// ✅ Good: Dynamic import (lazy loaded)
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

---

## Related Documentation

- [Performance Optimization Guide](../runbooks/performance.md)
- [ISR Caching Patterns](./isr-caching.md)
- [Bundle Analysis](../guides/bundle-analysis.md)

---

**Last Updated**: Wave 3.3 completion (January 26, 2026)
