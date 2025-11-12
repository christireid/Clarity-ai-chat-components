# React 19 Primitives Refactoring Plan

**Date:** 2025-11-09  
**Scope:** All components in `/packages/primitives/src/components/`

---

## 📋 Components to Refactor (14 total)

### Components with forwardRef (9):
1. ✅ `avatar.tsx`
2. ✅ `badge.tsx`
3. ✅ `button.tsx` - **HIGH PRIORITY** (complex, has useMemo/useCallback)
4. ✅ `card.tsx`
5. ✅ `checkbox.tsx`
6. ✅ `dropdown-menu.tsx`
7. ✅ `input.tsx`
8. ✅ `scroll-area.tsx`
9. ✅ `textarea.tsx`

### Other Components (5):
10. ✅ `dialog.tsx` - Check for Context API
11. ✅ `drawer.tsx` - Check for Context API
12. ✅ `error-message.tsx` - Simple component
13. ✅ `popover.tsx` - Check for Context API
14. ✅ `tooltip.tsx` - Check for Context API
15. ✅ `button-state-icons.tsx` - Utility component

---

## 🎯 Refactoring Changes per Component

### 1. Button Component (`button.tsx`)

**Current State:**
- ✅ Uses `forwardRef`
- ✅ Has `useMemo` for ripple color (can remove, semantic)
- ✅ Has `useMemo` for state content (can remove)
- ✅ Has `useCallback` for click handler (can remove)
- ✅ Complex state management (loading, success, error)

**React 19 Changes:**
1. Remove `forwardRef` wrapper - use `ref` as prop
2. Remove `useMemo` wrappers (lines 115, 150) - React Compiler will optimize
3. Remove `useCallback` wrapper (line 139) - React Compiler will optimize
4. Add `"use client"` directive
5. Keep `useEffect` for auto-reset (semantic, not optimization)
6. **Add Actions support** - Optional `action` prop for async operations

**New Features to Add:**
```tsx
export interface ButtonProps {
  // ... existing props
  action?: () => Promise<void> // Async action with automatic pending state
}
```

**Testing Updates:**
- Update ref tests to use new syntax
- Add tests for Actions support
- Verify state transitions still work

**Stories Updates:**
- Update Button stories
- Add Action examples
- Show automatic pending states

**Example Updates:**
- Find all Button usage in examples/demos
- Update ref forwarding if used
- Add Action examples

---

### 2. Input Component (`input.tsx`)

**Current State:**
- ✅ Uses `forwardRef`
- ❌ No optimization hooks
- ✅ Simple component with error handling

**React 19 Changes:**
1. Remove `forwardRef` wrapper - use `ref` as prop
2. Add `"use client"` directive
3. Consider adding optimistic updates for controlled inputs

**Testing Updates:**
- Update ref tests
- Test error states

**Stories Updates:**
- Update Input stories

**Example Updates:**
- Find all Input usage
- Update ref forwarding

---

### 3. Checkbox Component (`checkbox.tsx`)

**Current State:**
- ✅ Uses `forwardRef`
- ❌ No optimization hooks
- ✅ Very simple component

**React 19 Changes:**
1. Remove `forwardRef` wrapper - use `ref` as prop
2. Add `"use client"` directive

**Testing Updates:**
- Update ref tests
- Test checked states

**Stories Updates:**
- Update Checkbox stories

**Example Updates:**
- Find all Checkbox usage
- Update ref forwarding

---

### 4-9. Other Components with forwardRef

**Same pattern for:**
- `avatar.tsx`
- `badge.tsx`
- `card.tsx`
- `dropdown-menu.tsx`
- `scroll-area.tsx`
- `textarea.tsx`

**Changes:**
1. Remove `forwardRef` wrapper
2. Add `"use client"` directive
3. Remove any optimization `useMemo`/`useCallback` if present

---

### 10-14. Context-based Components

**Components to check:**
- `dialog.tsx`
- `drawer.tsx`
- `popover.tsx`
- `tooltip.tsx`

