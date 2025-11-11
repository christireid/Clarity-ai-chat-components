# React 19 Migration Guide
## Modernizing Components for React 19

This guide documents the patterns and changes needed to modernize components for React 19.

---

## Key React 19 Changes

### 1. Ref as a Prop (New Feature)
React 19 supports passing `ref` as a regular prop to function components. However, for TypeScript compatibility and backward compatibility, we have two options:

#### Option A: Keep forwardRef (Recommended for now)
```tsx
// Still works in React 19, maintains backward compatibility
export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ prop1, prop2 }, ref) => {
    return <div ref={ref}>...</div>
  }
)
```

#### Option B: Use ref as prop (React 19 native)
```tsx
// React 19 native approach
export interface MyComponentProps extends React.ComponentPropsWithoutRef<'div'> {
  // your props
}

export function MyComponent({ ref, ...props }: MyComponentProps) {
  // Use ref directly
  return <div ref={ref}>...</div>
}
```

**Note:** TypeScript support for ref-as-prop is still evolving. For maximum compatibility, Option A (forwardRef) is recommended until TypeScript types are fully stabilized.

---

### 2. Server Components
React 19 supports async Server Components:

```tsx
// Server Component (Next.js App Router)
export default async function ServerComponent() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

---

### 3. Server Actions
React 19 supports Server Actions for form handling:

```tsx
// Server Action (Next.js App Router)
async function updateUser(formData: FormData) {
  'use server'
  // Server-side logic
}

// Client Component
export function UserForm() {
  return (
    <form action={updateUser}>
      <input name="name" />
      <button type="submit">Update</button>
    </form>
  )
}
```

---

### 4. use() Hook
React 19 introduces the `use()` hook for promises and context:

```tsx
import { use } from 'react'

function Component({ promise }: { promise: Promise<Data> }) {
  const data = use(promise) // Suspends until promise resolves
  return <div>{data}</div>
}
```

---

### 5. Automatic Batching Improvements
React 19 automatically batches more state updates, reducing the need for manual batching.

---

## Migration Checklist

### Components
- [ ] Review all components using `forwardRef`
- [ ] Decide whether to keep `forwardRef` or migrate to ref-as-prop
- [ ] Update TypeScript types to React 19
- [ ] Remove unnecessary `memo()`, `useCallback()`, `useMemo()` (React 19 compiler optimizes)
- [ ] Ensure all components are function components (except Error Boundaries)

### Hooks
- [ ] Review hooks for React 19 patterns
- [ ] Use `use()` hook where appropriate for promises
- [ ] Leverage automatic batching improvements

### Next.js Apps
- [ ] Migrate to App Router (if not already)
- [ ] Implement Server Components where applicable
- [ ] Use Server Actions for form handling
- [ ] Update caching strategies for Next.js 15

### TypeScript
- [ ] Update to TypeScript 5.6+
- [ ] Enable strict mode
- [ ] Update `@types/react` to 19.x
- [ ] Remove `any` types where possible

### Testing
- [ ] Update tests for React 19
- [ ] Test Server Components
- [ ] Test Server Actions
- [ ] Verify accessibility

---

## Components Already Modernized

1. ✅ `theme-switcher.tsx` - Migrated from forwardRef to ref-as-prop pattern
2. ✅ `keyboard-hint.tsx` - Migrated from forwardRef to ref-as-prop pattern

---

## Components Pending Modernization

1. `interactive-card.tsx` - Uses forwardRef
2. `command-palette.tsx` - Uses forwardRef
3. `draggable.tsx` - Uses forwardRef
4. `context-menu.tsx` - Uses forwardRef
5. `message-optimized.tsx` - Uses forwardRef
6. `advanced-chat-input.tsx` - Uses forwardRef

---

## Next Steps

1. **Install Dependencies:** Run `pnpm install` to install React 19 and updated packages
2. **Test Build:** Run `pnpm build` to verify everything compiles
3. **Run Tests:** Run `pnpm test` to ensure tests pass
4. **Modernize Components:** Follow the patterns above to modernize remaining components
5. **Update Next.js Apps:** Implement Server Components and Server Actions
6. **Update Storybook:** Migrate stories to CSF3 format

---

## Resources

- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Storybook 8 Migration Guide](https://storybook.js.org/docs/migration-guide)
