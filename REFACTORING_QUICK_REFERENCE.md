# React Component Refactoring Quick Reference

## 🚀 Quick Patterns for Common Issues

### 1. Add Missing Memoization

#### Problem: Function recreated every render
```typescript
// ❌ BAD
const handleClick = () => {
  doSomething(value)
}
```

#### Solution: Wrap in useCallback
```typescript
// ✅ GOOD
const handleClick = useCallback(() => {
  doSomething(value)
}, [value])
```

---

### 2. Memoize Expensive Calculations

#### Problem: Expensive calculation runs every render
```typescript
// ❌ BAD
const filtered = data.filter(/* expensive */).map(/* expensive */)
```

#### Solution: Wrap in useMemo
```typescript
// ✅ GOOD
const filtered = useMemo(() => 
  data.filter(/* expensive */).map(/* expensive */),
  [data]
)
```

---

### 3. Extract Magic Numbers

#### Problem: Hard-coded values scattered throughout
```typescript
// ❌ BAD
<motion.div transition={{ duration: 0.3 }}>
setTimeout(() => {}, 1000)
```

#### Solution: Use constants
```typescript
// ✅ GOOD
import { ANIMATION_TIMINGS } from '../animations/constants'

<motion.div transition={{ duration: ANIMATION_TIMINGS.NORMAL }}>
setTimeout(() => {}, UI_FEEDBACK_DELAYS.SUCCESS)
```

---

### 4. Fix Stale Closures

#### Problem: Callback captures old state
```typescript
// ❌ BAD
const callback = useCallback(() => {
  console.log(messages) // Might be stale!
}, [])
```

#### Solution: Use ref for latest value
```typescript
// ✅ GOOD
const messagesRef = useRef(messages)
useEffect(() => {
  messagesRef.current = messages
}, [messages])

const callback = useCallback(() => {
  console.log(messagesRef.current) // Always latest!
}, [])
```

---

### 5. Clean Up Timers

#### Problem: Memory leak from setTimeout
```typescript
// ❌ BAD
setTimeout(() => setState(value), 1000)
```

#### Solution: Add cleanup
```typescript
// ✅ GOOD
useEffect(() => {
  const timeoutId = setTimeout(() => setState(value), 1000)
  return () => clearTimeout(timeoutId)
}, [value])
```

---

### 6. Extract Complex JSX

#### Problem: Large inline JSX blocks
```typescript
// ❌ BAD
return (
  <div>
    {condition && (
      <div>
        {/* 50 lines of complex JSX */}
      </div>
    )}
  </div>
)
```

#### Solution: Extract to memoized component
```typescript
// ✅ GOOD
const ComplexSection = useMemo(() => (
  <div>
    {/* 50 lines of complex JSX */}
  </div>
), [dependencies])

return <div>{condition && ComplexSection}</div>
```

---

### 7. Optimize Animation Variants

#### Problem: Animation objects recreated every render
```typescript
// ❌ BAD
<motion.div
  animate={{ scale: [1, 1.2, 1] }}
  transition={{ duration: 0.5 }}
>
```

#### Solution: Extract to constants
```typescript
// ✅ GOOD
const SCALE_ANIMATION = {
  animate: { scale: [1, 1.2, 1] },
  transition: { duration: ANIMATION_TIMINGS.SLOW },
}

<motion.div {...SCALE_ANIMATION}>
```

---

### 8. Add Accessibility Attributes

#### Problem: Missing ARIA labels
```typescript
// ❌ BAD
<button onClick={handleClick}>
  <SendIcon />
</button>
```

#### Solution: Add proper labels
```typescript
// ✅ GOOD
<button 
  onClick={handleClick}
  aria-label="Send message"
>
  <SendIcon aria-hidden="true" />
</button>
```

---

### 9. Improve Error Handling

#### Problem: Errors not properly handled
```typescript
// ❌ BAD
try {
  await sendMessage()
} catch (error) {
  console.error(error)
}
```

