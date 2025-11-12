# Webhooks

Clarity Chat provides a flexible webhook system for event-driven notifications. Perfect for async operations, monitoring, integrations, and real-time updates.

## Overview

Webhooks allow you to:
- Subscribe to events (chat messages, completions, errors, etc.)
- Receive real-time notifications
- Integrate with external systems
- Monitor application activity
- Build event-driven architectures

## Installation

Webhook utilities are included in `@clarity-chat/react`:

```tsx
import { WebhookManager, WebhookEvents } from '@clarity-chat/react'
```

## Quick Start

### 1. Create Webhook Manager

```tsx
import { WebhookManager } from '@clarity-chat/react'

const webhooks = new WebhookManager({
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 5000,
  verifySignatures: true,
})
```

### 2. Register Webhook Endpoints

```tsx
webhooks.register({
  id: 'analytics-webhook',
  url: 'https://analytics.example.com/webhook',
  events: ['chat.message.sent', 'chat.completion'],
  secret: 'your-secret-key',
  enabled: true,
})
```

### 3. Emit Events

```tsx
await webhooks.emit({
  id: 'evt-123',
  type: 'chat.completion',
  data: {
    messageId: 'msg-456',
    tokens: 150,
    model: 'gpt-4',
  },
  timestamp: Date.now(),
})
```

## Event Types

Clarity Chat provides common event types:

```tsx
import { WebhookEvents } from '@clarity-chat/react'

// Chat events
WebhookEvents.CHAT_MESSAGE_SENT
WebhookEvents.CHAT_MESSAGE_RECEIVED
WebhookEvents.CHAT_COMPLETION
WebhookEvents.CHAT_ERROR

// Agent events
WebhookEvents.AGENT_STARTED
WebhookEvents.AGENT_TOOL_CALLED
WebhookEvents.AGENT_COMPLETED
WebhookEvents.AGENT_FAILED

// RAG events
WebhookEvents.RAG_DOCUMENT_UPLOADED
WebhookEvents.RAG_SEARCH_PERFORMED
WebhookEvents.RAG_QUERY_COMPLETED

// Safety events
WebhookEvents.SAFETY_PII_DETECTED
WebhookEvents.SAFETY_CONTENT_FLAGGED
WebhookEvents.SAFETY_INJECTION_DETECTED

// System events
WebhookEvents.SYSTEM_ERROR
WebhookEvents.SYSTEM_WARNING
WebhookEvents.SYSTEM_RATE_LIMITED
```

## Event Subscriptions

### Specific Events

```tsx
webhooks.register({
  id: 'chat-webhook',
  url: 'https://example.com/chat-events',
  events: [
    'chat.message.sent',
    'chat.message.received',
    'chat.completion',
  ],
})
```

### Wildcard Events

```tsx
// Subscribe to all chat events
webhooks.register({
  id: 'all-chat-webhook',
  url: 'https://example.com/all-chat',
  events: ['chat.*'],
})

// Subscribe to all events
webhooks.register({
  id: 'all-events-webhook',
  url: 'https://example.com/all',
  events: ['*'],
})
```

## Webhook Signatures

Verify webhook authenticity with signatures:

```tsx
webhooks.register({
  id: 'secure-webhook',
  url: 'https://example.com/webhook',
  events: ['*'],
  secret: 'your-secret-key',
})

// Signature is automatically added to headers
// X-Webhook-Signature: sha256=...
```

### Verify Signatures (Server-Side)

```tsx
// In your webhook endpoint
import { WebhookManager } from '@clarity-chat/react'

const webhooks = new WebhookManager()

app.post('/webhook', async (req, res) => {
  const signature = req.headers['x-webhook-signature']
  const payload = JSON.stringify(req.body)
  const secret = 'your-secret-key'

  const isValid = webhooks.verifySignature(payload, signature, secret)

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  // Process webhook...
})
```

## Retry Logic

Webhooks automatically retry failed deliveries:

```tsx
const webhooks = new WebhookManager({
  maxRetries: 3,        // Maximum retry attempts
  retryDelay: 1000,     // Initial retry delay (ms)
  timeout: 5000,        // Request timeout (ms)
})

// Retries use exponential backoff
// Attempt 1: Immediate
// Attempt 2: 1s delay
// Attempt 3: 2s delay
// Attempt 4: 4s delay
```

