# Vercel AI SDK Compatible Examples

This example demonstrates backwards compatibility with Vercel AI SDK hooks.

> ⚠️ **Note:** The `useChat` hook is provided for migration purposes only and is deprecated. For new
> projects, use `useClarityChat` which provides memory integration, transport selection, and
> enhanced features.

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

### Step 1: Drop-in Replacement (Quick Start)

If you're currently using Vercel AI SDK, you can replace:

```tsx
// Before (Vercel AI SDK)
import { useChat } from 'ai/react'

// After (Clarity Chat - backwards compatible)
import { useChat } from '@clarity-chat/react'
```

The API is fully compatible - no code changes needed!

### Step 2: Upgrade to useClarityChat (Recommended)

After migrating, upgrade to `useClarityChat` for enhanced features:

```tsx
// ❌ Deprecated (works, but will be removed in v3.0)
import { useChat } from '@clarity-chat/react'

// ✅ Recommended
import { useClarityChat } from '@clarity-chat/react'

const { messages, append, isLoading, memoryEnabled } = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true, strategy: 'sliding-window' },
  transport: 'sse',
})
```
