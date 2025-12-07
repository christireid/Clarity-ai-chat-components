# Layout Components

This directory contains layout components for the documentation site.

## Components

### AnimatedBackground

An interactive particle background component that enhances the visual appeal of the home page.

#### Features

- **Theme-aware**: Automatically adapts to dark/light mode
- **Accessible**: Respects `prefers-reduced-motion` preference
- **Performant**: Optimized with 60fps limit and visibility API integration
- **Non-intrusive**: Uses `pointer-events-none` to not interfere with page interactions

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
- **Window Resize**: Automatically adjusts to window size changes

#### Technical Details

- Uses `@tsparticles/react` for particle rendering
- Memoized configurations to prevent unnecessary re-renders
- Proper cleanup of event listeners and engine on unmount
- SSR-safe (doesn't render until client-side mount)

#### Testing

The component has comprehensive test coverage (92.85%):

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

See `__tests__/AnimatedBackground.test.tsx` for test details.

---

### Other Components

- **HeroSection**: Hero section with animated elements
- **FeaturesGrid**: Grid layout for feature displays
- **Footer**: Site footer component
- **LiveChatDemo**: Interactive chat demonstration
