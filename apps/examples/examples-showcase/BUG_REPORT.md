# Showcase Application - Bug Report

**Date**: 2026-02-04
**Severity**: CRITICAL
**Status**: Identified - Requires Fix

---

## Critical Bug: Missing Component Imports

### Description
The showcase application attempts to import components that are not exported from `@clarity-chat/react`, causing module resolution failures that will prevent the application from running.

### Steps to Reproduce
1. Start dev server: `cd apps/examples/examples-showcase && npm run dev`
2. Open browser to `http://localhost:5173`
3. Check browser console for errors

### Expected Behavior
- All imported components should resolve successfully
- Application loads without module resolution errors
- All components render correctly

### Actual Behavior
The following imports in `src/App.tsx` (lines 9-28) reference components that don't exist in the public API:

#### Non-Existent Imports:
```tsx
// These components are NOT exported from @clarity-chat/react
import {
  ModelSelector,           // ❌ NOT EXPORTED
  ContextManager,          // ❌ NOT EXPORTED
  UsageDashboard,          // ❌ NOT EXPORTED
  PerformanceDashboard,    // ❌ NOT EXPORTED
  CustomerSupportTemplate, // ❌ NOT EXPORTED
  AIAssistantTemplate,     // ❌ NOT EXPORTED
  CodeHelperTemplate,      // ❌ NOT EXPORTED
} from '@clarity-chat/react'
```

#### Available Alternatives (from public-api.ts):
```tsx
// These ARE exported and should be used instead:
import {
  // Core Components
  ChatWindow,              // ✅ AVAILABLE (line 117)
  ChatInput,               // ✅ AVAILABLE (line 52)
  MessageList,             // ✅ AVAILABLE (line 48)

  // Token/Usage Components
  TokenUsageMeter,         // ✅ AVAILABLE (line 70)
  TokenBudgetBar,          // ✅ AVAILABLE (line 72)
  TokenCounter,            // ✅ AVAILABLE (line 139)

  // Input Components
  VoiceInput,              // ✅ AVAILABLE (line 133)
  AudioRecorder,           // ✅ AVAILABLE (line 135)

  // Other Components
  StreamingMessage,        // ✅ AVAILABLE (line 64)
  StreamingProgress,       // ✅ AVAILABLE (line 66)
  MemoryActivityIndicator, // ✅ AVAILABLE (line 77)
  CommandPalette,          // ✅ AVAILABLE (line 164)
  ErrorBoundary,           // ✅ AVAILABLE (line 125)
} from '@clarity-chat/react'
```

---

## Additional Issues Found in Code Review

### 1. Missing Reduced Motion Support
**Severity**: HIGH (Accessibility)
**File**: `src/index.css`

The CSS does not include `prefers-reduced-motion` media query support.

**Impact**:
- Violates WCAG 2.1 guidelines
- Poor experience for users with motion sensitivity
- Animations cannot be disabled

**Required Fix**:
```css
/* Add to index.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 2. Missing Focus Indicators
**Severity**: MEDIUM (Accessibility)
**File**: `src/index.css`

The CSS does not define clear focus indicators for keyboard navigation.

**Impact**:
- Keyboard users cannot see focus
- Violates WCAG 2.1 AA requirements

**Required Fix**:
```css
/* Add to index.css */
*:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible,
[role="button"]:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
  box-shadow: 0 0 0 4px hsla(var(--primary), 0.2);
}
```

### 3. No Error Boundary
**Severity**: MEDIUM (Reliability)
**File**: `src/App.tsx`

The application does not wrap components in an ErrorBoundary.

**Impact**:
- One component error crashes entire app
- No graceful error handling
- Poor user experience

**Required Fix**:
```tsx
import { ErrorBoundary } from '@clarity-chat/react'

// Wrap app in ErrorBoundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <ThemeProvider theme={selectedTheme}>
    {/* App content */}
  </ThemeProvider>
</ErrorBoundary>
```

### 4. Missing Loading States
**Severity**: LOW (UX)
**File**: `src/App.tsx`

Theme switching and view changes have no loading indicators.

**Impact**:
- Perceived slowness
- No feedback during transitions

**Recommended Fix**:
```tsx
const [isLoading, setIsLoading] = useState(false)

const handleViewChange = (view: View) => {
  setIsLoading(true)
  setCurrentView(view)
  setTimeout(() => setIsLoading(false), 0)
}

