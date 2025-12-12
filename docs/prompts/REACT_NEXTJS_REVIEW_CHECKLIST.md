# React & NextJS Review Checklist

> Quick-reference checklist for reviewing React/NextJS code. For detailed guidance, see [REACT_NEXTJS_CODE_REVIEW_PROMPT.md](./REACT_NEXTJS_CODE_REVIEW_PROMPT.md).

## Focus Area: __________ (security | performance | tailwind | typescript | architecture | all)

---

## Pre-Review Discovery

- [ ] Identify changed files: `git diff main --name-only`
- [ ] Check component type (Server vs Client)
- [ ] Identify data flow and state management

---

## Core Checks by Domain

### Security (Critical)

- [ ] Server Actions validate inputs (Zod/Valibot)
- [ ] No secrets in client components
- [ ] `dangerouslySetInnerHTML` sanitized with DOMPurify
- [ ] CSP headers configured
- [ ] SQL/NoSQL injection prevented
- [ ] CSRF protection on mutations

### React Performance

- [ ] `React.memo` on frequently re-rendered components
- [ ] `useCallback` for callbacks passed to children
- [ ] `useMemo` for expensive computations
- [ ] Dynamic imports for code splitting
- [ ] No state updates in render path
- [ ] Dependency arrays accurate and minimal

### Tailwind CSS

- [ ] No arbitrary values (`w-[123px]` → `w-32`)
- [ ] Mobile-first responsive (`sm:` → `md:` → `lg:`)
- [ ] Dark mode with `dark:` variants
- [ ] Consistent spacing scale
- [ ] No duplicate/conflicting utilities

### TypeScript

- [ ] All props have interfaces
- [ ] No `any` types (use `unknown` + type guards)
- [ ] Explicit return types on exports
- [ ] Strict null checks passing
- [ ] Generic constraints defined

### Architecture

- [ ] Client components marked `'use client'`
- [ ] Server components fetch data directly
- [ ] Components < 200 lines (SRP)
- [ ] Custom hooks named `use*`
- [ ] `loading.tsx` and `error.tsx` boundaries exist

---

## Component Type Matrix

| Concern | Server Component | Client Component |
|---------|------------------|------------------|
| Data fetching | Direct DB/API | Via props or hooks |
| State | Not allowed | `useState`, `useReducer` |
| Effects | Not allowed | `useEffect` |
| Event handlers | Not allowed | Allowed |
| Browser APIs | Not allowed | Allowed |
| Secrets | Can access | Cannot access |

---

## Final Validation

- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] No ESLint warnings in changed files
- [ ] Bundle size checked (no large deps added)
- [ ] Loading states for async operations
- [ ] Error boundaries handle failures gracefully
- [ ] Accessible (ARIA labels, keyboard nav)

---

## Quick Commands

```bash
# TypeScript check
pnpm tsc --noEmit

# Find client components
grep -rn "'use client'" packages/react/src/ --include="*.tsx"

# Find React.memo usage
grep -rn "React.memo\|memo(" packages/react/src/ --include="*.tsx"

# Find arbitrary Tailwind values
grep -rn "\[.*px\]\|\[.*rem\]" packages/react/src/ --include="*.tsx"

# Find dangerouslySetInnerHTML
grep -rn "dangerouslySetInnerHTML" packages/react/src/ --include="*.tsx"

# Check for any types
grep -rn ": any\|as any" packages/react/src/ --include="*.ts"
```

---

## Common Fixes

### Missing "use client"

```tsx
// Before: Server component with client-only hooks
import { useState } from 'react'
export default function Counter() {
  const [count, setCount] = useState(0) // Error!
}

// After: Add directive
'use client'
import { useState } from 'react'
export default function Counter() {
  const [count, setCount] = useState(0) // Works
}
```

### Arbitrary Tailwind Values

```tsx
// Before: Arbitrary values
<div className="w-[256px] p-[15px] mt-[23px]" />

// After: Design system values
<div className="w-64 p-4 mt-6" />
```

### Untyped Props

```tsx
// Before: Implicit any
export function UserCard({ user }) { ... }

// After: Explicit interface
interface UserCardProps {
  user: User
}
export function UserCard({ user }: UserCardProps) { ... }
```

### Unsanitized HTML

```tsx
// Before: XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// After: Sanitized
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

### Missing Memoization

```tsx
// Before: Re-renders on every parent render
export function ExpensiveList({ items }) {
  const sorted = items.sort((a, b) => a.name.localeCompare(b.name))
  return sorted.map(item => <Item key={item.id} item={item} />)
}

// After: Memoized computation
import { useMemo, memo } from 'react'
export const ExpensiveList = memo(function ExpensiveList({ items }) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  )
  return sorted.map(item => <Item key={item.id} item={item} />)
})
```

---

*Checklist Version: 1.0.0 | See full prompt for implementation details*
