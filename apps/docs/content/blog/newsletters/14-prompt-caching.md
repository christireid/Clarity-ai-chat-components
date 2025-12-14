# Newsletter: Free Money from Prompt Caching

**Subject:** You're paying full price for the same tokens twice

---

Your system prompt is 1,200 tokens. With 50,000 requests per day, that's 60 million tokens daily—all identical.

OpenAI, Anthropic, and Google offer prompt caching: **50% discount** on repeated prefixes.

## The Key Insight

**Static content first, dynamic content last.**

```typescript
// BAD: Dynamic content breaks cache
const brokenPrompt = `
User ${user.name} is asking about ${topic}.
Today is ${new Date()}.

You are a helpful assistant...
[1000+ tokens of static instructions]
`

// GOOD: Static prefix maximizes cache hits
const cachedPrompt = `
You are a helpful assistant...
[1000+ tokens of static instructions]

---

User: ${user.name}
Topic: ${topic}
Date: ${new Date()}
`
```

The cache works on **prefixes**. Everything before your first dynamic value gets cached. Move static content to the front.

**Requirements:**
- Prefix must be 1,024+ tokens
- Same model, same prefix = cache hit
- Works across API calls (for 5-10 minutes)

**Our results:**
- 85% cache hit rate
- 42% reduction in input costs
- **$1,100/month saved**

---

[Read the full article →](/blog/prompt-caching)

*Structure your prompts right and the savings are automatic.*
