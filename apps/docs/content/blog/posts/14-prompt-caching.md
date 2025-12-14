---
title: "Prompt Caching: The Feature Most Developers Ignore"
description: "Leverage OpenAI and Anthropic prompt caching for automatic discounts. Structure prompts correctly to maximize cache hits."
keywords: ["prompt caching", "OpenAI caching", "Anthropic caching", "API optimization", "cost savings"]
author: "Clarity Chat Team"
publishDate: 2025-02-20
readingTime: 9
category: "Cost & Performance"
relatedPosts: ["13-cut-gpt4-bill", "10-token-counting", "08-context-windows"]
---

# Prompt Caching: The Feature Most Developers Ignore

You're paying full price for the same system prompt 50,000 times a day.

OpenAI, Anthropic, and Google all offer prompt caching—automatic discounts when your prompts share prefixes. Most developers don't know it exists. Those who do often structure their prompts wrong and miss the savings entirely.

Let's fix that.

---

## What Is Prompt Caching?

When you send requests with identical prefixes (like system prompts), AI providers cache that prefix and charge less for subsequent requests.

**How it works:**

| Provider | Discount | Min Length | Cache TTL |
|----------|----------|------------|-----------|
| OpenAI | 50% off input | 1,024 tokens | 5-10 min |
| Anthropic | 90% off cached | 1,024 tokens | 5 min |
| Google | 75% off | 32,000 tokens | 1 hour |

Let's do the math:

- System prompt: 1,500 tokens
- User message: 100 tokens
- Total: 1,600 tokens

Without caching: Pay full price for 1,600 tokens
With caching: Pay full price for 100 tokens + 50% for 1,500 = 850 effective tokens

That's a 47% reduction just from prompt structure.

At scale—say, 50,000 requests per day—that's the difference between $75/day and $40/day. Over a year: $12,775 saved.

---

## Why You're Missing Cache Hits

Most developers are unintentionally breaking their cache eligibility. Here are the common mistakes:

### Mistake 1: Dynamic Content at the Start

```typescript
// BAD: Dynamic content breaks cache
const prompt = `
User ${user.name} is asking about ${topic}.
Current date: ${new Date().toISOString()}.

You are a helpful assistant for TechCorp...
[1,200 tokens of instructions]
`
```

This prompt will *never* cache because every request has a different prefix. The user name and date change, so the prefix changes.

```typescript
// GOOD: Static content first
const prompt = `
You are a helpful assistant for TechCorp...
[1,200 tokens of static instructions]

---

User ${user.name} is asking about ${topic}.
Current date: ${new Date().toISOString()}.
`
```

Now the first 1,200+ tokens are identical across requests. Cache hit.

### Mistake 2: Prompt Too Short

```typescript
// BAD: Under 1,024 tokens won't cache
const prompt = "You are a helpful assistant."  // ~10 tokens
```

Prompt caching only kicks in at 1,024+ tokens. If your system prompt is shorter, you get no benefit.

```typescript
// GOOD: Expand with useful content
const prompt = `
You are a helpful customer support assistant for TechCorp.

## Your Personality
- Friendly but professional
- Concise and direct
- Patient with confused users

## Guidelines
1. Always greet the user by name if provided
2. Reference official documentation when available
3. Escalate to human support if you're uncertain
4. Never make up information about policies or pricing

## Product Knowledge
- Starter Plan: $29/month, includes 1,000 API calls
- Pro Plan: $99/month, includes 10,000 API calls
- Enterprise: Custom pricing, dedicated support

## Common Questions
Q: How do I reset my password?
A: Go to Settings > Security > Reset Password. You'll receive an email with a reset link.

Q: What payment methods do you accept?
A: We accept all major credit cards, PayPal, and bank transfers for annual plans.

[Continue with more examples, edge cases, formatting guidelines...]
`  // ~1,500 tokens
```

The expanded prompt isn't padding—it's genuinely useful context that improves response quality AND enables caching.

### Mistake 3: Unnecessary Variation

```typescript
// BAD: Timestamp breaks cache
const prompt = `
Current time: ${new Date().toISOString()}
You are a helpful assistant...
`

// GOOD: Move timestamp after static content
const prompt = `
You are a helpful assistant...
[static content]
---
Current time: ${new Date().toISOString()}
`
```

Every dynamic element should be as late in the prompt as possible.

---

## Optimal Prompt Structure

Here's a template that maximizes cache hits:

```typescript
// Static prefix - never changes, always cached
const STATIC_PREFIX = `
# TechCorp Customer Support Assistant

## Role
You are a helpful, professional customer support assistant for TechCorp.

## Core Guidelines
1. Be concise and helpful
2. Reference documentation when available
3. Escalate to human when uncertain
4. Never make up information

## Response Format
- Use bullet points for lists
- Include relevant documentation links
- End with follow-up question if appropriate

## Product Information
### Pricing
- Starter: $29/month (1,000 API calls)
- Pro: $99/month (10,000 API calls)
- Enterprise: Custom pricing

