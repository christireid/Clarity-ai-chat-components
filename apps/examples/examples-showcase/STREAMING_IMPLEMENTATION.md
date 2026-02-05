# Streaming Message Implementation Guide

This document provides a comprehensive overview of the streaming message demonstrations created for the Clarity Chat Components Showcase.

## Overview

Two streaming demonstrations have been created:

1. **StreamingShowcase.tsx** - Comprehensive, feature-rich demonstration
2. **SimpleStreamingDemo.tsx** - Simplified, easy-to-integrate version

## Files Created

### 1. StreamingShowcase.tsx
**Location**: `/apps/examples/examples-showcase/src/demos/StreamingShowcase.tsx`

**Features**:
- 5 different streaming scenarios (Fast, Normal, Slow, Code, Multiline)
- Glassmorphism styled containers with backdrop blur effects
- Real-time statistics tracking (chars/sec, progress, elapsed time)
- Framer Motion animations for smooth transitions
- Multi-stream comparison view
- Streaming indicators with bouncing dots
- Progress bars and visual feedback
- Responsive grid layouts

**Size**: ~800 lines of code

**Dependencies**:
- React 18+
- Framer Motion 12+
- Tailwind CSS 3+

### 2. SimpleStreamingDemo.tsx
**Location**: `/apps/examples/examples-showcase/src/demos/SimpleStreamingDemo.tsx`

**Features**:
- 3 streaming speeds (Fast: 20ms, Normal: 50ms, Slow: 100ms)
- Minimal dependencies (React only)
- Simple animated cursor
- Clean, straightforward implementation
- Easy to understand and modify

**Size**: ~150 lines of code

**Dependencies**:
- React 18+
- Tailwind CSS 3+

### 3. Documentation Files

- `STREAMING_DEMO.md` - Comprehensive documentation for StreamingShowcase
- `src/demos/README.md` - Guide for all demos in the showcase
- `STREAMING_IMPLEMENTATION.md` - This file

## Core Concepts

### Token-by-Token Streaming

Both implementations use a similar core mechanism:

```tsx
useEffect(() => {
  if (currentIndex < content.length) {
    timeoutRef.current = setTimeout(() => {
      setDisplayedContent(content.slice(0, currentIndex + 1))
      setCurrentIndex(currentIndex + 1)
    }, speed)
  }

  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }
}, [content, speed, currentIndex])
```

**Key Points**:
1. Uses `useState` to track current position
2. `setTimeout` for controlled delay between characters
3. Cleanup function prevents memory leaks
4. `useEffect` dependencies ensure proper updates

### Animated Cursor

Simple implementation:
```tsx
<span className="inline-block ml-1 w-2 h-5 bg-blue-500 animate-pulse" />
```

Advanced implementation with Framer Motion:
```tsx
<motion.span
  animate={{ opacity: [1, 0, 1] }}
  transition={{ duration: 0.8, repeat: Infinity }}
  className="inline-block ml-1 w-2 h-5 bg-current align-middle"
/>
```

## Integration Options

### Option 1: Add to App.tsx Navigation (Recommended)

1. Import the demo:
```tsx
import { StreamingShowcase } from './demos/StreamingShowcase'
// or
import { SimpleStreamingDemo } from './demos/SimpleStreamingDemo'
```

2. Add to View type:
```tsx
type View =
  | 'playground'
  | 'streaming'  // Add this
  | 'components'
  // ... other views
```

3. Add navigation button:
```tsx
<button
  className={currentView === 'streaming' ? 'active' : ''}
  onClick={() => setCurrentView('streaming')}
>
  Streaming
</button>
```

4. Add to renderView switch:
```tsx
case 'streaming':
  return <StreamingShowcase />
  // or <SimpleStreamingDemo />
```

### Option 2: Lazy Loading (Performance)

```tsx
const StreamingShowcase = lazy(() => import('./demos/StreamingShowcase'))

// In render:
<Suspense fallback={
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-2xl">Loading...</div>
  </div>
}>
  <StreamingShowcase />
</Suspense>
```

### Option 3: Standalone Page

Both demos can run independently:

```tsx
import StreamingShowcase from './demos/StreamingShowcase'

function StreamingPage() {
  return <StreamingShowcase />
}
```

## Streaming Scenarios

### StreamingShowcase Scenarios

| Scenario | Speed | Use Case | Color Scheme |
|----------|-------|----------|--------------|
| Fast | 20ms | Short messages, quick responses | Blue → Cyan |
| Normal | 50ms | Standard chat, AI responses | Purple → Pink |
| Slow | 100ms | Dramatic effect, complex queries | Green → Emerald |
| Code | 30ms | Code generation, syntax highlighting | Orange → Red |
| Multiline | 40ms | Markdown, structured content | Indigo → Purple |

### SimpleStreamingDemo Scenarios

| Scenario | Speed | Description |
|----------|-------|-------------|
| Fast | 20ms | Quick streaming demonstration |
| Normal | 50ms | Comfortable reading pace |
| Slow | 100ms | Deliberate, thoughtful appearance |

## Styling Guide

### Glassmorphism Effects

```tsx
// Base glass effect
const glassStyles = {
  base: 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl',
  light: 'backdrop-blur-xl bg-white/70 border border-white/30 shadow-xl',
  dark: 'backdrop-blur-xl bg-black/30 border border-white/10 shadow-2xl',
}
```

### Gradient Backgrounds

```tsx
// Page background
className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"

// Dark mode
className="dark:from-gray-900 dark:via-purple-900 dark:to-gray-900"
```

### Text Gradients

```tsx
className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
```

## Animation Patterns

