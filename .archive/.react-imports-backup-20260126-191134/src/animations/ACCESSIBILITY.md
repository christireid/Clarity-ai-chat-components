# Animation Accessibility Guide

This guide documents the patterns and best practices for creating accessible animations in Clarity
components, ensuring WCAG 2.3.3 compliance (Motion from Animation).

## Overview

All animation components in this library respect the user's motion preferences through the
`prefers-reduced-motion` media query. This is critical for users who experience motion sickness,
vestibular disorders, or simply prefer reduced motion.

## The `useReducedMotion` Hook

The primary mechanism for respecting motion preferences is the `useReducedMotion` hook from
`@clarity-chat/primitives`:

```tsx
import { useReducedMotion } from '@clarity-chat/primitives'

const MyAnimatedComponent = () => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
    >
      Content
    </motion.div>
  )
}
```

## Patterns by Animation Type

### 1. Enter/Exit Animations

For components that animate in/out, provide opacity-only fallbacks:

```tsx
// Full motion version
const fullMotion = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.9 },
}

// Reduced motion version (opacity only)
const reducedMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
```

### 2. Continuous Animations (Loops)

For repeating animations like pulsing, shaking, or glowing, disable entirely when reduced motion is
preferred:

```tsx
const PulseAttention = ({ active, children }) => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      animate={active && !prefersReducedMotion ? { scale: [1, 1.05, 1], opacity: [1, 0.8, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      {children}
    </motion.div>
  )
}
```

### 3. Particle Effects (Confetti, Ripples)

For decorative particle effects, return null or skip creation entirely:

```tsx
const ConfettiEffect = ({ trigger }) => {
  const prefersReducedMotion = useReducedMotion()

  // Skip entirely when reduced motion preferred
  if (prefersReducedMotion) {
    return null
  }

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div key={particle.id} {...particleAnimation} />
      ))}
    </AnimatePresence>
  )
}
```

### 4. Layout Animations

For layout shifts (reordering lists, expanding panels), render static elements:

```tsx
const AnimatedList = ({ children }) => {
  const prefersReducedMotion = useReducedMotion()

  // Render static div when reduced motion preferred
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div variants={staggerVariants} initial="initial" animate="animate">
      {children}
    </motion.div>
  )
}
```

### 5. Transition Delays

When reduced motion is preferred, also remove artificial delays:

```tsx
transition={{
  duration: ANIMATION_DURATION.normal / 1000,
  delay: prefersReducedMotion ? 0 : 0.2,
}}
```

## ESLint Enforcement

The `clarity-animations/require-reduced-motion` rule (set to `error`) ensures all animation
components handle reduced motion. The rule checks for:

1. Components using framer-motion
2. Components using CSS animations
3. Components using CSS transitions

If your component triggers this rule, add `useReducedMotion` and adjust the animation accordingly.

## Testing Accessibility

### Unit Tests

All animation components should have tests verifying reduced-motion behavior:

```tsx
import { vi } from 'vitest'

// Mock useReducedMotion to return true
let mockReducedMotion = false
vi.mock('@clarity-chat/primitives', async () => ({
  ...(await vi.importActual('@clarity-chat/primitives')),
  useReducedMotion: () => mockReducedMotion,
}))

describe('MyAnimatedComponent', () => {
  it('uses opacity-only animation when reduced motion is preferred', () => {
    mockReducedMotion = true
    const { container } = render(<MyAnimatedComponent show={true} />)

    // Verify no scale/transform animations
    // Verify opacity transitions work
  })
})
```

### Storybook Testing

Use the "Reduce Motion" toggle in the Storybook toolbar to test components with reduced motion
enabled. This simulates `prefers-reduced-motion: reduce`.

## Motion-Safe Helpers

The `animations/motion-safe.ts` module provides helper functions for common patterns:

```tsx
import {
  getMotionSafeValue,
  getMotionSafeDuration,
  getMotionSafeScale,
  createMotionVariants,
} from '@clarity-chat/react/animations'

// Get a motion-safe value
const scale = getMotionSafeValue(
  prefersReducedMotion,
  1, // Value when reduced motion
  1.2 // Value when motion enabled
)

// Get reduced duration when preferred
const duration = getMotionSafeDuration(prefersReducedMotion, 0.3)

// Create motion variants with reduced-motion fallbacks
const variants = createMotionVariants(prefersReducedMotion, {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
})
```

## Component Checklist

When creating a new animated component, ensure:

- [ ] Import and use `useReducedMotion` hook
- [ ] Provide opacity-only fallbacks for enter/exit animations
- [ ] Disable continuous/looping animations when reduced motion preferred
- [ ] Remove or skip decorative particle effects
- [ ] Remove artificial delays
- [ ] Add unit tests for reduced-motion behavior
- [ ] Test in Storybook with "Reduce Motion" toggle enabled

## WCAG 2.3.3 Reference

**Animation from Interactions (Level AAA)**: Motion animation triggered by interaction can be
disabled, unless the animation is essential to the functionality or the information being conveyed.

Our implementation goes beyond the requirement by:

1. Automatically detecting user preference
2. Providing graceful fallbacks (not just disabling)
3. Preserving information hierarchy through opacity transitions

## Files Structure

```
packages/react/src/animations/
├── constants.ts         # Animation timing constants
├── index.ts             # Public exports
├── motion-safe.ts       # Helper functions for motion-safe animations
├── utils.ts             # Variant creation utilities
├── ACCESSIBILITY.md     # This documentation
└── __tests__/
    ├── constants.test.ts
    └── zero-dependency.test.tsx
```

## Related Components

Components that implement reduced-motion support:

- `FeedbackAnimation` - Success, error, warning, info feedback overlays
- `SuccessCheckmark` - Animated checkmark icon
- `ErrorShake` - Shake animation wrapper
- `PulseAttention` - Pulsing attention animation
- `RippleEffect` - Ripple effect on interaction
- `ConfettiEffect` - Celebratory confetti particles
- `GlowEffect` - Glowing border animation
- `BounceIn` - Bouncing entrance animation
- `SlideNotification` - Sliding notification toast
- `AnimatedList` / `AnimatedListItem` - List animations
- `FadePresence` / `SlidePresence` / `ScalePresence` - Presence wrappers
- `ConditionalPresence` - Conditional animated presence
- `StaggerContainer` - Staggered child animations
- `AnimatedGrid` - Animated grid layout
