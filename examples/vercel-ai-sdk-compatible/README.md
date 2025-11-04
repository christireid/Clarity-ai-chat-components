# Vercel AI SDK Compatible Examples

This example demonstrates the Vercel AI SDK compatible hooks (`useChat`, `useCompletion`, `useAssistant`) from Clarity Chat.

## Features Demonstrated

### 1. useChat Hook
- Streaming chat messages
- Message management
- Error handling
- Loading states
- Form submission handling

### 2. useCompletion Hook
- Text completion
- Streaming responses
- Stop functionality
- Completion callbacks

### 3. useAssistant Hook
- AI assistant with tool calling
- Status tracking
- Tool invocation handling
- Multi-step workflows

## Running the Example

```bash
npm install
npm run dev
```

## API Endpoints Required

The example expects the following API endpoints:

- `/api/chat` - Chat endpoint
- `/api/completion` - Completion endpoint
- `/api/assistant` - Assistant endpoint

These endpoints should return streaming responses in SSE format.

## Migration from Vercel AI SDK

If you're currently using Vercel AI SDK, you can replace:

```tsx
// Before (Vercel AI SDK)
import { useChat } from 'ai/react'

// After (Clarity Chat)
import { useChat } from '@clarity-chat/react'
```

The API is fully compatible - no code changes needed!
