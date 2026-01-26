# Manual Accessibility Testing Checklist

**Purpose:** Verify WCAG 2.1 AA compliance for externalized components with missing peer
dependencies

**Date:** 2026-01-26

**Tester:** ********\_********

---

## Setup Instructions

### Test Environment 1: No Peer Dependencies

```bash
# Create fresh test environment
npm create vite@latest test-accessibility -- --template react-ts
cd test-accessibility

# Install Clarity Chat Components ONLY (no optional peers)
npm install @clarity-chat/react

# Start dev server
npm run dev
```

### Test Environment 2: With All Peers

```bash
# Install all optional peer dependencies
npm install shiki react-markdown remark-gfm rehype-highlight jszip pdfjs-dist
```

---

## Test 1: CodeBlock Without shiki

### 1.1 Visual Inspection

- [ ] Warning banner displays at top of code block
- [ ] Warning uses amber/yellow color scheme (not red/error)
- [ ] Text is readable against background
- [ ] Code content still visible below warning
- [ ] Copy button visible and properly positioned
- [ ] No broken layouts or overlapping elements

**Expected:** Amber warning banner + unstyled code in monospace font

### 1.2 Keyboard Navigation

- [ ] Tab to warning link - opens documentation in new tab
- [ ] Tab to copy button - Enter/Space copies code
- [ ] Tab to code region - can read code with screen reader
- [ ] Tab to expand button (if present) - Enter/Space expands
- [ ] Shift+Tab reverses focus order
- [ ] All focus indicators visible (blue ring or outline)

**Keyboard Shortcuts** (if `enableKeyboardShortcuts={true}`):

- [ ] Focus code block
- [ ] Press Cmd/Ctrl+Shift+C - copies code
- [ ] Press Cmd/Ctrl+Shift+D - downloads code (if button shown)
- [ ] Press Cmd/Ctrl+Shift+E - toggles expand (if applicable)

### 1.3 Screen Reader Testing

**NVDA (Windows):**

- [ ] Warning reads: "Alert. CodeBlock requires shiki..."
- [ ] Installation instruction reads clearly
- [ ] Documentation link announces URL
- [ ] Code region announces: "Region. Code block: [title] ([language])"
- [ ] Code content reads line by line
- [ ] Copy button reads: "Button. Copy code to clipboard"

**JAWS (Windows):**

- [ ] Same content as NVDA
- [ ] Forms mode allows button activation
- [ ] Virtual cursor navigates all content

**VoiceOver (macOS):**

- [ ] Same content as NVDA/JAWS
- [ ] VO+Space activates buttons
- [ ] VO+Right Arrow navigates through content

### 1.4 Color Contrast

Use browser DevTools or contrast checker:

- [ ] Warning banner text vs background ≥ 4.5:1
- [ ] Warning "⚠" icon vs background ≥ 3:1
- [ ] Code text vs background ≥ 4.5:1
- [ ] Copy button vs background ≥ 3:1
- [ ] Focus indicators ≥ 3:1

**Tools:** Chrome DevTools Contrast Ratio, WebAIM Contrast Checker

### 1.5 ARIA Inspection

Use Chrome DevTools Accessibility pane:

- [ ] Warning banner: `role="alert"`
- [ ] Code region: `role="region"` with `aria-label`
- [ ] Copy button: `aria-label="Copy code to clipboard"`
- [ ] Download button: `aria-label="Download code..."`
- [ ] Expand button: `aria-expanded` and `aria-controls`
- [ ] Decorative icons: `aria-hidden="true"`

---

## Test 2: Markdown Without react-markdown

### 2.1 Visual Inspection

- [ ] Fallback notice appears above content
- [ ] Notice uses muted styling (not alarming)
- [ ] Headings render as proper HTML headings
- [ ] Lists render as `<ul>`/`<ol>` with bullets/numbers
- [ ] Links are underlined and different color
- [ ] Code blocks in monospace with background
- [ ] Inline code has subtle background

**Expected:** Plain text with basic HTML formatting

### 2.2 Keyboard Navigation

- [ ] Tab through all links in content
- [ ] Enter opens links in new tab
- [ ] Links have visible focus indicator
- [ ] Can navigate headings with screen reader shortcuts
- [ ] Lists are navigable item by item

### 2.3 Screen Reader Testing

**NVDA:**

- [ ] Notice reads: "Status. Enhanced markdown rendering is unavailable"
- [ ] Headings announce: "Heading level [N]. [Text]"
- [ ] Lists announce: "List with [N] items"
- [ ] List items announce: "Bullet. [Text]" or "1. [Text]"
- [ ] Links announce: "Link. [Link text]"
- [ ] Code blocks announce: "Code. [Content]"

**JAWS:**

- [ ] Same structure as NVDA
- [ ] Can navigate by heading (H key)
- [ ] Can navigate by link (Tab or K key)
- [ ] Can navigate by list (L key)

**VoiceOver:**

- [ ] Same structure as NVDA/JAWS
- [ ] VO+Command+H navigates headings
- [ ] VO+Command+L navigates links

