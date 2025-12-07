# AnimatedBackground - Quick Reference

## Usage

```tsx
import { AnimatedBackground } from '@/components/Layout/AnimatedBackground'

// Basic usage
<AnimatedBackground />

// With custom className
<AnimatedBackground className="opacity-50" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |

## Features

- 🎨 **Theme-aware**: Automatically adapts to light/dark mode
- ♿ **Accessible**: Respects `prefers-reduced-motion`
- ⚡ **Performance**: 60fps, optimized with debouncing
- 🎯 **Interactive**: Mouse hover repulse effect
- 🔄 **Auto-pause**: Pauses when tab is hidden
- 🧹 **Clean**: Proper cleanup on unmount

## Behavior

- **Reduced Motion**: Component doesn't render if user prefers reduced motion
- **Initialization**: Returns `null` until particles engine initializes (~50-100ms)
- **Error Handling**: Silent failure if initialization fails (non-critical background)
- **Theme Change**: Automatically updates particle colors when theme changes

## Styling

The component uses:
- `position: fixed`
- `z-index: -1` (behind all content)
- `pointer-events: none` (doesn't block interactions)
- `inset-0` (full viewport)

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## Troubleshooting

**Component not visible?**
- Check browser console for errors
- Verify `prefers-reduced-motion` is not enabled
- Ensure theme provider is set up correctly

**Performance issues?**
- Component automatically pauses when tab is hidden
- Resize events are debounced (150ms)
- Frame rate is capped at 60fps

**Type errors?**
- Ensure `@tsparticles/react`, `@tsparticles/engine`, `@tsparticles/slim` are installed
- Check TypeScript version compatibility

## See Also

- [Full Implementation Details](./ANIMATED_BACKGROUND_IMPLEMENTATION.md)
- [Test File](./AnimatedBackground.test.tsx)
- [Handoff Summary](../../ANIMATED_BACKGROUND_HANDOFF.md)
