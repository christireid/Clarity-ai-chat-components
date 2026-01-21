# Examples

Copy-paste ready examples for `@clarity-chat/token-optimization`.

## Quick Start

The fastest path to working code:

```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

const { count } = useTokenCount(text)
```

## Examples Index

| File                                                  | Description                     | Complexity   | Key Features                               |
| ----------------------------------------------------- | ------------------------------- | ------------ | ------------------------------------------ |
| [01-basic-react.tsx](./01-basic-react.tsx)            | React hooks basics              | Beginner     | Token counting, budget tracking            |
| [02-node-counting.ts](./02-node-counting.ts)          | Node.js token counting          | Beginner     | Simple API, batch operations               |
| [03-model-routing.ts](./03-model-routing.ts)          | Model selection                 | Intermediate | Cost optimization, automatic routing       |
| [04-full-pipeline.tsx](./04-full-pipeline.tsx)        | Complete optimization           | Advanced     | Compression, caching, routing              |
| [05-provider-caching.ts](./05-provider-caching.ts) ⭐ | Provider caching (90% savings!) | Intermediate | Anthropic, OpenAI, Google caching          |
| [06-security.ts](./06-security.ts) 🔒                 | Security features               | Intermediate | PII detection, prompt injection protection |
| [07-compression.ts](./07-compression.ts) 📦           | Compression strategies          | Intermediate | LLMLingua, extractive, adaptive            |

## Running Examples

### React Examples (01, 04)

Copy the components directly into your React app, or:

```bash
# Create a test app
npx create-react-app test-app --template typescript
cd test-app

# Install the package
npm install @clarity-chat/token-optimization

# Copy an example into src/App.tsx and run
npm start
```

### Node.js Examples (02, 03, 05, 06, 07)

```bash
# From the package root
npx tsx examples/02-node-counting.ts       # Token counting basics
npx tsx examples/03-model-routing.ts       # Model selection
npx tsx examples/05-provider-caching.ts    # 90% cost savings! ⭐
npx tsx examples/06-security.ts            # Security features
npx tsx examples/07-compression.ts         # Compression strategies
```

## Which Example to Start With?

### By Goal

- **Just count tokens?** → `01-basic-react.tsx` or `02-node-counting.ts`
- **Save 90% on API costs?** → `05-provider-caching.ts` ⭐ RECOMMENDED
- **Build a chat UI?** → `01-basic-react.tsx` (includes budget tracking)
- **Optimize costs?** → `03-model-routing.ts` (automatic model selection)
- **Reduce prompt size?** → `07-compression.ts` (up to 70% reduction)
- **Secure user input?** → `06-security.ts` (PII detection, injection protection)
- **Production app?** → `04-full-pipeline.tsx` (everything combined)

### By Use Case

| Use Case                   | Example                  | Key Feature                   |
| -------------------------- | ------------------------ | ----------------------------- |
| Chatbot with system prompt | `05-provider-caching.ts` | 90% savings on static prompts |
| Document Q&A               | `07-compression.ts`      | Fit large docs in context     |
| Multi-user chat            | `06-security.ts`         | Protect sensitive data        |
| Cost-conscious app         | `03-model-routing.ts`    | Auto-select cheapest model    |
| React dashboard            | `01-basic-react.tsx`     | Real-time token tracking      |
| API service                | `02-node-counting.ts`    | Fast token counting           |

## Common Patterns

### 1. Provider Caching (90% savings!)

```typescript
import { quickCache } from '@clarity-chat/token-optimization'

const result = await quickCache([
  { role: 'system', content: largeSystemPrompt }, // Gets cached!
  { role: 'user', content: userQuery },
])
// Subsequent calls with same system prompt = 90% cheaper
```

### 2. Security Protection

```typescript
import { TokenSecurityManager } from '@clarity-chat/token-optimization'

const security = new TokenSecurityManager({
  enablePromptInjectionDetection: true,
  enablePIIDetection: true,
})

const result = await security.sanitizeAndProtect(userInput)
if (result.allowed) {
  // Safe to process
}
```

### 3. Smart Compression

```typescript
import { compressAdaptively } from '@clarity-chat/token-optimization'

const result = await compressAdaptively(longDocument, {
  targetTokens: 500,
  preserveCode: true,
})
// Automatically picks best strategy
```

### 4. React with Debouncing

```tsx
const { count } = useTokenCount(text, {
  debounceMs: 300, // Wait after user stops typing
})
```

### 5. Model Routing

```typescript
import { ModelRouter } from '@clarity-chat/token-optimization'

const router = ModelRouter.builder().useOpenAIModels().withStrategy('cost-optimized').build()

const { model, cost } = router.route(prompt)
console.log(`Using ${model} - $${cost}`)
```

### 6. Full Optimization Pipeline

```tsx
const result = useTokenOptimization(text, {
  preset: 'production',
  enableCache: true,
  enableCompression: true,
  enableProviderCaching: true,
})
```

## Example Output

### Provider Caching

```
=== Provider Caching ===

Caching applied: true
Provider: anthropic
Cached tokens: 1534
Estimated savings: 90%
Cost reduction: $0.0138

✓ Subsequent calls with same system prompt = 90% cheaper!
```

### Compression

```
=== Compression ===

Original: 2,543 tokens
Compressed: 891 tokens
Compression ratio: 65%
Quality score: 0.87

Strategy: adaptive (LLMLingua)
```

### Security

```
=== Security ===

Input: "My email is john@example.com and my password is secret123"
Allowed: true
Risk level: medium
PII detected: email, password

Sanitized: "My email is [EMAIL_REDACTED] and my password is [REDACTED]"
```

## Need More Help?

- **Documentation**: Check [docs/](../docs/) folder
  - [Getting Started](../docs/GETTING_STARTED.md)
  - [Provider Caching Guide](../docs/PROVIDER_CACHING.md)
  - [Best Practices](../docs/BEST_PRACTICES.md)
  - [Troubleshooting](../docs/TROUBLESHOOTING.md)
- **Issues**: [GitHub Issues](https://github.com/clarity-ai/token-optimization/issues)
- **API Reference**: Full API docs in [docs/API_REFERENCE.md](../docs/API_REFERENCE.md)

## Contributing Examples

Have a great example? Contributions are welcome!

1. Create a new file: `examples/08-your-example.ts`
2. Follow the existing pattern (numbered examples, clear documentation)
3. Add to this README
4. Submit a PR

## Tips for Learning

1. **Start simple**: Begin with `01` or `02`, then progress
2. **Run examples**: Seeing output helps understanding
3. **Modify examples**: Change values to see effects
4. **Combine patterns**: Mix caching + compression + routing
5. **Read docs**: Examples link to relevant documentation

Happy optimizing! 🚀
