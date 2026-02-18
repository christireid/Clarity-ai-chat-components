# Memory System Examples

This directory contains comprehensive examples demonstrating best practices for using the Clarity Memory system.

## Quick Start

Each example is self-contained and can be run independently. They showcase different aspects of the memory system, from basic usage to advanced production patterns.

## Examples Overview

### 1. Basic Usage (`01-basic-usage.tsx`)

**What it demonstrates:**
- Initializing the memory service
- Storing memories (episodic and semantic)
- Querying and filtering memories
- Updating and deleting memories
- Getting memory statistics
- Basic React integration

**Best for:**
- Getting started with the memory system
- Understanding core concepts
- Learning the fundamental API

**Run it:**
```bash
npx tsx docs/examples/01-basic-usage.tsx
```

---

### 2. Privacy-First Implementation (`02-privacy-first.tsx`)

**What it demonstrates:**
- GDPR/CCPA compliant memory usage
- Consent management (grant, revoke, check)
- Data rights implementation (Right to Access, Right to Erasure)
- Audit logging
- Data export functionality
- Privacy-aware React components

**Best for:**
- Production applications requiring privacy compliance
- Understanding consent flows
- Implementing data rights
- Building privacy-first applications

**Key concepts:**
- Always check/grant consent before user-scoped operations
- Implement data export and deletion
- Use audit logging for compliance

**Run it:**
```bash
npx tsx docs/examples/02-privacy-first.tsx
```

---

### 3. Production-Ready Template (`03-production-ready.tsx`)

**What it demonstrates:**
- Production configuration with presets
- Comprehensive error handling (typed errors)
- Retry logic for transient failures
- Graceful degradation (fallback to keyword search)
- Performance monitoring
- Health check endpoints
- Error reporting integration (Sentry)
- Metrics collection

**Best for:**
- Production deployments
- Enterprise applications
- Systems requiring high reliability
- Applications with monitoring requirements

**Key features:**
- Automatic retry with exponential backoff
- Fallback strategies when operations fail
- Performance tracking and alerting
- Integration with monitoring services

**Run it:**
```bash
npx tsx docs/examples/03-production-ready.tsx
```

---

### 4. Tool Integration (`04-tool-integration.tsx`)

**What it demonstrates:**
- Automatic tool call capture
- Tool history retrieval and analysis
- Context-aware tool usage
- Tool recommendation based on context
- LangChain integration
- Wrapper functions for automatic capture

**Best for:**
- AI agents with tool use
- LangChain applications
- Systems with multiple tools
- Context-aware automation

**Key concepts:**
- Capture both successful and failed tool calls
- Use tool history to recommend tools
- Build context-aware tool selection
- Integrate with LangChain agents

**Run it:**
```bash
npx tsx docs/examples/04-tool-integration.tsx
```

---

### 5. Streaming Message Handling (`05-streaming.tsx`)

**What it demonstrates:**
- Handling streaming AI responses
- Avoiding duplicate memories during streaming
- Deduplication strategies
- Abort handling for cancelled streams
- Progressive memory updates vs. completion-only storage
- React hooks for streaming UIs

**Best for:**
- Chat applications with streaming responses
- Real-time AI interactions
- Systems using OpenAI/Anthropic streaming APIs
- Progressive UI updates

**Approaches shown:**
1. **Progressive updates**: Update memory on each chunk
2. **Completion only**: Store once when stream completes
3. **Deduplication**: Use messageId for automatic dedup
4. **Abort handling**: Handle user cancellations

**Run it:**
```bash
npx tsx docs/examples/05-streaming.tsx
```

---

## Common Patterns

### Error Handling

All production examples demonstrate proper error handling:

```typescript
import {
  MemoryError,
  MemoryConsentError,
  MemoryOperationError,
} from '@clarity-chat/memory'

try {
  await memory.add(content, options)
} catch (error) {
  if (error instanceof MemoryConsentError) {
    // Handle consent issues
  } else if (error instanceof MemoryOperationError) {
    // Handle operation failures
  } else {
    // Handle unexpected errors
  }
}
```

### Configuration Presets

Use presets for common environments:

```typescript
import { clarityMemory, createConfig } from '@clarity-chat/memory'

// Browser environment + chatbot profile
const memory = clarityMemory(createConfig('browser', 'chatbot'))

// Production environment + knowledge base profile
const memory = clarityMemory(createConfig('production', 'knowledgeBase'))

// Custom overrides
const memory = clarityMemory(
  createConfig('production', 'chatbot', {
    limits: { maxMemories: 5000 },
  })
)
```

### React Integration

Use hooks for React applications:

```typescript
import {
  useMemoryService,
  useMemoryConsent,
  useMemoryTools,
} from '@clarity-chat/memory'

function MyComponent() {
  const memory = useMemoryService()
  const { hasConsent, grantConsent } = useMemoryConsent('user_123')
  const { captureToolCall } = useMemoryTools()

  // Use memory service...
}
```

## Running Examples

### Prerequisites

```bash
# Install dependencies
npm install @clarity-chat/memory
npm install @langchain/openai  # For embedding examples
```

### Environment Variables

Some examples require environment variables:

```bash
# .env
OPENAI_API_KEY=your_api_key_here  # For embedding provider
```

### TypeScript Execution

```bash
# Install tsx for running TypeScript
npm install -g tsx

# Run any example
tsx docs/examples/01-basic-usage.tsx
```

### In a React Application

Copy the React components from the examples into your application:

```typescript
import { BasicChatComponent } from './docs/examples/01-basic-usage'
import { ConsentDialog } from './docs/examples/02-privacy-first'

function App() {
  return (
    <>
      <ConsentDialog userId="user_123" />
      <BasicChatComponent />
    </>
  )
}
```

## Example Comparison

| Feature | Example 1 | Example 2 | Example 3 | Example 4 | Example 5 |
|---------|-----------|-----------|-----------|-----------|-----------|
| **Basic Operations** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Privacy/Consent** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Error Handling** | Basic | Basic | ✅ Advanced | ✅ | ✅ |
| **Production Ready** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Tool Integration** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Streaming** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **React Components** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Monitoring** | ❌ | ❌ | ✅ | ❌ | ❌ |

## Best Practices Demonstrated

1. **Always use typed errors** - Catch specific error types for better handling
2. **Enable consent for production** - Required for GDPR/CCPA compliance
3. **Use configuration presets** - Avoid manual configuration errors
4. **Implement retry logic** - Handle transient failures gracefully
5. **Monitor performance** - Track memory usage and operation durations
6. **Capture tool calls** - Essential for debugging and context building
7. **Handle streaming properly** - Avoid duplicate memories
8. **Implement graceful degradation** - Fallback when operations fail

## Further Reading

- [Memory Types Guide](../MEMORY_TYPES.md) - Understanding memory types
- [Scopes Guide](../SCOPES.md) - Understanding memory scopes
- [React Hooks Guide](../REACT_HOOKS.md) - React integration
- [Troubleshooting Guide](../TROUBLESHOOTING.md) - Common issues
- [Migration Guide](../MIGRATION.md) - Migrating from older versions

## Need Help?

- Check the [Troubleshooting Guide](../TROUBLESHOOTING.md) for common issues
- File an issue on GitHub
- Join our [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

---

**Note**: These examples use the latest API (v1.0+). If you're migrating from an older version, see the [Migration Guide](../MIGRATION.md).
