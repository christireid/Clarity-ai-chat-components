# Test Fixes Summary

## Overview

This document tracks the test fixes applied to align tests with Radix UI's API after the shadcn/ui refactor.

## Progress

- **Total Tests**: 312
- **Passing**: 286 (91.7%)
- **Failing**: 26 (8.3%)
- **Improvement**: Reduced from 35+ failures to 26 failures

## Completed Fixes

### ✅ Checkbox Component (36/36 tests passing)

**Issues Fixed**:
1. Changed `onChange` → `onCheckedChange` (Radix UI API)
2. Changed `querySelector('input[type="checkbox"]')` → `getByRole('checkbox')` (Radix UI uses button with role="checkbox")
3. Updated form integration tests (Radix UI doesn't use native form attributes)
4. Fixed focusable test to verify actual focus behavior
5. Updated styling tests to match Radix UI class names

**Files Modified**:
- `src/components/__tests__/checkbox.test.tsx`

### ✅ DropdownMenu Component (13/13 tests passing)

**Issues Fixed**:
1. Changed `toBeDisabled()` → `toHaveAttribute('aria-disabled', 'true')` and `toHaveAttribute('data-disabled')` (Radix UI uses aria-disabled for div elements)
2. Updated error message expectation from `'DropdownMenu components must be used within a DropdownMenu'` → `'DropdownMenuTrigger'` (matches Radix UI's actual error)

**Files Modified**:
- `src/components/__tests__/dropdown-menu.test.tsx`

## Remaining Failures

### ⏳ Avatar Component (4 failures)

**Issues**:
- Tests expect different image loading behavior
- Radix UI's `AvatarImage` handles loading/error internally
- Tests need to be updated to match Radix UI's behavior

**Test Failures**:
- `should render avatar with image`
- `should handle image load error`
- `should show fallback when image fails to load`
- `should have proper alt text for images`

### ⏳ Dialog Component (4 failures)

**Issues**:
- Tests expect different DOM structure
- Radix UI uses portals for Dialog content
- Tests need to account for portal rendering

**Test Failures**:
- `should render close button`
- `should close dialog when clicked`
- `should support aria-label on content`
- `should throw error when used outside Dialog context`

### ⏳ Popover Component (2 failures)

**Issues**:
- Tests expect custom error messages
- Radix UI has different error message format

**Test Failures**:
- `should throw error when used outside Popover context`
- `should support aria-label`

### ⏳ Other Components (16 failures)

Various component-specific API differences that need to be addressed.

## Next Steps

1. **Avatar Tests**: Update to match Radix UI's `AvatarImage` behavior
2. **Dialog Tests**: Update to account for portal rendering
3. **Popover Tests**: Update error message expectations
4. **Other Tests**: Review and fix remaining failures

## Testing Commands

```bash
# Run all tests
cd packages/primitives
pnpm test --run

# Run specific component tests
pnpm test --run checkbox
pnpm test --run dropdown-menu
pnpm test --run avatar
pnpm test --run dialog
pnpm test --run popover
```

## Notes

- All fixes maintain test intent while adapting to Radix UI's API
- Tests now properly use `getByRole` for better accessibility testing
- Form integration tests updated to reflect Radix UI's approach (doesn't use native form attributes)
- Error message tests updated to match Radix UI's actual error messages
