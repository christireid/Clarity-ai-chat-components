# Accessibility Fixes - Quick Reference

**Priority**: Fix before production release
**Estimated Time**: 3 hours total

---

## 🔴 CRITICAL FIXES (Must Do)

### 1. MentionSystem ARIA Attributes (30 min)

**File**: `packages/react/src/components/input/MentionSystem.tsx`

**Add to textarea** (Line ~310):
```tsx
<textarea
  // ... existing props
  aria-label="Message input with mention support"
  aria-autocomplete="list"
  aria-expanded={showSuggestions}
  aria-controls="mention-suggestions"
  aria-activedescendant={showSuggestions ? `mention-option-${selectedIndex}` : undefined}
/>
```

**Add to suggestions container** (Line ~326):
```tsx
<div
  ref={suggestionsRef}
  id="mention-suggestions"
  role="listbox"
  aria-label="User mention suggestions"
  className="absolute bottom-full mb-2 left-0 right-0 max-h-64 overflow-y-auto scrollbar-hide glass-strong rounded-2xl shadow-lg z-50"
>
```

**Add to each suggestion** (Line ~328):
```tsx
<button
  key={user.id}
  id={`mention-option-${index}`}
  role="option"
  aria-selected={index === selectedIndex}
  onClick={() => insertMention(user)}
  // ... existing className
>
```

---

### 2. Message Actions ARIA Labels (20 min)

**File**: `apps/component-showcase/app/messages/page.tsx`

**Add labels to icon buttons** (Lines ~346-371):
```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8"
  aria-label="Like message"
>
  <ThumbsUp className="h-4 w-4" aria-hidden="true" />
</Button>

<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8"
  aria-label="Dislike message"
>
  <ThumbsDown className="h-4 w-4" aria-hidden="true" />
</Button>

<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8"
  onClick={() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }}
  aria-label={copied ? "Copied to clipboard" : "Copy message"}
>
  {copied ? (
    <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
  ) : (
    <Copy className="h-4 w-4" aria-hidden="true" />
  )}
</Button>

<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8"
  aria-label="Regenerate response"
>
  <RefreshCw className="h-4 w-4" aria-hidden="true" />
</Button>

<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8"
  aria-label="More actions"
>
  <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
</Button>
```

**Add live region for copy feedback**:
```tsx
<div role="status" aria-live="polite" className="sr-only">
  {copied && "Message copied to clipboard"}
</div>
```

---

### 3. Button Focus on Glass (45 min)

**File**: `packages/primitives/src/components/ui/button.tsx`

**Add glass context variant**:
```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // ... existing variants
      },
      size: {
        // ... existing sizes
      },
      glassContext: {
        true: 'focus-visible:ring-offset-0 focus-visible:ring-primary focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb)/0.3)]',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      glassContext: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glassContext, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, glassContext, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

**Usage in glass contexts**:
```tsx
<Button variant="ghost" size="icon" glassContext={true}>
  <Icon />
</Button>
```

---

## ⚠️ HIGH PRIORITY FIXES

### 4. Glass-Subtle Dark Mode (5 min)

**File**: `apps/component-showcase/app/globals.css`

**Line 250-252**:
```css
.glass-subtle {
  /* Change from dark:bg-white/[0.02] to dark:bg-white/5 */
  @apply bg-white/40 dark:bg-white/5 backdrop-blur-lg border border-white/10 dark:border-white/5;
}
```

---

### 5. Muted Text on Glass (15 min)

**File**: `apps/component-showcase/app/globals.css`

**Add after line 574**:
```css
/* Enhanced contrast for text on glass backgrounds */
.glass .text-muted-on-glass,
.glass-subtle .text-muted-on-glass,
.glass-strong .text-muted-on-glass {
  @apply text-foreground/70 dark:text-foreground/80;
}
```

**Update SlashCommandMenu** (Line ~263, ~319):
```tsx
// Change from text-muted-foreground to text-muted-on-glass
<div className="px-2 py-1.5 text-xs font-semibold text-muted-on-glass uppercase tracking-wide">
  {category}
