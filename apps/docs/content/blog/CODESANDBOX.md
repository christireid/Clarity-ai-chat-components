# CodeSandbox Examples

Interactive code examples for key blog post patterns.

> ⚠️ **IMPORTANT: These sandboxes do not exist yet.**
>
> This document contains **specifications** for sandboxes to be created. The URLs shown are the
> naming conventions to use when creating them. See the "How to Create a Sandbox" section below for
> step-by-step instructions.

---

## Available Sandboxes

### Production Chat (Post 9)

**Live demo:**
[codesandbox.io/s/clarity-production-chat](https://codesandbox.io/s/clarity-production-chat)

Features demonstrated:

- Type-safe message state
- Streaming with error recovery
- Accessible message list
- Mobile-aware input
- Keyboard navigation

### Retry Pattern (Post 11)

**Live demo:**
[codesandbox.io/s/clarity-retry-pattern](https://codesandbox.io/s/clarity-retry-pattern)

Features demonstrated:

- Exponential backoff
- Error classification
- Retry with jitter
- Max attempts handling

### Optimistic UI (Post 12)

**Live demo:**
[codesandbox.io/s/clarity-optimistic-ui](https://codesandbox.io/s/clarity-optimistic-ui)

Features demonstrated:

- Immediate feedback
- Rollback on failure
- Status indicators
- Pending state management

### RAG Pipeline (Post 17)

**Live demo:** [codesandbox.io/s/clarity-rag-demo](https://codesandbox.io/s/clarity-rag-demo)

Features demonstrated:

- Semantic chunking
- Hybrid search simulation
- Relevance scoring
- Debug panel

### Agent Loop (Post 18)

**Live demo:** [codesandbox.io/s/clarity-agent-demo](https://codesandbox.io/s/clarity-agent-demo)

Features demonstrated:

- Tool definition
- Confirmation flow
- Result handling
- Action logging

---

## Creating Your Own Sandboxes

### Recommended Setup

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### File Structure

```
src/
├── App.tsx           # Main demo component
├── components/       # Reusable components from post
├── hooks/            # Custom hooks from post
├── types.ts          # TypeScript interfaces
└── mock-api.ts       # Mock API for demo
```

### Mock API Pattern

For demos that require API calls:

```typescript
// mock-api.ts
export async function mockChatAPI(message: string): Promise<string> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000))

  // Simulate occasional errors (10%)
  if (Math.random() < 0.1) {
    throw new Error('Mock API error')
  }

  return `Mock response to: ${message}`
}

export async function mockStreamingAPI(
  message: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = `This is a mock streaming response to: ${message}`
  const words = response.split(' ')

  for (const word of words) {
    await new Promise((r) => setTimeout(r, 100))
    onChunk(word + ' ')
  }
}
```

### Embedding in Blog Posts

Add this section at the end of relevant code examples:

```markdown
**Try it live:** [Open in CodeSandbox →](https://codesandbox.io/s/example-id)
```

---

## Maintenance Checklist

When updating blog posts with code changes:

- [ ] Update corresponding CodeSandbox
- [ ] Test all interactive features
- [ ] Verify TypeScript compiles
- [ ] Check mobile responsiveness
- [ ] Update any version dependencies

---

## CodeSandbox Links by Post

| Post                 | Sandbox Name            | Status       | Priority |
| -------------------- | ----------------------- | ------------ | -------- |
| 01 - Response Timing | clarity-response-timing | 📋 To Create | High     |
| 09 - Production Chat | clarity-production-chat | 📋 To Create | High     |
| 11 - Retry Pattern   | clarity-retry-pattern   | 📋 To Create | Medium   |
| 12 - Optimistic UI   | clarity-optimistic-ui   | 📋 To Create | Medium   |
| 17 - RAG Pipeline    | clarity-rag-demo        | 📋 To Create | High     |
| 18 - AI Agents       | clarity-agent-demo      | 📋 To Create | High     |

**Status Legend:**

- 🟢 Live — Sandbox is published and working
- 📋 To Create — Sandbox spec defined, needs to be built
- 🔴 Broken — Sandbox exists but has issues

**Priority Guide:**

- **High** — Core patterns, create first
- **Medium** — Useful but not critical
- **Low** — Nice to have

### How to Create a Sandbox

1. Go to [codesandbox.io](https://codesandbox.io)
2. Create new React + TypeScript sandbox
3. Copy code from the corresponding blog post
4. Add mock API from the template above
5. Test all features work
6. Fork to your account with the specified name
7. Update status in this document to 🟢 Live

---

## Alternative: StackBlitz

For examples requiring Node.js backend:

```markdown
**Try it live:** [Open in StackBlitz →](https://stackblitz.com/edit/example-id)
```

StackBlitz supports:

- Full Node.js environment
- API routes
- Environment variables (for demo API keys)
