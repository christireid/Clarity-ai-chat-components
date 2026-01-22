# AnimatedBackground Component

An animated particle background component for the home page, designed to enhance perceived quality while maintaining performance and accessibility.

## Features

- 🎨 **Theme-aware**: Automatically adapts to dark/light mode
- ♿ **Accessible**: Respects `prefers-reduced-motion` preference
- ⚡ **High Performance**: 60fps target with optimized particle counts
- 🎯 **Non-intrusive**: Positioned behind content with `pointer-events: none`
- 📦 **Code Split**: Dynamically loaded to reduce initial bundle size
- 🔧 **Maintainable**: Well-organized with custom hooks and utilities
- ⚛️ **Concurrent Rendering**: Uses `useDeferredValue` for smooth theme transitions

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

## Architecture

### Component Structure

```
AnimatedBackground/
├── AnimatedBackground.tsx      # Main component
├── AnimatedBackground.config.ts # Configuration constants
├── AnimatedBackground.utils.ts  # Utility functions
└── hooks/
    ├── index.ts                # Barrel export
    ├── useMounted.ts           # SSR-safe mounted detection
    ├── usePrefersReducedMotion.ts # Accessibility preference
    ├── useIsDark.ts            # Theme detection
    └── useParticlesEngine.ts   # Particles engine initialization
```

### Key Design Decisions

1. **Dynamic Import**: The `Particles` component is dynamically imported to reduce initial bundle size
2. **Singleton Pattern**: Particles engine initialization uses a singleton pattern to prevent multiple initializations
3. **Custom Hooks**: Logic is extracted into reusable hooks for better testability and maintainability
4. **Configuration**: All magic numbers are centralized in a config file for easy tuning
5. **Graceful Degradation**: Component silently fails if initialization fails (renders nothing)
6. **Concurrent Rendering**: Uses `useDeferredValue` to prevent blocking renders during theme transitions

## Customization

### Adjusting Particle Count

Edit `AnimatedBackground.config.ts`:

```typescript
export const PARTICLES_COUNT = {
  DARK: 80,   // Adjust for dark mode
  LIGHT: 60,  // Adjust for light mode
} as const
```

### Changing Colors

The component uses Tailwind brand colors. To change colors, modify the color values in `AnimatedBackground.utils.ts`:

```typescript
const baseColor = isDark ? '#60a5fa' : '#3b82f6'
const secondaryColor = isDark ? '#93c5fd' : '#60a5fa'
```

### Performance Tuning

Key performance settings in `AnimatedBackground.config.ts`:

- `FPS_LIMIT`: Target frame rate (default: 60)
- `DENSITY_AREA`: Particle density area (default: 800)
- `PARTICLES_COUNT`: Number of particles per theme

## Accessibility

The component automatically respects the `prefers-reduced-motion` media query. When enabled, particles are disabled entirely to prevent motion sickness and improve accessibility.

## Browser Support

- Modern browsers with ES2020+ support
- Legacy browser fallback for `matchMedia` API (IE11+)
- Graceful degradation if particles engine fails to load

## Performance Considerations

1. **Code Splitting**: Particles library is dynamically imported
2. **Pause on Blur**: Animation pauses when tab is not visible
3. **Pause on Outside Viewport**: Animation pauses when scrolled out of view
4. **Retina Detection**: Automatically adjusts for high-DPI displays
5. **Optimized Particle Counts**: Different counts for dark/light mode based on visibility
6. **Concurrent Rendering**: Theme changes use `useDeferredValue` to prevent blocking renders

## Troubleshooting

### Particles Not Showing

1. Check browser console for errors
2. Verify `@tsparticles/react` and `@tsparticles/slim` are installed
3. Ensure component is mounted (client-side only)
4. Check if `prefers-reduced-motion` is enabled

### Performance Issues

1. Reduce `PARTICLES_COUNT` values in config
2. Increase `DENSITY_AREA` to spread particles out
3. Disable animations in `prefers-reduced-motion` mode

## Related Components

- `HeroSection` - Uses similar theme-aware patterns
- `FeaturesGrid` - Uses framer-motion for animations
