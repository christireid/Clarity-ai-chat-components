# Accessibility Guide

Complete guide to accessibility features in Clarity Chat components, ensuring WCAG 2.1 AA
compliance.

## Overview

Clarity Chat provides comprehensive accessibility support across all interactive components. This
guide covers keyboard navigation, screen reader support, focus management, and reduced motion
preferences.

## Core Accessibility Patterns

### 1. Keyboard Navigation

All interactive components support full keyboard navigation following WAI-ARIA best practices.

#### Navigation Keys

| Key               | Action                                                 |
| ----------------- | ------------------------------------------------------ |
| `Tab`             | Move focus to next focusable element                   |
| `Shift + Tab`     | Move focus to previous focusable element               |
| `Arrow Keys`      | Navigate within composite widgets (menus, tabs, lists) |
| `Home`            | Jump to first item in a list/menu                      |
| `End`             | Jump to last item in a list/menu                       |
| `Enter` / `Space` | Activate focused element                               |
| `Escape`          | Close dialogs, dropdowns, and modals                   |

#### Component-Specific Patterns

**Tabs Component**

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@clarity-chat/react'

;<Tabs defaultValue="tab1" orientation="horizontal">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

- Arrow keys navigate between tabs
- `Home` / `End` jump to first/last tab
- Roving tabindex ensures only active tab is in tab order
- `aria-controls` links tabs to their panels

**Dropdown/Listbox Pattern**

```tsx
import { ModelSelector } from '@clarity-chat/react'

;<ModelSelector
  models={models}
  value={selectedModel}
  onChange={handleChange}
  aria-label="Select AI model"
/>
```

- `Arrow Up/Down` navigates options
- `Enter` / `Space` selects option
- `Escape` closes dropdown
- `aria-activedescendant` provides virtual focus

**Radiogroup Pattern**

```tsx
import { ThemeSelector } from '@clarity-chat/react'

;<ThemeSelector orientation="vertical" onThemeChange={handleThemeChange} />
```

- Arrow keys navigate options
- Selection moves with focus (WAI-ARIA radiogroup pattern)
- Roving tabindex for focus management

### 2. ARIA Attributes

All components use proper ARIA attributes for screen reader compatibility.

#### Common Patterns

**Expandable Elements**

```tsx
<button aria-expanded={isOpen} aria-controls="content-id" aria-haspopup="listbox">
  Toggle
</button>
```

**Selection State**

```tsx
<div role="option" aria-selected={isSelected}>
  Option
</div>
```

**Live Regions**

```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### 3. Focus Management

#### Focus Trap

Dialogs and modals trap focus to prevent users from accidentally leaving:

```tsx
import { useFocusTrap } from '@clarity-chat/react'

function Dialog({ isOpen, children }) {
  const dialogRef = useFocusTrap(isOpen)

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true">
      {children}
    </div>
  )
}
```

#### Focus Restoration

When closing dialogs, focus returns to the trigger element:

```tsx
import { useFocusRestoration } from '@clarity-chat/react'

function Modal({ isOpen, onClose }) {
  useFocusRestoration(isOpen)
  // Focus automatically restores when isOpen becomes false
}
```

#### Roving Tab Index

For composite widgets, only the active item is in the tab order:

```tsx
import { useRovingTabIndex } from '@clarity-chat/react'

