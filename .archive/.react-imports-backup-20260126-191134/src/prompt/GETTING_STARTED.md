# Getting Started: Prompt & Token Optimization

A 5-minute guide to start using prompt and token optimization.

## Step 1: Install (Already Done!)

If you have `@clarity-chat/react` installed, you're all set. No additional packages needed.

```bash
npm install @clarity-chat/react
```

## Step 2: Enable Optimization (Choose One)

### Method A: In useClarityChat (Recommended)

Add one prop to your existing `useClarityChat` call:

```tsx
import { useClarityChat } from '@clarity-chat/react'

function MyChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,        // ← Add this
      targetTokens: 4000,   // ← And this
    },
  })

  return <div>{/* Your chat UI */}</div>
}
```

**Done!** Your chat now automatically optimizes prompts to stay under 4K tokens.

### Method B: Standalone Hook

Use the hook independently:

```tsx
import { useTokenBudget } from '@clarity-chat/react/prompt'

function MyComponent({ messages }) {
  const budget = useTokenBudget({
    messages,
    modelMetadata: 'gpt-4',
    targetBudget: 4000,
  })

  return (
    <div>
      <p>Tokens: {budget.currentTokens} / 4000</p>
      {budget.isExceeded && (
        <button onClick={() => budget.optimize('hybrid')}>
          Optimize
        </button>
      )}
    </div>
  )
}
```

## Step 3: View Token Stats (Optional)

Access token statistics from `useClarityChat`:

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  promptOptimization: { enabled: true, targetTokens: 4000 },
})

// Access token stats
if (chat.tokenStats) {
  console.log('Input tokens:', chat.tokenStats.inputTokens)
  console.log('Remaining budget:', chat.tokenStats.remainingBudget)
  console.log('Was optimized:', chat.tokenStats.wasOptimized)
  console.log('Reason:', chat.tokenStats.lastOptimizationReason)
}
```

## Step 4: Customize (Optional)

### Change Strategy

```tsx
promptOptimization: {
  enabled: true,
  targetTokens: 4000,
  strategy: 'sliding-window', // or 'summarize-old', 'drop-low-priority', 'hybrid'
  keepRecent: 5,              // For sliding-window
}
```

### Use Different Model

```tsx
promptOptimization: {
  enabled: true,
  targetTokens: 4000,
  model: 'gpt-4-turbo', // or 'claude-3-sonnet', 'gemini-1.5-pro', etc.
}
```

### Custom Summarization

```tsx
promptOptimization: {
  enabled: true,
  targetTokens: 4000,
  strategy: 'summarize-old',
  summarizeFn: async (messages) => {
    // Call your summarization API
    const res = await fetch('/api/summarize', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    })
    const { summary } = await res.json()
    return summary
  },
}
```

## What Happens Automatically?

When enabled, Clarity will:

1. ✅ **Count tokens** for each message
2. ✅ **Monitor budget** in real-time
3. ✅ **Optimize automatically** when approaching limit
4. ✅ **Preserve important messages** (system, recent, high-priority)
5. ✅ **Summarize old messages** if needed
6. ✅ **Drop low-value messages** when necessary

## Common Questions

### Q: Does this slow down my app?

**A:** No. Token counting is fast (approximate, ~4 chars per token). Optimization only runs when needed.

### Q: Will this break my existing code?

**A:** No. It's completely opt-in. Existing code works unchanged.

### Q: Can I use it with any model?

**A:** Yes! Works with OpenAI, Anthropic, Google, Mistral, and more.

### Q: How accurate is token counting?

**A:** Uses approximate counting (~4 chars per token). For exact counts, integrate `tiktoken` (see docs).

### Q: Can I disable it per request?

**A:** Yes. Set `enabled: false` or omit the prop entirely.

## Next Steps

- 📖 **Read full docs**: [README.md](./README.md)
- 🚀 **See examples**: `apps/examples/prompt-optimization-example.tsx`
- 🎯 **Advanced features**: [ADVANCED.md](./ADVANCED.md)
- 📚 **API reference**: [EXPORTS.md](./EXPORTS.md)

## Need Help?

- Check [SETUP.md](./SETUP.md) for detailed setup
- See [QUICK_START.md](./QUICK_START.md) for code snippets
- Review examples in `apps/examples/`

---

**You're all set!** Start optimizing prompts in your chat app. 🎉
