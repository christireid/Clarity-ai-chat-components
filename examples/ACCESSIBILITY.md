# Accessibility Guide for Clarity Chat Examples

This guide documents accessibility requirements and patterns for all example applications in the Clarity Chat codebase.

## Quick Reference

| Pattern | When to Use | Implementation |
|---------|-------------|----------------|
| Clickable div | Avoid! Use `<button>` | If unavoidable, see [Clickable Non-Button Elements](#clickable-non-button-elements) |
| Modal/Dialog | Overlay content | See [Modal Accessibility](#modal-accessibility) |
| Icon-only button | Close, delete, etc. | Add `aria-label="descriptive text"` |
| Dynamic content | Announcements | Use `aria-live` regions |
| Focus management | Modal open/close | See [Focus Management](#focus-management) |

## Core Principles

### 1. Semantic HTML First

Always prefer semantic HTML elements over generic divs with ARIA:

```tsx
// ✅ GOOD - Semantic HTML
<button onClick={handleClick}>Submit</button>

// ❌ BAD - Div as button
<div onClick={handleClick}>Submit</div>
```

### 2. Keyboard Navigation

All interactive elements must be keyboard accessible:
- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons
- **Escape**: Close modals/dropdowns
- **Arrow keys**: Navigate within components (lists, menus)

### 3. Screen Reader Support

- All images need `alt` text
- All form inputs need labels
- All icon-only buttons need `aria-label`
- Dynamic content needs `aria-live` announcements

---

## Patterns

### Clickable Non-Button Elements

When you must use a non-button element as a button (avoid if possible):

```tsx
import { accessibleClickHandler } from './utils/accessibility'

// Option 1: Use the utility function
function ClickableCard({ onClick, children }) {
  return (
    <div
      {...accessibleClickHandler(onClick)}
      className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {children}
    </div>
  )
}

// Option 2: Manual implementation
function ManualClickableCard({ onClick, children }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(e)
        }
      }}
      className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {children}
    </div>
  )
}
```

**Checklist for clickable divs:**
- [ ] `role="button"`
- [ ] `tabIndex={0}`
- [ ] `onClick` handler
- [ ] `onKeyDown` handler for Enter and Space
- [ ] Visible focus indicator (`focus:ring-*`)

### Modal Accessibility

Modals require comprehensive accessibility support:

```tsx
import { useFocusTrap, useEscapeKey } from './utils/accessibility'

function AccessibleModal({ isOpen, onClose, children }) {
  const { containerRef } = useFocusTrap({ enabled: isOpen })
  useEscapeKey(onClose, isOpen)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">Modal Title</h2>
        <button
          onClick={onClose}
          aria-label="Close modal"
          autoFocus
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
```

**Checklist for modals:**
- [ ] `role="dialog"` on the content container
- [ ] `aria-modal="true"`
- [ ] `aria-labelledby` pointing to the title
- [ ] Focus trap to keep focus within modal
- [ ] Escape key closes the modal
- [ ] Focus returns to trigger element on close
- [ ] Auto-focus on first focusable element (usually close button)
- [ ] Backdrop click closes modal (with `role="presentation"`)

### Icon-Only Buttons

Buttons with only icons need descriptive labels:

```tsx
// ✅ GOOD - With aria-label
<button
  onClick={onClose}
  aria-label="Close dialog"
  className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
>
  ✕
</button>

// ✅ GOOD - With visually hidden text
<button
  onClick={onDelete}
  className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
>
  <TrashIcon aria-hidden="true" />
  <span className="sr-only">Delete message</span>
</button>

// ❌ BAD - No accessible name
<button onClick={onClose}>✕</button>
```

### Focus Management

Use the provided hooks for focus management:

```tsx
import { useFocusTrap, useAutoFocus, useEscapeKey } from './utils/accessibility'

function SearchDialog({ isOpen, onClose }) {
  // Trap focus within the dialog
  const { containerRef } = useFocusTrap({ enabled: isOpen })

  // Auto-focus the search input
  const inputRef = useAutoFocus<HTMLInputElement>(isOpen)

  // Close on Escape
  useEscapeKey(onClose, isOpen)

  return (
    <div ref={containerRef} role="dialog">
      <input ref={inputRef} type="search" placeholder="Search..." />
    </div>
  )
}
```

### Dynamic Content Announcements

For content that changes dynamically:

```tsx
import { announceToScreenReader } from './utils/accessibility'

function FormSubmitButton() {
  const handleSubmit = async () => {
    try {
      await submitForm()
      announceToScreenReader('Form submitted successfully')
    } catch (error) {
      announceToScreenReader('Form submission failed', 'assertive')
    }
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

---

## Utility Functions

The `examples/utils/accessibility.ts` file provides these utilities:

### `accessibleClickHandler(handler)`

Returns props for making a div clickable:
- `role="button"`
- `tabIndex={0}`
- `onClick`
- `onKeyDown` (Enter/Space)

### `useFocusTrap(options)`

Hook that traps focus within a container:
- Returns `containerRef` to attach to the container
- Options: `enabled`, `autoFocus`, `returnFocus`

### `useAutoFocus(condition)`

Hook that auto-focuses an element when a condition is met:
- Returns ref to attach to the element
- Focuses when `condition` changes to `true`

### `useEscapeKey(handler, enabled)`

Hook that calls handler when Escape is pressed:
- Pass `enabled: false` to disable

### `announceToScreenReader(message, priority)`

Announces a message to screen readers:
- `priority: 'polite'` (default) - waits for current speech
- `priority: 'assertive'` - interrupts current speech

---

## Testing Accessibility

### Manual Testing Checklist

- [ ] Tab through all interactive elements
- [ ] Verify focus indicators are visible
- [ ] Test with screen reader (VoiceOver, NVDA)
- [ ] Verify Escape closes modals/dropdowns
- [ ] Verify Enter/Space activates buttons
- [ ] Check color contrast (4.5:1 for text)
- [ ] Test without mouse

### Automated Testing

Consider adding these tools:
- `@axe-core/react` - Runtime accessibility checks
- `jest-axe` - Accessibility assertions in tests
- `eslint-plugin-jsx-a11y` - Lint for accessibility issues

---

## Common Mistakes

### 1. Missing focus indicators

```tsx
// ❌ BAD - No visible focus
<button className="text-white bg-blue-500">Click</button>

// ✅ GOOD - Visible focus ring
<button className="text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300">
  Click
</button>
```

### 2. Using div instead of button

```tsx
// ❌ BAD
<div onClick={handleClick}>Click me</div>

// ✅ GOOD
<button onClick={handleClick}>Click me</button>
```

### 3. Missing aria-label on icon buttons

```tsx
// ❌ BAD
<button onClick={onClose}>✕</button>

// ✅ GOOD
<button onClick={onClose} aria-label="Close">✕</button>
```

### 4. Modal without focus trap

```tsx
// ❌ BAD - Focus can escape modal
<div role="dialog">
  <button>Close</button>
</div>

// ✅ GOOD - Focus trapped
<div role="dialog" aria-modal="true">
  {/* Focus trap implemented */}
</div>
```

---

## Keyboard Shortcuts Reference

### Global Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Tab` | Move focus to next element | All |
| `Shift+Tab` | Move focus to previous element | All |
| `Escape` | Close modal/dropdown/overlay | Modal, dropdown |
| `Enter` | Activate button/link | Button, link |
| `Space` | Activate button, toggle checkbox | Button, checkbox |

### Modal/Dialog Shortcuts

| Shortcut | Action |
|----------|--------|
| `Escape` | Close modal and return focus to trigger |
| `Tab` | Cycle through focusable elements (trapped) |
| `Shift+Tab` | Cycle backwards through elements |

### List/Menu Navigation

| Shortcut | Action |
|----------|--------|
| `Arrow Down` | Move to next item |
| `Arrow Up` | Move to previous item |
| `Home` | Jump to first item |
| `End` | Jump to last item |
| `Enter` / `Space` | Select current item |

### Form Controls

| Shortcut | Action |
|----------|--------|
| `Enter` | Submit form (in text input) |
| `Escape` | Clear input / Cancel edit |
| `Tab` | Move to next field |

### Chat Interface Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Send message (multi-line mode) |
| `Enter` | Send message (single-line mode) |
| `Arrow Up` | Edit last message (when input empty) |
| `Escape` | Cancel editing / Clear input |

### Implementing Custom Shortcuts

```tsx
import { useEffect } from 'react'

function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === key &&
        (!options.ctrl || e.ctrlKey || e.metaKey) &&
        (!options.shift || e.shiftKey) &&
        (!options.alt || e.altKey)
      ) {
        e.preventDefault()
        callback()
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [key, callback, options.ctrl, options.shift, options.alt])
}

// Usage
function ChatInput() {
  useKeyboardShortcut('Enter', sendMessage, { ctrl: true })
  // ...
}
```

---

## Interactive Demo

For a hands-on demonstration of accessibility features, see the interactive demo:

```tsx
import { AccessibilityDemo } from './examples/advanced-features/accessibility-demo'
```

The demo includes:
- Accessible click handlers for non-button elements
- Focus trap implementation for modals
- Auto-focus behavior
- Escape key handling
- Screen reader announcements
- Keyboard navigation patterns

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility Docs](https://react.dev/reference/react-dom/components#form-components)
- [MDN ARIA Authoring Practices](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Last Updated:** December 9, 2025