function Toolbar() {
  const { activeIndex, handleKeyDown } = useRovingTabIndex({
    itemCount: 5,
    orientation: 'horizontal',
  })

  return (
    <div role="toolbar" onKeyDown={handleKeyDown}>
      {items.map((item, i) => (
        <button key={i} tabIndex={i === activeIndex ? 0 : -1}>
          {item}
        </button>
      ))}
    </div>
  )
}
```

### 4. Reduced Motion Support

All animations respect `prefers-reduced-motion` media query:

```tsx
import { useReducedMotion } from '@clarity-chat/primitives'

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion()

  const variants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

  return <motion.div variants={variants} />
}
```

Components with reduced motion support:

- `FloatingChatWidget` - Simplified fade transitions
- `ModelSelector` - Instant dropdown appearance
- `ThemeSelectorDropdown` - No scale/slide animations
- `VoiceInput` - Static waveform indicator
- `Draggable` / `DropZone` - No scale/rotate animations
- `InteractiveCard` - Static ripple alternative

## Component Accessibility Reference

### Chat Components

| Component            | Keyboard Support                         | Screen Reader                         | Reduced Motion |
| -------------------- | ---------------------------------------- | ------------------------------------- | -------------- |
| `ChatInput`          | Enter to submit, Shift+Enter for newline | Live region for character count       | N/A            |
| `FloatingChatWidget` | Escape to close, focus trap              | Dialog role, live region for messages | Yes            |
| `MessageList`        | Tab navigation                           | Log role with polite announcements    | N/A            |

### Navigation Components

| Component        | Keyboard Support              | Screen Reader              | Reduced Motion |
| ---------------- | ----------------------------- | -------------------------- | -------------- |
| `Tabs`           | Arrow keys, Home/End          | Tablist/tab/tabpanel roles | N/A            |
| `CommandPalette` | Arrow keys, Enter, Escape     | Combobox pattern           | Yes            |
| `ContextMenu`    | Arrow keys, type-ahead search | Menu/menuitem roles        | N/A            |

### Selector Components

| Component                  | Keyboard Support          | Screen Reader      | Reduced Motion |
| -------------------------- | ------------------------- | ------------------ | -------------- |
| `ModelSelector`            | Arrow keys, Enter, Escape | Listbox pattern    | Yes            |
| `ThemeSelector`            | Arrow keys, Home/End      | Radiogroup pattern | N/A            |
| `ThemeSelectorDropdown`    | Arrow keys, Enter, Escape | Listbox pattern    | N/A            |
| `OutputPreferenceSelector` | Arrow keys                | Radiogroup pattern | Yes            |

### UI Components

| Component             | Keyboard Support        | Screen Reader                  | Reduced Motion |
| --------------------- | ----------------------- | ------------------------------ | -------------- |
| `CollapsibleSection`  | Enter/Space to toggle   | aria-expanded, aria-controls   | Yes            |
| `InteractiveCard`     | Enter/Space to activate | Button role                    | Yes            |
| `InteractiveListItem` | Enter/Space to select   | Button role with aria-selected | Yes            |
| `Draggable`           | N/A (mouse only)        | aria-grabbed, aria-disabled    | Yes            |

### Input Components

| Component    | Keyboard Support     | Screen Reader              | Reduced Motion |
| ------------ | -------------------- | -------------------------- | -------------- |
| `VoiceInput` | Enter to toggle      | Live region for transcript | Yes            |
| `FileUpload` | Enter to open picker | Button with file input     | N/A            |

## Testing Accessibility

### Automated Testing

Run the accessibility linter:

```bash
pnpm lint
```

### Manual Testing Checklist

1. **Keyboard Navigation**
   - [ ] All interactive elements are reachable via Tab
   - [ ] Arrow keys work in composite widgets
   - [ ] Escape closes modals/dropdowns
   - [ ] Focus is visible at all times

2. **Screen Reader**
   - [ ] All elements have accessible names
   - [ ] Dynamic content is announced
   - [ ] Form errors are announced
   - [ ] Loading states are announced

3. **Reduced Motion**
   - [ ] Enable "Reduce motion" in OS settings
   - [ ] Verify animations are simplified/removed
   - [ ] Content remains fully functional

4. **Color Contrast**
   - [ ] Text meets 4.5:1 contrast ratio
   - [ ] UI components meet 3:1 contrast ratio
   - [ ] Focus indicators are clearly visible

## Accessibility Hooks

### `useFocusTrap`

Traps focus within a container:

```tsx
const ref = useFocusTrap(isActive)
```

### `useFocusRestoration`

Restores focus when component unmounts:

```tsx
useFocusRestoration(isOpen)
```

### `useRovingTabIndex`

Manages roving tabindex for composite widgets:

```tsx
const { activeIndex, handleKeyDown, setActiveIndex } = useRovingTabIndex({
  itemCount: items.length,
  orientation: 'horizontal',
  loop: true,
})
```

### `useFocusVisible`

Detects keyboard vs mouse focus:

```tsx
const isFocusVisible = useFocusVisible()
```

### `useReducedMotion`

Detects user's reduced motion preference:

```tsx
const prefersReducedMotion = useReducedMotion()
```

## Best Practices

1. **Always provide accessible names**
   - Use `aria-label` for icon buttons
   - Use `aria-labelledby` for sections with visible headings

2. **Announce dynamic content**
   - Use `aria-live="polite"` for status updates
   - Use `aria-live="assertive"` for critical errors

3. **Manage focus appropriately**
   - Move focus to new content (dialogs, modals)
   - Restore focus when closing overlays
   - Never trap focus unexpectedly

4. **Support keyboard alternatives**
   - Provide keyboard equivalents for mouse interactions
   - Use standard key bindings users expect

5. **Respect user preferences**
   - Honor `prefers-reduced-motion`
   - Support high contrast mode
   - Allow font size scaling

## WCAG 2.1 Compliance

Clarity Chat components target WCAG 2.1 Level AA compliance:

- **1.1 Text Alternatives** - Images have alt text, icons have labels
- **1.3 Adaptable** - Semantic HTML, proper ARIA roles
- **1.4 Distinguishable** - Sufficient contrast, resize support
- **2.1 Keyboard Accessible** - All functionality via keyboard
- **2.4 Navigable** - Skip links, focus management
- **4.1 Compatible** - Valid HTML, proper ARIA usage

## Related Documentation

- [Best Practices Guide](./best-practices.md)
- [Integration Guide](./integration-guide.md)
- [Component API Reference](../api/react-components.md)
