# Accessibility Documentation

## WCAG 2.1 AA Compliance

This documentation site is built to meet **WCAG 2.1 Level AA** compliance standards, ensuring an inclusive experience for all users.

## Accessibility Features

### 1. Semantic HTML (WCAG 1.3.1)

All pages use proper semantic HTML5 elements:

```html
<header role="banner">
  <nav aria-label="Main navigation">...</nav>
</header>

<main id="main-content" role="main">
  <article>
    <h1>Page Title</h1>
    <section aria-labelledby="section-heading">
      <h2 id="section-heading">Section Title</h2>
      ...
    </section>
  </article>
</main>

<footer role="contentinfo">...</footer>
```

### 2. Keyboard Navigation (WCAG 2.1.1, 2.1.2)

#### Full Keyboard Support

- **Tab**: Navigate forward through interactive elements
- **Shift + Tab**: Navigate backward through interactive elements
- **Enter**: Activate buttons and links
- **Space**: Activate buttons and checkboxes
- **Escape**: Close modals and dialogs
- **Arrow Keys**: Navigate within menus and lists

#### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` or `Ctrl+K` | Open search dialog |
| `⌘.` or `Ctrl+.` | Toggle AI assistant |
| `?` | Show keyboard shortcuts |
| `Escape` | Close dialog/menu |

### 3. Skip Links (WCAG 2.4.1)

Skip to main content link appears on focus:

```tsx
<a href="#main-content" className="skip-to-content">
  Skip to content
</a>
```

Press `Tab` on any page to reveal the skip link.

### 4. Focus Management (WCAG 2.4.7)

#### Visible Focus Indicators

All interactive elements have clear focus indicators:

```css
*:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}
```

#### Focus Trap in Modals

Modals and dialogs trap focus to prevent keyboard users from leaving:

```tsx
const dialogRef = useFocusTrap(isOpen, {
  returnFocus: true,
  escapeDeactivates: true,
})
```

### 5. Screen Reader Support

#### ARIA Labels and Descriptions

```tsx
// Button with accessible name
<button aria-label="Close dialog">
  <X className="w-5 h-5" />
</button>

// Section with aria-labelledby
<section aria-labelledby="features-heading">
  <h2 id="features-heading">Features</h2>
  ...
</section>
```

#### Live Regions for Dynamic Content

```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {announcement}
</div>
```

#### Screen Reader Only Content

```tsx
<span className="sr-only">
  Loading, please wait
</span>
```

### 6. Color Contrast (WCAG 1.4.3)

All text meets WCAG AA contrast requirements:

- **Normal text**: 4.5:1 minimum
- **Large text (18pt+)**: 3:1 minimum
- **UI components**: 3:1 minimum

#### Color Contrast Ratios

| Element | Light Mode | Dark Mode | Ratio |
|---------|-----------|-----------|-------|
| Body text | #0a0a0b on #fafafa | #f8f8fa on #050506 | 17.8:1 |
| Secondary text | #525252 on #fafafa | #a0a0ab on #050506 | 4.54:1 |
| Tertiary text | #666666 on #fafafa | #8b8b9a on #050506 | 5.74:1 |
| Brand color | #6366f1 on #ffffff | #818cf8 on #000000 | 4.5:1 |

### 7. Reduced Motion Support (WCAG 2.3.3)

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Users can also enable reduced motion manually in the accessibility menu.

### 8. Touch Target Size (WCAG 2.5.5)

All interactive elements have minimum 44x44px touch targets:

```css
button,
a,
input[type="checkbox"],
input[type="radio"],
select {
  min-width: 44px;
  min-height: 44px;
}
```

### 9. Form Accessibility (WCAG 3.3.1, 3.3.2)

#### Labeled Inputs

```tsx
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-helper"
/>
<p id="email-helper" className="helper-text">
  We'll never share your email
</p>
```

#### Error Handling

```tsx
<input
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
{hasError && (
  <div id="email-error" role="alert" className="error-message">
    Please enter a valid email address
  </div>
)}
```

### 10. ARIA Patterns

#### Dialog/Modal

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure you want to proceed?</p>
  ...
</div>
```

#### Disclosure Widget

```tsx
<button
  aria-expanded={isOpen}
  aria-controls="panel-id"
  onClick={toggle}
>
  Toggle Details
</button>
<div id="panel-id" hidden={!isOpen}>
  Details content
</div>
```

#### Tabs

```tsx
<div role="tablist" aria-label="Code examples">
  <button
    role="tab"
    aria-selected={isSelected}
    aria-controls="panel-1"
    id="tab-1"
  >
    JavaScript
  </button>
