# Migration Guides

Comprehensive guides for migrating from deprecated patterns to current best practices in Clarity AI
Chat Components.

---

## Table of Contents

1. [useChat → useClarityChat](#1-usechat--useclaritychat)
2. [Animation Library Migration](#2-animation-library-migration)
3. [React 19 forwardRef → ref-as-prop](#3-react-19-forwardref--ref-as-prop)
4. [Reduced Motion Accessibility](#4-reduced-motion-accessibility)
5. [React Hooks Exhaustive Deps](#5-react-hooks-exhaustive-deps)

---

## 1. useChat → useClarityChat

**Status:** Deprecated in v1.0.0, will be removed in v2.0.0

### Why This Change?

The `useChat()` hook had multiple implementations across the codebase leading to confusion:

- `use-chat.ts` - Basic implementation
- `use-chat-unified.tsx` - Enhanced implementation
- `use-chat-composable.tsx` - Composable implementation
- `use-chat-enhanced.tsx` - Feature-rich implementation

All functionality has been consolidated into a single, comprehensive `useClarityChat()` hook.

### Migration Steps

**Before:**

```typescript
import { useChat } from '@clarity-chat/react'
// or
import { useChatComposable } from '@clarity-chat/react'
// or
import { useChatEnhanced } from '@clarity-chat/react'

function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    apiEndpoint: '/api/chat',
    initialMessages: [],
  })

  // Component logic...
}
```

**After:**

```typescript
import { useClarityChat } from '@clarity-chat/react'

function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useClarityChat({
    apiEndpoint: '/api/chat',
    initialMessages: [],
  })

  // Component logic - API is identical
}
```

### API Compatibility

`useClarityChat()` is **100% backwards compatible** with all previous `useChat*` implementations.
Simply replace the import - no other changes needed.

### Additional Features in useClarityChat

```typescript
const {
  // All previous features, plus:
  retry, // Retry failed messages
  regenerate, // Regenerate assistant responses
  cancel, // Cancel streaming
  setMessages, // Programmatically update messages
  updateMessage, // Update a specific message
  deleteMessage, // Delete a message
  clearMessages, // Clear all messages

  // Enhanced state
  error, // Error information
  isPaused, // Streaming pause state
  abortController, // Direct abort control
} = useClarityChat(options)
```

### Automated Migration

Use our codemod for bulk migration:

```bash
npx @clarity-chat/codemods migrate-use-chat
```

---

## 2. Animation Library Migration

**Status:** Recommended migration from inline animations to `ANIMATION_PRESETS`

### Why This Change?

- **Consistency:** Standardized animations across all components
- **Accessibility:** Built-in reduced motion support
- **Performance:** Optimized animation configurations
- **Maintainability:** Single source of truth for animation values

### Migration Steps

**Before (Inline Animations):**

```typescript
import { motion } from 'framer-motion'

function Component() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
    >
      Content
    </motion.div>
  )
}
```

**After (Animation Library):**

```typescript
import { motion } from 'framer-motion'
import { ANIMATION_PRESETS } from '@clarity-chat/react/animations'

function Component() {
  return (
    <motion.div
      {...ANIMATION_PRESETS.slideUp}
      viewport={{ once: true }}
    >
      Content
    </motion.div>
  )
}
```

### Available Presets

```typescript
import {
  ANIMATION_PRESETS,
  ANIMATION_PRESETS_REDUCED, // Accessible variants
} from '@clarity-chat/react/animations'

// Available presets:
ANIMATION_PRESETS.fadeIn
ANIMATION_PRESETS.fadeOut
ANIMATION_PRESETS.slideUp
ANIMATION_PRESETS.slideDown
ANIMATION_PRESETS.slideLeft
ANIMATION_PRESETS.slideRight
ANIMATION_PRESETS.scale
ANIMATION_PRESETS.pop
ANIMATION_PRESETS.rotate
ANIMATION_PRESETS.blur
```

### With Accessibility

**Recommended Pattern:**

```typescript
import { motion } from 'framer-motion'
import { useReducedMotion } from '@clarity-chat/react'
import { ANIMATION_PRESETS } from '@clarity-chat/react/animations'

function Component() {
  const prefersReducedMotion = useReducedMotion()

  return prefersReducedMotion ? (
    <div>Content</div>
  ) : (
    <motion.div
      {...ANIMATION_PRESETS.slideUp}
      viewport={{ once: true }}
    >
      Content
    </motion.div>
  )
}
```

### Automated Migration

Use our codemod for bulk migration:

```bash
npx @clarity-chat/codemods migrate-animations
```

---

## 3. React 19 forwardRef → ref-as-prop

**Status:** React 19 introduces ref-as-prop pattern, deprecating `React.forwardRef`

### Why This Change?

React 19 simplifies ref handling by allowing refs as regular props. This eliminates the need for the
`forwardRef` wrapper, reducing boilerplate and improving type inference.

### Migration Steps

**Before (React 18 with forwardRef):**

```typescript
import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick }, ref) => {
    return (
      <button ref={ref} onClick={onClick}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

**After (React 19 with ref-as-prop):**

```typescript
import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  ref?: React.Ref<HTMLButtonElement>
}

function Button({ children, onClick, ref }: ButtonProps) {
  return (
    <button ref={ref} onClick={onClick}>
      {children}
    </button>
  )
}
```

### Type-Safe Ref Props

**Using ComponentPropsWithRef:**

```typescript
import { ComponentPropsWithRef } from 'react'

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'primary' | 'secondary'
}

function Button({ variant = 'primary', ref, ...props }: ButtonProps) {
  return <button ref={ref} className={`btn-${variant}`} {...props} />
}
```

### For Generic Components

**Before:**

```typescript
const GenericComponent = React.forwardRef(
  <T extends HTMLElement = HTMLDivElement>(
    props: Props,
    ref: React.Ref<T>
  ) => {
    return <div ref={ref as any} {...props} />
  }
)
```

**After:**

```typescript
function GenericComponent<T extends HTMLElement = HTMLDivElement>({
  ref,
  ...props
}: Props & { ref?: React.Ref<T> }) {
  return <div ref={ref as any} {...props} />
}
```

### Backwards Compatibility

The ref-as-prop pattern works in React 18.3+ with the `react-19-compat` flag. For full React 18
compatibility, keep `forwardRef` until upgrading to React 19.

---

## 4. Reduced Motion Accessibility

**Status:** Required for WCAG 2.1 Level AA compliance (Success Criterion 2.3.3)

### Why This Change?

Users with vestibular disorders, motion sensitivity, or cognitive disabilities can experience
discomfort, nausea, or confusion from animations. Supporting `prefers-reduced-motion` is a WCAG
requirement.

### Migration Steps

**Before (Non-Accessible):**

```typescript
import { motion } from 'framer-motion'

function Component() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      Content
    </motion.div>
  )
}
```

**After (Accessible):**

```typescript
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@clarity-chat/react'

function Component() {
  const prefersReducedMotion = useReducedMotion()

  return prefersReducedMotion ? (
    <div>Content</div>
  ) : (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Content
      </motion.div>
    </AnimatePresence>
  )
}
```

### Using Animation Library (Recommended)

```typescript
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@clarity-chat/react'
import { ANIMATION_PRESETS } from '@clarity-chat/react/animations'

function Component() {
  const prefersReducedMotion = useReducedMotion()

  return prefersReducedMotion ? (
    <div>Content</div>
  ) : (
    <AnimatePresence>
      <motion.div
        {...ANIMATION_PRESETS.slideRight}
        viewport={{ once: true }}
      >
        Content
      </motion.div>
    </AnimatePresence>
  )
}
```

### ESLint Enforcement

The `clarity-animations/require-reduced-motion` rule enforces this pattern:

```javascript
// .eslintrc.js
rules: {
  'clarity-animations/require-reduced-motion': 'error'
}
```

---

## 5. React Hooks Exhaustive Deps

**Status:** Best practice for preventing stale closure bugs

### Why This Pattern?

Missing dependencies in `useEffect`, `useCallback`, and `useMemo` can cause:

- **Stale closures**: Accessing outdated variable values
- **Memory leaks**: Cleanup functions not running properly
- **Unexpected behavior**: Effects not re-running when they should

### Common Patterns

#### Pattern 1: Ref Cleanup

**Problem (Stale Ref Access):**

```typescript
const timeoutRef = useRef<NodeJS.Timeout>()

useEffect(() => {
  timeoutRef.current = setTimeout(() => {
    console.log('Delayed action')
  }, 1000)

  return () => clearTimeout(timeoutRef.current) // ❌ Stale ref access
}, [])
```

**Solution (Capture Ref Value):**

```typescript
const timeoutRef = useRef<NodeJS.Timeout>()

useEffect(() => {
  const timeout = setTimeout(() => {
    console.log('Delayed action')
  }, 1000)
  timeoutRef.current = timeout

  return () => clearTimeout(timeout) // ✅ Uses captured value
}, [])
```

#### Pattern 2: Intentional Empty Deps

**When To Use:**

```typescript
// Track event ONCE on mount (analytics, logging)
useEffect(() => {
  trackPageView({ page: 'home', timestamp: Date.now() })
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []) // Empty deps intentional - track once on mount
```

**Add Comment:** Always document why deps are intentionally omitted.

#### Pattern 3: Callback Dependencies

**Problem:**

```typescript
const handleSubmit = useCallback(() => {
  onSubmit(value) // ❌ Missing 'value' in deps
}, [onSubmit])
```

**Solution:**

```typescript
const handleSubmit = useCallback(() => {
  onSubmit(value) // ✅ 'value' included in deps
}, [onSubmit, value])
```

#### Pattern 4: Memoize Object/Function Props

**Problem:**

```typescript
const config = { apiKey, endpoint } // ❌ New object each render

useEffect(() => {
  initializeService(config)
}, [config]) // Runs every render!
```

**Solution:**

```typescript
const config = useMemo(
  () => ({ apiKey, endpoint }), // ✅ Stable reference
  [apiKey, endpoint]
)

useEffect(() => {
  initializeService(config)
}, [config]) // Only runs when apiKey/endpoint change
```

### ESLint Configuration

```javascript
// .eslintrc.js
rules: {
  'react-hooks/exhaustive-deps': 'warn', // or 'error'
}
```

---

## Automated Migration Tools

### Clarity Codemods

Install and run codemods for automated migrations:

```bash
# Install codemods package
npm install --save-dev @clarity-chat/codemods

# Run specific migrations
npx @clarity-chat/codemods migrate-use-chat
npx @clarity-chat/codemods migrate-animations
npx @clarity-chat/codemods migrate-forwardref

# Run all migrations
npx @clarity-chat/codemods migrate-all
```

### ESLint Auto-Fix

Many patterns can be auto-fixed with ESLint:

```bash
# Fix all auto-fixable issues
pnpm lint --fix

# Fix specific patterns
pnpm lint --fix --rule 'clarity-animations/*'
```

---

## Support & Resources

- **Documentation:**
  [https://clarity-chat.dev/docs/migration](https://clarity-chat.dev/docs/migration)
- **GitHub Issues:**
  [Report migration issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- **Discord:** [Join our community](https://discord.gg/clarity-chat)
- **Email:** hello@codeandclarity.com

---

## Version Compatibility Matrix

| Migration                | Min Version | Recommended | Breaking In |
| ------------------------ | ----------- | ----------- | ----------- |
| useChat → useClarityChat | v1.0.0      | v1.1.0+     | v2.0.0      |
| Animation Library        | v1.0.0      | v1.1.0+     | -           |
| React 19 forwardRef      | v1.0.0      | React 19+   | -           |
| Reduced Motion           | v1.0.0      | v1.0.0+     | -           |
| Exhaustive Deps          | v1.0.0      | v1.0.0+     | -           |

---

**Last Updated:** January 24, 2026 **Maintainer:** Code & Clarity Team
