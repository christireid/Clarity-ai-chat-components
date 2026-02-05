# Streaming Message Showcase

A comprehensive demonstration of real-time message streaming functionality with multiple scenarios, glassmorphism styling, and smooth animations.

## Features

- **Real-time message streaming simulation** - Token-by-token rendering with configurable speeds
- **Multiple streaming scenarios** - Fast (20ms), Normal (50ms), Slow (100ms), Code, and Multiline
- **Glassmorphism styled containers** - Modern glass effect with backdrop blur
- **Smooth animations** - Framer Motion powered transitions and cursor animations
- **Streaming indicators** - Visual feedback for active streaming
- **Real-time statistics** - Track characters streamed, speed, and elapsed time
- **Multi-stream comparison** - View multiple speeds side-by-side

## Installation

The streaming showcase is already integrated into the examples-showcase app. To run it:

```bash
cd apps/examples/examples-showcase
pnpm dev
```

Then navigate to the "Streaming" tab in the showcase.

## File Location

```
apps/examples/examples-showcase/src/demos/StreamingShowcase.tsx
```

## Usage

### Standalone Component

You can import and use the `StreamingMessage` component directly:

```tsx
import { StreamingMessage } from './demos/StreamingShowcase'

function MyComponent() {
  const [isStreaming, setIsStreaming] = useState(true)
  const content = "Your streaming content here..."

  return (
    <StreamingMessage
      content={content}
      speed={50}
      isStreaming={isStreaming}
      onComplete={() => setIsStreaming(false)}
      showCursor={true}
    />
  )
}
```

### Full Showcase

```tsx
import StreamingShowcase from './demos/StreamingShowcase'

function App() {
  return <StreamingShowcase />
}
```

## Component Props

### StreamingMessage

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | required | The full text content to stream |
| `speed` | `number` | required | Delay in milliseconds between characters |
| `isStreaming` | `boolean` | required | Whether streaming is active |
| `onComplete` | `() => void` | optional | Callback when streaming completes |
| `showCursor` | `boolean` | `true` | Show animated cursor |
| `className` | `string` | `''` | Additional CSS classes |

## Scenarios

### 1. Fast Streaming (20ms)
- Best for: Short messages, quick responses
- Speed: 20ms per character
- Color: Blue to Cyan gradient

### 2. Normal Streaming (50ms)
- Best for: Standard chat messages, typical AI responses
- Speed: 50ms per character
- Color: Purple to Pink gradient

### 3. Slow Streaming (100ms)
- Best for: Dramatic effect, complex queries
- Speed: 100ms per character
- Color: Green to Emerald gradient

### 4. Code Streaming (30ms)
- Best for: Code generation, syntax highlighting
- Speed: 30ms per character
- Color: Orange to Red gradient

### 5. Multiline Content (40ms)
- Best for: Markdown content, structured responses
- Speed: 40ms per character
- Color: Indigo to Purple gradient

## Styling

The showcase uses Tailwind CSS with custom glassmorphism effects:

```tsx
const glassStyles = {
  base: 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl',
  light: 'backdrop-blur-xl bg-white/70 border border-white/30 shadow-xl',
  dark: 'backdrop-blur-xl bg-black/30 border border-white/10 shadow-2xl',
}
```

## Animations

### Cursor Animation
```tsx
<motion.span
  animate={{ opacity: [1, 0, 1] }}
  transition={{ duration: 0.8, repeat: Infinity }}
  className="inline-block ml-1 w-2 h-5 bg-current align-middle"
/>
```

### Streaming Indicator
```tsx
<motion.div
  animate={{ y: [0, -5, 0] }}
  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
  className="w-2 h-2 bg-blue-500 rounded-full"
/>
```

### Progress Bar
```tsx
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.3 }}
  className="bg-gradient-to-r from-blue-500 to-cyan-500"
/>
```

## Implementation Details

### Token-by-Token Rendering

The component uses `useEffect` with `setTimeout` to simulate streaming:

```tsx
useEffect(() => {
  if (!isStreaming) {
    setDisplayedContent(content)
    return
  }

  if (currentIndex < content.length) {
    timeoutRef.current = setTimeout(() => {
      setDisplayedContent(content.slice(0, currentIndex + 1))
      setCurrentIndex(currentIndex + 1)
    }, speed)
  } else if (onComplete) {
    onComplete()
  }

  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }
}, [content, speed, isStreaming, currentIndex, onComplete])
```

### Statistics Tracking

Real-time stats are calculated and displayed:

```tsx
const progress = totalChars > 0 ? (charsStreamed / totalChars) * 100 : 0
const charsPerSecond = elapsed > 0 ? (charsStreamed / (elapsed / 1000)).toFixed(1) : '0'
```

## Integration with App.tsx

The showcase is lazy-loaded for performance:

```tsx
const StreamingShowcase = lazy(() => import('./demos/StreamingShowcase'))

// In render:
<Suspense fallback={<LoadingSpinner />}>
  <StreamingShowcase />
</Suspense>
```

## Dependencies

- React 18+
- Framer Motion 12+
- Tailwind CSS 3+

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance Considerations

1. **Memory Management**: Timeout refs are properly cleaned up
2. **Lazy Loading**: Component is code-split for faster initial load
3. **Memoization**: Callbacks use `useCallback` to prevent re-renders
4. **GPU Acceleration**: Animations use `transform` and `opacity` only

## Accessibility

- Proper ARIA labels on interactive elements
- Keyboard navigation support
- Respects `prefers-reduced-motion` (implement if needed)
- Semantic HTML structure

## Future Enhancements

- [ ] Add pause/resume functionality
- [ ] Support for markdown streaming
- [ ] Variable speed streaming (slow down for punctuation)
- [ ] Stream multiple messages simultaneously
- [ ] Add sound effects option
- [ ] Export functionality for stream recordings
- [ ] WebSocket integration for real streaming
- [ ] SSE (Server-Sent Events) integration

## Related Components

- `/packages/react/src/components/message/streaming-message.tsx` - Production streaming component
- `/packages/react/src/components/message/streaming-text-renderer.tsx` - Text renderer
- `/packages/react/src/hooks/streaming/use-streaming-sse.tsx` - SSE hook
- `/packages/react/src/hooks/streaming/use-streaming-websocket.tsx` - WebSocket hook

## License

MIT - Part of Clarity AI Chat Components

## Credits

Created as part of the Clarity Chat Components showcase. Uses Framer Motion for animations and Tailwind CSS for styling.
