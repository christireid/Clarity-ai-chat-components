# Newsletter: The Costs Nobody Tells You About

**Subject:** Your AI bill is 40% higher than you think

---

Token costs are obvious. But there are hidden costs eating your budget that don't appear on the OpenAI invoice.

## The Key Insight

**The real cost of AI chat includes:**

1. **Context accumulation**
   - Message 1: 100 tokens
   - Message 10: You're sending 2,000+ tokens
   - Message 30: 8,000+ tokens per request

   Every message sends the *entire* history.

2. **Retry costs**
   - Rate limit retry? Double the tokens.
   - Timeout retry? Triple if you're unlucky.
   - Network failure? Each attempt costs money.

3. **Failed requests**
   - You still pay for requests that error mid-stream
   - Moderation rejections count
   - Context length exceeded? Paid tokens.

4. **Development waste**
   - Testing with production models
   - Debug sessions with GPT-4
   - Prompt iteration without caching

```typescript
// Track ALL costs, not just successful requests
const trackRequest = (tokens: number, status: 'success' | 'retry' | 'failed') => {
  metrics.totalTokens += tokens
  metrics.wastedTokens += status !== 'success' ? tokens : 0

  // Alert if waste ratio > 15%
  if (metrics.wastedTokens / metrics.totalTokens > 0.15) {
    alert('High token waste detected')
  }
}
```

**Quick wins:**
- Context compression at 10+ messages
- Exponential backoff (don't retry immediately)
- Use GPT-4o-mini for development
- Cache prompts aggressively

---

[Read the full article →](/blog/hidden-costs)

*Know what you're actually spending. Then optimize.*
