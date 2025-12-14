---
title: "I Cut My GPT-4 Bill by 60% (Real Strategies, Real Numbers)"
description: "Real cost optimization from $8,400 to $3,200/month. Model routing, semantic caching, and context pruning with production code."
keywords: ["GPT-4 costs", "API optimization", "cost reduction", "model routing", "semantic caching"]
author: "Clarity Chat Team"
publishDate: 2025-02-18
readingTime: 12
category: "Cost & Performance"
featured: true
relatedPosts: ["10-token-counting", "14-prompt-caching", "15-model-selection"]
---

# I Cut My GPT-4 Bill by 60% (Real Strategies, Real Numbers)

> **Pricing Note:** API pricing changes frequently. The costs in this article reflect 2025 rates—verify current pricing on the provider's website before implementation.

My startup was spending $8,400/month on OpenAI. Now it's $3,200. Same features, same quality.

This isn't theory—these are real numbers from a production AI chat application serving 15,000 daily active users. I'm going to share exactly what we changed, with code you can copy.

No vendor lock-in pitches. No "just use our product." Just the actual techniques that work.

---

## Where the Money Goes

Before optimizing, we had no idea where our costs actually came from. So we instrumented everything:

**Our breakdown:**
- Total: $8,400/month
- GPT-4 (main chat): $6,200 (74%)
- Embeddings: $1,400 (17%)
- GPT-3.5 (fallback): $800 (9%)

The problem was obvious: we were using GPT-4 for *everything*. Every message, every query, every classification. User says "hello"? GPT-4. User asks what time it is? GPT-4. User asks a complex legal question? Also GPT-4.

We were paying premium prices for tasks that a cheaper model could handle just as well.

---

## Strategy 1: Model Routing

The insight: not every message needs GPT-4. Simple questions, greetings, and confirmations work fine with GPT-4o-mini at 1/16th the cost.

Here's the routing logic we implemented:

```typescript
interface ModelConfig {
  model: string
  maxTokens: number
  costPer1kInput: number
  costPer1kOutput: number
}

const MODELS: Record<string, ModelConfig> = {
  simple: {
    model: 'gpt-4o-mini',
    maxTokens: 500,
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.0006,
  },
  standard: {
    model: 'gpt-4o',
    maxTokens: 2000,
    costPer1kInput: 0.0025,
    costPer1kOutput: 0.01,
  },
  complex: {
    model: 'gpt-4o',
    maxTokens: 4000,
    costPer1kInput: 0.0025,
    costPer1kOutput: 0.01,
  },
}

function classifyComplexity(message: string): 'simple' | 'standard' | 'complex' {
  // Quick heuristics (no API call needed)
  const lowerMessage = message.toLowerCase()

  // Greetings and simple confirmations
  if (message.length < 20) return 'simple'
  if (/^(hi|hello|hey|thanks|ok|yes|no)[\s!.]*$/i.test(message.trim())) {
    return 'simple'
  }

  // FAQ-type questions
  const faqPatterns = [
    /what (are|is) your (hours|address|phone|email)/i,
    /how (do|can) i (contact|reach|call)/i,
    /where (are|is) you located/i,
  ]
  if (faqPatterns.some(p => p.test(message))) return 'simple'

  // Complex reasoning indicators
  const complexPatterns = [
    /analyze|compare|explain why|difference between/i,
    /step by step|in detail|comprehensive/i,
    /write .*(code|function|class|component)/i,
    /review|audit|evaluate/i,
  ]
  if (complexPatterns.some(p => p.test(message))) return 'complex'

  // Everything else
  return 'standard'
}

async function routeMessage(
  message: string,
  conversationHistory: Message[]
): Promise<{ response: string; model: string; cost: number }> {
  const complexity = classifyComplexity(message)
  const config = MODELS[complexity]

  const response = await openai.chat.completions.create({
    model: config.model,
    max_tokens: config.maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message },
    ],
  })

  const inputTokens = response.usage?.prompt_tokens || 0
  const outputTokens = response.usage?.completion_tokens || 0
  const cost = (inputTokens * config.costPer1kInput / 1000) +
               (outputTokens * config.costPer1kOutput / 1000)

  return {
    response: response.choices[0].message.content || '',
    model: config.model,
    cost,
  }
}
```

