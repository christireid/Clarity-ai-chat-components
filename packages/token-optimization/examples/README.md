# Examples

Copy-paste ready examples for `@clarity-chat/token-optimization`.

## Quick Start

The fastest path to working code:

```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

const { count } = useTokenCount(text)
```

## Examples Index

| File                                           | Description              | Complexity   |
| ---------------------------------------------- | ------------------------ | ------------ |
| [01-basic-react.tsx](./01-basic-react.tsx)     | Simple React hooks       | Beginner     |
| [02-node-counting.ts](./02-node-counting.ts)   | Node.js token counting   | Beginner     |
| [03-model-routing.ts](./03-model-routing.ts)   | Model router and builder | Intermediate |
| [04-full-pipeline.tsx](./04-full-pipeline.tsx) | Complete optimization    | Advanced     |

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

### Node.js Examples (02, 03)

```bash
# From the package root
npx tsx examples/02-node-counting.ts
npx tsx examples/03-model-routing.ts
```

## Which Example to Start With?

- **Just need token count?** → `01-basic-react.tsx` or `02-node-counting.ts`
- **Building a chat UI?** → `01-basic-react.tsx` (TokenLimitWarning)
- **Need cost optimization?** → `03-model-routing.ts`
- **Production app?** → `04-full-pipeline.tsx`

## Common Patterns

### Count tokens with debouncing

```tsx
const { count } = useTokenCount(text, { debounceMs: 300 })
```

### Use a specific model

```tsx
const { count } = useTokenCount(text, { model: 'claude-3-5-sonnet' })
```

### Route to cheapest model

```typescript
const router = ModelRouter.builder().useOpenAIModels().withStrategy('cost-optimized').build()
```

### Full optimization with presets

```tsx
const result = useTokenOptimization(text, {
  preset: 'production',
  enableCache: true,
  enableCompression: true,
})
```
