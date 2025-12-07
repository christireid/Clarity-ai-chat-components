# Layout Components

This directory contains layout components for the documentation site.

## Components

### AnimatedBackground

An interactive particle background component that enhances the visual appeal of the home page.

#### Features

- **Theme-aware**: Automatically adapts to dark/light mode
- **Accessible**: Respects `prefers-reduced-motion` preference
- **Performant**: Optimized with 60fps limit, visibility API, and debounced resize handlers
- **Non-intrusive**: Uses `pointer-events-none` to not interfere with page interactions
- **Type-safe**: Full TypeScript support with proper type guards
- **Modular**: Extracted into reusable hooks and configuration files

#### Usage

```tsx
import { AnimatedBackground } from '@/components/Layout/AnimatedBackground'

export default function HomePage() {
  return (
    <div className="relative">
      <AnimatedBackground />
      {/* Your page content */}
    </div>
  )
}
```

#### Props

```tsx
interface AnimatedBackgroundProps {
  className?: string // Optional additional CSS classes
}
```

#### Behavior

- **Dark Mode**: Displays 50 glowing blue particles with connecting lines
- **Light Mode**: Displays 40 subtle particles with softer connections
- **Reduced Motion**: Component doesn't render when `prefers-reduced-motion: reduce` is enabled
- **Page Visibility**: Animation pauses when tab is hidden to save resources
- **Window Resize**: Automatically adjusts to window size changes (debounced)

#### Architecture

The component is built with a modular architecture:

- **Component**: `AnimatedBackground.tsx` - Main component (96 lines, down from 309)
- **Hooks**: 
  - `hooks/useMediaQuery.ts` - Media query detection
  - `hooks/useThemeDetection.ts` - Theme detection with system fallback
  - `hooks/useDebouncedCallback.ts` - Debounced callbacks
- **Config**: `config/particleConfigs.ts` - Particle configurations
- **Types**: `types/particles.ts` - Type definitions and guards

#### Technical Details

- Uses `@tsparticles/react` for particle rendering
- Custom hooks for reusable logic (media queries, theme detection)
- Type-safe with proper type guards (no `as any`)
- Debounced resize handlers for better performance
- Memoized configurations to prevent unnecessary re-renders
- Proper cleanup of event listeners and engine on unmount
- SSR-safe (doesn't render until client-side mount)

#### Testing

The component has comprehensive test coverage (94.68%):

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

**Test Files:**
- `__tests__/AnimatedBackground.test.tsx` - Component tests (12 tests)
- `hooks/__tests__/useMediaQuery.test.ts` - Media query hook tests (4 tests)
- `hooks/__tests__/useThemeDetection.test.ts` - Theme detection hook tests (4 tests)
- `hooks/__tests__/useDebouncedCallback.test.ts` - Debounce hook tests (3 tests)

**Total:** 23 tests, all passing

---

### Other Components

- **HeroSection**: Hero section with animated elements
- **FeaturesGrid**: Grid layout for feature displays
- **Footer**: Site footer component
- **LiveChatDemo**: Interactive chat demonstration
