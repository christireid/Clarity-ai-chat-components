# 🔧 Troubleshooting Guide

> **Common issues and solutions for Clarity Chat**

This guide helps you resolve common issues quickly. If you don't find your issue here, check the [FAQ](./FAQ.md) or open an issue on [GitHub](https://github.com/christireid/Clarity-ai-chat-components/issues).

---

## 🚨 Common Issues

### Messages Not Displaying

**Symptoms:**
- Chat window appears empty
- Messages sent but not shown
- Type errors related to messages

**Solutions:**

1. **Check Message Conversion**
   ```tsx
   // ❌ Wrong - missing conversion
   <ChatWindow messages={coreMessages} />
   
   // ✅ Correct - convert messages
   const messages = useMemo(
     () => convertCoreMessagesToMessages(coreMessages),
     [coreMessages]
   )
   <ChatWindow messages={messages} />
   ```

2. **Verify Message Format**
   ```tsx
   // Messages must be Message[] type
   const messages: Message[] = [
     {
       id: '1',
       role: 'user',
       content: 'Hello',
       createdAt: new Date(),
       updatedAt: new Date(),
     },
   ]
   ```

3. **Check Array is Not Empty**
   ```tsx
   console.log('Messages:', messages) // Should show array
   console.log('Messages length:', messages.length) // Should be > 0
   ```

---

### Streaming Not Working

**Symptoms:**
- Messages don't stream in real-time
- Messages appear all at once
- Connection errors

**Solutions:**

1. **Verify API Endpoint**
   ```tsx
   // Ensure your API endpoint supports SSE
   const response = await fetch('/api/chat', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ messages }),
   })
   
   // Response should be a stream
   const reader = response.body?.getReader()
   ```

2. **Check Transport Type**
   ```tsx
   // Default is SSE, but you can specify
   const { messages } = useClarityChat({
     api: '/api/chat',
     transport: 'sse', // or 'websocket'
   })
   ```

3. **Verify Network Connection**
   - Check browser console for errors
   - Verify API endpoint is accessible
   - Check CORS settings if needed

---

### Type Errors

**Symptoms:**
- TypeScript errors
- Import errors
- Type mismatches

**Solutions:**

1. **Check React Version**
   ```json
   // package.json
   {
     "dependencies": {
       "react": "^19.2.0", // or ^18.0.0 with compatibility
       "react-dom": "^19.2.0"
     }
   }
   ```

2. **Verify Imports**
   ```tsx
   // ✅ Correct imports
   import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
   import type { Message } from '@clarity-chat/types'
   ```

3. **Check Type Definitions**
   ```bash
   # Reinstall types if needed
   npm install --save-dev @types/react @types/react-dom
   ```

---

### Memory Not Working

**Symptoms:**
- Memory not enabled
- Context not persisting
- Memory errors

**Solutions:**

1. **Wrap with MemoryProvider**
   ```tsx
   // ❌ Wrong - missing provider
   function App() {
     return <ChatPage />
   }
   
   // ✅ Correct - wrap with provider
   function App() {
     return (
       <MemoryProvider config={{ maxTokens: 10000 }}>
         <ChatPage />
       </MemoryProvider>
     )
   }
   ```

2. **Check Memory Configuration**
   ```tsx
   const { memoryEnabled } = useClarityChat({
     api: '/api/chat',
     memory: {
       enabled: true, // Must be true
       strategy: 'sliding-window',
       maxTokens: 4000,
     },
   })
   
   console.log('Memory enabled:', memoryEnabled) // Should be true
   ```

3. **Verify Strategy Setup**
   - `sliding-window`: No setup needed
   - `semantic-chunks`: Requires configuration
   - `vector-store`: Requires vector store setup

---

### Performance Issues

**Symptoms:**
- Slow rendering
- Laggy scrolling
- High memory usage

**Solutions:**

1. **Use VirtualizedMessageList**
   ```tsx
   // For many messages, use virtualized list
   import { VirtualizedMessageList } from '@clarity-chat/react'
   
   <VirtualizedMessageList
     messages={messages}
     height={600}
   />
   ```

2. **Memoize Messages**
   ```tsx
   // Always memoize message conversion
   const messages = useMemo(
     () => convertCoreMessagesToMessages(coreMessages),
     [coreMessages]
   )
   ```

