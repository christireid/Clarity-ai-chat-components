# Newsletter: The Right Model for the Right Job

**Subject:** Why you're overpaying for "hello"

---

GPT-4 costs 16x more than GPT-4o-mini.

Is it 16x better for greeting messages? For simple FAQs? For "thank you"?

No. You're using a PhD to answer the phone.

## The Key Insight

**Route queries to the cheapest model that handles them well.**

```typescript
function classifyComplexity(message: string): 'simple' | 'standard' | 'complex' {
  // Greetings → cheap model
  if (/^(hi|hello|thanks|ok)[\s!.]*$/i.test(message.trim())) {
    return 'simple'
  }

  // Complex reasoning → premium model
  if (/analyze|compare|step by step|write.*code/i.test(message)) {
    return 'complex'
  }

  return 'standard'
}

const MODELS = {
  simple: 'gpt-4o-mini', // $0.15/1M tokens
  standard: 'gpt-4o', // $2.50/1M tokens
  complex: 'claude-sonnet', // $3.00/1M tokens
}
```

**Real production data:**

- 65% of queries are simple → routed to mini
- 25% are standard → routed to GPT-4o
- 10% are complex → routed to Claude Sonnet

**Result: 58% cost reduction, no quality loss.**

Users don't notice the difference for simple queries. They notice when the complex ones are handled
well.

---

[Read the full article →](/blog/model-selection)

_Clarity Chat's `useModelRouter` handles routing, fallback chains, and cost tracking automatically._
