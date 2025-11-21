# Quick Reference - 2025 Features

## 💰 Token Optimization

### Basic Usage
```tsx
import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

const { optimizeData, countTokens, calculateCost } = useTokenOptimizationEnhanced({
  enableTOON: true,
  enableCaching: true,
  preferredModel: 'gpt-4o',
})

// Optimize data (auto-selects TOON or JSON)
const result = await optimizeData({ large: 'object' })
// { optimized: string, format: 'toon', savings: 0.6, tokenCount: 120 }

// Count tokens
const count = await countTokens('message text')
// { count: 45, model: 'gpt-4o' }

// Calculate cost
const cost = calculateCost({ inputTokens: 1000, outputTokens: 500, model: 'gpt-4o' })
// { inputCost: 0.0025, outputCost: 0.005, totalCost: 0.0075 }
```

### Configuration Options
```tsx
useTokenOptimizationEnhanced({
  enableTOON: true,              // Auto TOON format
  enableCaching: true,           // Prompt caching
  enableCompression: true,       // Text compression
  enableSemanticCache: true,     // Semantic caching
  preferredModel: 'gpt-4o',      // Default model
  compressionLevel: 'medium',    // 'low' | 'medium' | 'high'
  toonThreshold: 0.2,           // Min savings to use TOON (20%)
})
```

---

## 🛡️ Security System

### Secure Chat Hook
```tsx
import { useSecureChat } from '@clarity-chat/react'

const { messages, sendMessage, error } = useSecureChat({
  config: {
    promptInjection: { enabled: true },
    pii: { enabled: true, redactionStrategy: 'synthetic' },
    jailbreakPrevention: { enabled: true },
    contentModeration: { enabled: true },
    rateLimiting: { enabled: true, maxRequestsPerMinute: 60 },
  },
  userId: 'user-123',
  onSecurityBlock: (reason, details) => {
    console.error('Blocked:', reason)
  },
})
```

### Security Manager
```tsx
import { SecurityManager, WebhookAlertHandler } from '@clarity-chat/react'

const security = new SecurityManager({
  promptInjection: {
    enabled: true,
    config: {
      enableHeuristics: true,
      enableSemanticAnalysis: true,
      useAttackPatternDB: true,
      confidenceThreshold: 0.7,
    },
  },
  monitoring: {
    enabled: true,
    alertHandlers: [
      new WebhookAlertHandler('https://alerts.example.com'),
    ],
  },
})

// Validate input
const result = await security.validateInput(message, { userId: 'user-123' })
if (!result.allowed) {
  console.log('Blocked:', result.reason)
}

// Prepare messages with jailbreak prevention
const secureMessages = security.prepareMessages(messages)

// Validate output
const outputValidation = await security.validateOutput(response)
```

### Security Hooks
```tsx
// Monitor security metrics
const metrics = useSecurityMonitor({ updateInterval: 30000 })
// { totalEvents, promptInjectionRate, piiDetectionRate, ... }

// Subscribe to security events
const { events } = useSecurityEvents({
  filter: { severity: 'critical' },
  onEvent: (event) => console.error('Critical:', event),
})

// Validate individual inputs
const { validate, isValidating, lastResult } = useSecureInput(config)
const result = await validate(message)
```

---

## 🔐 Enhanced Webhooks

### Basic Setup
```tsx
import { EnhancedWebhookManager } from '@clarity-chat/react'

const webhooks = new EnhancedWebhookManager({
  maxRetries: 3,
  timeout: 5000,
  enableHealthMonitoring: true,
  rateLimitPerEndpoint: 60,
})

webhooks.register({
  id: 'my-webhook',
  url: 'https://example.com/webhook',
  events: ['chat.message', 'chat.completion'],
  secret: 'my-secret-key', // HMAC-SHA256 signatures
})

await webhooks.emit({
  id: 'evt-123',
  type: 'chat.completion',
  data: { messageId: '456', tokens: 100 },
  timestamp: Date.now(),
})
```

### Health Monitoring
```tsx
// Get endpoint health
const health = webhooks.getEndpointHealth('my-webhook')
// {
//   totalDeliveries: 100,
//   successfulDeliveries: 98,
//   failedDeliveries: 2,
//   successRate: 98,
//   isHealthy: true,
//   averageResponseTime: 250
// }

// Get all health stats
const allHealth = webhooks.getAllEndpointHealth()
```

---

## 📊 Common Patterns

### Optimized + Secure Chat
```tsx
import { useSecureChat, useTokenOptimizationEnhanced } from '@clarity-chat/react'

function OptimizedSecureChat() {
  const { optimizeData, stats } = useTokenOptimizationEnhanced()

  const { messages, sendMessage } = useSecureChat({
    config: {
      promptInjection: { enabled: true },
      pii: { enabled: true },
    },
  })

  const handleSend = async (message: string) => {
    // Optimize before sending
    const optimized = await optimizeData(message)
    await sendMessage(optimized.optimized)

    console.log('Saved', stats.totalTokensSaved, 'tokens')
  }

  return <ChatUI messages={messages} onSend={handleSend} />
}
```

