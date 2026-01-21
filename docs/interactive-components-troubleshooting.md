# Interactive Components Troubleshooting Guide

This guide helps diagnose and resolve common issues with Clarity Chat's interactive components.

## Table of Contents

- [Performance Issues](#performance-issues)
- [Accessibility Problems](#accessibility-problems)
- [Interaction Bugs](#interaction-bugs)
- [Styling Issues](#styling-issues)
- [Build and Runtime Errors](#build-and-runtime-errors)

## Performance Issues

### Input Lag in AdvancedChatInput

**Symptoms:**
- Text appears with delay after typing
- Input feels unresponsive
- Suggestion loading is slow

**Diagnosis:**
```bash
# Check if useDebounce is properly imported
grep -r "useDebounce" packages/react/src/components/input/advanced-chat-input.tsx

# Verify debounce delay is reasonable (should be 150ms)
grep -A 5 -B 5 "useDebounce" packages/react/src/components/input/advanced-chat-input.tsx
```

**Solutions:**

1. **Immediate Visual Feedback Issue:**
   ```typescript
   // Ensure onChange is called immediately for visual updates
   const handleChange = (value: string) => {
     setValue(value) // Immediate visual update
     // Expensive operations can be debounced separately
   }
   ```

2. **Suggestion Loading Performance:**
   ```typescript
   // Use debounced queries for expensive operations
   const debouncedQuery = useDebounce(query, 150)
   // Only filter/load suggestions when debouncedQuery changes
   ```

**Prevention:**
- Always separate visual feedback from expensive operations
- Use `useDebounce` for API calls and heavy computations
- Test with rapid typing scenarios

### Scroll Jumping in VirtualizedMessageList

**Symptoms:**
- Scroll position jumps unexpectedly when new messages arrive
- User loses their place in conversation
- Auto-scroll doesn't work properly

**Diagnosis:**
```bash
# Check scroll preservation logic
grep -A 10 "scrollOffset" packages/react/src/components/chat/virtualized-message-list.tsx

# Verify auto-scroll conditions
grep -A 5 "autoScrollToBottom" packages/react/src/components/chat/virtualized-message-list.tsx
```

**Solutions:**

1. **Scroll Position Preservation:**
   ```typescript
   const [scrollOffset, setScrollOffset] = useState(0)

   const handleScroll = useCallback(({ scrollOffset: newOffset }) => {
     setScrollOffset(newOffset)
     // ... other scroll logic
   }, [])
   ```

2. **Smart Auto-Scroll:**
   ```typescript
   useEffect(() => {
     if (autoScrollToBottom && hasNewMessages && isNearBottom) {
       listRef.current?.scrollToItem(messages.length - 1, 'end')
     } else if (hasNewMessages && !isNearBottom) {
       // Preserve position for scrolled-up users
       setTimeout(() => {
         listRef.current?.scrollToOffset(scrollOffset)
       }, 0)
     }
   }, [messages.length, autoScrollToBottom, scrollOffset])
   ```

**Prevention:**
- Always track scroll position during data updates
- Implement smart auto-scroll logic
- Test with various scroll positions

### Slow CommandPalette Search

**Symptoms:**
- Search results appear with significant delay
- Input lag during typing
- Performance degrades with more commands

**Diagnosis:**
```bash
# Check for debouncing implementation
grep -r "useDebounce" packages/react/src/components/navigation/command-palette.tsx

# Verify filtering is using debounced search
grep -A 5 "filteredItems.*useMemo" packages/react/src/components/navigation/command-palette.tsx
```

**Solutions:**

1. **Add Search Debouncing:**
   ```typescript
   const [search, setSearch] = useState('')
   const debouncedSearch = useDebounce(search, 150)

   const filteredItems = useMemo(() => {
     if (!debouncedSearch) return items
     // Expensive filtering logic here
   }, [items, debouncedSearch]) // Use debounced value
   ```

2. **Optimize Filtering Logic:**
   ```typescript
   // Use efficient string operations
   return items.filter(item =>
     item.label.toLowerCase().includes(query.toLowerCase()) ||
     item.description?.toLowerCase().includes(query.toLowerCase())
   )
   ```

**Prevention:**
- Always debounce search operations
- Use efficient filtering algorithms
- Test with large datasets (1000+ items)

### Slow Message Markdown Rendering

**Symptoms:**
- Messages take 500ms+ to appear
- UI blocks during markdown processing
- Complex formatting causes delays

**Diagnosis:**
```bash
# Check for lazy rendering implementation
grep -r "LazyMarkdownRenderer" packages/react/src/components/message/message.tsx

# Verify ReactMarkdown is not called directly in render
grep -A 5 "ReactMarkdown" packages/react/src/components/message/message.tsx
```

**Solutions:**

1. **Implement Lazy Rendering:**
   ```typescript
   const LazyMarkdownRenderer = React.memo(function LazyMarkdownRenderer({
     content,
     components
   }) {
     const [renderedContent, setRenderedContent] = React.useState(null)

     React.useEffect(() => {
       // Defer expensive rendering
       const timer = setTimeout(() => {
         setRenderedContent(
           <ReactMarkdown components={components}>
             {content}
           </ReactMarkdown>
         )
       }, 0)

       return () => clearTimeout(timer)
     }, [content, components])

     // Show plain text initially
     return renderedContent || <div>{content}</div>
   })
   ```

2. **Fallback Display:**
   ```typescript
   // Always show something immediately
   return renderedContent || (
     <div className="text-muted-foreground">
       {content.split('\n').map((line, i) => (
         <React.Fragment key={i}>
           {line}
           {i < content.split('\n').length - 1 && <br />}
         </React.Fragment>
       ))}
     </div>
   )
   ```

**Prevention:**
- Never call heavy computations directly in render
- Use lazy loading for expensive operations
- Provide immediate fallback content

### Animation Stuttering in StreamingMessage

**Symptoms:**
- Text streaming has inconsistent timing
- Visual stuttering during animations
- 60fps not maintained

**Diagnosis:**
```bash
# Check for requestAnimationFrame usage
grep -r "requestAnimationFrame" packages/react/src/components/message/streaming-message.tsx

# Verify animation timing logic
grep -A 10 "useSmoothStreaming" packages/react/src/components/message/streaming-message.tsx
```

**Solutions:**

1. **Use Precise 60fps Timing:**
   ```typescript
   const animate = (timestamp: number) => {
     if (!lastUpdateRef.current) {
       lastUpdateRef.current = timestamp
     }

     const elapsed = timestamp - lastUpdateRef.current

     // Only update at ~60fps intervals (16.67ms)
     if (elapsed >= 16.67) {
       lastUpdateRef.current = timestamp

       setDisplayedContent(prev => {
         // Calculate characters for this frame
         const charsToAdd = Math.max(1, Math.floor(elapsed * charsPerMs))
         const nextLength = Math.min(prev.length + charsToAdd, target.length)
         return target.slice(0, nextLength)
       })
     }

     if (displayedContent.length < targetContentRef.current.length) {
       animationFrameRef.current = requestAnimationFrame(animate)
     }
   }
   ```

2. **Proper Cleanup:**
   ```typescript
   React.useEffect(() => {
     animationFrameRef.current = requestAnimationFrame(animate)

     return () => {
       if (animationFrameRef.current) {
         cancelAnimationFrame(animationFrameRef.current)
       }
     }
   }, [content, isStreaming, enabled, charsPerMs])
   ```

**Prevention:**
- Always use `requestAnimationFrame` for smooth animations
- Maintain consistent timing intervals
- Clean up animation frames properly

## Accessibility Problems

### Dialog Focus Trap Issues

**Symptoms:**
- Focus escapes dialog on mobile
- Keyboard navigation doesn't work in dialogs
- Screen readers can't navigate properly

**Diagnosis:**
```bash
# Check mobile focus trap implementation
grep -r "useMobileFocusTrap" packages/primitives/src/components/ui/dialog.tsx

# Verify focus management logic
grep -A 10 "useFocusTrap" packages/primitives/src/components/ui/dialog.tsx
```

**Solutions:**

1. **Mobile-Specific Focus Handling:**
   ```typescript
   function useMobileFocusTrap(contentRef: RefObject<HTMLElement | null>, isOpen: boolean) {
     React.useEffect(() => {
       if (!isOpen) return

       const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
         navigator.userAgent
       )

       if (isMobile) {
         // Mobile-specific focus trapping logic
         const handleFocus = (e: FocusEvent) => {
           // Keep focus within dialog bounds
         }

         document.addEventListener('focusin', handleFocus, true)
         return () => document.removeEventListener('focusin', handleFocus, true)
       }
     }, [isOpen])
   }
   ```

2. **Keyboard Navigation:**
   ```typescript
   // Ensure proper ARIA attributes
   <DialogContent
     role="dialog"
     aria-labelledby="dialog-title"
     aria-describedby="dialog-description"
   >
   ```

**Prevention:**
- Test dialogs on actual mobile devices
- Implement mobile-specific focus handling
- Use proper ARIA attributes

### Button Ripple Performance Issues

**Symptoms:**
- Multiple ripple animations overlap
- UI freezing with rapid clicks
- Memory leaks from animation accumulation

**Diagnosis:**
```bash
# Check ripple effect implementation
grep -r "useRippleEffect" packages/primitives/src/components/button.tsx

# Verify animation cleanup logic
grep -A 10 "addRipple" packages/primitives/src/hooks/use-ripple-effect.ts
```

**Solutions:**

1. **Prevent Ripple Accumulation:**
   ```typescript
   const [ripples, setRipples] = useState<RippleData[]>([])
   const isRipplingRef = useRef(false)

   const addRipple = useCallback((x: number, y: number) => {
     if (isRipplingRef.current) return // Prevent overlapping ripples

     isRipplingRef.current = true
     const newRipple = { id: Date.now(), x, y }

     setRipples(prev => [newRipple]) // Replace, don't accumulate

     setTimeout(() => {
       setRipples(prev => prev.filter(r => r.id !== newRipple.id))
       isRipplingRef.current = false
     }, 600) // Ripple duration
   }, [])
   ```

2. **Memory Cleanup:**
   ```typescript
   useEffect(() => {
     return () => {
       // Clean up any pending ripples
       isRipplingRef.current = false
     }
   }, [])
   ```

**Prevention:**
- Limit to one active ripple at a time
- Implement proper cleanup
- Test with rapid clicking scenarios

## Interaction Bugs

### Form Input Issues

**Symptoms:**
- Values not updating correctly
- Validation not triggering
- Submit not working

**Common Causes & Solutions:**

1. **Uncontrolled vs Controlled Components:**
   ```typescript
   // ✅ Correct: Controlled component
   const [value, setValue] = useState('')
   <Input value={value} onChange={setValue} />

   // ❌ Wrong: Mixing controlled/uncontrolled
   <Input value={value} defaultValue="initial" onChange={setValue} />
   ```

2. **Event Handler Issues:**
   ```typescript
   // ✅ Correct: Proper event handling
   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
     setValue(e.target.value)
   }

   // ❌ Wrong: Missing event parameter
   const handleChange = () => {
     setValue('hardcoded value')
   }
   ```

### State Synchronization Issues

**Symptoms:**
- Component state not updating
- Props not reflecting changes
- Race conditions

**Solutions:**

1. **Use useEffect for Side Effects:**
   ```typescript
   useEffect(() => {
     // Update derived state when props change
     setDerivedState(calculateFromProps(props))
   }, [props])
   ```

2. **Avoid State Mutations:**
   ```typescript
   // ✅ Correct: Immutable updates
   setState(prev => ({ ...prev, count: prev.count + 1 }))

   // ❌ Wrong: Direct mutation
   state.count += 1
   setState(state)
   ```

## Styling Issues

### CSS-in-JS Problems

**Symptoms:**
- Styles not applying correctly
- Class name conflicts
- Theme variables not working

**Solutions:**

1. **Check Class Variance Authority (CVA) Setup:**
   ```typescript
   const buttonVariants = cva(
     'inline-flex items-center justify-center rounded-md text-sm font-medium',
     {
       variants: {
         variant: {
           default: 'bg-primary text-primary-foreground',
           destructive: 'bg-destructive text-destructive-foreground',
         },
         size: {
           default: 'h-10 px-4 py-2',
           sm: 'h-9 px-3',
         },
       },
       defaultVariants: {
         variant: 'default',
         size: 'default',
       },
     }
   )
   ```

2. **Theme Provider Issues:**
   ```typescript
   // Ensure ThemeProvider wraps your app
   <ThemeProvider>
     <YourApp />
   </ThemeProvider>
   ```

### Responsive Design Issues

**Symptoms:**
- Components don't work on mobile
- Touch targets too small
- Layout breaks on different screen sizes

**Solutions:**

1. **Touch Target Sizes:**
   ```typescript
   // Minimum 44x44px touch targets
   const buttonClasses = 'min-h-[44px] min-w-[44px] px-4 py-2'
   ```

2. **Mobile-Specific Behavior:**
   ```typescript
   const isMobile = useMediaQuery('(max-width: 768px)')

   return (
     <Component
       variant={isMobile ? 'mobile' : 'desktop'}
       size={isMobile ? 'lg' : 'default'}
     />
   )
   ```

## Build and Runtime Errors

### TypeScript Errors

**Common Issues:**

1. **Missing Type Definitions:**
   ```typescript
   // Add proper type imports
   import type { ComponentProps } from 'react'
   import type { ButtonProps } from '@clarity-chat/primitives'
   ```

2. **Ref Type Issues:**
   ```typescript
   // ✅ Correct ref typing
   const ref = useRef<HTMLDivElement>(null)

   // ❌ Wrong: Missing generic parameter
   const ref = useRef(null)
   ```

### Import/Export Issues

**Symptoms:**
- Module not found errors
- Tree shaking issues
- Bundle size problems

**Solutions:**

1. **Check Package Exports:**
   ```json
   // package.json
   {
     "exports": {
       ".": {
         "types": "./dist/index.d.ts",
         "import": "./dist/index.js"
       },
       "./core": {
         "types": "./dist/core.d.ts",
         "import": "./dist/core.js"
       }
     }
   }
   ```

2. **Tree Shaking Issues:**
   ```typescript
   // Use named exports for better tree shaking
   export { Button } from './components/button'
   export type { ButtonProps } from './components/button'

   // Avoid default exports when possible
   // export default Button // ❌ Not tree-shakeable
   ```

### Memory Leaks

**Symptoms:**
- Performance degrades over time
- Components don't clean up properly
- Memory usage increases with usage

**Solutions:**

1. **Clean Up Effects:**
   ```typescript
   useEffect(() => {
     const timer = setTimeout(() => doSomething(), 1000)

     return () => clearTimeout(timer) // ✅ Cleanup
   }, [])
   ```

2. **Event Listener Cleanup:**
   ```typescript
   useEffect(() => {
     const handleResize = () => setWindowSize(getWindowSize())
     window.addEventListener('resize', handleResize)

     return () => window.removeEventListener('resize', handleResize) // ✅ Cleanup
   }, [])
   ```

3. **Animation Cleanup:**
   ```typescript
   useEffect(() => {
     const animationId = requestAnimationFrame(animate)

     return () => cancelAnimationFrame(animationId) // ✅ Cleanup
   }, [])
   ```

## Testing Checklist

When troubleshooting interactive components, run through this checklist:

### Performance Testing
- [ ] Type rapidly in inputs - no lag?
- [ ] Scroll through large lists - smooth?
- [ ] Open/close dialogs rapidly - no memory issues?
- [ ] Search through large datasets - responsive?

### Accessibility Testing
- [ ] Keyboard navigation works (Tab, Enter, Escape, arrow keys)?
- [ ] Screen reader announces properly?
- [ ] Focus indicators visible?
- [ ] Touch targets meet minimum size (44x44px)?

### Interaction Testing
- [ ] All user actions produce expected results?
- [ ] State updates correctly?
- [ ] Error states handled gracefully?
- [ ] Loading states shown appropriately?

### Cross-Browser Testing
- [ ] Works in Chrome, Firefox, Safari, Edge?
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)?
- [ ] Different screen sizes and orientations?

### Memory and Performance Monitoring
- [ ] No memory leaks in Chrome DevTools?
- [ ] React DevTools shows no unnecessary re-renders?
- [ ] Bundle analyzer shows reasonable sizes?

## Getting Help

If you encounter issues not covered here:

1. **Check Existing Issues:** Search the GitHub repository for similar problems
2. **Create a Minimal Reproduction:** Isolate the issue in a clean environment
3. **Include Debug Information:**
   - Browser and version
   - OS and version
   - Component usage example
   - Error messages and stack traces
   - Performance metrics if applicable

4. **Use the Right Channel:**
   - Bug reports: GitHub Issues
   - Questions: GitHub Discussions
   - Security issues: security@clarity.chat