**React 19 Changes:**
1. Update Context API: Remove `.Provider` → use Context directly
2. Add `"use client"` directive
3. Remove `forwardRef` if present

---

## 📊 Refactoring Order (Priority)

### Phase 1: Simple Components (Start Here)
1. ✅ **Checkbox** - Simplest, good test case
2. ✅ **Badge** - Simple, no logic
3. ✅ **Avatar** - Simple, no logic
4. ✅ **ErrorMessage** - Utility component

### Phase 2: Form Components
5. ✅ **Input** - Form component, moderate complexity
6. ✅ **Textarea** - Similar to Input
7. ✅ **Button** - Complex, many features (save for when confident)

### Phase 3: Compound Components
8. ✅ **Card** - Compound component
9. ✅ **Dialog** - Context API
10. ✅ **Drawer** - Context API
11. ✅ **Popover** - Context API
12. ✅ **Tooltip** - Context API
13. ✅ **Dropdown-menu** - Complex compound component

### Phase 4: Advanced Components
14. ✅ **Scroll-area** - Complex Radix integration
15. ✅ **Button-state-icons** - Utility, may not need changes

---

## 🔨 Refactoring Workflow (Per Component)

### Step 1: Refactor Component
```bash
# 1. Add "use client" at top
# 2. Remove forwardRef wrapper
# 3. Update function signature to accept ref as prop
# 4. Remove optimization useMemo/useCallback
# 5. Update Context API if applicable
# 6. Add Actions support if applicable
```

### Step 2: Update Tests
```bash
# Navigate to test file
# Update ref usage
# Add new feature tests
# Run tests: npm test -- componentName
```

### Step 3: Update Storybook Stories
```bash
# Find story in apps/storybook/stories/
# Update to use new API
# Add new feature stories
# Test in Storybook
```

### Step 4: Update Examples/Demos
```bash
# Search for component usage:
grep -r "ComponentName" examples/
grep -r "ComponentName" apps/
# Update all references
```

### Step 5: Commit
```bash
git add .
git commit -m "refactor(primitives): Upgrade ComponentName to React 19
- Remove forwardRef (ref as prop)
- Remove manual optimizations (React Compiler)
- Add 'use client' directive
- Update all tests and stories
- Update all examples
"
```

---

## ✅ Success Criteria

For each component refactoring to be considered complete:

- ✅ Component code updated with React 19 patterns
- ✅ All tests passing
- ✅ Storybook stories updated and working
- ✅ All example usages updated
- ✅ TypeScript compiles with no errors
- ✅ No visual regressions
- ✅ Changes committed with detailed message

---

## 🚨 Breaking Changes

### Ref Handling
**Before (React 18):**
```tsx
const ref = useRef<HTMLButtonElement>(null)
<Button ref={ref} />
// Component uses forwardRef
```

**After (React 19):**
```tsx
const ref = useRef<HTMLButtonElement>(null)
<Button ref={ref} />
// Component accepts ref as prop (no forwardRef)
```

**Impact:** 
- Internal change, external API stays same
- TypeScript types may need updating
- All existing code should work without changes

---

## 📚 Resources for Reference

- React 19 Upgrade Guide: https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- forwardRef deprecation: https://react.dev/reference/react/forwardRef
- React Compiler: https://react.dev/learn/react-compiler
- Actions: https://react.dev/reference/react-dom/hooks/useFormState

---

## 🎯 Expected Outcomes

### Code Quality:
- ✅ ~20-30% less boilerplate code
- ✅ More readable component implementations
- ✅ Better TypeScript inference
- ✅ Future-proof patterns

### Performance:
- ✅ React Compiler optimizations (automatic)
- ✅ Smaller bundle size (less wrapper code)
- ✅ Better re-render optimization

### Developer Experience:
- ✅ Simpler component APIs
- ✅ Less manual optimization needed
- ✅ Clearer code intent
- ✅ Modern React patterns

---

**Plan Created:** 2025-11-09  
**Ready to Execute:** Starting with Checkbox component

🚀 **Let's modernize the primitives package!**
