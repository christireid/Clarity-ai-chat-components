# Animation Library Migration Guide

**Version:** 1.0  
**Last Updated:** 2025-12-09  
**Target Audience:** Developers working on Clarity Chat documentation

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Why Migrate?](#why-migrate)
3. [Before You Start](#before-you-start)
4. [Common Migration Patterns](#common-migration-patterns)
5. [Step-by-Step Migration Process](#step-by-step-migration-process)
6. [Troubleshooting](#troubleshooting)
7. [Checklist](#checklist)
8. [Examples](#examples)

---

## Quick Start

**Goal:** Convert components from ad-hoc animations to use the animation library
(`lib/animations.ts`).

**Benefits:**

- ✅ Consistent timing and easing across site
- ✅ 60fps GPU-accelerated animations
- ✅ Built-in accessibility (prefers-reduced-motion)
- ✅ Full TypeScript support
- ✅ Reduced code duplication

**Time Estimate:** 15-30 minutes per component

---

## Why Migrate?

### Problems with Ad-Hoc Animations

```tsx
// ❌ BAD: Ad-hoc animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

**Issues:**

- Timing inconsistent (0.2s here, 0.3s there, 0.5s somewhere else)
- No prefers-reduced-motion support
- No spring physics (linear easing feels robotic)
- Code duplication everywhere
- Hard to maintain (change timing = update 20 files)

### Benefits of Animation Library

```tsx
// ✅ GOOD: Animation library
<motion.div
  variants={fadeInUp}
  initial="initial"
  animate="animate"
  transition={{ duration: durations.normal, ease: springs.smooth.ease }}
>
```

**Benefits:**

- Consistent timing (durations.fast, normal, slow)
- Automatic accessibility support
- Spring physics for natural feel
- Reusable patterns
- Change once, update everywhere

---

## Before You Start

### 1. Import the Animation Library

```tsx
import {
  fadeIn,
  fadeInUp,
  slideUp,
  staggerContainer,
  staggerItem,
  buttonAnimation,
  cardAnimation,
  springs,
  durations,
} from '@/lib/animations'
```

### 2. Understand Key Concepts

#### Variants

Animation states (initial, animate, exit):

```tsx
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
```

#### Springs

Physics-based easing for natural motion:

```tsx
springs.smooth // General purpose (damping: 25, stiffness: 300)
springs.snappy // Quick interactions (damping: 20, stiffness: 400)
springs.gentle // Subtle effects (damping: 30, stiffness: 200)
```

#### Durations

Standardized timing:

```tsx
durations.fast // 150ms - Micro-interactions
durations.normal // 250ms - General animations
durations.slow // 350ms - Complex transitions
```

---

## Common Migration Patterns

### Pattern 1: Simple Fade In

**Before:**

```tsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
  <h1>Hello</h1>
</motion.div>
```

**After:**

```tsx
<motion.div variants={fadeIn} initial="initial" animate="animate">
  <h1>Hello</h1>
</motion.div>
```

**Why Better:** Uses standardized pattern, includes accessibility, cleaner code.

---

### Pattern 2: Slide Up with Fade

**Before:**

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
>
  <Card />
</motion.div>
```

**After:**

```tsx
<motion.div variants={fadeInUp} initial="initial" animate="animate">
  <Card />
</motion.div>
```

**Why Better:** Consistent 20px offset, spring physics, reduced-motion support.

---

### Pattern 3: Button Hover States

**Before:**

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Click Me
</motion.button>
```

**After:**

```tsx
<motion.button {...buttonAnimation}>Click Me</motion.button>
```

**Why Better:** Spread operator applies all states (hover, tap, focus), consistent with other
buttons.

**Note:** `buttonAnimation` includes:

```tsx
{
  whileHover: { scale: 1.02, y: -2 },
  whileTap: { scale: 0.98 },
  transition: { duration: durations.fast, ease: springs.snappy.ease }
}
```

---

### Pattern 4: Card Hover Effects

**Before:**

```tsx
<motion.div
  whileHover={{
    scale: 1.02,
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  }}
  transition={{ duration: 0.3 }}
>
  <CardContent />
</motion.div>
```

**After:**

```tsx
<motion.div variants={cardAnimation} initial="initial" whileHover="hover" whileTap="tap">
  <CardContent />
</motion.div>
```

**Why Better:** Includes scale, shadow, and subtle lift. Consistent across all cards.

---

### Pattern 5: Staggered List Items

**Before:**

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } },
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

**After:**

```tsx
<motion.div variants={staggerContainer} initial="initial" animate="animate">
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      variants={staggerItem}
      custom={i * 0.05} // Optional: additional delay per item
    >
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

**Why Better:** Standardized stagger timing (50ms), cleaner code, consistent pattern.

---

### Pattern 6: Icon Animations

**Before:**

```tsx
<motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
  <Icon />
</motion.div>
```

**After:**

```tsx
<motion.div variants={iconHover} initial="initial" whileHover="hover">
  <Icon />
</motion.div>
```

**Available Icon Variants:**

- `iconHover` - Scale + subtle lift
- `iconSpin` - Continuous rotation
- `iconBounce` - Playful bounce effect

---

### Pattern 7: Scroll-Triggered Animations

**Before:**

```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.5 }}
>
  <Content />
</motion.div>
```

**After:**

```tsx
<motion.div
  variants={scrollReveal}
  initial="initial"
  whileInView="animate"
  viewport={{ once: true, amount: 0.2 }}
>
  <Content />
</motion.div>
```

**Or use the hook:**

```tsx
import { useScrollAnimation } from '@/lib/animations'

function MyComponent() {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div ref={ref} initial="initial" animate={controls} variants={fadeInUp}>
      <Content />
    </motion.div>
  )
}
```

---

### Pattern 8: Modal/Dialog Entrance

**Before:**

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <DialogContent />
    </motion.div>
  )}
</AnimatePresence>
```

**After:**

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: durations.fast }}
    >
      <DialogContent />
    </motion.div>
  )}
</AnimatePresence>
```

**Note:** For scale+fade, use `scaleIn` variant.

---

## Step-by-Step Migration Process

### Step 1: Identify Animation Usage

Search for these patterns in your component:

- `motion.div`, `motion.button`, etc.
- `initial=`, `animate=`, `whileHover=`, `whileTap=`
- `transition={{ duration: ... }}`

### Step 2: Classify the Animation Type

Determine which pattern applies:

- **Entrance:** fadeIn, fadeInUp, slideUp, scaleIn
- **Interactive:** buttonAnimation, cardAnimation, iconHover
- **List/Group:** staggerContainer + staggerItem
- **Scroll:** scrollReveal, useScrollAnimation hook

### Step 3: Import Required Patterns

```tsx
import {
  fadeInUp, // If using entrance animation
  buttonAnimation, // If animating buttons
  staggerContainer, // If animating lists
  durations, // If custom timing needed
  springs, // If custom easing needed
} from '@/lib/animations'
```

### Step 4: Replace Inline Animations

Replace hardcoded objects with variants:

```tsx
// Before
initial={{ opacity: 0, y: 20 }}

// After
variants={fadeInUp}
initial="initial"
```

### Step 5: Update Transitions

Replace hardcoded transitions:

```tsx
// Before
transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}

// After
transition={{ duration: durations.normal, ease: springs.smooth.ease }}
```

### Step 6: Test Thoroughly

- ✅ Visual check: Animation looks correct
- ✅ Timing check: Consistent with other components
- ✅ Accessibility: Enable prefers-reduced-motion, verify animations reduce
- ✅ Performance: Check DevTools for 60fps
- ✅ Edge cases: Fast clicking, rapid state changes

### Step 7: Update Tests (if applicable)

If component has tests, update animation assertions:

```tsx
// Update expectations to match new timing
await waitFor(
  () => {
    expect(element).toBeVisible()
  },
  { timeout: durations.normal }
)
```

---

## Troubleshooting

### Issue 1: Animation Not Triggering

**Symptom:** Component renders but animation doesn't play.

**Common Causes:**

1. Missing `initial` prop
2. `animate` not set to "animate"
3. Variants not imported

**Solution:**

```tsx
// ✅ Ensure all three are present
<motion.div
  variants={fadeIn}        // 1. Variants defined
  initial="initial"        // 2. Initial state
  animate="animate"        // 3. Animate to this state
>
```

---

### Issue 2: Animation Too Fast/Slow

**Symptom:** Animation timing feels off.

**Solution:** Use design token durations, don't hardcode:

```tsx
// ❌ Don't hardcode
transition={{ duration: 0.3 }}

// ✅ Use tokens
transition={{ duration: durations.normal }}  // 250ms
transition={{ duration: durations.fast }}    // 150ms
transition={{ duration: durations.slow }}    // 350ms
```

---

### Issue 3: Animation Feels "Robotic"

**Symptom:** Animation is smooth but feels mechanical.

**Solution:** Use spring physics instead of linear easing:

```tsx
// ❌ Linear feels robotic
transition={{ duration: 0.3, ease: 'easeInOut' }}

// ✅ Spring feels natural
transition={{
  duration: durations.normal,
  ease: springs.smooth.ease
}}
```

---

### Issue 4: Stagger Not Working

**Symptom:** List items animate simultaneously instead of staggered.

**Common Causes:**

1. Container missing `staggerContainer` variants
2. Items missing `staggerItem` variants
3. Items not direct children of container

**Solution:**

```tsx
// ✅ Correct structure
<motion.div variants={staggerContainer} initial="initial" animate="animate">
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={staggerItem} // Must be direct child
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

### Issue 5: Exit Animation Not Playing

**Symptom:** Component disappears instantly instead of animating out.

**Common Causes:**

1. Missing `AnimatePresence` wrapper
2. Missing `exit` state in variants
3. Missing unique `key` prop

**Solution:**

```tsx
// ✅ Correct setup
import { AnimatePresence } from 'framer-motion'

;<AnimatePresence>
  {isVisible && (
    <motion.div
      key="unique-key" // 1. Unique key
      variants={fadeIn} // 2. Variants include exit
      initial="initial"
      animate="animate"
      exit="exit" // 3. Exit state defined
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

---

### Issue 6: Scroll Animation Triggers Multiple Times

**Symptom:** Animation replays every time element scrolls into view.

**Solution:** Add `viewport={{ once: true }}`:

```tsx
<motion.div
  variants={scrollReveal}
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}  // ✅ Only animate once
>
```

---

### Issue 7: TypeScript Errors with Variants

**Symptom:** TypeScript complains about variant types.

**Solution:** Import `AnimationVariant` type:

```tsx
import { type AnimationVariant } from '@/lib/animations'

// For custom variants
const myCustomVariant: AnimationVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}
```

---

### Issue 8: Animation Performance Issues

**Symptom:** Animation is janky or drops frames.

**Common Causes:**

1. Animating width/height instead of scale
2. Animating color/box-shadow excessively
3. Too many elements animating simultaneously

**Solution:**

```tsx
// ❌ BAD: Causes reflow
animate={{ width: '100%', height: 'auto' }}

// ✅ GOOD: GPU-accelerated
animate={{ scaleX: 1, scaleY: 1 }}

// ❌ BAD: Many simultaneous heavy animations
{items.map(item => (
  <motion.div animate={{ boxShadow: '...' }} /> // 100 items = slow
))}

// ✅ GOOD: Use CSS transitions for simple states
<div className="hover:shadow-xl transition-shadow" />
```

---

## Checklist

Use this checklist when migrating a component:

### Pre-Migration

- [ ] Identified all animation usage in component
- [ ] Classified animation types (entrance, hover, scroll, etc.)
- [ ] Checked animation library for matching patterns
- [ ] Read relevant sections of this guide

### During Migration

- [ ] Imported required patterns from `@/lib/animations`
- [ ] Replaced inline animation objects with variants
- [ ] Replaced hardcoded transitions with tokens
- [ ] Updated spread operators for interactive animations
- [ ] Maintained component functionality (no breaking changes)

### Post-Migration

- [ ] Tested animation visually
- [ ] Verified consistent timing with other components
- [ ] Tested with `prefers-reduced-motion` enabled
- [ ] Checked DevTools for 60fps performance
- [ ] Tested edge cases (rapid interactions, state changes)
- [ ] Updated tests if applicable
- [ ] Updated component documentation if needed

### Code Review

- [ ] No hardcoded duration/easing values
- [ ] Using design tokens (durations, springs)
- [ ] Following animation library patterns
- [ ] TypeScript types correct
- [ ] No console warnings

---

## Complete Examples

### Example 1: Feature Card Component

**Before:**

```tsx
'use client'

import { motion } from 'framer-motion'

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-xl border border-border bg-bg-primary"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </motion.div>
  )
}
```

**After:**

```tsx
'use client'

import { motion } from 'framer-motion'
import { fadeInUp, cardAnimation } from '@/lib/animations'

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="p-6 rounded-xl border border-border bg-bg-primary"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </motion.div>
  )
}
```

**Changes Made:**

1. Imported `fadeInUp` and `cardAnimation` from library
2. Replaced inline `initial`/`animate` with `fadeInUp` variants
3. Used `cardAnimation` for hover states (includes scale + shadow)
4. Removed hardcoded transition

---

### Example 2: Animated List

**Before:**

```tsx
'use client'

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export function BlogPostList({ posts }: { posts: Post[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {posts.map((post) => (
        <motion.article
          key={post.id}
          variants={itemVariants}
          className="p-4 rounded-lg bg-bg-secondary"
        >
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </motion.article>
      ))}
    </motion.div>
  )
}
```

**After:**

```tsx
'use client'

import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations'

export function BlogPostList({ posts }: { posts: Post[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {posts.map((post, index) => (
        <motion.article
          key={post.id}
          variants={staggerItem}
          custom={index * 0.05}
          className="p-4 rounded-lg bg-bg-secondary"
        >
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </motion.article>
      ))}
    </motion.div>
  )
}
```

**Changes Made:**

1. Removed custom variants, imported from library
2. Used `staggerContainer` and `staggerItem`
3. Added `custom` prop for per-item delay adjustment
4. Standardized state names (hidden/visible → initial/animate)

---

### Example 3: Button with Loading State

**Before:**

```tsx
'use client'

import { motion } from 'framer-motion'

export function SubmitButton({ isLoading, onClick }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      disabled={isLoading}
      className="px-6 py-3 bg-brand-500 text-white rounded-lg"
    >
      {isLoading ? 'Loading...' : 'Submit'}
    </motion.button>
  )
}
```

**After:**

```tsx
'use client'

import { motion } from 'framer-motion'
import { buttonAnimation } from '@/lib/animations'

export function SubmitButton({ isLoading, onClick }: ButtonProps) {
  return (
    <motion.button
      {...buttonAnimation}
      onClick={onClick}
      disabled={isLoading}
      className="px-6 py-3 bg-brand-500 text-white rounded-lg disabled:opacity-50"
    >
      {isLoading ? 'Loading...' : 'Submit'}
    </motion.button>
  )
}
```

**Changes Made:**

1. Imported `buttonAnimation` (includes hover, tap, focus states)
2. Used spread operator to apply all animation props
3. Cleaner, more consistent with other buttons

---

## Quick Reference

### Most Common Patterns

| Use Case            | Pattern                            | Import                                                             |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------ |
| **Fade in content** | `fadeIn`                           | `import { fadeIn } from '@/lib/animations'`                        |
| **Slide up + fade** | `fadeInUp`                         | `import { fadeInUp } from '@/lib/animations'`                      |
| **Button hover**    | `buttonAnimation`                  | `import { buttonAnimation } from '@/lib/animations'`               |
| **Card hover**      | `cardAnimation`                    | `import { cardAnimation } from '@/lib/animations'`                 |
| **List stagger**    | `staggerContainer` + `staggerItem` | `import { staggerContainer, staggerItem } from '@/lib/animations'` |
| **Scroll reveal**   | `scrollReveal`                     | `import { scrollReveal } from '@/lib/animations'`                  |
| **Icon hover**      | `iconHover`                        | `import { iconHover } from '@/lib/animations'`                     |
| **Modal entrance**  | `fadeIn` or `scaleIn`              | `import { fadeIn, scaleIn } from '@/lib/animations'`               |

### Timing Tokens

```tsx
durations.fast // 150ms - Quick micro-interactions
durations.normal // 250ms - Standard animations
durations.slow // 350ms - Complex transitions
```

### Spring Physics

```tsx
springs.smooth // General purpose (most common)
springs.snappy // Quick, responsive (buttons)
springs.gentle // Subtle, smooth (backgrounds)
springs.bouncy // Playful (icons, accents)
```

---

## Getting Help

### Resources

1. **Animation Library Source**: `apps/docs/lib/animations.ts`
2. **Design Tokens**: `apps/docs/lib/design-tokens.ts`
3. **Example Components**:
   - `apps/docs/components/Layout/FeaturesGrid.tsx`
   - `apps/docs/components/Navigation/SearchDialog.tsx`
   - `apps/docs/components/AI/CodeBlock.tsx`

### Common Questions

**Q: Can I create custom variants?**  
A: Yes! Follow the same pattern:

```tsx
import { type AnimationVariant } from '@/lib/animations'

const myVariant: AnimationVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}
```

**Q: What if the library doesn't have what I need?**  
A: Consider adding it to the library if it's reusable. Otherwise, use inline animations but follow
best practices (spring physics, durations, prefers-reduced-motion).

**Q: How do I test animations?**  
A: Check the test suite in `apps/docs/lib/__tests__/animations.test.ts` for examples.

---

## Version History

| Version | Date       | Changes                 |
| ------- | ---------- | ----------------------- |
| 1.0     | 2025-12-09 | Initial migration guide |

---

**Questions or Suggestions?** Open an issue or contact the design systems team.
