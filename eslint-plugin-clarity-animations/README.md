# eslint-plugin-clarity-animations

ESLint plugin to enforce Clarity Chat animation best practices.

## Installation

```bash
# This plugin is already included in the monorepo
# No installation needed
```

## Usage

Add to your ESLint config:

```javascript
// eslint.config.js
import clarityAnimations from './eslint-plugin-clarity-animations/index.js'

export default [
  // ... other configs
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'clarity-animations': clarityAnimations,
    },
    rules: {
      'clarity-animations/no-hardcoded-duration': 'warn',
      'clarity-animations/no-layout-animation': 'error',
      'clarity-animations/prefer-animation-library': 'warn',
      'clarity-animations/require-reduced-motion': 'warn',
    },
  },
]
```

## Rules

### `no-hardcoded-duration` (⚠️ warning, auto-fixable)

Prevents hardcoded animation duration values. Enforces use of duration tokens from animation
library.

**Bad:**

```typescript
const animation = {
  transition: { duration: 0.3 }, // ❌ Hardcoded value
}
```

**Good:**

```typescript
import { durations } from '@/lib/animations'

const animation = {
  transition: { duration: durations.moderate }, // ✅ Uses token
}
```

**Auto-fix:** Automatically replaces hardcoded values with appropriate tokens:

- `<= 0.15` → `durations.fast`
- `<= 0.2` → `durations.normal`
- `<= 0.3` → `durations.moderate`
- `<= 0.5` → `durations.slow`
- `> 0.5` → `durations.slower`

---

### `no-layout-animation` (🔴 error)

Prevents animating layout-triggering properties that cause reflow. Enforces GPU-accelerated
properties for 60fps performance.

**Bad:**

```typescript
<motion.div
  animate={{
    width: '100%', // ❌ Causes layout thrashing
    height: 200,   // ❌ Triggers reflow
  }}
/>
```

**Good:**

```typescript
<motion.div
  animate={{
    scale: 1.2,    // ✅ GPU-accelerated
    opacity: 1,    // ✅ GPU-accelerated
    x: 20,         // ✅ GPU-accelerated (translate)
  }}
/>
```

**Blocked properties:**

- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border`

**Allowed properties:**

- `opacity`
- `scale`
- `x`, `y` (transforms)
- `rotate`, `rotateX`, `rotateY`, `rotateZ`

---

### `prefer-animation-library` (⚠️ warning)

Suggests using animation library variants instead of inline animations for consistency.

**Suboptimal:**

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
/>
```

**Better:**

```typescript
import { fadeInUp } from '@/lib/animations'

<motion.div
  variants={fadeInUp}
  initial="initial"
  animate="animate"
/>
```

**Benefits:**

- Consistent animations across codebase
- Easier to maintain and update
- Centralized design tokens
- Better code reusability

---

### `require-reduced-motion` (⚠️ warning)

Ensures animations respect `prefers-reduced-motion` accessibility preference.

**Bad:**

```typescript
<motion.div
  animate={{ scale: 1.2, rotate: 360 }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```

**Good (Option 1 - Using viewport.once):**

```typescript
<motion.div
  animate={{ scale: 1.2 }}
  viewport={{ once: true }} // ✅ Animates once, respects motion preferences
/>
```

**Good (Option 2 - Conditional rendering):**

```typescript
import { useReducedMotion } from 'framer-motion'

const shouldReduceMotion = useReducedMotion()

<motion.div
  animate={shouldReduceMotion ? {} : { scale: 1.2 }}
/>
```

**Good (Option 3 - ScrollReveal component):**

```typescript
import { ScrollReveal } from '@/components/UI/ScrollReveal'

<ScrollReveal> // ✅ Built-in reduced-motion support
  <Content />
</ScrollReveal>
```

---

## Examples

### Before (Without Plugin)

```typescript
// ❌ Multiple violations
export function Card() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        width: '300px', // Layout animation!
      }}
      transition={{ duration: 0.3 }} // Hardcoded!
    >
      Content
    </motion.div>
  )
}
```

**ESLint Output:**

```
⚠ Line 9: Use duration tokens (durations.moderate) instead of hardcoded 0.3 (clarity-animations/no-hardcoded-duration)
❌ Line 7: Animating 'width' causes layout thrashing. Use 'transform: scale' instead (clarity-animations/no-layout-animation)
⚠ Line 4: Consider using animation library variants (fadeInUp) (clarity-animations/prefer-animation-library)
⚠ Line 3: Animation should respect prefers-reduced-motion (clarity-animations/require-reduced-motion)
```

### After (With Plugin)

```typescript
// ✅ All violations fixed
import { fadeInUp, durations } from '@/lib/animations'

export function Card() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ duration: durations.moderate }}
    >
      Content
    </motion.div>
  )
}
```

---

## Configuration

### Recommended Config

```javascript
{
  rules: {
    'clarity-animations/no-hardcoded-duration': 'warn',
    'clarity-animations/no-layout-animation': 'error',
    'clarity-animations/prefer-animation-library': 'warn',
    'clarity-animations/require-reduced-motion': 'warn',
  }
}
```

### Strict Config

```javascript
{
  rules: {
    'clarity-animations/no-hardcoded-duration': 'error',
    'clarity-animations/no-layout-animation': 'error',
    'clarity-animations/prefer-animation-library': 'error',
    'clarity-animations/require-reduced-motion': 'error',
  }
}
```

### Relaxed Config (For Migration)

```javascript
{
  rules: {
    'clarity-animations/no-hardcoded-duration': 'off',
    'clarity-animations/no-layout-animation': 'warn',
    'clarity-animations/prefer-animation-library': 'off',
    'clarity-animations/require-reduced-motion': 'warn',
  }
}
```

---

## Migration Guide

When adding this plugin to an existing codebase:

1. **Start with warnings only**
2. **Fix critical issues first** (`no-layout-animation`)
3. **Use auto-fix** for `no-hardcoded-duration`
4. **Gradually migrate** to library variants
5. **Enable strict mode** once clean

```bash
# Step 1: Run ESLint to see all violations
npm run lint

# Step 2: Auto-fix what's possible
npm run lint:fix

# Step 3: Manually fix remaining issues
# Focus on layout animations first (performance critical)

# Step 4: Verify all tests pass
npm test
```

---

## Performance Impact

### Without Rules (Before)

- **Layout animations** cause reflow (30fps or worse)
- **Hardcoded values** lead to inconsistency
- **No reduced-motion** support causes accessibility issues

### With Rules (After)

- **GPU-accelerated** animations only (60fps)
- **Consistent timing** via design tokens
- **Accessible** animations for all users
- **10x faster** development with library patterns

---

## Related Documentation

- [Animation Library Guide](/apps/docs/lib/animations.ts)
- [Animation Migration Guide](/apps/docs/ANIMATION_MIGRATION_GUIDE.md)
- [Design Tokens](/apps/docs/lib/design-tokens.ts)
- [Performance Best Practices](/apps/docs/VISUAL_DESIGN_AUDIT.md)

---

## License

MIT
