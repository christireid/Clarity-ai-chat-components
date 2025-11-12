# Usage Quotas

Track and enforce usage limits to control costs, manage resources, and implement billing.

## Overview

Usage quotas help you:
- Control API costs
- Enforce rate limits
- Implement tiered pricing
- Monitor usage
- Prevent abuse

## Quick Start

```tsx
import { QuotaManager, MemoryQuotaStorage } from '@clarity-chat/react'

const quotas = new QuotaManager({
  limits: {
    tokens: 100000,  // 100k tokens per month
    requests: 1000,  // 1k requests per month
  },
  resetPeriod: 'monthly',
  storage: new MemoryQuotaStorage(),
})

// Check quota before operation
const check = await quotas.checkQuota('user-123', 'tokens', 500)

if (check.allowed) {
  // Perform operation
} else {
  // Quota exceeded
  console.log(`Limit: ${check.limit}, Used: ${check.used}, Remaining: ${check.remaining}`)
}
```

## Quota Types

### Token Quotas

```tsx
const quotas = new QuotaManager({
  limits: {
    tokens: 100000,
  },
  resetPeriod: 'monthly',
})

// Check token quota
const check = await quotas.checkQuota('user-123', 'tokens', 1000)

if (check.allowed) {
  await useTokens(1000)
  await quotas.consume('user-123', 'tokens', 1000)
}
```

### Request Quotas

```tsx
const quotas = new QuotaManager({
  limits: {
    requests: 1000,
  },
  resetPeriod: 'daily',
})

// Check request quota
const check = await quotas.checkQuota('user-123', 'requests', 1)

if (check.allowed) {
  await makeRequest()
  await quotas.consume('user-123', 'requests', 1)
}
```

### Cost Quotas

```tsx
const quotas = new QuotaManager({
  limits: {
    cost: 100.0, // $100 per month
  },
  resetPeriod: 'monthly',
})

// Check cost quota
const estimatedCost = 0.05 // $0.05
const check = await quotas.checkQuota('user-123', 'cost', estimatedCost)

if (check.allowed) {
  await performOperation()
  await quotas.consume('user-123', 'cost', actualCost)
}
```

## Reset Periods

### Daily Reset

```tsx
const quotas = new QuotaManager({
  limits: { requests: 1000 },
  resetPeriod: 'daily',
  resetTime: '00:00', // UTC
})
```

### Weekly Reset

```tsx
const quotas = new QuotaManager({
  limits: { requests: 10000 },
  resetPeriod: 'weekly',
  resetDay: 'monday', // Reset every Monday
})
```

### Monthly Reset

```tsx
const quotas = new QuotaManager({
  limits: { tokens: 100000 },
  resetPeriod: 'monthly',
  resetDay: 1, // Reset on 1st of each month
})
```

### Custom Reset

```tsx
const quotas = new QuotaManager({
  limits: { requests: 1000 },
  resetPeriod: 'custom',
  resetFunction: async (userId) => {
    // Custom reset logic
    const user = await getUser(userId)
    return user.subscriptionRenewalDate
  },
})
```

## Storage Backends

### Memory Storage (Development)

```tsx
import { MemoryQuotaStorage } from '@clarity-chat/react'

const quotas = new QuotaManager({
  storage: new MemoryQuotaStorage(),
})
```

### Database Storage

```tsx
import { DatabaseQuotaStorage } from '@clarity-chat/react'

const quotas = new QuotaManager({
  storage: new DatabaseQuotaStorage({
    connectionString: process.env.DATABASE_URL,
    tableName: 'quotas',
  }),
})
```

### Redis Storage

```tsx
import { RedisQuotaStorage } from '@clarity-chat/react'

const quotas = new QuotaManager({
  storage: new RedisQuotaStorage({
    url: process.env.REDIS_URL,
  }),
})
```

## Quota Checking

### Check Before Operation

```tsx
const check = await quotas.checkQuota('user-123', 'tokens', 1000)

if (check.allowed) {
  // Proceed with operation
} else {
  // Handle quota exceeded
  throw new Error(`Quota exceeded. Limit: ${check.limit}, Used: ${check.used}`)
}
```

