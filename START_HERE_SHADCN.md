# START HERE: Using shadcn/ui Components

> **Last Updated:** December 6, 2025  
> **Status:** Phase 1 Complete, Phases 2 & 3 Pending

## Quick Start (2 minutes)

### 1. Should I use shadcn/ui components?

**✅ YES** - For new code  
**⚠️ MAYBE** - For existing code (see migration guide)  
**❌ NOT YET** - If you haven't done setup (see step 2)

### 2. Setup Required (MUST DO FIRST)

```bash
# Check if setup is complete:
# 1. Do you have CSS variables in your global CSS?
# 2. Is your Tailwind config updated?
# 3. Is TooltipProvider wrapping your app?

# If NO to any → See: SHADCN_SETUP_REQUIRED.md
```

### 3. Import and Use

```tsx
import { ShadcnButton } from '@clarity-chat/primitives'

function MyComponent() {
  return <ShadcnButton>Click Me</ShadcnButton>
}
```

**That's it!** (If setup is complete)

---

## Current Status: What You Need to Know

### ✅ What Works

- 7 shadcn/ui components are available
- All automated tests pass
- TypeScript types work
- Backward compatible

### ⚠️ What's Not Tested

- Visual rendering (never tested in browser)
- Dark mode
- Accessibility
- Bundle size impact

### ❌ What's Not Done

- Migration of existing code
- Removal of custom components
- Full validation

**Translation:** You can use these components, but **test them yourself first**.

---

## Which Component Should I Use?

### New Code: Use shadcn/ui ✅

```tsx
// ✅ RECOMMENDED
import { ShadcnButton } from '@clarity-chat/primitives'
```

### Existing Code: Depends ⚠️

```tsx
// ⚠️ DEPRECATED but still works
import { Button } from '@clarity-chat/primitives'

// ✅ MIGRATE when you can
import { ShadcnButton as Button } from '@clarity-chat/primitives'
```

### Need Custom Features: Use Custom Components 🔧

```tsx
// If you need ripple effects or built-in loading states:
import { Button } from '@clarity-chat/primitives'  // Custom version
```

---

## Component Comparison

| Feature | Custom Button | Shadcn Button |
|---------|--------------|---------------|
| Variants | ✅ 9 variants | ✅ 6 variants |
| Sizes | ✅ 4 sizes | ✅ 4 sizes |
| Ripple Effect | ✅ Built-in | ❌ Not available |
| Loading State | ✅ Built-in | ❌ Manual |
| TypeScript | ✅ Full support | ✅ Full support |
| Accessibility | ⚠️ Good | ✅ WCAG 2.1 AA |
| Keyboard Nav | ✅ Works | ✅ Better |
| Status | ⚠️ Deprecated | ✅ Recommended |

---

## Available Components

### 1. Button

```tsx
import { ShadcnButton } from '@clarity-chat/primitives'

<ShadcnButton variant="default">Click</ShadcnButton>
<ShadcnButton variant="outline">Outline</ShadcnButton>
<ShadcnButton variant="ghost">Ghost</ShadcnButton>
```