## Delivery Status

Track webhook delivery status:

```tsx
const deliveries = await webhooks.emit({
  id: 'evt-123',
  type: 'chat.completion',
  data: { messageId: '456' },
  timestamp: Date.now(),
})

deliveries.forEach(delivery => {
  console.log(`Endpoint: ${delivery.endpointId}`)
  console.log(`Status: ${delivery.deliveryStatus}`)
  console.log(`Attempts: ${delivery.attempts}`)
  
  if (delivery.deliveryStatus === 'failed') {
    console.error(`Error: ${delivery.error}`)
  }
})
```

## Integration with Chat

Emit events from chat operations:

```tsx
import { ChatWindow, WebhookManager, WebhookEvents } from '@clarity-chat/react'

function ChatWithWebhooks() {
  const [messages, setMessages] = useState([])
  const webhooks = new WebhookManager()

  useEffect(() => {
    // Register webhook endpoint
    webhooks.register({
      id: 'chat-analytics',
      url: '/api/webhooks/analytics',
      events: [WebhookEvents.CHAT_MESSAGE_SENT, WebhookEvents.CHAT_COMPLETION],
    })
  }, [])

  const handleSend = async (content: string) => {
    const messageId = Date.now().toString()
    
    // Add user message
    setMessages(prev => [...prev, {
      id: messageId,
      role: 'user',
      content,
      timestamp: Date.now(),
    }])

    // Emit webhook event
    await webhooks.emit({
      id: `evt-${messageId}`,
      type: WebhookEvents.CHAT_MESSAGE_SENT,
      data: {
        messageId,
        content,
        userId: 'user-123',
      },
      timestamp: Date.now(),
    })

    // Get AI response...
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content }),
    })

    const data = await response.json()

    // Emit completion event
    await webhooks.emit({
      id: `evt-${Date.now()}`,
      type: WebhookEvents.CHAT_COMPLETION,
      data: {
        messageId: data.id,
        tokens: data.tokens,
        model: data.model,
      },
      timestamp: Date.now(),
    })
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}
```

## Integration with Agents

Emit events from agent operations:

```tsx
import { Agent, WebhookManager, WebhookEvents } from '@clarity-chat/react'

const webhooks = new WebhookManager()

webhooks.register({
  id: 'agent-monitor',
  url: '/api/webhooks/agents',
  events: [
    WebhookEvents.AGENT_STARTED,
    WebhookEvents.AGENT_TOOL_CALLED,
    WebhookEvents.AGENT_COMPLETED,
  ],
})

const agent = new Agent({
  model: openaiAdapter,
  tools: [searchTool, calculatorTool],
  onStart: async () => {
    await webhooks.emit({
      id: `evt-${Date.now()}`,
      type: WebhookEvents.AGENT_STARTED,
      data: { agentId: agent.id },
      timestamp: Date.now(),
    })
  },
  onToolCall: async (tool) => {
    await webhooks.emit({
      id: `evt-${Date.now()}`,
      type: WebhookEvents.AGENT_TOOL_CALLED,
      data: {
        toolName: tool.name,
        toolInput: tool.input,
      },
      timestamp: Date.now(),
    })
  },
  onComplete: async (result) => {
    await webhooks.emit({
      id: `evt-${Date.now()}`,
      type: WebhookEvents.AGENT_COMPLETED,
      data: {
        result: result.output,
        tokens: result.tokens,
      },
      timestamp: Date.now(),
    })
  },
})
```

## Custom Headers

Add custom headers to webhook requests:

```tsx
webhooks.register({
  id: 'custom-webhook',
  url: 'https://example.com/webhook',
  events: ['*'],
  headers: {
    'X-API-Key': 'your-api-key',
    'X-Custom-Header': 'custom-value',
  },
})
```

## Enable/Disable Endpoints

Dynamically enable or disable endpoints:

```tsx
// Disable endpoint
const endpoint = webhooks.getEndpoint('analytics-webhook')
if (endpoint) {
  endpoint.enabled = false
  webhooks.register(endpoint)
}

// Enable endpoint
endpoint.enabled = true
webhooks.register(endpoint)
```

