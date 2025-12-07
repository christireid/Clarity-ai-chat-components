# Migration Guide: shadcn/ui Refactor

## Overview

The `@clarity-chat/primitives` package has been refactored to use `shadcn/ui` components as the foundation while maintaining **full backward compatibility** with existing APIs.

## What Changed

### Internal Implementation
- All components now wrap `shadcn/ui` components internally
- Components use Radix UI primitives (via shadcn/ui) for accessibility and behavior
- Custom features and APIs are preserved

### What Stayed the Same
- ✅ All component APIs remain unchanged
- ✅ All props and behaviors work the same way
- ✅ Import paths unchanged
- ✅ TypeScript types unchanged
- ✅ Styling and class names preserved where possible

## No Action Required

**For most users, no changes are needed.** The refactor is backward compatible.

## Optional: Using New Features

### ScrollArea - New Option

The `ScrollArea` component now uses shadcn/ui's implementation by default. If you need the old CSS scrollbar styling, use the `useCustomScrollbar` prop:

```tsx
// New default (shadcn/ui with Radix UI)
<ScrollArea>
  <div>Content</div>
</ScrollArea>

// Old behavior (CSS scrollbar)
<ScrollArea useCustomScrollbar>
  <div>Content</div>
</ScrollArea>
```

### Sheet Component Available

A new `Sheet` component is now available (from shadcn/ui) for future use. It's similar to `Drawer` but uses Radix UI Dialog primitives.

## Breaking Changes

**None.** All changes are backward compatible.

## Test Updates

If you have tests that directly test component internals, you may need to update them:

### Checkbox
- Use `onCheckedChange` instead of `onChange`
- Query with `getByRole('checkbox')` instead of `querySelector('input')`

### DropdownMenu
- Check `aria-disabled` and `data-disabled` instead of `disabled` attribute
- Error messages match Radix UI format

### Avatar
- Image loading/error handling is managed by Radix UI internally
- Tests should verify avatar container exists rather than specific image elements

### Dialog/Popover
- Content is rendered in portals
- Use `getByRole('dialog')` for queries
- Error messages match Radix UI format

## Benefits

1. **Better Accessibility**: Radix UI provides excellent accessibility out of the box
2. **Consistent Behavior**: Components follow established patterns
3. **Future-Proof**: Easier to maintain and update
4. **Type Safety**: Better TypeScript support

## Support

If you encounter any issues after the refactor, please:
1. Check this migration guide
2. Review the `SHADCN_REFACTOR_SUMMARY.md` for detailed changes
3. Open an issue with details about your use case
