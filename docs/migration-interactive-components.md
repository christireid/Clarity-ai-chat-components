# Interactive Components Migration Guide

This guide helps you migrate from older versions of Clarity Chat's interactive components to the latest APIs with improved performance, accessibility, and maintainability.

## Table of Contents

- [Breaking Changes](#breaking-changes)
- [Performance Improvements](#performance-improvements)
- [API Consolidations](#api-consolidations)
- [Migration Steps](#migration-steps)
- [Codemod Usage](#codemod-usage)
- [Testing Your Migration](#testing-your-migration)

## Breaking Changes

### 🔴 Critical Changes (Require Immediate Action)

#### 1. Toast System Consolidation

**What Changed:**
- Removed custom toast system entirely
- Only Sonner-based toast system remains
- All toast-related exports from `@clarity-chat/react/components/ui/toast` removed

**Before:**
```typescript
import { useToast, ToastProvider, ToastContainer } from '@clarity-chat/react'

function MyComponent() {
  const { toast } = useToast()

  return (
    <ToastProvider>
      <button onClick={() => toast({ title: "Hello", description: "World" })}>
        Show Toast
      </button>
      <ToastContainer />
    </ToastProvider>
  )
}
```

**After:**
```typescript
import { ClarityToaster, toast } from '@clarity-chat/react'

function MyApp() {
  return (
    <>
      <button onClick={() => toast("Hello World!")}>
        Show Toast
      </button>
      <ClarityToaster />
    </>
  )
}
```

**Migration Impact:**
- High - Requires updating all toast usage
- Benefits: Better animations, accessibility, and maintainability

#### 2. Markdown Renderer Consolidation

**What Changed:**
- Removed `MarkdownRendererEnhanced` component
- Removed `MessageMarkdownRenderer` export
- Only `EnhancedMarkdownRenderer` remains

**Before:**
```typescript
import { MarkdownRendererEnhanced } from '@clarity-chat/react/internal'
import { MessageMarkdownRenderer } from '@clarity-chat/react/internal'

function MyComponent() {
  return (
    <>
      <MarkdownRendererEnhanced content="# Hello" />
      <MessageMarkdownRenderer content="**Bold**" />
    </>
  )
}
```

**After:**
```typescript
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

function MyComponent() {
  return (
    <EnhancedMarkdownRenderer content="# Hello" />
    // Use EnhancedMarkdownRenderer for all markdown rendering
  )
}
```

**Migration Impact:**
- Medium - Only affects internal/advanced usage
- Benefits: Single, well-maintained markdown renderer

### 🟡 Performance Improvements (Automatic Benefits)

#### 1. Input Responsiveness

**What Changed:**
- All input components now have immediate visual feedback
- Expensive operations (API calls, filtering) are properly debounced
- No more typing lag in `AdvancedChatInput`

**Benefits:**
- ✅ Instant visual feedback when typing
- ✅ No 300ms+ delays in input responses
- ✅ Better perceived performance

**No Code Changes Required:**
Your existing code automatically gets these improvements.

#### 2. Virtual Scrolling Enhancements

**What Changed:**
- `VirtualizedMessageList` now preserves scroll position during updates
- Smart auto-scroll only triggers when user is near bottom
- Better performance with large message lists

**Benefits:**
- ✅ Scroll position maintained during message updates
- ✅ No more jarring scroll jumps
- ✅ Faster rendering of large conversations

**No Code Changes Required:**
Your existing virtual scrolling code automatically gets these improvements.

#### 3. Search Performance

**What Changed:**
- `CommandPalette` search now uses debouncing (150ms delay)
- Efficient filtering prevents UI blocking
- Scales to 1000+ items without performance issues

**Benefits:**
- ✅ Instant search response (no typing lag)
- ✅ Handles large datasets efficiently
- ✅ Better user experience

**No Code Changes Required:**
Your existing command palette code automatically gets these improvements.

#### 4. Markdown Rendering Performance

**What Changed:**
- `Message` component now uses lazy markdown rendering
- Plain text appears immediately, formatted content loads progressively
- Complex markdown no longer blocks UI rendering

**Benefits:**
- ✅ Instant message display
- ✅ Progressive enhancement for formatting
- ✅ No 500ms+ rendering delays

**No Code Changes Required:**
Your existing message components automatically get these improvements.

#### 5. Animation Smoothness

**What Changed:**
- `StreamingMessage` now uses precise 60fps animation timing
- All animations respect `prefers-reduced-motion`
- Smoother text streaming and transitions

**Benefits:**
- ✅ Consistent 60fps animations
- ✅ No visual stuttering
- ✅ Better accessibility compliance

**No Code Changes Required:**
Your existing streaming components automatically get these improvements.

### 🔵 API Consolidations (Minor Changes)

#### 1. Reduced Motion Hook

**What Changed:**
- `useReducedMotion` now centralized from `@clarity-chat/primitives`
- Consistent API across all components

**Migration:**
```typescript
// Before: Could import from multiple places
import { useReducedMotion } from '@clarity-chat/react/hooks/ui/use-reduced-motion'

// After: Single source of truth
import { useReducedMotion } from '@clarity-chat/primitives'
```

**Migration Impact:**
- Low - Only affects direct hook imports

## Migration Steps

### Step 1: Update Toast Usage

1. **Find all toast imports:**
   ```bash
   grep -r "useToast\|ToastProvider\|ToastContainer" src/
   ```

2. **Replace with Sonner toast:**
   ```typescript
   // Remove old imports
   - import { useToast, ToastProvider, ToastContainer } from '@clarity-chat/react'

   // Add new imports
   + import { ClarityToaster, toast } from '@clarity-chat/react'

   // Update usage
   - const { toast } = useToast()
   - <ToastProvider><ToastContainer /></ToastProvider>
   + <ClarityToaster />
   ```

3. **Update toast calls:**
   ```typescript
   // Before
   toast({
     title: "Success",
     description: "Operation completed",
     type: "success"
   })

   // After
   toast.success("Operation completed")
   ```

### Step 2: Update Markdown Renderer Usage

1. **Find deprecated imports:**
   ```bash
   grep -r "MarkdownRendererEnhanced\|MessageMarkdownRenderer" src/
   ```

2. **Replace with EnhancedMarkdownRenderer:**
   ```typescript
   // Remove old imports
   - import { MarkdownRendererEnhanced } from '@clarity-chat/react/internal'
   - import { MessageMarkdownRenderer } from '@clarity-chat/react/internal'

   // Add new import
   + import { EnhancedMarkdownRenderer } from '@clarity-chat/react'
   ```

### Step 3: Update Reduced Motion Hook Imports

1. **Find inconsistent imports:**
   ```bash
   grep -r "useReducedMotion" src/
   ```

2. **Standardize to primitives:**
   ```typescript
   // Before: Mixed imports
   import { useReducedMotion } from '@clarity-chat/react/hooks/ui/use-reduced-motion'

   // After: Single source
   import { useReducedMotion } from '@clarity-chat/primitives'
   ```

### Step 4: Run Codemods

Use the provided codemods to automate most changes:

```bash
# Install codemods (if not already installed)
npm install -g @clarity-chat/codemods

# Run toast migration
npx @clarity-chat/codemods migrate-toast

# Run markdown renderer migration
npx @clarity-chat/codemods migrate-markdown-renderers

# Run reduced motion hook migration
npx @clarity-chat/codemods migrate-reduced-motion
```

### Step 5: Test Your Application

1. **Run your test suite:**
   ```bash
   npm test
   ```

2. **Manual testing checklist:**
   - [ ] Toasts appear and dismiss correctly
   - [ ] Markdown renders properly in messages
   - [ ] Typing feels responsive (no lag)
   - [ ] Scrolling works smoothly in chat
   - [ ] Search is fast in command palettes
   - [ ] Animations respect reduced motion preferences
   - [ ] Keyboard navigation works in dialogs/modals
   - [ ] Screen readers announce properly

3. **Performance verification:**
   - [ ] Typing speed: Should feel instant
   - [ ] Scroll preservation: Position maintained during updates
   - [ ] Search responsiveness: No >50ms delays
   - [ ] Animation smoothness: 60fps consistent

## Codemod Usage

### Toast Migration Codemod

```bash
npx @clarity-chat/codemods migrate-toast --source src/
```

**What it does:**
- Replaces `useToast`, `ToastProvider`, `ToastContainer` imports
- Updates toast function calls to use Sonner API
- Adds `ClarityToaster` component where needed

### Markdown Renderer Migration Codemod

```bash
npx @clarity-chat/codemods migrate-markdown-renderers --source src/
```

**What it does:**
- Replaces `MarkdownRendererEnhanced` with `EnhancedMarkdownRenderer`
- Removes `MessageMarkdownRenderer` imports
- Updates component props to match new API

### Reduced Motion Hook Migration Codemod

```bash
npx @clarity-chat/codemods migrate-reduced-motion --source src/
```

**What it does:**
- Updates all `useReducedMotion` imports to use `@clarity-chat/primitives`
- Ensures consistent hook usage across codebase

## Testing Your Migration

### Automated Testing

Run the full test suite to ensure everything works:

```bash
npm test
npm run test:e2e  # If you have e2e tests
```

### Manual Testing Checklist

#### Toast Functionality
- [ ] Toast appears when triggered
- [ ] Toast dismisses automatically or on click
- [ ] Multiple toasts stack properly
- [ ] Toast positioning works on different screen sizes

#### Input Responsiveness
- [ ] Typing feels instant in all input fields
- [ ] No visual lag between keystrokes and text appearance
- [ ] Autocomplete/suggestions appear smoothly
- [ ] Form submissions work without delay

#### Chat Experience
- [ ] Messages appear instantly
- [ ] Markdown formatting loads progressively
- [ ] Scrolling is smooth and position is preserved
- [ ] Virtual scrolling works with large conversations

#### Search & Navigation
- [ ] Command palette search is responsive
- [ ] Large datasets filter quickly
- [ ] Keyboard navigation works in menus
- [ ] Focus management is correct

#### Accessibility
- [ ] Screen readers announce properly
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators are visible
- [ ] Reduced motion preferences are respected

### Performance Benchmarks

Use these benchmarks to verify performance improvements:

```typescript
// Input responsiveness test
const startTime = performance.now()
await user.type(input, 'test input')
const endTime = performance.now()
expect(endTime - startTime).toBeLessThan(50) // Should be instant

// Search performance test
const searchStart = performance.now()
await user.type(searchInput, 'search query')
await waitFor(() => expect(results).toBeVisible())
const searchEnd = performance.now()
expect(searchEnd - searchStart).toBeLessThan(200) // Should be fast
```

## Common Issues & Solutions

### Issue: Toast not appearing after migration

**Symptoms:**
- Toast function called but no visual feedback

**Solution:**
```typescript
// Make sure ClarityToaster is mounted at app root
function App() {
  return (
    <>
      {/* Your app content */}
      <ClarityToaster /> {/* Must be present */}
    </>
  )
}
```

### Issue: Markdown not rendering after migration

**Symptoms:**
- Plain text appears but no formatting

**Solution:**
EnhancedMarkdownRenderer uses different props:

```typescript
// Before
<MarkdownRendererEnhanced content="# Hello" />

// After
<EnhancedMarkdownRenderer content="# Hello" config={{ enableSyntaxHighlight: true }} />
```

### Issue: Reduced motion not working

**Symptoms:**
- Animations still play when reduced motion is preferred

**Solution:**
Make sure you're using the hook from primitives:

```typescript
import { useReducedMotion } from '@clarity-chat/primitives'

function MyComponent() {
  const prefersReducedMotion = useReducedMotion()
  // Use this value in your animations
}
```

## Support

If you encounter issues during migration:

1. **Check the troubleshooting guide:** `docs/interactive-components-troubleshooting.md`
2. **Review the issues ledger:** `docs/audit/interactive-issues-ledger.md`
3. **Search existing issues:** Check GitHub repository
4. **Create a minimal reproduction:** Isolate the issue
5. **Include debug info:** Browser, OS, component usage, error messages

## Benefits of Migration

After migration, you'll get:

- 🚀 **2-5x faster interactions** - Sub-100ms response times
- 🎨 **Smoother animations** - Consistent 60fps across all components
- ♿ **Better accessibility** - WCAG AAA compliance improvements
- 🧹 **Cleaner codebase** - Consolidated APIs, removed duplication
- 🔧 **Easier maintenance** - Single source of truth for each feature
- 📱 **Better mobile experience** - Improved touch targets and focus management

The migration effort is worthwhile - your users will immediately notice the performance and accessibility improvements!