### Entrance Animations

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
```

### Button Interactions

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

### Streaming Indicators

```tsx
<motion.div
  animate={{ y: [0, -5, 0] }}
  transition={{
    duration: 0.6,
    repeat: Infinity,
    delay: 0
  }}
  className="w-2 h-2 bg-blue-500 rounded-full"
/>
```

### Progress Bars

```tsx
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.3 }}
/>
```

## Component Architecture

### StreamingShowcase Structure

```
StreamingShowcase/
├── StreamingMessage (Core streaming component)
├── StreamingIndicator (Animated dots)
├── StreamStats (Real-time statistics)
├── Scenario selector (Grid of scenario buttons)
├── Main streaming area (Primary demo)
├── Stats panel (Sidebar with metrics)
├── Multi-stream comparison (Side-by-side view)
└── Info cards (Features and implementation)
```

### SimpleStreamingDemo Structure

```
SimpleStreamingDemo/
├── SimpleStreaming (Core component)
├── Scenario selector (Speed buttons)
├── Streaming container (Display area)
├── Controls (Start/Stop buttons)
└── Feature cards (Info panels)
```

## Performance Considerations

### Memory Management

```tsx
// Always cleanup timeouts
useEffect(() => {
  // ... streaming logic

  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }
}, [dependencies])
```

### Optimized Animations

```tsx
// Use GPU-accelerated properties only
style={{
  willChange: 'opacity, transform'
}}
```

### Memoization

```tsx
const handleStart = useCallback(() => {
  setIsStreaming(true)
}, [])
```

## Testing Checklist

- [ ] Streaming starts and stops correctly
- [ ] Cursor animation is smooth
- [ ] Statistics update in real-time
- [ ] All scenarios work properly
- [ ] Responsive on mobile devices
- [ ] No memory leaks (check DevTools)
- [ ] Works in all major browsers
- [ ] Accessible via keyboard
- [ ] Dark mode support (if applicable)

## Accessibility Features

### Semantic HTML
```tsx
<button aria-label="Start streaming" disabled={isStreaming}>
<div role="status" aria-live="polite">
```

### Keyboard Navigation
- Tab to navigate between buttons
- Enter/Space to activate
- Escape to stop streaming (could be added)

### Reduced Motion Support

Could be added:
```tsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

if (prefersReducedMotion) {
  // Show content instantly
  setDisplayedContent(content)
}
```

## Real-World Integration

### With Clarity Chat Components

```tsx
import { StreamingMessage } from '@clarity-chat/react'
import { useStreamingSSE } from '@clarity-chat/react'

function ChatInterface() {
  const { data, isStreaming } = useStreamingSSE({
    url: '/api/chat/stream'
  })

  return (
    <StreamingMessage
      content={data}
      isStreaming={isStreaming}
      smoothStreaming={true}
      streamingSpeed="normal"
    />
  )
}
```

### With API Endpoints

```tsx
async function streamResponse() {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: 'Hello' })
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    setContent(prev => prev + chunk)
  }
}
```

## Troubleshooting

### Issue: Streaming doesn't start
**Solution**: Check that `isStreaming` is true and content is not empty

### Issue: Cursor doesn't animate
**Solution**: Ensure Framer Motion is installed or use CSS animation

### Issue: Memory leak warnings
**Solution**: Verify cleanup in useEffect return function

### Issue: Animations are janky
**Solution**: Use GPU-accelerated properties (transform, opacity)

### Issue: Content appears instantly
**Solution**: Check speed value is greater than 0

## Future Enhancements

Potential additions:
- [ ] Pause/resume functionality
- [ ] Variable speed (slow down for punctuation)
- [ ] Markdown streaming with syntax highlighting
- [ ] Sound effects option
- [ ] WebSocket integration
- [ ] SSE (Server-Sent Events) support
- [ ] Export stream recordings
- [ ] Multi-language support
- [ ] Custom cursor styles

## Related Files

### Production Components
- `/packages/react/src/components/message/streaming-message.tsx`
- `/packages/react/src/components/message/streaming-text-renderer.tsx`
- `/packages/react/src/components/ai/streaming-progress.tsx`

### Hooks
- `/packages/react/src/hooks/streaming/use-streaming-sse.tsx`
- `/packages/react/src/hooks/streaming/use-streaming-websocket.tsx`

### Examples
- `/packages/react/src/examples/streaming-chat-example.tsx`
- `/packages/memory/docs/examples/05-streaming.tsx`

## Quick Start Commands

```bash
# Navigate to showcase
cd apps/examples/examples-showcase

# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Code Examples

### Basic Streaming

```tsx
function BasicStreaming() {
  const [text, setText] = useState('')
  const content = "Hello, this is streaming text!"
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < content.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + content[index])
        setIndex(prev => prev + 1)
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [index])

  return <div>{text}▋</div>
}
```

### With Statistics

```tsx
function StreamingWithStats() {
  const [stats, setStats] = useState({
    charsStreamed: 0,
    startTime: Date.now(),
    charsPerSecond: 0
  })

  useEffect(() => {
    const elapsed = (Date.now() - stats.startTime) / 1000
    const cps = stats.charsStreamed / elapsed
    setStats(prev => ({ ...prev, charsPerSecond: cps }))
  }, [stats.charsStreamed])

  return (
    <div>
      <div>Speed: {stats.charsPerSecond.toFixed(1)} chars/sec</div>
    </div>
  )
}
```

## License

MIT - Part of Clarity AI Chat Components

## Support

For issues or questions:
1. Check the documentation files
2. Review the example implementations
3. Consult the main Clarity Chat Components docs
4. Open an issue on GitHub

---

**Created**: January 2026
**Last Updated**: January 2026
**Version**: 1.0.0
