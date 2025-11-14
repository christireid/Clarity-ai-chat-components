# useClarityChat Showcase

Comprehensive example demonstrating all features of `useClarityChat` flagship hook.

## Features Demonstrated

- ✅ Basic chat functionality
- ✅ Memory integration with strategy selection
- ✅ Transport protocol selection (SSE/WebSocket)
- ✅ Memory context visualization
- ✅ Error handling
- ✅ Real-time configuration changes

## Run

```bash
cd apps/examples/use-clarity-chat-showcase
pnpm install
pnpm dev
```

## What It Shows

1. **Memory Strategies**: Switch between sliding-window, semantic-chunks, and vector-store
2. **Transport Selection**: Toggle between SSE and WebSocket
3. **Memory Status**: Visual indicator when memory is active
4. **Context Preview**: See memory context summary
5. **Error Handling**: Graceful error display and recovery

## Code Highlights

```tsx
const { messages, append, memoryEnabled, contextSummary } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'semantic-chunks',
  },
  transport: 'sse',
})
```