</div>

<p className="text-xs text-muted-on-glass truncate">
  {cmd.description}
</p>
```

---

### 6. Dark Mode Muted Foreground (5 min)

**File**: `apps/component-showcase/app/globals.css`

**Line 45**:
```css
.dark {
  /* ... */
  --muted-foreground: 215 20.2% 70%; /* Changed from 65.1% */
  /* ... */
}
```

---

## 🟡 MEDIUM PRIORITY (Nice to Have)

### 7. Selection Visual Indicator (20 min)

**File**: `packages/react/src/components/input/MentionSystem.tsx`

**Add to selected option** (after line ~407):
```tsx
{index === selectedIndex && (
  <motion.div
    layoutId="mention-selection-indicator"
    className="w-1.5 h-1.5 rounded-full bg-primary"
    transition={{
      type: 'spring',
      stiffness: 500,
      damping: 30,
    }}
  />
)}
```

---

### 8. Border Contrast in Headers (5 min)

**File**: `packages/react/src/components/chat/SlashCommandMenu.tsx`

**Line 231**:
```tsx
// Change from border-white/10 dark:border-white/5 to border-white/15 dark:border-white/10
<div className="sticky top-0 glass-subtle border-b border-white/15 dark:border-white/10 px-3 py-2.5">
```

---

### 9. Message Status Semantics (15 min)

**File**: `apps/component-showcase/app/messages/page.tsx`

**Wrap status icons** (Lines ~131-156):
```tsx
<div role="status" aria-label="Message sending">
  <Clock className="h-3 w-3 opacity-70" aria-hidden="true" />
</div>

<div role="status" aria-label="Message delivered">
  <Check className="h-3 w-3 opacity-70" aria-hidden="true" />
</div>

<div role="status" aria-label="Message read">
  <CheckCheck className="h-3 w-3 text-blue-300" aria-hidden="true" />
</div>
```

---

## Testing Checklist

After implementing fixes, verify:

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work in SlashCommandMenu
- [ ] Arrow keys work in MentionSystem
- [ ] Escape closes menus
- [ ] No keyboard traps

### Screen Reader
- [ ] All buttons have labels
- [ ] Menu roles are announced
- [ ] Selected states are announced
- [ ] Live regions work (copy feedback)
- [ ] Status icons are announced

### Visual
- [ ] Focus rings visible on all elements
- [ ] Focus rings visible on glass backgrounds
- [ ] Text readable on all glass variants
- [ ] Dark mode contrast sufficient
- [ ] Borders visible in all modes

### Automated
```bash
# Install axe DevTools browser extension
# Or run via CLI:
npm install -g @axe-core/cli
axe http://localhost:3000/messages --tags wcag2a,wcag2aa
```

Target: 0 violations

---

## Quick Commands

```bash
# Run type check
pnpm typecheck

# Run linting
pnpm lint

# Run tests
pnpm test

# Format code
pnpm format

# Start showcase
cd apps/component-showcase
pnpm dev
```

---

## Files to Modify

1. `packages/react/src/components/input/MentionSystem.tsx` (CRITICAL)
2. `apps/component-showcase/app/messages/page.tsx` (CRITICAL)
3. `packages/primitives/src/components/ui/button.tsx` (CRITICAL)
4. `apps/component-showcase/app/globals.css` (HIGH + MEDIUM)
5. `packages/react/src/components/chat/SlashCommandMenu.tsx` (HIGH + MEDIUM)

---

## Time Breakdown

- Critical Fixes: 1.5 hours
- High Priority: 30 minutes
- Medium Priority: 1 hour
- **Total**: 3 hours

---

## Support Resources

- Full audit report: `GLASSMORPHISM_ACCESSIBILITY_AUDIT.md`
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Practices: https://www.w3.org/WAI/ARIA/apg/
- Contrast Checker: https://webaim.org/resources/contrastchecker/