// Add loading state to render
{isLoading ? <Skeleton /> : renderView()}
```

### 5. No Responsive Breakpoints
**Severity**: MEDIUM (UX)
**File**: `src/index.css`

The CSS has responsive grid templates but no mobile-specific styles.

**Impact**:
- Poor mobile experience
- Text may be too small
- Touch targets may be inadequate

**Required Fix**:
```css
/* Mobile-first responsive styles */
@media (max-width: 768px) {
  .showcase-header h1 {
    font-size: 1.75rem;
  }

  .showcase-nav {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .showcase-nav button {
    font-size: 0.875rem;
    padding: 0.375rem 1rem;
  }

  .template-grid,
  .component-sections {
    grid-template-columns: 1fr;
  }
}
```

---

## Potential Runtime Issues (Requires Browser Testing)

### Console Errors to Check
1. ✅ **Module Resolution**: Check for "Cannot find module" errors
2. ⚠️ **React Hydration**: Check for hydration mismatch warnings
3. ⚠️ **CSS Loading**: Verify `@clarity-chat/react/styles.css` loads
4. ⚠️ **Theme Variables**: Check if CSS variables are defined

### Interactive Features to Test
1. ⚠️ **Navigation Tabs**: Click each tab and verify view switches
2. ⚠️ **Theme Dropdown**: Select different themes and verify application
3. ⚠️ **Chat Input**: Type and send messages
4. ⚠️ **File Upload**: Test if `enableFileUpload` prop works
5. ⚠️ **Voice Input**: Test if `enableVoiceInput` prop works
6. ⚠️ **Theme Cards**: Click theme cards in theme view

### Animation Testing
1. ⚠️ **View Transitions**: Check for smooth transitions
2. ⚠️ **Button Hovers**: Verify hover animations (line 47-49)
3. ⚠️ **Card Hovers**: Check theme card transforms (line 156-159)
4. ⚠️ **Message Animations**: Test message appearance animations

### Responsive Testing
1. ⚠️ **Desktop (1920x1080)**: Full layout
2. ⚠️ **Laptop (1366x768)**: Adapted layout
3. ⚠️ **Tablet (768x1024)**: Mobile-friendly
4. ⚠️ **Mobile (375x667)**: Minimal layout
5. ⚠️ **Resize Behavior**: Smooth reflow

### Dark Mode Testing
1. ⚠️ **Theme Switching**: Select dark themes
2. ⚠️ **Contrast Ratios**: WCAG AA compliance
3. ⚠️ **Element Visibility**: All UI elements visible
4. ⚠️ **Glass Effects**: Proper transparency with dark backgrounds

---

## Glassmorphism-Specific Issues (Requires Visual Testing)

### Pages Using Glassmorphism
The showcase doesn't currently implement glassmorphism - it uses the default theme system. To test glassmorphism, we need to verify it works in:

1. **ChatWindow Component** (from @clarity-chat/react)
   - Check backdrop-filter support
   - Verify background transparency
   - Check border/shadow rendering

2. **Input Components**
   - ChatInput glass effects
   - VoiceInput button glass effects

3. **Message Components**
   - Message bubble glass effects
   - Streaming message glass effects

### Browser Compatibility
- ✅ **Chrome/Edge**: Full support for backdrop-filter
- ⚠️ **Firefox**: Check Firefox 103+ support
- ⚠️ **Safari**: Check Safari 15+ support
- ❌ **Old Browsers**: Need fallback solid backgrounds

---

## Priority Fix Order

### P0 - Critical (Blocks Application)
1. ✅ **Fix Module Imports** - Replace non-existent imports
   - Remove: ModelSelector, ContextManager, UsageDashboard, etc.
   - Use: ChatWindow, TokenUsageMeter, etc.

### P1 - High (Accessibility/Usability)
2. ⚠️ **Add Reduced Motion Support** - CSS media query
3. ⚠️ **Add Focus Indicators** - Keyboard navigation
4. ⚠️ **Add ErrorBoundary** - Graceful error handling

### P2 - Medium (UX Improvements)
5. ⚠️ **Add Responsive Styles** - Mobile support
6. ⚠️ **Add Loading States** - User feedback
7. ⚠️ **Test Theme Switching** - Verify all themes work

### P3 - Low (Nice to Have)
8. ⚠️ **Add Skeleton Loaders** - Better loading UX
9. ⚠️ **Add Keyboard Shortcuts** - Power user features
10. ⚠️ **Add Toast Notifications** - Action feedback

---

## Testing Checklist

### Before Browser Testing
- [x] Identify module resolution issues
- [x] Review component exports
- [x] Check CSS accessibility issues
- [ ] Fix critical imports
- [ ] Add required CSS rules

### Browser Testing (After Fixes)
- [ ] Check console for errors
- [ ] Test all navigation tabs
- [ ] Test theme switching
- [ ] Test chat functionality
- [ ] Test keyboard navigation
- [ ] Test responsive layouts
- [ ] Test reduced motion
- [ ] Test dark mode
- [ ] Performance profiling
- [ ] Accessibility audit (axe DevTools)

---

## Recommended Actions

1. **Immediate**: Fix module imports in `src/App.tsx`
2. **Next**: Add reduced motion and focus styles to `src/index.css`
3. **Then**: Add ErrorBoundary wrapper
4. **Finally**: Browser testing with checklist

---

## Additional Notes

### Components Currently Used
The App.tsx currently uses these working components:
- ✅ `ThemeProvider` - From public API
- ✅ `ChatWindow` - From public API (line 106-111)
- ✅ `TokenCounter` - Imported but not used
- ✅ Theme objects (defaultLightTheme, etc.) - Need to verify export

### Components That Need Replacement
Need to find/create alternatives for:
- `ModelSelector` → Could use custom dropdown
- `ContextManager` → Could use `MemoryActivityIndicator`
- `UsageDashboard` → Use `TokenUsageMeter` + `TokenBudgetBar`
- `PerformanceDashboard` → Remove or create custom
- `*Template` components → Create simple demo templates

### Testing Recommendations
1. Use Chrome DevTools Performance tab
2. Enable "Paint flashing" to see repaints
3. Use React DevTools Profiler
4. Run Lighthouse audit
5. Test with axe DevTools
6. Test with keyboard only
7. Test with screen reader
8. Test on real mobile devices

---

**Estimated Fix Time**: 2-4 hours
**Testing Time**: 1-2 hours
**Total**: 3-6 hours