</div>
<div
  role="tabpanel"
  id="panel-1"
  aria-labelledby="tab-1"
>
  Code content
</div>
```

## Accessibility Utilities

### Hooks

```tsx
import {
  useFocusTrap,
  useAnnounce,
  useKeyboardShortcut,
  useReducedMotion,
  useDisclosure,
} from '@/hooks/useAccessibility'

// Focus trap in modal
const dialogRef = useFocusTrap(isOpen)

// Announce to screen readers
const announce = useAnnounce()
announce('Search results updated')

// Keyboard shortcuts
useKeyboardShortcut('k', openSearch, {
  requireModifier: 'meta',
  preventDefault: true,
})

// Detect reduced motion preference
const shouldReduceMotion = useReducedMotion()

// Accessible disclosure
const { isOpen, buttonProps, panelProps } = useDisclosure()
```

### Helper Functions

```tsx
import {
  announceToScreenReader,
  createFocusTrap,
  checkColorContrast,
  getAccessibleName,
} from '@/lib/accessibility'

// Announce to screen readers
announceToScreenReader('Page loaded', 'polite')

// Check color contrast
const contrast = checkColorContrast('#6366f1', '#ffffff')
console.log(contrast.AA) // true if meets WCAG AA

// Get accessible name of element
const name = getAccessibleName(element)
```

## Testing Accessibility

### Automated Testing

We use multiple tools to ensure accessibility:

1. **axe-core** - Automated WCAG testing
2. **Lighthouse** - Accessibility audit
3. **Pa11y** - CLI accessibility testing

```bash
# Run accessibility tests
npm run test:a11y

# Run Lighthouse audit
npm run lighthouse

# Run Pa11y
npm run pa11y
```

### Manual Testing

#### Screen Readers

Test with the following screen readers:

- **macOS**: VoiceOver (`Cmd+F5`)
- **Windows**: NVDA (free) or JAWS
- **Mobile**: TalkBack (Android) or VoiceOver (iOS)

#### Keyboard Navigation

1. Disconnect mouse
2. Navigate entire site using only keyboard
3. Verify all functionality is accessible
4. Check focus indicators are visible

#### Browser DevTools

1. Chrome DevTools > Lighthouse > Accessibility
2. Chrome DevTools > Elements > Accessibility pane
3. Firefox Developer Tools > Accessibility Inspector

### Development Tools

#### Accessibility Audit Component

In development mode, the accessibility audit tool is available:

```tsx
import { AccessibilityAudit } from '@/components/Accessibility/AccessibilityAudit'

// In layout or app component
<AccessibilityAudit />
```

Click the purple button in the bottom-left corner to view accessibility issues.

## Common Patterns

### Accessible Button

```tsx
<button
  type="button"
  aria-label="Close dialog"
  onClick={handleClose}
  className="focus-visible:ring-2 focus-visible:ring-brand-500"
>
  <X className="w-5 h-5" aria-hidden="true" />
</button>
```

### Accessible Link

```tsx
<a
  href="/docs"
  className="focus-visible:ring-2 focus-visible:ring-brand-500"
>
  Read documentation
  <span className="sr-only"> about accessibility features</span>
</a>
```

### Accessible Image

```tsx
<img
  src="/hero.png"
  alt="Dashboard showing chat analytics and metrics"
  loading="lazy"
/>

{/* Decorative image */}
<img
  src="/decoration.png"
  alt=""
  role="presentation"
/>
```

### Accessible Form

```tsx
<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="name">
      Full Name <span className="required">*</span>
    </label>
    <input
      id="name"
      type="text"
      required
      aria-required="true"
      aria-invalid={errors.name ? 'true' : 'false'}
      aria-describedby={errors.name ? 'name-error' : 'name-helper'}
    />
    <p id="name-helper" className="helper-text">
      Enter your first and last name
    </p>
    {errors.name && (
      <p id="name-error" role="alert" className="error-message">
        {errors.name}
      </p>
    )}
  </div>
</form>
```

## Resources

### WCAG Guidelines

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)
- [How to Meet WCAG](https://www.w3.org/WAI/WCAG21/quickref/)

### ARIA Authoring Practices

- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)

### Testing Tools

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Pa11y](https://pa11y.org/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Learning Resources

- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Reporting Issues

If you encounter any accessibility issues, please report them:

1. Open an issue on GitHub
2. Include:
   - Page URL
   - Browser and version
   - Assistive technology used
   - Expected behavior
   - Actual behavior
   - Steps to reproduce

We are committed to maintaining WCAG 2.1 AA compliance and will address issues promptly.