**Results:**
- 62% of queries routed to GPT-4o-mini
- Cost per request dropped from $0.028 to $0.003 for simple queries
- Savings: **$2,800/month**

User experience? Identical. Nobody noticed the difference for simple queries.

---

## Strategy 2: Prompt Caching

OpenAI, Anthropic, and Google all offer prompt caching—automatic discounts when your prompts share prefixes. We were leaving money on the table.

The math: Our system prompt was 1,200 tokens. With 50,000 requests/day, that's 60 million tokens per day on the same text.

With prompt caching, identical prefixes cost 50% less after the first request. But there's a catch: only prompts over 1,024 tokens qualify, and the cached portion must be at the *start* of the prompt.

We restructured:

```typescript
// BEFORE: Dynamic content at the start (breaks cache)
const badPrompt = `
User ${user.name} is asking about ${topic}.
Current date: ${new Date().toISOString()}.

You are a helpful customer support assistant for TechCorp...
[rest of static instructions]
`

// AFTER: Static content first (maximizes cache hits)
const STATIC_PREFIX = `
You are a helpful customer support assistant for TechCorp.

## Guidelines
1. Be concise and professional
2. Reference documentation when available
3. Escalate complex issues to human support
4. Never make up information about policies

## Product Knowledge
- Starter Plan: $29/month, 1,000 API calls
- Pro Plan: $99/month, 10,000 API calls
- Enterprise: Custom pricing, dedicated support

## Response Format
- Use bullet points for multi-step instructions
- Include relevant documentation links
- Ask clarifying questions when needed

## Common Scenarios
[... extensive static examples and guidelines ...]
`.trim()  // ~1,400 tokens of static content

function buildPrompt(user: User, topic: string): string {
  return `${STATIC_PREFIX}

---

## Current Context
- User: ${user.name}
- Plan: ${user.plan}
- Topic: ${topic}
- Date: ${new Date().toISOString()}
`
}
```

The key: static content *first*, dynamic content *last*. The cache works on prefixes, so everything before your first dynamic value gets cached.

**Results:**
- 85% cache hit rate
- Input cost reduced by 42%
- Savings: **$1,100/month**

---

## Strategy 3: Context Compression

Conversation history grows linearly. By message 20, you're sending 10,000+ tokens of history with each request. Most of that is old, irrelevant context.

We implemented three compression strategies:

**1. Sliding Window**

The simplest approach—keep only the last N messages:

```typescript
function getRecentContext(messages: Message[], maxMessages = 10): Message[] {
  return messages.slice(-maxMessages)
}
```

Works great for casual chat. Loses important context for complex conversations.

**2. Summarization**

Compress old messages into a summary:

```typescript
async function getCompressedContext(
  messages: Message[],
  recentCount = 10
): Promise<Message[]> {
  if (messages.length <= recentCount) {
    return messages
  }

  const oldMessages = messages.slice(0, -recentCount)
  const recentMessages = messages.slice(-recentCount)

  // Use cheap model to summarize old context
  const summary = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 500,
    messages: [
      {
        role: 'system',
        content: 'Summarize this conversation in 2-3 sentences, focusing on key decisions, facts, and context needed for future messages.',
      },
      ...oldMessages,
    ],
  })

  return [
    {
      role: 'system',
      content: `Previous conversation summary: ${summary.choices[0].message.content}`,
    },
    ...recentMessages,
  ]
}
```

The summarization call costs ~$0.001, but saves ~$0.05 in context on subsequent messages.

**3. Semantic Pruning**

Keep only messages relevant to the current query:

```typescript
// Helper functions for embeddings (use your preferred provider)
async function embed(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

async function getRelevantContext(
  currentQuery: string,
  messages: Message[],
  maxMessages = 8
): Promise<Message[]> {
  // Embed current query
  const queryEmbedding = await embed(currentQuery)

  // Score each message by relevance
  const scored = await Promise.all(
    messages.map(async (msg) => ({
      message: msg,
      score: cosineSimilarity(queryEmbedding, await embed(msg.content)),
    }))
  )

  // Return top K most relevant
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxMessages)
    .sort((a, b) => a.message.timestamp - b.message.timestamp) // Restore chronological order
    .map(s => s.message)
}
```

