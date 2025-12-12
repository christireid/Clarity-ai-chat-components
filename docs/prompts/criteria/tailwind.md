# Tailwind CSS Review Criteria

> Canonical Tailwind CSS quality and consistency criteria

## Design System Adherence

### Critical Checks
- [ ] No arbitrary values (`w-[123px]` → use `w-32` from scale)
- [ ] Consistent spacing scale (4, 8, 12, 16, 20, 24...)
- [ ] Colors from theme palette (not hex values)
- [ ] Font sizes from typography scale
- [ ] Border radius from theme

### Spacing Scale Reference

```
Scale: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96

Examples:
- p-4 = 1rem (16px)
- p-6 = 1.5rem (24px)
- p-8 = 2rem (32px)

Arbitrary Value Conversions:
- w-[256px] → w-64
- p-[15px] → p-4 (close enough)
- mt-[23px] → mt-6
- gap-[10px] → gap-2.5
```

### Color Patterns

```tsx
// INCORRECT: Hardcoded colors
<div className="bg-[#f5f5f5] text-[#333333]" />

// CORRECT: Theme colors
<div className="bg-gray-100 text-gray-800" />

// CORRECT: Semantic colors (if configured)
<div className="bg-surface text-foreground" />
```

## Responsive Design

### Critical Checks
- [ ] Mobile-first approach (base styles → `sm:` → `md:` → `lg:` → `xl:`)
- [ ] Breakpoints used consistently
- [ ] Touch targets adequate on mobile (min 44px)
- [ ] No horizontal scroll on mobile
- [ ] Text readable on all screen sizes

### Mobile-First Pattern

```tsx
// INCORRECT: Desktop-first (adding mobile overrides)
<div className="flex-row sm:flex-col" />
<div className="text-xl sm:text-base" />

// CORRECT: Mobile-first (base = mobile, add desktop)
<div className="flex-col sm:flex-row" />
<div className="text-base sm:text-xl" />

// CORRECT: Progressive enhancement
<div className="
  w-full px-4
  sm:w-auto sm:px-6
  md:px-8
  lg:max-w-4xl lg:mx-auto
" />
```

### Breakpoint Reference

```
sm: 640px  - Small tablets, large phones landscape
md: 768px  - Tablets
lg: 1024px - Small laptops, tablets landscape
xl: 1280px - Desktops
2xl: 1536px - Large desktops
```

## Dark Mode

### Critical Checks
- [ ] All background colors have `dark:` variants
- [ ] All text colors have `dark:` variants
- [ ] Sufficient contrast in both modes (WCAG AA minimum)
- [ ] Images/icons adapt to dark mode
- [ ] Borders and dividers have dark variants
- [ ] No hardcoded colors that ignore dark mode

### Dark Mode Pattern

```tsx
// INCORRECT: No dark mode support
<div className="bg-white text-gray-900 border-gray-200">
  <h1 className="text-black">Title</h1>
</div>

// CORRECT: Full dark mode support
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
</div>

// BETTER: Use semantic colors from theme
<div className="bg-background text-foreground border-border">
  <h1 className="text-foreground">Title</h1>
</div>
```

## Class Organization

### Critical Checks
- [ ] Logical class ordering (layout → spacing → sizing → typography → colors → effects)
- [ ] No duplicate utilities
- [ ] No conflicting utilities (`flex` and `grid` on same element)
- [ ] Related utilities grouped together

### Recommended Order

```tsx
// Recommended class order:
<div className="
  {/* 1. Layout */}
  flex flex-col items-center justify-between
  {/* 2. Positioning */}
  relative z-10
  {/* 3. Sizing */}
  w-full max-w-md h-auto min-h-screen
  {/* 4. Spacing */}
  p-4 m-2 gap-4
  {/* 5. Typography */}
  text-base font-medium leading-relaxed
  {/* 6. Colors */}
  bg-white dark:bg-gray-900 text-gray-900 dark:text-white
  {/* 7. Borders */}
  border border-gray-200 dark:border-gray-700 rounded-lg
  {/* 8. Effects */}
  shadow-md hover:shadow-lg transition-shadow
  {/* 9. States */}
  hover:bg-gray-50 focus:ring-2 disabled:opacity-50
"/>
```

## Component Extraction

### When to Extract

Extract repeated patterns to components when:
- Same combination appears 3+ times
- Pattern represents a semantic concept (Card, Button, Badge)
- Pattern has variants (primary, secondary, etc.)

```tsx
// BEFORE: Repeated pattern
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Save
</button>
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Submit
</button>

// AFTER: Extracted component
const Button = ({ children, ...props }) => (
  <button
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    {...props}
  >
    {children}
  </button>
)
```

## Severity Levels

| Issue | Severity | Impact |
|-------|----------|--------|
| No dark mode on interactive elements | High | Accessibility |
| Arbitrary values for common sizes | Medium | Inconsistency |
| Desktop-first responsive | Medium | Mobile UX |
| Duplicate utilities | Low | Bundle size |
| Unordered classes | Low | Maintainability |
