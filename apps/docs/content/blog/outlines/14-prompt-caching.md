# Blog Post 14: Prompt Caching: The Feature Most Developers Ignore

## Meta Information

- **Reading Time:** 5 minutes (~1,200 words)
- **Category:** Cost & Optimization
- **Primary Keyword:** prompt caching LLM
- **Secondary Keywords:** OpenAI caching, reduce API costs, token optimization

---

## Hook / Opening (100 words)

**Opening line:** "You're paying full price for the same system prompt 50,000 times a day."

OpenAI, Anthropic, and Google all offer prompt caching—automatic discounts when your prompts share
prefixes. Most developers don't know it exists. Those who do often structure their prompts wrong and
miss the savings.

Let's fix that.

---

## Section 1: What Is Prompt Caching? (200 words)

### Content:

**The concept:** When you send requests with identical prefixes (like system prompts), providers
cache that prefix and charge less for subsequent requests.

**Provider support:** | Provider | Discount | Min Length | Cache TTL |
|----------|----------|------------|-----------| | OpenAI | 50% off input | 1,024 tokens | 5-10 min
| | Anthropic | 90% off cached | 1,024 tokens | 5 min | | Google | 75% off | 32,000 tokens | 1 hour
|

**Example:**

- System prompt: 1,500 tokens (cached)
- User message: 100 tokens (not cached)
- Total: 1,600 tokens
- Cost: 100 tokens full price + 1,500 at 50% = 850 effective tokens

### Visual:

```
[VISUAL 1: Caching flow diagram]
Request 1: [System Prompt] + [User Message] → Full price
Request 2: [Same System Prompt] + [User Message] → 50% off prefix
Request 3: [Same System Prompt] + [User Message] → 50% off prefix
```

---

## Section 2: Why You're Missing Cache Hits (250 words)

### Content:

**Common mistakes:**

**1. Dynamic content at the start:**

```tsx
// BAD: Dynamic content breaks cache
const prompt = `
User ${user.name} is asking about ${topic}.
You are a helpful assistant for TechCorp...
`

// GOOD: Static content first
const prompt = `
You are a helpful assistant for TechCorp...
[1,200+ tokens of static instructions]
---
User ${user.name} is asking about ${topic}.
`
```

**2. Prompt too short:**

```tsx
// BAD: Under 1,024 tokens won't cache
const prompt = 'You are a helpful assistant.' // ~10 tokens

// GOOD: Expand with useful context
const prompt = `
You are a helpful assistant for TechCorp...
[Detailed instructions, examples, formatting guidelines]
` // 1,500 tokens
```

**3. Unnecessary variation:**

```tsx
// BAD: Timestamp breaks cache
const prompt = `
Current time: ${new Date().toISOString()}
You are a helpful assistant...
`

// GOOD: Move dynamic content after static
const prompt = `
You are a helpful assistant...
[static content]
---
Current time: ${new Date().toISOString()}
`
```

---

## Section 3: Optimal Prompt Structure (300 words)

### Code Example:

```tsx
// Structured for maximum cache hits

const STATIC_PREFIX = `
# TechCorp Customer Support Assistant

## Role
You are a helpful, professional customer support assistant.

## Guidelines
1. Be concise and helpful
2. Reference documentation when available
3. Escalate to human when uncertain
4. Never make up information

## Product Knowledge
- Starter Plan: $29/month, 1,000 API calls
- Pro Plan: $99/month, 10,000 API calls
- Enterprise: Custom pricing

## Response Format
- Use bullet points for lists
- Include relevant documentation links
- End with follow-up question if appropriate

## Examples
User: How do I reset my password?
Assistant: To reset your password:
1. Go to Settings > Security
2. Click "Reset Password"
3. Check your email for the reset link

Would you like me to walk you through any of these steps?

[Continue with more examples until ~1,200 tokens]
`.trim()

// Now add dynamic content AFTER the cached prefix
function buildPrompt(context: UserContext) {
  return `${STATIC_PREFIX}

---

## Current Context
- User: ${context.userName}
- Plan: ${context.plan}
- Open Tickets: ${context.openTickets}
- Last Login: ${context.lastLogin}
`
}
```

### Visual:

```
[VISUAL 2: Prompt structure diagram]
┌─────────────────────────────────┐
│  CACHED PREFIX (1,200+ tokens)  │  ← 50% off
│  - Role definition              │
│  - Guidelines                   │
│  - Examples                     │
│  - Static knowledge             │
├─────────────────────────────────┤
│  DYNAMIC SUFFIX (varies)        │  ← Full price
│  - User context                 │
│  - Current query                │
└─────────────────────────────────┘
```

---

## Section 4: Measuring Cache Performance (200 words)

### Content:

**OpenAI returns cache info in response:**

```tsx
const response = await openai.chat.completions.create({...})

// Check cache usage
const usage = response.usage
console.log({
  totalTokens: usage.total_tokens,
  cachedTokens: usage.prompt_tokens_details?.cached_tokens || 0,
  cacheHitRate: (usage.prompt_tokens_details?.cached_tokens || 0) /
                 usage.prompt_tokens * 100
})
```

**Track over time:**

```tsx
import { useTokenTracker } from '@clarity-chat/react'

const { cacheStats } = useTokenTracker({
  trackCacheHits: true,
})

// cacheStats = {
//   hitRate: 0.87,
//   savedTokens: 1_245_000,
//   savedCost: 124.50
// }
```

---

## Section 5: Anthropic's Even Better Caching (150 words)

### Content:

**Anthropic offers 90% savings on cached tokens:**

```tsx
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: STATIC_PREFIX,
      cache_control: { type: 'ephemeral' }, // Explicit cache hint
    },
  ],
  messages: [{ role: 'user', content: userMessage }],
})
```

**Result:** 90% off cached portion—even better than OpenAI's 50%.

---

## Conclusion (80 words)

### Key takeaways:

1. Prompt caching gives 50-90% savings automatically
2. Structure matters: static first, dynamic last
3. Minimum 1,024 tokens for cache eligibility
4. Measure cache hit rates to optimize

### Subtle CTA:

"Clarity Chat's token tracking includes cache hit monitoring, so you can see exactly how much you're
saving—and optimize your prompt structure for maximum efficiency."