### 2.4 Semantic HTML

Inspect DOM in browser DevTools:

- [ ] `<h1>` through `<h6>` for headings (no skipped levels)
- [ ] `<p>` for paragraphs
- [ ] `<ul>` or `<ol>` for lists
- [ ] `<li>` for list items
- [ ] `<a>` with `href`, `target="_blank"`, `rel="noopener noreferrer"`
- [ ] `<code>` for inline code
- [ ] `<pre><code>` for code blocks
- [ ] `<strong>` for bold
- [ ] `<em>` for italic

### 2.5 Status Announcement

- [ ] Fallback notice has `role="status"`
- [ ] Fallback notice has `aria-live="polite"`
- [ ] Content changes announce to screen reader
- [ ] No disruptive interruptions (polite, not assertive)

---

## Test 3: Document Loaders Without Peers

### 3.1 DOCX Loader Without jszip

**Test Code:**

```tsx
import { DOCXLoader } from '@clarity-chat/react'

const loader = new DOCXLoader()
const file = new File(['content'], 'test.docx', {
  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
})

const docs = await loader.load(file)
console.log(docs[0])
```

**Checklist:**

- [ ] Returns document object (not null/undefined)
- [ ] `content` contains error message in brackets: `[...]`
- [ ] Error message is human-readable (no code jargon)
- [ ] `metadata.error` contains detailed explanation
- [ ] `metadata.requiresInstall` = 'jszip'
- [ ] Error explains how to fix (installation command)
- [ ] No console errors (warnings OK in dev mode)

**Expected Error Content:**

```
[DOCX loader unavailable - missing dependency]
```

**Expected Error Metadata:**

```typescript
{
  source: 'test.docx',
  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  error: 'JSZip is required for DOCX parsing but was not found.\n\nTo fix this, install jszip:\n  npm install jszip',
  requiresInstall: 'jszip'
}
```

### 3.2 PDF Loader Without pdfjs-dist

**Test Code:**

```tsx
import { PDFLoader } from '@clarity-chat/react'

const loader = new PDFLoader()
const file = new File(['PDF content'], 'test.pdf', {
  type: 'application/pdf',
})

const docs = await loader.load(file)
console.log(docs[0])
```

**Checklist:**

- [ ] Returns document object
- [ ] Error in bracketed format
- [ ] Metadata includes error details
- [ ] Message mentions 'pdfjs-dist' or 'PDF parsing library'
- [ ] Explains installation steps
- [ ] No crashes or unhandled rejections

**Expected Error Content:**

```
[Failed to load PDF: PDF parsing library not available]
```

### 3.3 Screen Reader Compatibility

When displaying error documents:

- [ ] Error content readable by screen reader
- [ ] Bracketed format clearly indicates error
- [ ] Metadata not read aloud (visual only)
- [ ] No confusing technical terms
- [ ] Clear next steps provided

---

## Test 4: Integration Testing

### 4.1 Complete Chat Interface

**Test Code:**

```tsx
import { ClarityChat } from '@clarity-chat/react'

// No optional peers installed
function App() {
  return (
    <ClarityChat
      config={{
        api: '/api/chat',
        enableCodeBlocks: true,
        enableMarkdown: true,
        enableFileUpload: true,
      }}
      initialMessages={[
        {
          role: 'assistant',
          content: `# Welcome

Here's some **code**:

\`\`\`typescript
const greeting = "Hello"
\`\`\`

[Documentation](https://example.com)`,
        },
      ]}
    />
  )
}
```

**Checklist:**

- [ ] Chat interface loads without errors
- [ ] Markdown renders as plain text (no crash)
- [ ] Code blocks show fallback warning
- [ ] File upload (if DOCX/PDF) shows error gracefully
- [ ] All UI elements keyboard accessible
- [ ] Screen reader can navigate entire interface
- [ ] No visual layout breaks
- [ ] Performance acceptable (no lag)

### 4.2 Keyboard Navigation Flow

Tab through entire interface:

1. [ ] Chat input field
2. [ ] Send button
3. [ ] Message content
4. [ ] Code block warning link
5. [ ] Copy button
6. [ ] Markdown links
7. [ ] Scroll to bottom button
8. [ ] Settings/menu buttons

**All focus indicators visible:** [ ] Yes [ ] No

### 4.3 Screen Reader Full Test

Navigate chat with screen reader:

- [ ] Messages announce sender (user/assistant)
- [ ] Message content reads correctly
- [ ] Headings in messages navigable
- [ ] Code blocks announce as code
- [ ] Links activate properly
- [ ] Buttons have clear labels
- [ ] Status updates announce (e.g., "Sending...")

---

## Test 5: Reduced Motion

### 5.1 System Preference

**Windows:** Settings → Accessibility → Visual effects → Animation effects: OFF

**macOS:** System Preferences → Accessibility → Display → Reduce motion: ON

**Checklist:**

- [ ] Code block warning fades in without animation
- [ ] Copy button state change instant (no fade)
- [ ] Expand/collapse instant (no slide animation)
- [ ] Markdown content appears instantly
- [ ] No motion sickness triggers
- [ ] Functionality still works perfectly

### 5.2 CSS Verification

Inspect styles with `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] Animations disabled or instant
- [ ] Transitions minimal (< 10ms)
- [ ] No auto-playing animations