### Complete Enterprise Setup
```tsx
import {
  SecurityManager,
  EnhancedWebhookManager,
  useTokenOptimizationEnhanced,
  WebhookAlertHandler,
} from '@clarity-chat/react'

// Security
const security = new SecurityManager({
  promptInjection: { enabled: true },
  pii: { enabled: true },
  jailbreakPrevention: { enabled: true },
  monitoring: {
    enabled: true,
    alertHandlers: [new WebhookAlertHandler('https://alerts.com')],
  },
})

// Webhooks
const webhooks = new EnhancedWebhookManager({
  enableHealthMonitoring: true,
})

// Token optimization
function ChatComponent() {
  const { optimizeData, calculateCost } = useTokenOptimizationEnhanced()

  const handleMessage = async (message: string) => {
    // 1. Security validation
    const validation = await security.validateInput(message, { userId: 'user-123' })
    if (!validation.allowed) return

    // 2. Optimize
    const optimized = await optimizeData(validation.sanitizedInput!)

    // 3. Prepare with jailbreak prevention
    const messages = security.prepareMessages([
      { role: 'system', content: 'You are helpful.' },
      { role: 'user', content: optimized.optimized },
    ])

    // 4. Call LLM
    const response = await callLLM(messages)

    // 5. Validate output
    const outputValidation = await security.validateOutput(response)
    if (!outputValidation.safe) return

    // 6. Emit webhook
    await webhooks.emit({
      type: 'chat.completion',
      data: { message: response },
    })

    // 7. Calculate cost
    const cost = calculateCost({
      inputTokens: optimized.tokenCount,
      outputTokens: 500,
    })
    console.log('Cost:', cost.totalCost)

    return outputValidation.output
  }
}
```

---

## 🎯 Configuration Presets

### Development
```tsx
// Minimal security, verbose logging
const devConfig = {
  promptInjection: { enabled: true },
  monitoring: { enabled: true, logEvents: true },
}
```

### Production
```tsx
// Full security, webhook alerts
const prodConfig = {
  promptInjection: {
    enabled: true,
    config: {
      enableHeuristics: true,
      enableSemanticAnalysis: true,
      useAttackPatternDB: true,
      enableMultiTurnDetection: true,
    },
  },
  pii: {
    enabled: true,
    redactionStrategy: 'synthetic',
  },
  jailbreakPrevention: {
    enabled: true,
    config: {
      protectSystemMessage: true,
      bracketUserInput: true,
      validateOutput: true,
      strictMode: true,
    },
  },
  monitoring: {
    enabled: true,
    alertHandlers: [
      new WebhookAlertHandler('https://alerts.example.com'),
    ],
  },
  rateLimiting: {
    enabled: true,
    maxRequestsPerMinute: 60,
  },
}
```

### High-Security
```tsx
// Maximum security, all features enabled
const highSecurityConfig = {
  promptInjection: {
    enabled: true,
    config: {
      enableHeuristics: true,
      enableSemanticAnalysis: true,
      useAttackPatternDB: true,
      enableMultiTurnDetection: true,
      confidenceThreshold: 0.6, // Lower = more strict
    },
  },
  pii: {
    enabled: true,
    patterns: ['EMAIL', 'PHONE', 'SSN', 'CREDIT_CARD', 'IP_ADDRESS'],
    redactionStrategy: 'remove', // Complete removal
  },
  jailbreakPrevention: {
    enabled: true,
    config: {
      protectSystemMessage: true,
      bracketUserInput: true,
      validateOutput: true,
      monitorConversation: true,
      strictMode: true,
    },
  },
  contentModeration: {
    enabled: true,
    config: {
      thresholds: {
        hate: 0.5,
        violence: 0.6,
        sexual: 0.5,
      },
    },
  },
  rateLimiting: {
    enabled: true,
    maxRequestsPerMinute: 30,
    maxRequestsPerHour: 500,
  },
}
```

---

## 📈 Performance Tips

### Token Optimization
- Use TOON for arrays/lists (30-60% savings)
- Enable caching for repeated content (50-90% savings)
- Use compression for long text (20-35% savings)
- Monitor `stats.totalTokensSaved` to track ROI

### Security
- Enable heuristics (fast, <1ms)
- Add semantic analysis for better accuracy
- Use pattern DB for known attacks (high confidence)
- Disable multi-turn detection if not needed (saves 20ms)

### Webhooks
- Enable health monitoring
- Set appropriate retry limits
- Use rate limiting to prevent abuse
- Monitor delivery success rates

---

## 🐛 Troubleshooting

### Security False Positives
```tsx
// Reduce sensitivity
config: {
  promptInjection: {
    config: {
      confidenceThreshold: 0.8, // Higher = fewer false positives
    },
  },
}
```

### Performance Issues
```tsx
// Disable expensive features
config: {
  promptInjection: {
    config: {
      enableSemanticAnalysis: false,
      enableMultiTurnDetection: false,
    },
  },
}
```

### PII Not Detected
```tsx
// Add custom patterns
config: {
  pii: {
    patterns: ['EMAIL', 'PHONE', 'SSN', 'CREDIT_CARD', 'CUSTOM_PATTERN'],
  },
}
```

---

## 📚 Resources

- **Token Optimization:** [TOKEN_OPTIMIZATION_SUMMARY.md](./TOKEN_OPTIMIZATION_SUMMARY.md)
- **Security Guide:** [SECURITY_GUIDE.md](./SECURITY_GUIDE.md)
- **Enterprise Features:** [ENTERPRISE_FEATURES_SUMMARY.md](./ENTERPRISE_FEATURES_SUMMARY.md)
- **Complete Summary:** [IMPLEMENTATION_SUMMARY_2025.md](./IMPLEMENTATION_SUMMARY_2025.md)
- **Interactive Playground:** `apps/docs/app/playground/security/`

---

**Quick Links:**
- 🎮 [Security Playground](apps/docs/app/playground/security/) - Test security features
- 📖 [Full Documentation](./README.md) - Complete library docs
- 🐛 [GitHub Issues](https://github.com/yourusername/clarity-ai-chat-components/issues) - Report issues

**Document Version:** 1.0 | **Date:** 2025-11-20