### Features
- Real-time analytics
- Custom integrations
- Priority support (Pro and above)
- SLA guarantees (Enterprise only)

## Example Interactions

### Password Reset
User: How do I reset my password?
Assistant: To reset your password:
1. Go to Settings > Security
2. Click "Reset Password"
3. Check your email for the reset link

The link expires in 24 hours. Would you like me to help with anything else?

### Billing Question
User: Can I get a refund?
Assistant: We offer refunds within 30 days of purchase for all plans. To request a refund:
1. Go to Settings > Billing
2. Click "Request Refund"
3. Select your reason

Refunds are typically processed within 5-7 business days.

[Continue with more examples until ~1,200 tokens...]
`.trim()

// Dynamic suffix - changes per request, not cached
function buildPrompt(context: UserContext): string {
  return `${STATIC_PREFIX}

---

## Current Context
- User: ${context.userName}
- Plan: ${context.plan}
- Account Status: ${context.status}
- Open Tickets: ${context.openTickets}
- Timezone: ${context.timezone}
- Current Time: ${new Date().toISOString()}
`
}
```

The structure:

1. **Static prefix (1,200+ tokens)**: Role, guidelines, examples, product info—anything that doesn't change between requests
2. **Separator**: Clear divider between cached and dynamic content
3. **Dynamic suffix**: User-specific context, timestamps, session data

---

## Measuring Cache Performance

OpenAI includes cache information in the API response:

```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: buildPrompt(userContext) },
    { role: 'user', content: userMessage },
  ],
})

// Check cache stats
const usage = response.usage
if (usage?.prompt_tokens_details) {
  const cachedTokens = usage.prompt_tokens_details.cached_tokens || 0
  const totalPromptTokens = usage.prompt_tokens
  const cacheHitRate = cachedTokens / totalPromptTokens

  console.log({
    totalPromptTokens,
    cachedTokens,
    cacheHitRate: `${(cacheHitRate * 100).toFixed(1)}%`,
  })
}
```

Track this over time to ensure your optimization is working:

```typescript
interface CacheStats {
  totalRequests: number
  cachedTokens: number
  uncachedTokens: number
  estimatedSavings: number
}

function trackCacheStats(stats: CacheStats, response: ChatCompletion) {
  const usage = response.usage
  const cached = usage?.prompt_tokens_details?.cached_tokens || 0
  const uncached = (usage?.prompt_tokens || 0) - cached

  stats.totalRequests++
  stats.cachedTokens += cached
  stats.uncachedTokens += uncached

  // Calculate savings (50% discount on cached tokens)
  const savingsPerToken = 0.0025 / 1000 * 0.5 // GPT-4o input price * discount
  stats.estimatedSavings += cached * savingsPerToken

  return stats
}

// Report weekly
console.log({
  cacheHitRate: `${(stats.cachedTokens / (stats.cachedTokens + stats.uncachedTokens) * 100).toFixed(1)}%`,
  estimatedMonthlySavings: `$${(stats.estimatedSavings * 4).toFixed(2)}`,
})
```

---

## Anthropic's Even Better Caching

Anthropic offers 90% savings on cached tokens—significantly better than OpenAI's 50%. You can also explicitly mark content for caching:

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: STATIC_PREFIX,
      cache_control: { type: 'ephemeral' }  // Explicit cache hint
    }
  ],
  messages: [
    { role: 'user', content: userMessage }
  ]
})

// Check cache usage
console.log({
  inputTokens: response.usage.input_tokens,
  cacheRead: response.usage.cache_read_input_tokens,
  cacheCreation: response.usage.cache_creation_input_tokens,
})
```

At 90% discount, Anthropic's caching is extremely cost-effective for applications with long system prompts.

---

## Cache TTL Considerations

Caches expire:
- **OpenAI**: 5-10 minutes
- **Anthropic**: 5 minutes
- **Google**: 1 hour

For high-traffic applications, this is fine—you'll get cache hits continuously. For low-traffic applications, you might not benefit as much.

Ways to maximize TTL benefits:

```typescript
// Batch similar requests together
async function processBatch(messages: string[]): Promise<string[]> {
  // Process in quick succession to maximize cache hits
  const results = []
  for (const message of messages) {
    results.push(await sendMessage(message))
  }
  return results
}

// Use consistent system prompts across endpoints
const SHARED_SYSTEM_PROMPT = buildSystemPrompt() // Same for all users
```

---

## The Takeaway

Prompt caching is free money. You're already paying for system prompts on every request—structuring them correctly can cut those costs by 50-90%.

The rules:
1. **Static content first, dynamic content last** — Caches work on prefixes
2. **Minimum 1,024 tokens** — Shorter prompts don't cache
3. **Measure your cache hit rate** — Verify optimization is working
4. **Consider Anthropic for long prompts** — 90% savings beats 50%

Most developers don't know this feature exists. Now you do. Go restructure your prompts.

---

*Clarity Chat's token tracking includes cache hit monitoring, showing you exactly how much you're saving and where to optimize further. [See the token tracking docs →](/docs/hooks/use-token-tracker)*
