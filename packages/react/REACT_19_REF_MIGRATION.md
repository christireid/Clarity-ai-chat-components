# React 19 Ref Migration Guide

This guide documents the migration of Clarity Chat components from React 18's `forwardRef` pattern to React 19's ref-as-prop pattern.

## Overview

React 19 introduces a simpler way to handle refs: instead of wrapping components in `forwardRef`, refs can now be passed as regular props. This provides better TypeScript inference, cleaner component APIs, and reduced wrapper overhead.

## What Changed

### Migrated Components (17 total)

The following components in `@clarity-chat/react` now accept `ref` as a standard prop:

| Component | Element Type | Notes |
|-----------|--------------|-------|
| `AdvancedChatInput` | `HTMLTextAreaElement` | Uses `useMergedRef` for internal + external ref |
| `MessageOptimized` | `HTMLDivElement` | Custom `React.memo` comparison includes ref |
| `CommandPalette` | `HTMLDivElement` | Rendered via portal when open |
| `ContextMenu` | `HTMLDivElement` | Rendered via portal when triggered |
| `KeyboardHint` | `HTMLDivElement` | Only rendered when `visible={true}` |
| `ThemeSwitcher` | `HTMLDivElement` | Direct ref forwarding |
| `Draggable` | `HTMLDivElement` | Direct ref forwarding |
| `DropZone` | `HTMLDivElement` | Direct ref forwarding |
| `DashboardProgress` | `HTMLDivElement` | Direct ref forwarding |
| `InteractiveCard` | `HTMLDivElement` | Direct ref forwarding |
| `InteractiveButton` | `HTMLButtonElement` | Direct ref forwarding |
| `OutputPreferenceSelector` | Custom ref type | Uncontrolled variant with imperative handle |
| `CalendarIntegration` | `HTMLDivElement` | Direct ref forwarding |
| `DocumentIntegration` | `HTMLDivElement` | Direct ref forwarding |
| `EmailIntegration` | `HTMLDivElement` | Direct ref forwarding |

### Components Not Migrated

The `@clarity-chat/primitives` package continues to use `forwardRef`. These are shadcn/ui-based components that wrap Radix UI primitives, which require `forwardRef` for proper functioning.

## Migration Guide for Consumers

### Basic Usage (No Change Required)

If you're simply passing refs to these components, no changes are needed:

```tsx
// This still works exactly the same
const ref = useRef<HTMLDivElement>(null)
<CommandPalette ref={ref} {...props} />
```

### Wrapper Components

If you have wrapper components using `forwardRef`, you can migrate them to the ref-as-prop pattern:

```tsx
// Before (React 18)
import { forwardRef } from 'react'
import { CommandPalette } from '@clarity-chat/react'

interface MyPaletteProps {
  items: CommandItem[]
  onClose: () => void
}

const MyPalette = forwardRef<HTMLDivElement, MyPaletteProps>((props, ref) => (
  <div className="my-wrapper">
    <CommandPalette ref={ref} open={true} {...props} />
  </div>
))
```

```tsx
// After (React 19)
import { CommandPalette } from '@clarity-chat/react'

interface MyPaletteProps {
  items: CommandItem[]
  onClose: () => void
  ref?: React.Ref<HTMLDivElement>
}

function MyPalette({ ref, ...props }: MyPaletteProps) {
  return (
    <div className="my-wrapper">
      <CommandPalette ref={ref} open={true} {...props} />
    </div>
  )
}
```

### TypeScript Typing

The ref type is now part of the props interface:

```tsx
// Component props now include ref
interface KeyboardHintProps {
  shortcuts: KeyboardHintShortcut[]
  visible: boolean
  onClose?: () => void
  className?: string
  ref?: React.Ref<HTMLDivElement>  // New in React 19
}
```

## New Utilities

### `useMergedRef`

When you need to use both an internal ref and accept an external ref, use the new `useMergedRef` hook:

```tsx
import { useMergedRef } from '@clarity-chat/react'

interface MyInputProps {
  ref?: React.Ref<HTMLInputElement>
  autoFocus?: boolean
}

function MyInput({ ref, autoFocus }: MyInputProps) {
  const internalRef = useRef<HTMLInputElement>(null)
  const mergedRef = useMergedRef(internalRef, ref)

  useEffect(() => {
    if (autoFocus) {
      internalRef.current?.focus()
    }
  }, [autoFocus])

  return <input ref={mergedRef} />
}
```

### `mergeRefs`

For non-hook scenarios (e.g., in render props or event handlers):

```tsx
import { mergeRefs } from '@clarity-chat/react'

const combinedRef = mergeRefs(ref1, ref2, ref3)
```

### `useMergedRefWithCleanup`

For components using ResizeObserver, IntersectionObserver, or other APIs that need cleanup:

```tsx
import { useMergedRefWithCleanup } from '@clarity-chat/react'

function ObservedComponent({ ref }: { ref?: React.Ref<HTMLDivElement> }) {
  const internalRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<ResizeObserver | null>(null)

  const mergedRef = useMergedRefWithCleanup(
    [internalRef, ref],
    () => {
      // Cleanup function - called when element unmounts
      observerRef.current?.disconnect()
    }
  )

  useEffect(() => {
    if (internalRef.current) {
      observerRef.current = new ResizeObserver((entries) => {
        // Handle resize
      })
      observerRef.current.observe(internalRef.current)
    }
  }, [])

  return <div ref={mergedRef}>...</div>
}
```

## Common Patterns

### Conditional Rendering with AnimatePresence

Some components (like `KeyboardHint`) use `AnimatePresence` and only render when visible. The ref will be `null` when the component isn't rendered:

```tsx
const ref = useRef<HTMLDivElement>(null)

// ref.current is null when visible={false}
<KeyboardHint shortcuts={shortcuts} visible={false} ref={ref} />

// ref.current is set when visible={true}
<KeyboardHint shortcuts={shortcuts} visible={true} ref={ref} />
```

### React.memo with Refs

When using `React.memo` with custom comparison, include the ref in the comparison:

```tsx
const MyComponent = React.memo(MyComponentInner, (prev, next) => {
  return (
    prev.value === next.value &&
    prev.className === next.className &&
    prev.ref === next.ref  // Include ref comparison
  )
})
```

## Troubleshooting

### Ref is null when expected to have value

1. Check if the component uses `AnimatePresence` or conditional rendering
2. Ensure the component is actually mounted in the DOM
3. Verify the ref type matches the component's expected element type

### TypeScript errors with ref prop

Ensure you're using the correct ref type:

```tsx
// Wrong - using generic Ref
ref?: React.Ref<Element>

// Correct - use specific element type
ref?: React.Ref<HTMLDivElement>
```

### Ref not updating on re-render

If using `React.memo`, ensure your custom comparison function includes the ref:

```tsx
// Bad - ref changes won't trigger re-render
(prev, next) => prev.value === next.value

// Good - ref changes will trigger re-render
(prev, next) => prev.value === next.value && prev.ref === next.ref
```

## Development Warnings

In development mode, the `useMergedRef` hook will warn if an invalid ref type is passed:

```
[useMergedRef] Invalid ref at index 1. Expected a callback function,
an object with a 'current' property, null, or undefined. Received: string
```

This warning is stripped in production builds.

## Further Reading

- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
- [React RFC: Ref as Prop](https://github.com/reactjs/rfcs/pull/107)
- [Clarity Chat React API Reference](./API_REFERENCE.md)
