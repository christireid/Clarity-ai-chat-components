# Layout Components

This directory contains layout components for the documentation site.

## Components

### AnimatedBackground

A high-performance animated particle background component for the homepage.

**Usage:**
```tsx
import { AnimatedBackground } from '@/components/Layout/AnimatedBackground'

<AnimatedBackground />
```

**Features:**
- Interactive particle system with connecting nodes
- Theme-aware (light/dark mode)
- Respects `prefers-reduced-motion`
- Performance optimized (60fps, debounced resize, visibility API)
- Fully accessible (`aria-hidden`)

**Props:**
- `className?: string` - Optional additional CSS classes

**See also:**
- [Implementation Details](./ANIMATED_BACKGROUND_IMPLEMENTATION.md)
- [Test File](./AnimatedBackground.test.tsx)

### HeroSection

Hero section component with animated counter and CTAs.

### FeaturesGrid

Grid layout for displaying feature cards.

### Footer

Site footer component.

### LiveChatDemo

Interactive chat demo component.