### Get Current Usage

```tsx
const usage = await quotas.getUsage('user-123', 'tokens')

console.log(`Used: ${usage.used}/${usage.limit}`)
console.log(`Remaining: ${usage.remaining}`)
console.log(`Percentage: ${usage.percentage}%`)
```

### Check Multiple Quotas

```tsx
const checks = await quotas.checkMultiple('user-123', {
  tokens: 1000,
  requests: 1,
  cost: 0.05,
})

if (checks.every(check => check.allowed)) {
  // All quotas OK
} else {
  // Some quotas exceeded
  const exceeded = checks.filter(check => !check.allowed)
  console.log('Exceeded quotas:', exceeded.map(c => c.quota))
}
```

## Consuming Quotas

### Consume After Operation

```tsx
// Check quota
const check = await quotas.checkQuota('user-123', 'tokens', 1000)

if (check.allowed) {
  // Perform operation
  const actualTokens = await performOperation()
  
  // Consume actual amount used
  await quotas.consume('user-123', 'tokens', actualTokens)
}
```

### Atomic Consumption

```tsx
// Reserve quota atomically
const reservation = await quotas.reserve('user-123', 'tokens', 1000)

if (reservation.success) {
  try {
    await performOperation()
    await reservation.commit() // Confirm consumption
  } catch (error) {
    await reservation.rollback() // Release reservation
  }
}
```

## Warnings and Limits

### Configure Warnings

```tsx
const quotas = new QuotaManager({
  limits: { tokens: 100000 },
  warnings: {
    tokens: [0.8, 0.9, 0.95], // Warn at 80%, 90%, 95%
  },
  onWarning: (quota, usage) => {
    console.log(`Warning: ${usage.percentage}% of ${quota} quota used`)
    // Send notification
  },
})
```

### Handle Exceeded Quotas

```tsx
const quotas = new QuotaManager({
  limits: { tokens: 100000 },
  onExceeded: (quota, usage) => {
    console.log(`Quota exceeded: ${quota}`)
    // Block operation or upgrade prompt
  },
})
```

## Integration with Chat

### Automatic Quota Checking

```tsx
import { ChatWindow, QuotaProvider } from '@clarity-chat/react'

const quotas = new QuotaManager({
  limits: { tokens: 100000 },
})

function App() {
  return (
    <QuotaProvider manager={quotas} autoCheck={true}>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </QuotaProvider>
  )
}
```

### Manual Quota Checking

```tsx
import { useQuota } from '@clarity-chat/react'

function ChatComponent() {
  const { checkQuota, consume } = useQuota()
  
  const handleSend = async (content: string) => {
    // Estimate tokens
    const estimatedTokens = estimateTokens(content)
    
    // Check quota
    const check = await checkQuota('tokens', estimatedTokens)
    
    if (!check.allowed) {
      throw new Error('Token quota exceeded')
    }
    
    // Send message
    const response = await sendMessage(content)
    
    // Consume actual tokens used
    await consume('tokens', response.usage.totalTokens)
  }
  
  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Tiered Quotas

### Different Limits per Tier

```tsx
const quotas = new QuotaManager({
  tiers: {
    free: {
      tokens: 10000,
      requests: 100,
    },
    pro: {
      tokens: 100000,
      requests: 1000,
    },
    enterprise: {
      tokens: 1000000,
      requests: 10000,
    },
  },
  getUserTier: async (userId) => {
    const user = await getUser(userId)
    return user.tier
  },
})
```

## Best Practices

1. **Check Before Operations**: Always check quotas before expensive operations
2. **Consume Actual Usage**: Consume actual amounts, not estimates
3. **Handle Gracefully**: Provide clear error messages when quotas are exceeded
4. **Monitor Usage**: Track usage patterns and adjust limits
5. **Set Warnings**: Configure warnings before limits are reached
6. **Use Atomic Operations**: Use reservations for critical operations
7. **Cache Quota Checks**: Cache quota checks for performance

## Next Steps

- [Quota API Reference](/api/quotas) - Complete quota API
- [Storage Backends](/guide/quota-storage) - Storage options
- [Billing Integration](/guide/billing) - Integrate with billing systems
