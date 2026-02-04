# PromptComposer Accessibility Checklist

Quick reference for developers implementing accessibility fixes.

## Critical Fixes (P0) - Must Complete

### ✅ Keyboard Navigation

- [ ] **Suggestion chips** - Add Enter/Space activation
  ```tsx
  <button
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleSuggestionClick()
      }
    }}
  />
  ```

- [ ] **Arrow key navigation** - Implement for suggestion lists
  ```tsx
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    }
  }
  ```

- [ ] **Context expansion buttons** - Add keyboard support
- [ ] **Tab key navigation** - Ensure logical flow

### ✅ Focus Indicators

- [ ] **Add to all interactive elements**
  ```tsx
  className={cn(
    'base-styles',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-blue-500',
    'focus-visible:ring-offset-2'
  )}
  ```

- [ ] **Remove `focus:outline-none`** from textarea (line 352)
- [ ] **Add to suggestion chips** (lines 183-194)
- [ ] **Add to context buttons** (ContextItemCard.tsx:104-125)
- [ ] **Test contrast** - Verify 3:1 ratio

### ✅ ARIA Attributes

- [ ] **Main container**
  ```tsx
  <section
    role="region"
    aria-label="Prompt composer"
  >
  ```

- [ ] **Textarea**
  ```tsx
  <textarea
    aria-label="Message input"
    aria-describedby="token-budget error-message"
    aria-invalid={!!state.error}
    aria-required="true"
  />
  ```

- [ ] **Progress bar** (TokenBudgetIndicator.tsx:71-80)
  ```tsx
  <div
    role="progressbar"
    aria-valuenow={current}
    aria-valuemin={0}
    aria-valuemax={max}
    aria-label={`Token usage: ${current} of ${max}`}
  />
  ```

- [ ] **Suggestion list**
  ```tsx
  <div role="list" aria-label="Suggested prompts">
    <button role="listitem">...</button>
  </div>
  ```

- [ ] **Context items** - Add role="article" or semantic element

### ✅ Live Regions

- [ ] **Error messages** (PromptComposer.tsx:506-510)
  ```tsx
  <div
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    {state.error.message}
  </div>
  ```

- [ ] **Token budget updates** (TokenBudgetIndicator.tsx)
  ```tsx
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
  ```

- [ ] **Upload status** (AttachmentManager.tsx)
  ```tsx
  <div role="status" aria-live="polite">
    {isUploading ? 'Uploading...' : 'Upload complete'}
  </div>
  ```

- [ ] **Context items** - Announce when added/removed

### ✅ Combobox Pattern (ContextMentionInput.tsx)

- [ ] **Input ARIA attributes**
  ```tsx
  <textarea
    role="combobox"
    aria-expanded={showSuggestions}
    aria-controls="mention-suggestions"
    aria-autocomplete="list"
    aria-activedescendant={showSuggestions ? `suggestion-${selectedIndex}` : undefined}
  />
  ```

- [ ] **Suggestions list**
  ```tsx
  <div
    id="mention-suggestions"
    role="listbox"
    aria-label="Mention suggestions"
  >
    {suggestions.map((item, index) => (
      <button
        id={`suggestion-${index}`}
        role="option"
        aria-selected={index === selectedIndex}
      />
    ))}
  </div>
  ```

---

## Important Fixes (P1) - Before Release

### ✅ Semantic HTML

- [ ] **Wrap in form element**
  ```tsx
  <form
    onSubmit={(e) => {
      e.preventDefault()
      actions.submit()
    }}
    aria-label="Prompt composer form"
  >
  ```

- [ ] **Add label for textarea**
  ```tsx
  <label htmlFor="prompt-input" className="sr-only">
    Message input
  </label>
  <textarea id="prompt-input" />
  ```

- [ ] **File input labeling** (AttachmentManager.tsx:232-239)
  ```tsx
  <input
    id="file-upload"
    type="file"
    className="sr-only"
    aria-label="Upload files"
    aria-describedby="file-constraints"
  />
  <div id="file-constraints" className="sr-only">
    Maximum {maxFiles} files, {formatFileSize(maxFileSize)} each
  </div>
  ```

### ✅ Color Independence

- [ ] **Token status icons** (TokenBudgetIndicator.tsx:54-59)
  ```tsx
  const statusInfo = useMemo(() => {
    if (usage < 60) return { color: 'green', icon: '✓', label: 'Good' }
    if (usage < 80) return { color: 'yellow', icon: '⚠', label: 'Warning' }
    return { color: 'red', icon: '✕', label: 'Critical' }
  }, [usage])

  <span aria-label={statusInfo.label}>
    {statusInfo.icon}
  </span>
  ```

- [ ] **Context level badges** - Add text labels
- [ ] **Any color-only indicators** - Add icon/text alternative

### ✅ Focus Management

- [ ] **Focus trap** for command palette
  ```tsx
  const trapRef = useFocusTrap(showCommands)
  ```

- [ ] **Focus restoration** after modal close
  ```tsx
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (showModal) {
      previousFocus.current = document.activeElement as HTMLElement
    } else {
      previousFocus.current?.focus()
    }
  }, [showModal])
  ```

- [ ] **Initial focus** on mount (optional)
  ```tsx
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  ```

### ✅ Button Types

