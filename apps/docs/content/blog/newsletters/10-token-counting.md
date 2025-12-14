# Token Counting That Actually Works

*Newsletter version of: Accurate Cost Prediction*

---

JavaScript's `string.length` has nothing to do with tokens.

That's why your cost estimates are wrong.

You estimated 1,000 tokens. The API charged you for 2,300. What happened?

## Why String Length Fails

```typescript
// Looks like ~50 characters
"Hello, how are you today?"

// GPT-4 tokenizes this as 7 tokens
// But "こんにちは" (5 chars) = 3-5 tokens
// And "🎉🎊🎁" (3 chars) = 6+ tokens
```

Different models use different tokenizers. Unicode is unpredictable. Code tokenizes differently than prose.

## The Right Way

Use tiktoken (OpenAI's tokenizer):

```typescript
import { encoding_for_model } from 'tiktoken'

function countTokens(text: string, model: string): number {
  const encoder = encoding_for_model(model)
  const tokens = encoder.encode(text)
  encoder.free()
  return tokens.length
}
```

## Token Budget Management

Track tokens across your conversation:

```typescript
interface TokenBudget {
  systemPrompt: number    // Fixed cost
  history: number         // Grows over time
  userMessage: number     // Current input
  responseBuffer: number  // Reserve for output
  total: number
  limit: number
}

function checkBudget(budget: TokenBudget): boolean {
  const used = budget.systemPrompt + budget.history + budget.userMessage
  return used + budget.responseBuffer < budget.limit
}
```

## Cost Estimation

```typescript
function estimateCost(tokens: number, model: string): number {
  const rates = {
    'gpt-4o': { input: 0.0025, output: 0.01 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  }
  return (tokens / 1000) * rates[model].input
}
```

## Key Takeaway

Never guess tokens. Always count. Display usage to users so they understand costs.

---

**Read the full post** for model-specific tokenizers and real-time cost tracking.

[Read full post →]