---

## Test 6: High Contrast Mode

### 6.1 Windows High Contrast

Enable: Settings → Accessibility → Contrast themes → Select theme

**Checklist:**

- [ ] All text visible
- [ ] Focus indicators visible (yellow outline)
- [ ] Buttons have clear boundaries
- [ ] Links distinguishable from text
- [ ] Icons visible or replaced with text
- [ ] Code blocks have borders/backgrounds

### 6.2 Forced Colors Mode

**CSS Test:**

```css
@media (forced-colors: active) {
  /* Verify components adapt */
}
```

- [ ] Components respect system colors
- [ ] No invisible text
- [ ] Borders/outlines visible
- [ ] Focus still clear

---

## Test 7: Zoom and Reflow

### 7.1 Browser Zoom to 200%

**Steps:**

1. Load page
2. Press Cmd/Ctrl + Plus (+) to zoom to 200%
3. Verify layout

**Checklist:**

- [ ] No horizontal scrolling required
- [ ] Text reflows properly
- [ ] Buttons remain clickable
- [ ] Code blocks don't break layout
- [ ] Warning messages still readable
- [ ] Tab order still logical

### 7.2 Text-Only Zoom

**Steps:**

1. Browser settings → Text zoom: 200%
2. Verify text scales

**Checklist:**

- [ ] All text scales proportionally
- [ ] No text overflow
- [ ] Line spacing adequate
- [ ] Still readable

---

## Test 8: Mobile Accessibility

### 8.1 Touch Targets

**Minimum size: 44x44 CSS pixels**

Measure buttons:

- [ ] Copy button ≥ 44px
- [ ] Download button ≥ 44px
- [ ] Expand button ≥ 44px
- [ ] Links ≥ 44px tall
- [ ] Adequate spacing between targets (≥ 8px)

### 8.2 Mobile Screen Readers

**iOS VoiceOver:**

- [ ] Swipe right navigates elements
- [ ] Double-tap activates buttons
- [ ] All content readable

**Android TalkBack:**

- [ ] Same behavior as VoiceOver
- [ ] Gestures work properly

---

## Test 9: Error Recovery

### 9.1 Invalid File Upload

**Test:** Upload corrupted DOCX/PDF

**Checklist:**

- [ ] No crash or blank screen
- [ ] Error message displays
- [ ] Can close error/continue using app
- [ ] Error announced to screen reader
- [ ] Retry option available

### 9.2 Network Failure

**Test:** Load external code theme while offline

**Checklist:**

- [ ] Fallback theme loads
- [ ] No broken images
- [ ] Error message (if any) is graceful
- [ ] Can still use code blocks

---

## Test 10: Automated Scanning

### 10.1 axe DevTools

**Steps:**

1. Install axe DevTools browser extension
2. Open page with components
3. Run "Scan All of My Page"

**Checklist:**

- [ ] 0 Critical issues
- [ ] 0 Serious issues
- [ ] Review and fix Moderate issues
- [ ] Document Minor issues

### 10.2 Lighthouse Audit

**Steps:**

1. Open Chrome DevTools
2. Lighthouse tab → Accessibility
3. Generate report

**Checklist:**

- [ ] Accessibility score ≥ 95/100
- [ ] All critical audits pass
- [ ] Review failed audits (if any)

### 10.3 WAVE

**Steps:**

1. Visit https://wave.webaim.org/
2. Enter page URL
3. Review results

**Checklist:**

- [ ] 0 Errors
- [ ] Review Alerts
- [ ] Verify structure is logical

---

## Sign-Off

### Test Results Summary

**Total Tests Performed:** **\_\_\_**

**Tests Passed:** **\_\_\_**

**Tests Failed:** **\_\_\_**

**Critical Issues:** **\_\_\_**

**Accessibility Rating:** [ ] WCAG 2.1 A [ ] WCAG 2.1 AA [ ] WCAG 2.1 AAA

### Critical Issues Found

1. ***
2. ***
3. ***

### Recommendations

---

---

---

### Tester Sign-Off

**Name:** **********\_\_\_**********

**Date:** **********\_\_\_**********

**Signature:** **********\_\_\_**********

---

## Additional Resources

### Screen Readers

- NVDA: https://www.nvaccess.org/download/
- JAWS: https://www.freedomscientific.com/products/software/jaws/
- VoiceOver: Built into macOS/iOS

### Testing Tools

- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/
- Lighthouse: Built into Chrome DevTools
- Contrast Checker: https://webaim.org/resources/contrastchecker/

### WCAG Resources

- WCAG 2.1 Quick Reference: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM Articles: https://webaim.org/articles/
- A11y Project Checklist: https://www.a11yproject.com/checklist/
