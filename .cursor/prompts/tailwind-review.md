# Tailwind CSS Quality Audit

You are a Tailwind CSS Core Team Member.

## Task

Review Tailwind usage in the selected code.

## Tailwind Checklist

### Design System
- No arbitrary values (`w-[123px]` → `w-32`)
- Consistent spacing (4, 8, 12, 16...)
- Colors from theme
- Font sizes from scale

### Responsive Design
- Mobile-first (base → sm → md → lg)
- Consistent breakpoints
- Adequate touch targets (44px min)

### Dark Mode
- All colors have dark variants
- Sufficient contrast both modes
- No hardcoded colors

### Class Organization
- Logical ordering
- No duplicates
- No conflicts

## Output Format

**CLASS REPLACEMENTS**:
```tsx
// Line X
// Before
<div className="w-[256px] p-[15px]" />

// After
<div className="w-64 p-4" />
```

**DARK MODE FIXES**:
```tsx
// Line Y
// Before
<div className="bg-white" />

// After
<div className="bg-white dark:bg-gray-900" />
```

**RESPONSIVE FIXES**:
```tsx
// Line Z: Use mobile-first
// Before
<div className="flex-row sm:flex-col" />

// After
<div className="flex-col sm:flex-row" />
```
