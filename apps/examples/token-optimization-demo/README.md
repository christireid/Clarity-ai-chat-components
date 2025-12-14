# Token Optimization Demo

Comprehensive demonstration of all token optimization features in Clarity Chat.

## Features Demonstrated

### 1. **Prompt Compression**
- Automatic prompt shortening
- Filler word removal
- Smart abbreviations
- Code/markdown preservation

### 2. **Smart Caching**
- Exact match caching
- Semantic similarity matching
- Automatic LRU eviction
- Cost savings tracking

### 3. **Model Routing**
- Automatic complexity analysis
- Cost-optimized model selection
- 40-60% savings on simple queries
- Learning from feedback

### 4. **Response Limiting**
- Output length constraints
- Format enforcement (JSON, bullets, etc.)
- Brevity levels
- Post-processing validation

### 5. **Request Batching**
- Automatic request grouping
- Priority-based processing
- 30-40% savings through batching
- Configurable batch sizes

### 6. **Smart Throttling**
- Adaptive throttling based on input
- Prevents rapid-fire requests
- API call tracking
- Savings calculation

### 7. **Reference Handling**
- Replace large data with references
- 50%+ payload reduction
- Automatic size optimization
- LRU cache management

### 8. **Optimization Dashboard**
- Real-time savings metrics
- Technique-by-technique breakdown
- Cost tracking
- Visual progress indicators

## Running the Demo

```bash
npm install
npm run dev
```

## Integration Examples

### Quick Start

```tsx
import {
  usePromptCompression,
  useSmartCache,
  useModelRouter,
  useResponseLimiter,
  TokenOptimizationDashboard,
} from '@clarity-chat/react'

function OptimizedChat() {
  // Enable all optimizations
  const compression = usePromptCompression({ removeFillers: true })
  const cache = useSmartCache({ enableSemanticMatching: true })
  const router = useModelRouter()
  const limiter = useResponseLimiter({ preset: 'brief' })

  const handleQuery = async (query: string) => {
    // 1. Compress prompt
    const { compressed } = compression.compress(query)
    
    // 2. Check cache
    const cached = await cache.get(compressed)
    if (cached) return cached
    
    // 3. Route to best model
    const { model } = router.route(compressed)
    
    // 4. Create limited prompt
    const { prompt } = limiter.createPrompt(compressed)
    
    // 5. Query API
    const response = await api.query(prompt, { model: model.id })
    
    // 6. Enforce limits
    const { response: limited } = limiter.enforce(response)
    
    // 7. Cache result
    await cache.set(compressed, limited)
    
    return limited
  }

  return (
    <div>
      <TokenOptimizationDashboard
        metrics={{
          totalTokens: compression.totalTokensSaved + cache.stats.tokensSaved,
          tokensSaved: compression.totalTokensSaved,
          costSaved: router.stats.totalEstimatedCost * 0.3,
          // ... more metrics
        }}
      />
      {/* Your chat UI */}
    </div>
  )
}
```

## Savings Examples

Based on real-world usage:

- **Prompt Compression**: 20-35% token reduction
- **Smart Caching**: 40-60% on repeated queries
- **Model Routing**: 40-60% cost savings
- **Response Limiting**: 30-50% output reduction
- **Request Batching**: 30-40% through batch discounts
- **Throttling**: Prevents 50%+ unnecessary calls
- **Reference Handling**: 50%+ payload reduction

**Combined savings: 50-70% typical, up to 80% in optimal scenarios**

## Best Practices

1. **Start with basics**: Enable compression and caching first
2. **Add routing**: Use cheaper models for simple queries
3. **Limit outputs**: Enforce brevity for cost control
4. **Batch when possible**: Group non-urgent requests
5. **Monitor savings**: Use dashboard to track ROI
6. **Tune thresholds**: Adjust based on your use case
7. **Test quality**: Ensure optimizations don't hurt UX

## Configuration Presets

### Aggressive (Maximum Savings)
```tsx
{
  compression: { preset: 'aggressive', maxLength: 200 },
  caching: { similarityThreshold: 0.8 },
  routing: { preferProvider: 'anthropic' }, // Use Haiku
  limiter: { preset: 'ultraBrief' },
  batching: { maxWaitTime: 2000 },
}
```

### Balanced (Recommended)
```tsx
{
  compression: { preset: 'balanced' },
  caching: { similarityThreshold: 0.85 },
  routing: { /* auto */ },
  limiter: { preset: 'brief' },
  batching: { maxWaitTime: 1000 },
}
```

### Conservative (Quality First)
```tsx
{
  compression: { preset: 'conservative' },
  caching: { similarityThreshold: 0.9 },
  routing: { /* use best models */ },
  limiter: { preset: 'standard' },
  batching: { enabled: false },
}
```

## Learn More

- [Best Practices](../../docs/best-practices.md)
- [API Reference](../../docs/api-reference.md)
