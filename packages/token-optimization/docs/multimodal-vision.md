## Multimodal & Vision Optimization (Week 4)

Complete toolkit for optimizing multimodal (text + images) LLM requests with accurate token counting and cost estimation.

### Features

- **Vision Token Counting**: Accurate token calculation for OpenAI, Anthropic, and Google
- **Image Optimization**: Resize and compress images to reduce costs
- **Multimodal Types**: Type-safe message structures for text + images
- **Cost Estimation**: Comprehensive cost breakdowns for multimodal requests

### Quick Start

```typescript
import {
  VisionTokenCounter,
  ImageOptimizer,
  MultimodalCostEstimator,
  createMultimodalMessage,
  createImageContent,
  MULTIMODAL_MODEL_PRICING,
} from '@clarity-chat/token-optimization/vision'

// Count vision tokens
const counter = new VisionTokenCounter({ provider: 'openai' })
const tokens = counter.count({
  dimensions: { width: 1024, height: 1024 },
})
console.log(`Image uses ${tokens.tokens} tokens`)

// Optimize image
const optimizer = new ImageOptimizer({
  provider: 'openai',
  strategy: 'balanced',
})
const result = optimizer.optimize({ width: 3000, height: 2000 })
console.log(`Reduced from ${result.tokensBefore} to ${result.tokensAfter} tokens`)

// Estimate costs
const estimator = new MultimodalCostEstimator({
  pricing: MULTIMODAL_MODEL_PRICING['gpt-4o'],
})
const image = createImageContent('base64...', 'image/jpeg', {
  width: 1024,
  height: 1024,
})
const message = createMultimodalMessage('user', 'What is this?', [image])
const cost = estimator.estimateMessage(message)
console.log(`Total cost: $${cost.totalCost.toFixed(6)}`)
```

### Vision Token Counting

**OpenAI**: GPT-4o, GPT-4-turbo
- Low detail: 85 tokens (fixed)
- High detail: 85 + (tiles × 170) tokens
- Auto: Chooses based on size

**Anthropic**: Claude 3/4 family
- ~750 tokens per 512×512 tile
- Max 1568px on longest side

**Google**: Gemini models
- Flat 258 tokens per image

```typescript
import { compareProvidersForImage } from '@clarity-chat/token-optimization/vision'

const comparison = compareProvidersForImage({ width: 1024, height: 1024 })
console.log(`Cheapest: ${comparison.cheapest}`)
```

### Image Optimization

Four strategies:
- **quality**: High fidelity, accept higher cost
- **balanced**: Balance quality and cost (recommended)
- **cost**: Minimize cost, acceptable quality
- **aggressive**: Maximum compression

```typescript
import { ImageOptimizer } from '@clarity-chat/token-optimization/vision'

const optimizer = new ImageOptimizer({
  provider: 'openai',
  strategy: 'balanced',
})

const result = optimizer.optimize({ width: 4000, height: 3000 })
// result.dimensions: { width: 2048, height: 1536 }
// result.tokenSavings: 0.65 (65% reduction)
// result.costSavings(2.5): $0.00425
```

### Multimodal Messages

Type-safe message structures compatible with all providers:

```typescript
import {
  createMultimodalMessage,
  createImageContent,
  toOpenAIFormat,
  toAnthropicFormat,
} from '@clarity-chat/token-optimization/vision'

// Create message
const image = createImageContent('base64data', 'image/jpeg', {
  width: 1024,
  height: 1024,
})
const msg = createMultimodalMessage('user', 'Analyze this', [image])

// Convert to provider format
const openaiMsg = toOpenAIFormat(msg)
const anthropicMsg = toAnthropicFormat(msg)
```

### Cost Estimation

```typescript
import {
  MultimodalCostEstimator,
  MULTIMODAL_MODEL_PRICING,
  compareMultimodalProviders,
} from '@clarity-chat/token-optimization/vision'

// Single model
const estimator = new MultimodalCostEstimator({
  pricing: MULTIMODAL_MODEL_PRICING['gpt-4o'],
})
const estimate = estimator.estimateMessage(message)

// Compare all providers
const comparison = compareMultimodalProviders(message)
console.log('GPT-4o:', comparison['gpt-4o'].totalCost)
console.log('Claude 3.5:', comparison['claude-3-5-sonnet'].totalCost)
console.log('Gemini Flash:', comparison['gemini-flash'].totalCost)
```

### Best Practices

1. **Always provide image dimensions** for accurate token counting
2. **Optimize before sending** - resize images to provider limits
3. **Use low detail for OpenAI** when visual precision isn't critical
4. **Compare providers** - costs vary significantly for images
5. **Batch optimize** - process multiple images together

### Performance

- Token counting: <1ms per image
- Image optimization: 5-10ms (planning only, no actual resizing)
- Cost estimation: <5ms per message

### Model Pricing (January 2025)

| Model | Provider | Input (per 1M) | Output (per 1M) |
|-------|----------|----------------|-----------------|
| GPT-4o | OpenAI | $2.50 | $10.00 |
| GPT-4o Mini | OpenAI | $0.15 | $0.60 |
| Claude 3.5 Sonnet | Anthropic | $3.00 | $15.00 |
| Claude 3.5 Haiku | Anthropic | $0.80 | $4.00 |
| Gemini Pro | Google | $1.25 | $5.00 |
| Gemini Flash | Google | $0.08 | $0.30 |

### Example: Complete Workflow

```typescript
// 1. Count tokens before optimization
const counter = new VisionTokenCounter({ provider: 'openai' })
const beforeTokens = counter.count({
  dimensions: { width: 3000, height: 2000 },
})

// 2. Optimize image
const optimizer = new ImageOptimizer({
  provider: 'openai',
  strategy: 'balanced',
})
const optimized = optimizer.optimize({ width: 3000, height: 2000 })

// 3. Create multimodal message with optimized dimensions
const image = createImageContent('base64data', 'image/jpeg', optimized.dimensions)
const message = createMultimodalMessage('user', 'Describe this', [image])

// 4. Estimate cost
const estimator = new MultimodalCostEstimator({
  pricing: MULTIMODAL_MODEL_PRICING['gpt-4o'],
})
const cost = estimator.estimateMessage(message)

console.log(`Optimized from ${beforeTokens.tokens} to ${cost.imageTokens} tokens`)
console.log(`Cost: $${cost.totalCost.toFixed(6)}`)
console.log(`Savings: ${(optimized.tokenSavings * 100).toFixed(1)}%`)
```