## Webhook Statistics

Get delivery statistics:

```tsx
const stats = webhooks.getStats()

console.log(`Total endpoints: ${stats.totalEndpoints}`)
console.log(`Active endpoints: ${stats.activeEndpoints}`)
console.log(`Total deliveries: ${stats.totalDeliveries}`)
console.log(`Failed deliveries: ${stats.failedDeliveries}`)
```

## Error Handling

Handle webhook delivery errors:

```tsx
const deliveries = await webhooks.emit({
  id: 'evt-123',
  type: 'chat.completion',
  data: { messageId: '456' },
  timestamp: Date.now(),
})

for (const delivery of deliveries) {
  if (delivery.deliveryStatus === 'failed') {
    console.error(`Webhook ${delivery.endpointId} failed:`)
    console.error(`Error: ${delivery.error}`)
    console.error(`Attempts: ${delivery.attempts}`)
    
    // Log to error tracking service
    await logError({
      type: 'webhook_delivery_failed',
      endpointId: delivery.endpointId,
      error: delivery.error,
      attempts: delivery.attempts,
    })
  }
}
```

## Complete Example

```tsx
import {
  ChatWindow,
  WebhookManager,
  WebhookEvents,
} from '@clarity-chat/react'

function ChatAppWithWebhooks() {
  const [messages, setMessages] = useState([])
  const webhooks = new WebhookManager({
    maxRetries: 3,
    timeout: 5000,
  })

  useEffect(() => {
    // Register analytics webhook
    webhooks.register({
      id: 'analytics',
      url: '/api/webhooks/analytics',
      events: [
        WebhookEvents.CHAT_MESSAGE_SENT,
        WebhookEvents.CHAT_COMPLETION,
      ],
      secret: process.env.WEBHOOK_SECRET,
    })

    // Register monitoring webhook
    webhooks.register({
      id: 'monitoring',
      url: '/api/webhooks/monitoring',
      events: [
        WebhookEvents.CHAT_ERROR,
        WebhookEvents.SYSTEM_ERROR,
      ],
    })
  }, [])

  const handleSend = async (content: string) => {
    try {
      const messageId = Date.now().toString()

      // Add user message
      setMessages(prev => [...prev, {
        id: messageId,
        role: 'user',
        content,
        timestamp: Date.now(),
      }])

      // Emit message sent event
      await webhooks.emit({
        id: `msg-${messageId}`,
        type: WebhookEvents.CHAT_MESSAGE_SENT,
        data: { messageId, content },
        timestamp: Date.now(),
      })

      // Get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: content }),
      })

      if (!response.ok) {
        throw new Error('Chat request failed')
      }

      const data = await response.json()

      // Add assistant message
      setMessages(prev => [...prev, {
        id: data.id,
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      }])

      // Emit completion event
      await webhooks.emit({
        id: `comp-${data.id}`,
        type: WebhookEvents.CHAT_COMPLETION,
        data: {
          messageId: data.id,
          tokens: data.tokens,
          model: data.model,
        },
        timestamp: Date.now(),
      })
    } catch (error) {
      // Emit error event
      await webhooks.emit({
        id: `err-${Date.now()}`,
        type: WebhookEvents.CHAT_ERROR,
        data: {
          error: error.message,
          messageId: Date.now().toString(),
        },
        timestamp: Date.now(),
      })
    }
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}
```

## Best Practices

1. **Use Secrets**: Always use secrets for webhook signature verification
2. **Handle Failures**: Implement retry logic and error handling
3. **Idempotency**: Make webhook endpoints idempotent
4. **Timeouts**: Set appropriate timeouts for webhook requests
5. **Rate Limiting**: Implement rate limiting on webhook endpoints
6. **Logging**: Log all webhook deliveries for debugging
7. **Monitoring**: Monitor webhook delivery success rates

## Next Steps

- Learn about [Observability](/guide/observability) for monitoring
- Check out [Audit Logging](/guide/audit-logging) for event tracking
- See [Multi-Tenancy](/guide/multi-tenancy) for tenant-specific webhooks