3. **Optimize Re-renders**
   ```tsx
   // Use React.memo for custom components
   const MessageComponent = React.memo(({ message }) => {
     return <div>{message.content}</div>
   })
   ```

---

### Theme Not Applying

**Symptoms:**
- Theme changes not visible
- Styles not updating
- Colors incorrect

**Solutions:**

1. **Wrap with ThemeProvider**
   ```tsx
   // ❌ Wrong - no theme provider
   <ChatWindow messages={messages} />
   
   // ✅ Correct - wrap with provider
   <ThemeProvider theme={customTheme}>
     <ChatWindow messages={messages} />
   </ThemeProvider>
   ```

2. **Import Styles**
   ```tsx
   // Don't forget to import styles
   import '@clarity-chat/react/styles.css'
   ```

3. **Check Theme Object**
   ```tsx
   const theme = {
     colors: {
       primary: '#4A90E2',
       // ... other colors
     },
   }
   ```

---

### Error Handling Issues

**Symptoms:**
- Errors not displayed
- Error recovery not working
- Crashes on errors

**Solutions:**

1. **Check Error State**
   ```tsx
   const { error } = useClarityChat({
     api: '/api/chat',
   })
   
   {error && (
     <div className="error">
       <p>Error: {error.message}</p>
     </div>
   )}
   ```

2. **Use Error Boundary**
   ```tsx
   import { ErrorBoundary } from '@clarity-chat/react'
   
   <ErrorBoundary fallback={<ErrorFallback />}>
     <ChatWindow messages={messages} />
   </ErrorBoundary>
   ```

3. **Handle API Errors**
   ```tsx
   const handleSend = async (content: string) => {
     try {
       await append({ role: 'user', content })
     } catch (err) {
       console.error('Failed to send:', err)
       // Show user-friendly error
     }
   }
   ```

---

## 🐛 Debugging Tips

### Enable Debug Logging

```tsx
const { messages, isLoading, error } = useClarityChat({
  api: '/api/chat',
  debug: true, // Enable debug logging
})
```

### Check Hook State

```tsx
const chatState = useClarityChat({
  api: '/api/chat',
})

console.log('Chat state:', {
  messages: chatState.messages,
  isLoading: chatState.isLoading,
  error: chatState.error,
  memoryEnabled: chatState.memoryEnabled,
})
```

### Inspect Network Requests

1. Open browser DevTools
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Check API requests and responses

### Verify Component Props

```tsx
// Add logging to see what props are passed
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={(content) => {
    console.log('Sending message:', content)
    handleSend(content)
  }}
/>
```

---

## 📋 Checklist

Before asking for help, check:

- [ ] Messages are converted with `convertCoreMessagesToMessages`
- [ ] `MemoryProvider` wraps app if using memory
- [ ] `ThemeProvider` wraps app if using custom theme
- [ ] Styles are imported: `import '@clarity-chat/react/styles.css'`
- [ ] React version is 19+ (or 18 with compatibility)
- [ ] API endpoint is correct and accessible
- [ ] Network requests are successful
- [ ] No console errors
- [ ] TypeScript types are correct

---

## 🆘 Getting More Help

### Resources

1. **Documentation**
   - [Getting Started](./getting-started-clarity-chat.md)
   - [API Reference](../../packages/react/README.md)
   - [Cookbook](./cookbook/)

2. **Examples**
   - [Example Apps](../../apps/examples/)
   - [Storybook](http://localhost:6006)

3. **Community**
   - [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
   - [Discord](https://discord.gg/clarity-chat)

### When Opening an Issue

Include:
- Clarity Chat version
- React version
- Error messages (full stack trace)
- Code example (minimal reproduction)
- Steps to reproduce
- Expected vs actual behavior

---

## 💡 Prevention Tips

1. **Follow Getting Started Guide**
   - Use the official guide for setup
   - Copy examples exactly
   - Test incrementally

2. **Read Documentation**
   - Check API reference
   - Review examples
   - Read migration guides

3. **Test Early**
   - Test with simple examples first
   - Add complexity gradually
   - Verify each step works

4. **Use TypeScript**
   - Catch errors early
   - Get better IDE support
   - Understand types better

---

**Remember**: Most issues are simple configuration problems. Double-check your setup before diving deep into debugging!
