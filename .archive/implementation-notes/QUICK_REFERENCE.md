# Animated Background - Quick Reference

## Quick Start

The animated background is already integrated into the home page. No additional setup required.

## Component Location
```
apps/docs/components/Layout/AnimatedBackground.tsx
```

## Usage Example
```tsx
import { AnimatedBackground } from '@/components/Layout/AnimatedBackground'

<div className="relative">
  <AnimatedBackground />
  {/* Your content */}
</div>
```

## Key Features

| Feature | Status | Notes |
|---------|--------|-------|
| Dark Mode | ✅ | Auto-detects via next-themes |
| Light Mode | ✅ | Auto-detects via next-themes |
| Accessibility | ✅ | Respects prefers-reduced-motion |
| Performance | ✅ | 60fps, pauses when tab hidden |
| Responsive | ✅ | Auto-resizes with window |
| Error Handling | ✅ | Graceful degradation |

## Configuration

### Dark Mode
- 50 particles
- Brand-400 color (#60a5fa)
- Repulse on hover
- 0.6 opacity

### Light Mode
- 40 particles
- Brand-300 color (#93c5fd)
- Grab on hover
- 0.4 opacity

## Testing

```bash
# Run tests
cd apps/docs
pnpm test components/Layout/__tests__/AnimatedBackground.test.tsx

# Run all tests
pnpm test
```

## Troubleshooting

### Background not showing?
1. Check browser console for errors
2. Verify `@tsparticles` packages are installed
3. Check if `prefers-reduced-motion` is enabled
4. Verify theme provider is set up

### Performance issues?
1. Check particle count (50 dark / 40 light)
2. Verify 60fps limit is active
3. Check if Page Visibility API is working
4. Monitor memory usage in DevTools

### Theme not switching?
1. Verify `next-themes` is configured
2. Check ThemeProvider is wrapping the app
3. Verify theme detection logic

## Customization

To customize particle count or colors, edit the config objects in `AnimatedBackground.tsx`:

```tsx
// Dark mode config (line ~119)
const darkConfig: ISourceOptions = useMemo(() => ({
  particles: {
    number: { value: 50 }, // Change particle count
    color: { value: '#60a5fa' }, // Change color
    // ... other options
  }
}), [])
```

## Performance Tips

1. **Reduce particles**: Lower `value` in `particles.number`
2. **Disable animations**: Set `particles.opacity.animation.enable: false`
3. **Lower FPS**: Change `fpsLimit: 60` to lower value
4. **Disable interactions**: Set `interactivity.events.onHover.enable: false`

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Related Files

- Component: `components/Layout/AnimatedBackground.tsx`
- Tests: `components/Layout/__tests__/AnimatedBackground.test.tsx`
- Integration: `app/page.tsx` (line 24)
- Documentation: `components/Layout/AnimatedBackground.md`

## Support

For issues or questions:
1. Check component documentation
2. Review test cases for usage examples
3. Check implementation summary
4. Review deployment checklist

---

**Last Updated**: 2025-01-27
**Version**: 1.0.0
