# Basic Chat Demo

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchristireid%2FClarity-ai-chat-components&project-name=basic-chat&root-directory=apps%2Fexamples%2Fbasic-chat)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/christireid/Clarity-ai-chat-components/tree/main/apps/examples/basic-chat)

A simple, polished chat application showcasing core features of Clarity Chat Components.

## Features

✅ **Auto-Scroll** - Messages automatically scroll into view  
✅ **Error Recovery** - Graceful error handling with retry  
✅ **Token Tracking** - Real-time token usage display  
✅ **Realistic Typing** - AI responses with typing animation  
✅ **Error Boundary** - Crash protection  
✅ **Network Status** - Connection status indicator  
✅ **Responsive Design** - Works on mobile and desktop  
✅ **TypeScript** - Full type safety

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## What's Demonstrated

### 1. Essential Hooks

```typescript
// Auto-scrolling
const scrollRef = useAutoScroll({
  enabled: true,
  behavior: 'smooth',
  dependencies: [messages],
})

// Error recovery
const { error, clearError, retryLastAction } = useErrorRecovery()

// Token tracking
const { totalTokens, addTokens } = useTokenTracker()

// Realistic typing
const { startTyping, isTyping } = useRealisticTyping()

// Responsive design
const isMobile = useMediaQuery('(max-width: 768px)')
```

### 2. Essential Components

- `<ChatWindow>` - Main chat interface
- `<ErrorBoundary>` - Crash protection wrapper
- `<TokenCounter>` - Token usage display
- `<NetworkStatus>` - Connection indicator

### 3. Best Practices

- Proper TypeScript types for all messages
- Error handling with user-friendly retry
- Callback memoization with `useCallback`
- Responsive design considerations
- Token estimation for cost tracking
- Realistic typing for better UX

## Code Structure

```
basic-chat/
├── src/
│   ├── App.tsx          # Main application
│   ├── main.tsx         # Entry point
│   └── index.css        # Styles
├── package.json         # Dependencies
└── README.md           # This file
```

## Key Features Explained

### Auto-Scroll

Messages automatically scroll into view when new messages arrive. Smooth scrolling provides better
UX.

### Error Recovery

If something goes wrong, users see a friendly error message with a retry button rather than a crash.

### Token Tracking

Displays real-time token usage (estimated). Helpful for cost monitoring in production apps.

### Realistic Typing

AI responses appear with a typing animation, making the conversation feel more natural.

### Responsive Design

Adapts to mobile and desktop viewports using the `useMediaQuery` hook.

## Customization

### Change Theme

Import and apply your custom theme:

```typescript
import { ThemeProvider } from '@clarity-chat/react'

<ThemeProvider theme="dark">
  <App />
</ThemeProvider>
```

### Add Real API

Replace the simulated response with your actual API:

```typescript
const handleSendMessage = async (content: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content }),
  })

  const data = await response.json()
  // Handle response...
}
```

### Customize Typing Speed

Adjust typing animation parameters:

```typescript
const typedContent = await startTyping(responseContent, {
  speed: 50, // Characters per second
  variation: 0.5, // Speed variation (0-1)
})
```

## Dependencies

Core dependencies:

- `@clarity-chat/react` - Chat components and hooks
- `@clarity-chat/types` - TypeScript types
- `react` - UI framework
- `react-dom` - React renderer

## Environment Variables

None required for basic demo. For production with real API:

```env
VITE_API_URL=https://your-api.com
VITE_API_KEY=your-key-here
```

## Next Steps

To learn more:

- Check out [Advanced Chat Examples](../ai-assistant)
- Explore [Design System Showcase](../design-system-showcase)
- Read the [Component Documentation](../../docs)

## Troubleshooting

### Auto-scroll not working

Ensure the scroll ref is attached to the container:

```typescript
<div ref={scrollRef}>
  <ChatWindow ... />
</div>
```

### Typing animation too fast/slow

Adjust the `speed` parameter in `startTyping()`.

### Tokens not counting

Check that you're calling `addTokens()` after each message.

## License

MIT - see repository root for details