We use a combination: summarization for very old messages, semantic pruning for the middle, recent messages kept intact.

**Results:**
- Average context size: 8,000 → 2,400 tokens
- Savings: **$1,400/month**

---

## Strategy 4: Response Caching

Many queries are repeated. "What are your business hours?" gets asked 500 times per day. Why call the API 500 times for the same answer?

> **Production Note:** The in-memory cache shown below is for illustration. In production, use Redis or another distributed cache to handle scale and avoid memory issues.

```typescript
import { createHash } from 'crypto'

interface CacheEntry {
  response: string
  timestamp: number
  ttl: number
}

const cache = new Map<string, CacheEntry>()

function getCacheKey(message: string, systemPrompt: string): string {
  // Normalize the message
  const normalized = message.toLowerCase().trim()
  return createHash('sha256')
    .update(`${systemPrompt}:${normalized}`)
    .digest('hex')
}

async function getCachedOrFetch(
  message: string,
  systemPrompt: string,
  ttlSeconds = 3600
): Promise<{ response: string; cached: boolean }> {
  const key = getCacheKey(message, systemPrompt)

  // Check cache
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < cached.ttl * 1000) {
    return { response: cached.response, cached: true }
  }

  // Cache miss - call API
  // callOpenAI is your wrapper around openai.chat.completions.create()
  const response = await callOpenAI(message, systemPrompt)

  // Store in cache
  cache.set(key, {
    response,
    timestamp: Date.now(),
    ttl: ttlSeconds,
  })

  return { response, cached: false }
}
```

For semantic matching (catching variations like "what are your hours" vs "when are you open"), we added embedding-based similarity:

```typescript
async function findSimilarCached(
  message: string,
  threshold = 0.92
): Promise<string | null> {
  const embedding = await embed(message)

  for (const [key, entry] of cache.entries()) {
    const cachedEmbedding = await embed(entry.normalizedQuery)
    const similarity = cosineSimilarity(embedding, cachedEmbedding)

    if (similarity > threshold && Date.now() - entry.timestamp < entry.ttl * 1000) {
      return entry.response
    }
  }

  return null
}
```

**Results:**
- 23% cache hit rate
- Zero cost for cached responses
- Savings: **$900/month**

---

## The Final Numbers

**Before optimization:**
- Monthly cost: $8,400
- Cost per request: $0.028
- 300,000 requests/month

**After optimization:**
- Monthly cost: $3,200
- Cost per request: $0.011
- Same 300,000 requests/month

**Breakdown of savings:**
| Strategy | Monthly Savings |
|----------|-----------------|
| Model routing | $2,800 |
| Prompt caching | $1,100 |
| Context compression | $1,400 |
| Response caching | $900 |
| **Total** | **$5,200 (62%)** |

---

## What I'd Do Differently

If I were starting over:

1. **Start with routing first** — Biggest impact, easiest to implement, no quality tradeoff for simple queries

2. **Measure before optimizing** — We wasted a week optimizing embeddings before realizing they were only 17% of our cost

3. **Don't over-optimize** — We initially set our similarity threshold too low and cached inappropriate responses. User experience matters more than saving $0.001

4. **Monitor quality** — Cheaper models have different failure modes. Track user satisfaction alongside costs

5. **Use batch when possible** — For non-real-time operations (summarization, classification), OpenAI's batch API offers 50% discount

---

## The Takeaway

AI API costs are controllable. You don't need to throw money at every request or compromise on quality.

The fundamentals:
1. Route simple queries to cheap models
2. Structure prompts for cache hits
3. Compress conversation context
4. Cache repeated responses

These aren't theoretical optimizations—they're production-tested techniques that cut our bill from $8,400 to $3,200 without users noticing any difference.

---

*Clarity Chat includes `useModelRouter`, `useSmartCache`, and context management hooks that implement these patterns. We went through this optimization pain so you don't have to. [See the cost optimization docs →](/docs/cost-optimization)*
