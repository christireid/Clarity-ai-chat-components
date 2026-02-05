# Showcase Runtime Testing Checklist

## Test Date: 2026-02-04
## Server: Running on Vite (PID: 60889)
## URL: http://localhost:5173 (default Vite port)

---

## 1. Browser Console Errors

### Initial Load
- [ ] No module resolution errors
- [ ] No React hydration errors
- [ ] No CSS loading errors
- [ ] All imports resolve successfully

### Navigation
- [ ] No errors when switching between views (Playground, Components, Templates, Themes)
- [ ] No memory leaks in console
- [ ] No warnings about deprecated APIs

### Expected Components to Load
- [ ] ChatWindow
- [ ] ModelSelector
- [ ] ContextManager
- [ ] UsageDashboard
- [ ] VoiceInput
- [ ] PerformanceDashboard
- [ ] CustomerSupportTemplate
- [ ] AIAssistantTemplate
- [ ] CodeHelperTemplate
- [ ] TokenCounter

---

## 2. Interactive Features Testing

### Navigation
- [ ] Click "Playground" tab - switches view
- [ ] Click "Components" tab - switches view
- [ ] Click "Templates" tab - switches view
- [ ] Click "Themes" tab - switches view
- [ ] Active tab has visual indicator
- [ ] Tab transitions are smooth

### Theme Selector Dropdown
- [ ] Dropdown opens on click
- [ ] All 10 themes listed
- [ ] Can select each theme
- [ ] Theme applies immediately
- [ ] No flash of unstyled content (FOUC)

### Chat Playground
- [ ] Type in input field - text appears
- [ ] Press Enter - message sends
- [ ] Click send button - message sends
- [ ] User message appears immediately
- [ ] AI response appears after 1s delay
- [ ] Messages scroll into view
- [ ] Markdown renders correctly in messages
- [ ] Code blocks have syntax highlighting

### File Upload
- [ ] Click upload area - file picker opens
- [ ] Drag file over area - hover state shows
- [ ] Drop file - file is accepted
- [ ] File upload indicator shows

### Voice Input
- [ ] Click microphone button - permission requested
- [ ] Recording indicator appears
- [ ] Click to stop - recording stops
- [ ] Speech converted to text

### Keyboard Navigation
- [ ] Tab key - focuses next element
- [ ] Shift+Tab - focuses previous element
- [ ] Enter on focused button - activates
- [ ] Esc key - closes dialogs/modals
- [ ] Arrow keys in dropdown - navigate options

---

## 3. Animation Testing

### Page Transitions
- [ ] View switches have fade transition
- [ ] No jank or stuttering
- [ ] Smooth 60fps animations

### Message Animations
- [ ] New messages slide in smoothly
- [ ] Typing indicator animates
- [ ] Message hover states smooth

### Theme Transitions
- [ ] Theme change animates colors
- [ ] No sudden color flashes
- [ ] Gradient transitions smooth

### Button/Interactive States
- [ ] Hover states animate
- [ ] Active/pressed states animate
- [ ] Focus rings appear smoothly
- [ ] Loading spinners rotate smoothly

---

## 4. Prefers-Reduced-Motion Testing

### System Setting: Motion Enabled
- [ ] Full animations play
- [ ] Transitions are visible
- [ ] Smooth scrolling works

### System Setting: Motion Reduced
- [ ] Animations disabled or minimal
- [ ] Transitions are instant or very short
- [ ] No automatic scrolling
- [ ] No decorative animations
- [ ] Core functionality still works
- [ ] Accessibility not impaired

### CSS Media Query Check
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 5. Responsive Design Testing

### Desktop (1920x1080)
- [ ] Full layout displays correctly
- [ ] No horizontal scroll
- [ ] Chat window sized appropriately
- [ ] Sidebar/controls visible
- [ ] Text readable

### Laptop (1366x768)
- [ ] Layout adapts
- [ ] No content cutoff
- [ ] Chat remains functional

### Tablet Portrait (768x1024)
- [ ] Mobile-friendly layout
- [ ] Touch targets adequate (44x44px min)
- [ ] Navigation accessible
- [ ] Chat usable

### Tablet Landscape (1024x768)
- [ ] Layout optimized
- [ ] Chat interface comfortable

### Mobile (375x667)
- [ ] Full mobile layout
- [ ] Navigation becomes hamburger/tabs
- [ ] Chat input accessible
- [ ] Messages readable
- [ ] No text overflow