#### Solution: Proper error state management
```typescript
// ✅ GOOD
try {
  await sendMessage()
  setError(null)
} catch (error) {
  if (error.name === 'AbortError') return
  setError(error)
  // Show user-friendly error message
}
```

---

### 10. Use React 19 Features

#### Problem: Manual state management for async
```typescript
// ❌ OLD WAY (React 18)
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState(null)

const handleSubmit = async () => {
  setIsLoading(true)
  try {
    await action()
  } catch (err) {
    setError(err)
  } finally {
    setIsLoading(false)
  }
}
```

#### Solution: Use useActionState
```typescript
// ✅ NEW WAY (React 19)
import { useActionState } from 'react'

const [state, action, isPending] = useActionState(
  async (prevState, formData) => {
    return await submitForm(formData)
  },
  initialState
)
```

---

## 🔧 Refactoring Checklist

Before submitting a component:

- [ ] All callbacks wrapped in `useCallback`
- [ ] Expensive calculations wrapped in `useMemo`
- [ ] No magic numbers (use constants)
- [ ] All timeouts have cleanup
- [ ] ARIA labels added
- [ ] No stale closures
- [ ] Complex JSX extracted
- [ ] Animation variants extracted
- [ ] Error handling robust
- [ ] TypeScript strict mode passes

---

## 📊 Performance Checklist

- [ ] Component wrapped in React.memo if pure
- [ ] Props properly memoized
- [ ] No inline object/array creation in JSX
- [ ] Large lists virtualized
- [ ] Images lazy loaded
- [ ] Heavy components code-split
- [ ] Animations use transform/opacity
- [ ] No layout thrashing

---

## ♿ Accessibility Checklist

- [ ] Semantic HTML elements used
- [ ] ARIA labels for icon buttons
- [ ] `aria-live` for dynamic content
- [ ] `role` attributes where needed
- [ ] Keyboard navigation works
- [ ] Focus management proper
- [ ] Color contrast sufficient
- [ ] Screen reader tested

---

## 🧪 Testing Checklist

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Accessibility tests pass
- [ ] Performance benchmarks run
- [ ] Visual regression tests pass
- [ ] E2E tests pass
- [ ] TypeScript builds successfully
- [ ] Linter passes with no warnings

---

## 📦 Common Imports

```typescript
// React hooks
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

// Animation
import { motion, AnimatePresence } from 'framer-motion'
import { ANIMATION_TIMINGS, ANIMATION_PRESETS } from '../animations/constants'

// Primitives
import { Button, Card, Badge, cn } from '@clarity-chat/primitives'

// Types
import type { Message, AIStatus } from '@clarity-chat/types'
```

---

## 🎯 Priority Levels

### 🔴 High Priority (Fix Immediately)
- Memory leaks (missing cleanup)
- Stale closures causing bugs
- Missing error handling
- Accessibility violations
- Performance bottlenecks (>50ms renders)

### 🟡 Medium Priority (Fix Soon)
- Missing memoization (causing re-renders)
- Magic numbers
- Missing TypeScript types
- Poor error messages
- Incomplete accessibility

### 🟢 Low Priority (Nice to Have)
- Code organization improvements
- Better naming conventions
- More comments/documentation
- Extract constants for consistency
- Refactor for readability

---

## 💡 Pro Tips

1. **Always measure before optimizing** - Use React DevTools Profiler
2. **Memoize from the bottom up** - Start with leaf components
3. **Extract constants first** - Easier to refactor consistently
4. **Test after each change** - Don't batch too many changes
5. **Use ESLint rules** - Enforce best practices automatically
6. **Document your changes** - Future you will thank you
7. **Review performance impact** - Measure before and after
8. **Keep backward compatibility** - Don't break existing code

---

## 📚 Further Reading

- [React 19 Documentation](https://react.dev)
- [Framer Motion Best Practices](https://www.framer.com/motion/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Web.dev Performance](https://web.dev/performance/)

---

**Last Updated:** November 7, 2025  
**Version:** 1.0  
**Maintained By:** Clarity Chat Team