- [ ] **Add type="button"** to all non-submit buttons
- [ ] **Verify submit button** has correct type
- [ ] **Icon buttons** have descriptive aria-label

### ✅ Menu/Listbox Roles

- [ ] **Command palette** (CommandPalette.tsx)
  ```tsx
  <div
    role="menu"
    aria-label="Available commands"
  >
    <button role="menuitem">...</button>
  </div>
  ```

---

## Nice to Have (P2) - Future Improvements

### ✅ Keyboard Shortcuts Help

- [ ] Add "?" key to show shortcuts modal
- [ ] Document all keyboard commands
- [ ] Add to ARIA labels

### ✅ Skip Links

- [ ] Add skip to main input
  ```tsx
  <a href="#prompt-input" className="sr-only focus:not-sr-only">
    Skip to message input
  </a>
  ```

### ✅ Enhanced Tooltips

- [ ] Add to all icon buttons
- [ ] Make dismissible with Escape
- [ ] Ensure they don't trap focus

### ✅ High Contrast Mode

- [ ] Test with Windows High Contrast
- [ ] Add forced-colors media query
- [ ] Ensure borders remain visible

---

## Testing Checklist

### Automated Testing

- [ ] Install jest-axe
  ```bash
  npm install --save-dev jest-axe
  ```

- [ ] Add accessibility test
  ```tsx
  it('should have no accessibility violations', async () => {
    const { container } = render(<PromptComposer {...props} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  ```

- [ ] Run Lighthouse CI in pipeline

### Manual Testing

- [ ] **Keyboard only** - Disconnect mouse, test all functionality
- [ ] **Screen reader** - Test with NVDA or VoiceOver
- [ ] **Zoom to 200%** - Verify no horizontal scroll
- [ ] **Contrast check** - Use dev tools color picker
- [ ] **High contrast mode** - Enable and verify visibility

---

## Quick Reference: Common Patterns

### Accessible Button

```tsx
<button
  type="button"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
  aria-label="Descriptive label"
  className={cn(
    'base-styles',
    'focus-visible:ring-2 focus-visible:ring-blue-500'
  )}
>
  <svg aria-hidden="true">...</svg>
</button>
```

### Accessible List

```tsx
<div role="list" aria-label="List description">
  {items.map((item) => (
    <div key={item.id} role="listitem">
      {item.content}
    </div>
  ))}
</div>
```

### Accessible Alert

```tsx
{error && (
  <div
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    {error}
  </div>
)}
```

### Accessible Progress

```tsx
<div
  role="progressbar"
  aria-valuenow={current}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-label={`Progress: ${percent}%`}
>
  <div style={{ width: `${percent}%` }} />
</div>
```

### Accessible Combobox

```tsx
<div>
  <label htmlFor="combo-input">Search</label>
  <input
    id="combo-input"
    role="combobox"
    aria-expanded={showList}
    aria-controls="combo-list"
    aria-autocomplete="list"
    aria-activedescendant={showList ? `option-${activeIndex}` : undefined}
  />
  {showList && (
    <ul id="combo-list" role="listbox">
      {options.map((opt, i) => (
        <li
          key={opt.id}
          id={`option-${i}`}
          role="option"
          aria-selected={i === activeIndex}
        >
          {opt.label}
        </li>
      ))}
    </ul>
  )}
</div>
```

---

## File-Specific TODOs

### PromptComposer.tsx

- [ ] Lines 171-178: Add section role and aria-label
- [ ] Lines 181-195: Add list roles to suggestions
- [ ] Lines 183-194: Add keyboard navigation to suggestion chips
- [ ] Lines 339-358: Add ARIA attributes to textarea
- [ ] Lines 432-450: Ensure Settings button accessible
- [ ] Lines 473-488: Verify Submit button type
- [ ] Lines 506-510: Add role="alert" to error display

### TokenBudgetIndicator.tsx

- [ ] Lines 68-85: Add progressbar role and ARIA attributes
- [ ] Lines 54-59: Add non-color status indicators
- [ ] Add aria-live="polite" for updates

### ContextItemCard.tsx

- [ ] Lines 48-53: Add semantic element or role
- [ ] Lines 68-81: Add text labels to color badges
- [ ] Lines 104-125: Add keyboard navigation to buttons
- [ ] Lines 132-145: Verify remove button accessibility

### ContextMentionInput.tsx

- [ ] Lines 358-375: Implement combobox ARIA pattern
- [ ] Lines 378-449: Add listbox role to suggestions
- [ ] Add aria-expanded, aria-controls, aria-activedescendant

### CommandPalette.tsx

- [ ] Lines 176-285: Add menu or listbox role
- [ ] Add aria-activedescendant
- [ ] Implement focus trap

### AttachmentManager.tsx

- [ ] Lines 232-239: Add proper file input labeling
- [ ] Lines 240-267: Add aria-label to buttons
- [ ] Add aria-live for upload status

### VoiceInput.tsx

- [ ] Lines 271-276: Verify button aria-label
- [ ] Add announcement for recording state changes

---

## Useful Resources

- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM ARIA Techniques](https://webaim.org/techniques/aria/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

**Last Updated:** 2026-01-28
**Target Completion:** Before next release
**Estimated Effort:** 90-135 hours
