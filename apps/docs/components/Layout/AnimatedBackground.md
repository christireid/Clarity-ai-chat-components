# AnimatedBackground Component

A high-performance, interactive animated particle background component for the documentation site home page.

## Features

- ✨ **Interactive Particles**: Glowing nodes with connecting lines that respond to mouse interactions
- 🎨 **Theme-Aware**: Automatically adapts to dark/light mode with optimized visual styles
- ♿ **Accessible**: Respects `prefers-reduced-motion` preference
- ⚡ **Performance Optimized**: 
  - 60fps animation limit
  - Pauses when tab is hidden (Page Visibility API)
  - Memoized configurations to prevent unnecessary re-renders
- 🛡️ **Error Resilient**: Gracefully degrades if initialization fails
- 📱 **Responsive**: Automatically resizes with window changes

## Usage

```tsx
import { AnimatedBackground } from '@/components/Layout/AnimatedBackground'

export default function HomePage() {
  return (
    <div className="relative">
      <AnimatedBackground />
      {/* Your content here */}
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes to apply to the container |

## Technical Details

### Architecture
- Uses `@tsparticles/react` for particle rendering
- Path B (Particles/Geometric) approach
- Lightweight `@tsparticles/slim` bundle

### Dark Mode Configuration
- **Particles**: 50 nodes with brand-400 color (#60a5fa)
- **Links**: brand-500 color (#3b82f6) with 0.3 opacity
- **Interactivity**: Repulse on hover, push on click
- **Speed**: 1 unit/second

### Light Mode Configuration
- **Particles**: 40 nodes with brand-300 color (#93c5fd)
- **Links**: brand-200 color (#bfdbfe) with 0.2 opacity
- **Interactivity**: Grab on hover, push on click
- **Speed**: 0.5 unit/second (more subtle)

### Performance Features
- **FPS Limit**: 60fps cap
- **Page Visibility**: Automatically pauses when tab is hidden
- **Memory Management**: Proper cleanup of event listeners and refs
- **Memoization**: Config objects memoized to prevent re-creation

### Accessibility
- Respects `prefers-reduced-motion` media query
- Returns `null` when motion is reduced
- `aria-hidden="true"` on decorative element
- `pointer-events: none` to prevent interaction blocking

### Error Handling
- Catches initialization errors gracefully
- Handles missing browser APIs (matchMedia, etc.)
- Falls back silently for non-critical failures
- Prevents state updates after component unmount

## CSS Requirements

The component uses:
- `position: fixed` with `inset-0` for full viewport coverage
- `z-index: -10` to sit behind all content
- `pointer-events: none` to allow clicks through to content

## Browser Support

- Modern browsers with Canvas API support
- Falls back gracefully for older browsers
- SSR-safe (returns null during server-side rendering)

## Testing

Comprehensive test suite covers:
- Rendering and initialization
- Theme switching (dark/light)
- Accessibility (prefers-reduced-motion)
- Error handling
- Performance (page visibility)
- Cleanup on unmount

Run tests with:
```bash
pnpm test components/Layout/__tests__/AnimatedBackground.test.tsx
```

## Dependencies

- `@tsparticles/react`: ^3.0.0
- `@tsparticles/engine`: ^3.9.1
- `@tsparticles/slim`: ^3.9.1
- `next-themes`: ^0.4.4 (for theme detection)

## Notes

- Component is client-side only (`'use client'`)
- Initialization is asynchronous (particles load after mount)
- Component returns `null` until mounted and initialized
- Designed specifically for home page use case
