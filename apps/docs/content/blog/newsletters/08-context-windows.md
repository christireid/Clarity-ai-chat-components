# Context Windows Are Lying to You

*Newsletter version of: Managing 1M Tokens in Practice*

---

Gemini 2.5 Pro supports 1 million tokens.

So why does your app break at 50,000?

Marketing says "1M context window." Reality says performance degrades long before that limit. Your 45-message conversation shouldn't end with "Error: Maximum context length exceeded."

But in 23% of AI chat apps I've tested, it does.

## The Four Strategies That Work

**1. Sliding Window**
Keep only the last N messages. Simple but lossy.

```typescript
const windowSize = 20
const recentMessages = messages.slice(-windowSize)
```

Best for: Casual chat, support bots

**2. Summarization**
Compress old messages into summaries.

```typescript
if (messages.length > threshold) {
  const oldMessages = messages.slice(0, -10)
  const summary = await summarize(oldMessages)
  return [{ role: 'system', content: summary }, ...messages.slice(-10)]
}
```

Best for: Long conversations, customer support

**3. RAG (Retrieval)**
Don't send history—retrieve relevant context on demand.

Best for: Knowledge bases, documentation chat

**4. Semantic Pruning**
Score message relevance, keep what matters.

```typescript
const scored = messages.map(m => ({
  ...m,
  relevance: cosineSimilarity(embed(m.content), queryEmbedding)
}))
return scored.filter(m => m.relevance > 0.7)
```

Best for: Technical support, complex workflows

## Key Takeaway

Context limits are marketing numbers. Real limits are lower:
- GPT-4o: Sweet spot ~32k (advertised 128k)
- Claude: Sweet spot ~100k (advertised 200k)

Plan for degradation before you hit the wall.

---

**Read the full post** for complete implementations and token budget calculators.

[Read full post →]
