# Getting Started with @clarity-chat/token-optimization

Welcome! This guide will help you get up and running with token optimization in under 5 minutes.

## Table of Contents

- [Installation](#installation)
- [Your First Token Count](#your-first-token-count)
- [React Quick Start](#react-quick-start)
- [Node.js Quick Start](#nodejs-quick-start)
- [Provider Caching (90% Savings!)](#provider-caching-90-savings)
- [Next Steps](#next-steps)

## Installation

```bash
npm install @clarity-chat/token-optimization
```

Or with your preferred package manager:

```bash
# pnpm
pnpm add @clarity-chat/token-optimization

# yarn
yarn add @clarity-chat/token-optimization
```

## Your First Token Count

The simplest way to count tokens depends on your environment:

### React

```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

function MyComponent() {
  const { count } = useTokenCount('Hello, world!')

  return <div>{count} tokens</div>
}
```

### Node.js

```typescript
import { countTokens } from '@clarity-chat/token-optimization'

const count = countTokens('Hello, world!')
console.log(`${count} tokens`) // 3 tokens
```

That's it! No configuration needed.

## React Quick Start

### 1. Show Token Count

Display token count with automatic updates:

```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

function TokenCounter({ text }: { text: string }) {
  const { count, isLoading, info } = useTokenCount(text)

  if (isLoading) return <div>Counting...</div>

  return (
    <div>
      <strong>{count} tokens</strong>
      <div className="text-sm text-gray-500">
        {info.words} words • {info.characters} characters
      </div>
    </div>
  )
}
```

### 2. Warn at Token Limit

Show warnings when approaching limits:

```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

function PromptEditor({ maxTokens = 4096 }: { maxTokens?: number }) {
  const [text, setText] = useState('')
  const { count } = useTokenCount(text)

  const isNearLimit = count > maxTokens * 0.9
  const isOverLimit = count > maxTokens

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={isOverLimit ? 'border-red-500' : ''}
      />

      <div className={isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : ''}>
        {count} / {maxTokens} tokens
        {isOverLimit && ' - Exceeds limit!'}
        {isNearLimit && !isOverLimit && ' - Approaching limit'}
      </div>
    </div>
  )
}
```

### 3. Use Different Models

Count tokens for specific models:

```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

function ModelSelector() {
  const [model, setModel] = useState<'gpt-4o' | 'claude-3-5-sonnet'>('gpt-4o')
  const { count } = useTokenCount(text, { model })

  return (
    <div>
      <select value={model} onChange={(e) => setModel(e.target.value)}>
        <option value="gpt-4o">GPT-4o</option>
        <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
      </select>
      <div>
        {count} tokens (for {model})
      </div>
    </div>
  )
}
```

## Node.js Quick Start

### 1. Count Tokens

```typescript
import { countTokens } from '@clarity-chat/token-optimization'

// Default model (gpt-4o)
const count = countTokens('Hello, world!')
console.log(count) // 3

// Specific model
const claudeCount = countTokens('Hello, world!', {
  model: 'claude-3-5-sonnet',
})
console.log(claudeCount) // 4
```

### 2. Batch Counting

Count multiple texts efficiently:

```typescript
import { countTokensBatch } from '@clarity-chat/token-optimization'

const texts = ['First message', 'Second message', 'Third message']

const counts = countTokensBatch(texts)
console.log(counts) // [2, 2, 2]

// Total tokens
const total = counts.reduce((sum, count) => sum + count, 0)
console.log(`Total: ${total} tokens`)
```

### 3. Truncate to Limit

Fit text within token limit:

```typescript
import { truncateToTokens } from '@clarity-chat/token-optimization'

const longText = 'This is a very long text...'.repeat(1000)
const truncated = truncateToTokens(longText, 100)

console.log(countTokens(truncated)) // 100 (exactly)
```

## Provider Caching (90% Savings!)

Reduce costs by 90% with provider-native caching:

### Quick Start

```typescript
import { quickCache } from '@clarity-chat/token-optimization'

const result = await quickCache([
  {
    role: 'system',
    content: 'You are a helpful coding assistant with expertise in TypeScript...',
  },
  {
    role: 'user',
    content: 'How do I create a React component?',
  },
])

// Use result.messages in your API call to Anthropic
console.log(`Cached: ${result.cached}`)
console.log(`Savings: ${result.estimatedSavings.percentage * 100}%`)

// Send to Anthropic API
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: result.messages,
})
```

### How It Works

Provider caching works automatically when you have:

1. **≥1024 tokens** of cacheable content
2. **Static content** (system prompts, documents) marked as `cacheable: true`
3. **Repeating requests** with the same static content

**Cost Breakdown:**

- Without caching: 1000 tokens × $0.01/1K = $0.01
- With caching: 1000 tokens × $0.001/1K = $0.001
- **Savings: 90%** 🎉

### Provider-Specific Functions

```typescript
import {
  anthropicCache, // Anthropic Claude
  openaiCache, // OpenAI GPT
  googleCache, // Google Gemini
} from '@clarity-chat/token-optimization'

// Anthropic (with cache_control breakpoints)
const anthropicResult = await anthropicCache(messages)

// OpenAI (automatic for prompts ≥1024 tokens)
const openaiResult = await openaiCache(messages)

// Google Gemini (implicit caching)
const googleResult = await googleCache(messages)
```

[→ Full Provider Caching Guide](./PROVIDER_CACHING.md)

## Next Steps

Now that you've got the basics, here's what to explore next:

### 1. **Learn Provider Caching** (Recommended)

Save 90% on API costs with provider-native caching. →
[Provider Caching Guide](./PROVIDER_CACHING.md)

### 2. **Optimize for Production**

Learn compression, quality gates, and security features. →
[Best Practices Guide](./BEST_PRACTICES.md)

### 3. **Build Complete Apps**

See real-world examples and patterns. → [Examples Directory](../examples/)

### 4. **Explore Advanced Features**

- Model routing (automatic model selection)
- Multi-tier caching
- Compression strategies
- Security hardening

→ [API Reference](./API_REFERENCE.md)

### 5. **Troubleshoot Issues**

Get help with common problems. → [Troubleshooting Guide](./TROUBLESHOOTING.md)

## Common Questions

### Q: Do I need configuration?

**A:** No! The package works with zero configuration. Defaults are optimized for 90% of use cases.

### Q: Which model should I use?

**A:** The default (`gpt-4o`) works for most cases. Use model-specific counting when:

- You need exact counts for a specific provider
- You're comparing costs between models
- You're using a model with different tokenization (e.g., Claude)

### Q: How accurate is the counting?

**A:** 99%+ accurate using `gpt-tokenizer`. This is the same tokenizer used by OpenAI.

### Q: Can I use this with Claude/Gemini?

**A:** Yes! The package supports all major providers:

- OpenAI (GPT-4o, GPT-4o mini, o1, etc.)
- Anthropic (Claude 3.5 Sonnet, Claude 3 Haiku, etc.)
- Google (Gemini 2.0 Flash, Gemini 2.0 Pro)

### Q: What about React Native?

**A:** The core token counting works in React Native. React hooks work if you're using React Native
Web. Provider caching requires a Node.js environment.

### Q: Is this ready for use?

**A:** Yes! The package includes:

- Comprehensive error handling
- Health checks and observability
- Security features (OWASP LLM Top 10)
- Circuit breakers for resilience
- Full TypeScript support

## Getting Help

- **Documentation**: Check our [docs folder](../docs/)
- **Examples**: See [examples folder](../examples/)
- **Issues**: [GitHub Issues](https://github.com/clarity-ai/token-optimization/issues)
- **API Reference**: [API_REFERENCE.md](./API_REFERENCE.md)

## What's Next?

Continue with:

- [Provider Caching Guide](./PROVIDER_CACHING.md) - Save 90% on costs
- [Best Practices](./BEST_PRACTICES.md) - Production patterns
- [API Reference](./API_REFERENCE.md) - Complete API docs

Happy optimizing! 🚀