[Full API →](./SHADCN_QUICK_REFERENCE.md#button)

### 2. Dialog

```tsx
import { 
  ShadcnDialog, 
  ShadcnDialogTrigger, 
  ShadcnDialogContent 
} from '@clarity-chat/primitives'

<ShadcnDialog>
  <ShadcnDialogTrigger>Open</ShadcnDialogTrigger>
  <ShadcnDialogContent>
    {/* Your content */}
  </ShadcnDialogContent>
</ShadcnDialog>
```

[Full API →](./SHADCN_QUICK_REFERENCE.md#dialog)

### 3. Dropdown Menu

```tsx
import { 
  ShadcnDropdownMenu, 
  ShadcnDropdownMenuTrigger,
  ShadcnDropdownMenuContent,
  ShadcnDropdownMenuItem 
} from '@clarity-chat/primitives'

<ShadcnDropdownMenu>
  <ShadcnDropdownMenuTrigger>Menu</ShadcnDropdownMenuTrigger>
  <ShadcnDropdownMenuContent>
    <ShadcnDropdownMenuItem>Item 1</ShadcnDropdownMenuItem>
  </ShadcnDropdownMenuContent>
</ShadcnDropdownMenu>
```

[Full API →](./SHADCN_QUICK_REFERENCE.md#dropdown-menu)

### 4. Tooltip

```tsx
import { 
  ShadcnTooltipProvider,
  ShadcnTooltip, 
  ShadcnTooltipTrigger,
  ShadcnTooltipContent 
} from '@clarity-chat/primitives'

// ⚠️ IMPORTANT: Wrap your app once
<ShadcnTooltipProvider>
  <App />
</ShadcnTooltipProvider>

// Then use:
<ShadcnTooltip>
  <ShadcnTooltipTrigger>Hover</ShadcnTooltipTrigger>
  <ShadcnTooltipContent>Info</ShadcnTooltipContent>
</ShadcnTooltip>
```

[Full API →](./SHADCN_QUICK_REFERENCE.md#tooltip)

### 5. Checkbox

```tsx
import { ShadcnCheckbox } from '@clarity-chat/primitives'

<ShadcnCheckbox 
  checked={checked}
  onCheckedChange={setChecked}
/>
```

[Full API →](./SHADCN_QUICK_REFERENCE.md#checkbox)

### 6. Popover

```tsx
import { 
  ShadcnPopover, 
  ShadcnPopoverTrigger,
  ShadcnPopoverContent 
} from '@clarity-chat/primitives'

<ShadcnPopover>
  <ShadcnPopoverTrigger>Open</ShadcnPopoverTrigger>
  <ShadcnPopoverContent>Content</ShadcnPopoverContent>
</ShadcnPopover>
```

[Full API →](./SHADCN_QUICK_REFERENCE.md#popover)

### 7. Drawer

```tsx
import { 
  ShadcnDrawer, 
  ShadcnDrawerTrigger,
  ShadcnDrawerContent 
} from '@clarity-chat/primitives'

<ShadcnDrawer>
  <ShadcnDrawerTrigger>Open</ShadcnDrawerTrigger>
  <ShadcnDrawerContent>Content</ShadcnDrawerContent>
</ShadcnDrawer>
```

[Full API →](./SHADCN_QUICK_REFERENCE.md#drawer)

---

## Common Issues

### Issue: Component doesn't render / looks broken

**Cause:** CSS variables not set up  
**Fix:** See [SHADCN_SETUP_REQUIRED.md](./SHADCN_SETUP_REQUIRED.md)

### Issue: Tooltip doesn't work

**Cause:** Missing `TooltipProvider`  
**Fix:** Wrap your app:
```tsx
<ShadcnTooltipProvider>
  <App />
</ShadcnTooltipProvider>
```

### Issue: TypeScript errors

**Cause:** Types not generated  
**Fix:** 
```bash
cd packages/primitives
pnpm build
```

### Issue: "Module not found"

**Cause:** Package not built  
**Fix:**
```bash
pnpm install
pnpm build --filter @clarity-chat/primitives
```

---

## Need More Information?

### Getting Started
- **Setup Guide:** [SHADCN_SETUP_REQUIRED.md](./SHADCN_SETUP_REQUIRED.md) ← START HERE
- **Quick Reference:** [SHADCN_QUICK_REFERENCE.md](./SHADCN_QUICK_REFERENCE.md)
- **Migration Guide:** [MIGRATION_GUIDE_SHADCN.md](./MIGRATION_GUIDE_SHADCN.md)

### Status & Planning
- **Executive Summary:** [SHADCN_EXECUTIVE_SUMMARY.md](./SHADCN_EXECUTIVE_SUMMARY.md)
- **Actual Status:** [SHADCN_ACTUAL_STATUS.md](./SHADCN_ACTUAL_STATUS.md)
- **Phase 2 & 3 Plan:** [SHADCN_PHASE_2_3_PLAN.md](./SHADCN_PHASE_2_3_PLAN.md)

### Technical Details
- **Full Report:** [SHADCN_INTEGRATION_FINAL_REPORT.md](./SHADCN_INTEGRATION_FINAL_REPORT.md)
- **Pre-existing Issues:** [PRE_EXISTING_ISSUES.md](./PRE_EXISTING_ISSUES.md)
- **Component README:** [packages/primitives/src/components/ui/README.md](./packages/primitives/src/components/ui/README.md)

---

## Quick Decision Tree

```
Do you need a UI component?
│
├─ Is it a NEW feature?
│  └─ ✅ Use ShadcnButton, ShadcnDialog, etc.
│
├─ Are you UPDATING existing code?
│  ├─ Do you have time to migrate?
│  │  ├─ Yes → ✅ Use shadcn components
│  │  └─ No → ⚠️ Keep using custom components for now
│  │
│  └─ Do you need custom features (ripple, loading)?
│     ├─ Yes → 🔧 Keep using custom Button
│     └─ No → ✅ Use shadcn components
│
└─ Are you FIXING a bug?
   └─ ⚠️ Don't migrate during bug fix, just fix the bug
```

---

## Testing Checklist

Before using shadcn components in production:

- [ ] Setup complete (CSS variables, Tailwind config)
- [ ] TooltipProvider added (if using tooltips)
- [ ] Tested one component in browser
- [ ] Verified styles look correct
- [ ] Checked dark mode (if needed)
- [ ] No console errors
- [ ] Verified bundle size acceptable

---

## Summary

**What to do TODAY:**
1. Complete setup (if not done): [SHADCN_SETUP_REQUIRED.md](./SHADCN_SETUP_REQUIRED.md)
2. Test ONE component in browser
3. If it works → Use shadcn for new code
4. If it doesn't → File an issue with details

**What's coming:**
- Phase 2: Migrate existing code (timeline TBD)
- Phase 3: Remove custom components (timeline TBD)

**Questions?**
- Check documentation above
- File an issue on GitHub
- Ask in Discord/Slack

---

**Version:** 1.0 (Phase 1 Complete)  
**Last Updated:** December 6, 2025
