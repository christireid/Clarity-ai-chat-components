# Troubleshooting Guide

Common issues and solutions when using Clarity Chat Components.

## Installation Issues

### Package Not Found

**Error:** `Cannot find module '@clarity-chat/react'`

**Solutions:**
1. Verify installation:
   ```bash
   npm install @clarity-chat/react
   # or
   pnpm add @clarity-chat/react
   ```

2. Check package.json:
   ```json
   {
     "dependencies": {
       "@clarity-chat/react": "^0.1.0"
     }
   }
   ```

3. Clear cache and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### TypeScript Errors

**Error:** `Cannot find type definitions`

**Solutions:**
1. Ensure TypeScript is installed:
   ```bash
   npm install -D typescript @types/react @types/react-dom
   ```

2. Check tsconfig.json includes the package:
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true
     }
   }
   ```

## Runtime Issues

### Messages Not Displaying

**Problem:** Messages array is empty or not rendering

**Solutions:**
1. **Check message conversion:**
   ```tsx
   // ❌ Wrong - CoreMessage[] doesn't work directly
   <ChatWindow messages={coreMessages} />
   
   // ✅ Correct - Convert first
   const messages = useMemo(
     () => convertCoreMessagesToMessages(coreMessages),
     [coreMessages]
   )
   <ChatWindow messages={messages} />
   ```

2. **Verify messages format:**
   ```tsx
   // Messages should be Message[] format
   console.log(messages) // Should have id, role, content, etc.
   ```

3. **Check API response:**
   ```tsx
   const { messages } = useClarityChat({
     api: '/api/chat',
     onFinish: (message) => {
       console.log('Received:', message) // Debug
     },
   })
   ```

### Streaming Not Working

**Problem:** Messages don't stream, only appear when complete

**Solutions:**
1. **Verify API route returns streaming:**
   ```tsx
   // app/api/chat/route.ts
   export async function POST(req: Request) {
     const { messages } = await req.json()
     
     const result = await streamText({
       model: openai('gpt-4'),
       messages,
     })
     
     // ✅ Must return streaming response
     return result.toDataStreamResponse()
   }
   ```

2. **Check transport protocol:**
   ```tsx
   // Default SSE should work
   useClarityChat({
     api: '/api/chat',
     transport: 'sse', // or 'websocket'
   })
   ```

3. **Verify network tab:**
   - Check if request shows "streaming" or "chunked" transfer
   - Look for Server-Sent Events in Network tab

### Memory Not Working

**Problem:** Memory context not being used

**Solutions:**
1. **Wrap app with MemoryProvider:**
   ```tsx
   // ❌ Missing provider
   function App() {
     return <ChatPage />
   }
   
   // ✅ With provider
   function App() {
     return (
       <MemoryProvider config={{ maxTokens: 10000 }}>
         <ChatPage />
       </MemoryProvider>
     )
   }
   ```

2. **Enable memory in hook:**
   ```tsx
   useClarityChat({
     api: '/api/chat',
     memory: {
       enabled: true, // ✅ Must be explicitly enabled
       strategy: 'sliding-window',
     },
   })
   ```

3. **Check memory context:**
   ```tsx
   const { memoryEnabled, contextSummary } = useClarityChat({
     memory: { enabled: true },
   })
   
   console.log('Memory enabled:', memoryEnabled)
   console.log('Context:', contextSummary)
   ```

### Type Errors

**Problem:** TypeScript errors with message types

**Solutions:**
1. **Use correct conversion function:**
   ```tsx
   // ✅ Correct import
   import { convertCoreMessagesToMessages } from '@clarity-chat/react'
   
   // ❌ Wrong - doesn't exist
   import { coreMessagesToMessages } from '@clarity-chat/react'
   ```

2. **Type your messages:**
   ```tsx
   import type { Message } from '@clarity-chat/types'
   
   const messages: Message[] = convertCoreMessagesToMessages(coreMessages)
   ```

3. **Check hook return types:**
   ```tsx
   import type { UseClarityChatReturn } from '@clarity-chat/react'
   
   const chat: UseClarityChatReturn = useClarityChat({
     api: '/api/chat',
   })
   ```

## API Issues

### CORS Errors

**Error:** `Access to fetch at '...' has been blocked by CORS policy`

**Solutions:**
1. **Configure CORS in API route:**
   ```tsx
   // app/api/chat/route.ts
   export async function POST(req: Request) {
     // Add CORS headers
     const headers = {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Methods': 'POST',
     }
     
     return new Response(stream, { headers })
   }
   ```

2. **Use Next.js API routes** (handles CORS automatically)

### 401/403 Errors

**Error:** `Unauthorized` or `Forbidden`

**Solutions:**
1. **Add authentication headers:**
   ```tsx
   useClarityChat({
     api: '/api/chat',
     headers: {
       Authorization: `Bearer ${token}`,
     },
   })
   ```

2. **Check API route authentication:**
   ```tsx
   // app/api/chat/route.ts
   export async function POST(req: Request) {
     const authHeader = req.headers.get('Authorization')
     if (!authHeader) {
       return new Response('Unauthorized', { status: 401 })
     }
     // ... rest of handler
   }
   ```

### Rate Limiting

**Error:** `429 Too Many Requests`

**Solutions:**
1. **Implement retry logic:**
   ```tsx
   useClarityChat({
     api: '/api/chat',
     onError: (error) => {
       if (error.message.includes('429')) {
         // Retry after delay
         setTimeout(() => retry(), 1000)
       }
     },
   })
   ```

2. **Use error recovery hook:**
   ```tsx
   import { useErrorRecovery } from '@clarity-chat/react'
   
   const { retry, canRetry } = useErrorRecovery({
     onRetry: () => append(message),
   })
   ```

## Component Issues

### ChatWindow Not Rendering

**Problem:** Component doesn't appear or is blank

**Solutions:**
1. **Check required props:**
   ```tsx
   // ✅ Minimum required
   <ChatWindow
     messages={messages}
     onSendMessage={handleSend}
   />
   ```

2. **Verify container height:**
   ```tsx
   // ✅ Full height container
   <div className="h-screen">
     <ChatWindow messages={messages} />
   </div>
   
   // ❌ No height = invisible
   <div>
     <ChatWindow messages={messages} />
   </div>
   ```

3. **Check for errors:**
   ```tsx
   {error && (
     <div>Error: {error.message}</div>
   )}
   ```

### Input Not Working

**Problem:** Can't type in chat input

**Solutions:**
1. **ChatWindow manages input internally** - don't pass input props:
   ```tsx
   // ✅ Correct - ChatWindow handles input
   <ChatWindow
     messages={messages}
     onSendMessage={handleSend}
   />
   
   // ❌ Wrong - no inputValue prop
   <ChatWindow
     messages={messages}
     inputValue={input}
     onInputChange={setInput}
   />
   ```

2. **Use ChatInput separately if needed:**
   ```tsx
   import { ChatInput } from '@clarity-chat/react'
   
   <ChatInput
     value={input}
     onChange={setInput}
     onSubmit={handleSubmit}
   />
   ```

### Styling Issues

**Problem:** Components look unstyled or broken

**Solutions:**
1. **Import CSS:**
   ```tsx
   import '@clarity-chat/react/styles.css'
   // or
   import '@clarity-chat/react/dist/styles/index.css'
   ```

2. **Check Tailwind config:**
   ```js
   // tailwind.config.js
   module.exports = {
     content: [
       './node_modules/@clarity-chat/react/**/*.{js,ts,jsx,tsx}',
     ],
   }
   ```

3. **Verify CSS is loaded:**
   ```tsx
   // app/layout.tsx or _app.tsx
   import '@clarity-chat/react/styles.css'
   ```

## Performance Issues

### Slow Rendering with Many Messages

**Problem:** UI lags with 100+ messages

**Solutions:**
1. **Use VirtualizedMessageList:**
   ```tsx
   import { VirtualizedMessageList } from '@clarity-chat/react'
   
   <VirtualizedMessageList
     messages={messages}
     height={600}
   />
   ```

2. **Memoize message conversion:**
   ```tsx
   const messages = useMemo(
     () => convertCoreMessagesToMessages(coreMessages),
     [coreMessages] // ✅ Only recompute when coreMessages change
   )
   ```

3. **Limit message history:**
   ```tsx
   const recentMessages = useMemo(
     () => messages.slice(-50), // Keep last 50
     [messages]
   )
   ```

### Memory Leaks

**Problem:** Memory usage grows over time

**Solutions:**
1. **Clean up subscriptions:**
   ```tsx
   useEffect(() => {
     const subscription = subscribe()
     return () => subscription.unsubscribe() // ✅ Cleanup
   }, [])
   ```

2. **Limit memory context:**
   ```tsx
   memory: {
     enabled: true,
     maxTokens: 4000, // ✅ Limit context size
   }
   ```

## Migration Issues

### Vercel AI SDK Migration

**Problem:** Code doesn't work after migrating

**Solutions:**
1. **Update imports:**
   ```tsx
   // ❌ Old
   import { useChat } from 'ai/react'
   
   // ✅ New
   import { useClarityChat } from '@clarity-chat/react'
   ```

2. **Convert messages:**
   ```tsx
   // ✅ Add conversion
   const messages = convertCoreMessagesToMessages(coreMessages)
   ```

3. **Update component:**
   ```tsx
   // ❌ Old - custom UI
   {messages.map(m => <div>{m.content}</div>)}
   
   // ✅ New - use ChatWindow
   <ChatWindow messages={messages} />
   ```

## Getting Help

### Check Documentation
- [Getting Started](./getting-started-clarity-chat.md)
- [Quick Reference](./QUICK_REFERENCE.md)
- [API Reference](../packages/react/README.md)

### Debug Tips
1. **Enable debug logging:**
   ```tsx
   useClarityChat({
     api: '/api/chat',
     onFinish: (message) => console.log('Finish:', message),
     onError: (error) => console.error('Error:', error),
   })
   ```

2. **Check React DevTools:**
   - Inspect component props
   - Check hook values
   - Monitor re-renders

3. **Network tab:**
   - Verify API calls
   - Check response format
   - Monitor streaming

### Still Stuck?

- 📚 Check [API Reference](../packages/react/README.md)
- 💬 Open an issue on GitHub
- 🐛 Report bugs with reproduction steps
- 📧 Contact support