### Mobile Small (320x568)
- [ ] Minimal layout works
- [ ] Core features accessible
- [ ] Text still readable

### Test Viewport Transitions
- [ ] Smooth resize behavior
- [ ] No layout breaks
- [ ] Content reflows gracefully

---

## 6. Dark Mode Toggle

### Theme Switching
- [ ] Select "Default Dark" - applies immediately
- [ ] Select "Default Light" - applies immediately
- [ ] Glassmorphism adapts to theme
- [ ] Text contrast maintained
- [ ] All UI elements visible

### System Preference
- [ ] Respects OS dark mode setting (if implemented)
- [ ] Persists user choice in localStorage

### WCAG Contrast
- [ ] Light mode meets WCAG AA (4.5:1 for text)
- [ ] Dark mode meets WCAG AA
- [ ] Interactive elements distinguishable

---

## 7. Glassmorphism-Heavy Pages

### Overview/Playground Page
- [ ] Backdrop blur renders
- [ ] Glass panels have transparency
- [ ] Background shows through
- [ ] Borders visible
- [ ] Shadow depth correct
- [ ] Performance acceptable (60fps)
- [ ] No rendering artifacts

### Core Chat Components
- [ ] ChatWindow has glass effect
- [ ] Messages have subtle glass
- [ ] Input area has glass effect
- [ ] Hover states enhance glass
- [ ] Scrolling smooth with effects

### Input Components
- [ ] Input field glass background
- [ ] Focus state enhances glass
- [ ] Placeholder text visible
- [ ] Button glass effects work

### Messages View
- [ ] Message bubbles have glass
- [ ] User/assistant messages differentiated
- [ ] Markdown rendering clear through glass
- [ ] Code blocks readable with glass

### AI Reasoning/Thinking
- [ ] Thinking indicator has glass
- [ ] Animation smooth with glass
- [ ] Loading states visible
- [ ] Progress indicators clear

---

## Potential Issues to Watch For

### Performance Issues
1. **Glassmorphism Performance**: Backdrop-filter can be GPU-intensive
   - Watch for: Frame drops, stuttering
   - Check: GPU usage in DevTools Performance tab

2. **Message List Virtualization**: Large message lists
   - Watch for: Memory leaks, slow scrolling
   - Check: Memory profiler in DevTools

3. **Theme Switching**: Full re-render on theme change
   - Watch for: Lag, FOUC
   - Check: Render times in React DevTools

### Accessibility Issues
1. **Keyboard Navigation**: Focus management
   - Watch for: Lost focus, tab traps
   - Check: Tab through entire interface

2. **Screen Reader**: ARIA labels and roles
   - Watch for: Missing labels, incorrect roles
   - Check: VoiceOver (Mac) or NVDA (Windows)

3. **Color Contrast**: Glassmorphism can reduce contrast
   - Watch for: Unreadable text
   - Check: Chrome DevTools Lighthouse

### Browser Compatibility
1. **Backdrop-filter**: Not supported in all browsers
   - Watch for: Missing effects in Firefox < 103
   - Check: Fallback solid backgrounds

2. **CSS Custom Properties**: Should work in all modern browsers
   - Watch for: Styling breaks
   - Check: Variable inheritance

3. **React 19 Features**: Concurrent rendering
   - Watch for: Hydration mismatches
   - Check: Console warnings

---

## Testing Commands

### Open in Browser
```bash
open http://localhost:5173
```

### Enable React DevTools Profiler
1. Open DevTools (F12)
2. Go to Components tab
3. Click Profiler
4. Start profiling
5. Interact with app
6. Stop and analyze

### Check Console
```javascript
// Run in browser console
console.clear()
console.log('React version:', React.version)
console.log('Root element:', document.getElementById('root'))
console.log('Loaded stylesheets:', document.styleSheets.length)
```

### Performance Check
```javascript
// Run in browser console
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration)
  }
})
observer.observe({ entryTypes: ['measure', 'paint'] })
```

---

## Bug Report Template

```markdown
### Bug: [Short Description]

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**

**Actual Behavior:**

**Console Errors:**
```
[paste error]
```

**Environment:**
- Browser:
- OS:
- Screen Size:
- Theme:

**Screenshots:**
[attach if relevant]

**Severity:** Critical / High / Medium / Low
```

---

## Next Steps After Testing

1. Document all bugs found
2. Prioritize by severity
3. Create issues for each bug
4. Fix critical bugs immediately
5. Plan fixes for high/medium bugs
6. Consider low bugs as enhancements
