# Complete Feature Guide

Comprehensive guide to all token optimization features across all 8 weeks of development.

## Overview

This package provides a complete suite of token optimization tools to reduce LLM costs by 70-90% through intelligent compression, caching, routing, and optimization.

## Quick Navigation

- [Week 1-2: Foundation](#weeks-1-2-foundation)
- [Week 3: Enhanced React Hooks](#week-3-enhanced-react-hooks)
- [Week 4: Multimodal & Vision](#week-4-multimodal--vision-optimization)
- [Week 5: Streaming Optimization](#week-5-streaming-optimization)
- [Week 6: OpenTelemetry Integration](#week-6-opentelemetry-integration)
- [Week 7: Function Schema Optimization](#week-7-function-schema-optimization)
- [Week 8: Final Polish & QA](#week-8-final-polish--qa)

---

## Weeks 1-2: Foundation

### Token Counting
```typescript
import { useTokenCount, countTokens } from '@clarity-chat/token-optimization'

// React Hook
const { count } = useTokenCount(text)

// Direct function
const count = countTokens(text, { model: 'gpt-4o' })
```

### Text Compression
```typescript
import { compressText, CompressionLevel } from '@clarity-chat/token-optimization'

const result = compressText(longText, CompressionLevel.BALANCED)
console.log(`Saved ${(1 - result.ratio) * 100}% tokens`)
```

### Tiered Cache
```typescript
import { TieredCache } from '@clarity-chat/token-optimization'

const cache = new TieredCache()
cache.set('key', 'value')
const value = cache.get('key') // Fast retrieval
```

### Model Routing
```typescript
import { ModelRouter } from '@clarity-chat/token-optimization'

const router = new ModelRouter()
const result = router.route({
  messages: [{ role: 'user', content: 'Hello' }],
  maxTokens: 100,
})

console.log(`Use ${result.model.id} - ${result.reason}`)
```

---

## Week 3: Enhanced React Hooks

### Context Window Management

Manage conversation history with intelligent memory strategies.

```typescript
import { useContextWindow } from '@clarity-chat/token-optimization'

function Chat() {
  const {
    messages,
    addMessage,
    optimize,
    utilization,
  } = useContextWindow({
    strategy: 'sliding-window',
    windowSize: 10,
    autoOptimize: true,
  })

  return (
    <div>
      <p>Context utilization: {(utilization * 100).toFixed(1)}%</p>
      {messages.map((msg, i) => (
        <div key={i}>{msg.content}</div>
      ))}
    </div>
  )
}
```

**Strategies:**
- `sliding-window`: Keep last N messages
- `importance-based`: Keep most important messages
- `summarization`: Summarize old messages
- `adaptive`: Dynamic strategy selection

### Quality-Based Routing

Route requests to optimal models based on quality requirements.

```typescript
import { useQualityRouter } from '@clarity-chat/token-optimization'

function SmartChat() {
  const { generate, metrics } = useQualityRouter({
    providers: {
      fast: { model: 'gpt-4o-mini', maxRetries: 2 },
      balanced: { model: 'gpt-4o', maxRetries: 3 },
      premium: { model: 'claude-3-5-sonnet', maxRetries: 3 },
    },
    defaultQuality: 'balanced',
  })

  const handleSubmit = async (message: string) => {
    const response = await generate(message, {
      maxTokens: 500,
      quality: 'premium', // Override default
    })

    console.log(`Cost: $${metrics.totalCost.toFixed(4)}`)
    console.log(`Tokens: ${metrics.totalTokens}`)
  }
}
```

### Cache Performance Monitoring

```typescript
import { useCacheStats } from '@clarity-chat/token-optimization'

function CacheMonitor() {
  const { stats, hitRate, performance } = useCacheStats()

  return (
    <div>
      <h3>Cache Performance</h3>
      <p>Hit Rate: {hitRate.toFixed(1)}%</p>
      <p>Total Hits: {stats.hits}</p>
      <p>Total Misses: {stats.misses}</p>
      <p>Performance: {performance}</p> {/* "excellent", "good", "poor" */}
    </div>
  )
}
```

### Cost Estimation & Budget Alerts

```typescript
import {
  useEstimateCost,
  useBudgetAlerts,
  MODEL_PRICING_PRESETS,
} from '@clarity-chat/token-optimization'

function CostTracker() {
  const { estimate, breakdown } = useEstimateCost({
    pricing: MODEL_PRICING_PRESETS['gpt-4o'],
    cacheHitRate: 0.8,
    contextOptimizationRatio: 0.7,
  })

  const { alerts } = useBudgetAlerts({
    budgetLimit: 100, // $100/month
    warningThreshold: 0.8,
  })

  return (
    <div>
      <h3>Cost Breakdown</h3>
      <p>Base: ${breakdown.baseCost.toFixed(2)}</p>
      <p>After cache: ${(breakdown.baseCost - breakdown.cacheSavings).toFixed(2)}</p>
      <p>Final: ${breakdown.finalCost.toFixed(2)}</p>
      <p>Savings: {breakdown.savingsPercentage.toFixed(1)}%</p>

      {alerts.map((alert, i) => (
        <div key={i} style={{ color: alert.severity === 'critical' ? 'red' : 'orange' }}>
          {alert.message}
        </div>
      ))}
    </div>
  )
}
```

**Full Documentation**: [Enhanced Hooks Guide](./enhanced-hooks.md)

---

## Week 4: Multimodal & Vision Optimization

### Vision Token Counting

Accurate token counting for images across providers.

```typescript
import {
  calculateOpenAIVisionTokens,
  calculateAnthropicVisionTokens,
  calculateGoogleVisionTokens,
} from '@clarity-chat/token-optimization'

// OpenAI: 85 base + (tiles × 170)
const openai = calculateOpenAIVisionTokens(
  { width: 2048, height: 1536 },
  'auto'
)
console.log(`${openai.tokens} tokens (${openai.tileCount} tiles)`)

// Anthropic: ~750 per tile
const anthropic = calculateAnthropicVisionTokens(
  { width: 1568, height: 1568 },
  'png'
)

// Google: Flat 258 tokens
const google = calculateGoogleVisionTokens({ width: 1024, height: 768 })
```

### Image Optimization

Reduce vision token costs by 30-70% through intelligent resizing.

```typescript
import { ImageOptimizer } from '@clarity-chat/token-optimization'

const optimizer = new ImageOptimizer({
  strategy: 'cost', // or 'quality', 'balanced', 'aggressive'
  provider: 'openai',
})

const result = optimizer.optimize(
  { width: 4096, height: 3072 },
  'png'
)

console.log(`
  Original: ${result.tokensBefore} tokens
  Optimized: ${result.tokensAfter} tokens
  Saved: ${result.tokenSavings.toFixed(1)}%
  New dimensions: ${result.dimensions.width}x${result.dimensions.height}
`)
```

### Multimodal Cost Estimation

```typescript
import {
  MultimodalCostEstimator,
  MULTIMODAL_MODEL_PRICING,
} from '@clarity-chat/token-optimization'

const estimator = new MultimodalCostEstimator('openai')

const estimate = estimator.estimateMessage({
  role: 'user',
  content: [
    { type: 'text', text: 'Describe this image' },
    {
      type: 'image',
      image_url: 'https://example.com/image.jpg',
      dimensions: { width: 2048, height: 1536 },
    },
  ],
})

console.log(`
  Text tokens: ${estimate.textTokens}
  Image tokens: ${estimate.imageTokens}
  Total tokens: ${estimate.totalTokens}
  Estimated cost: $${estimate.estimatedCost.toFixed(4)}
`)
```

**Full Documentation**: [Multimodal & Vision Guide](./multimodal-vision.md)

---

## Week 5: Streaming Optimization

### Real-time Token Counting

Count tokens as they stream in, with prediction.

```typescript
import { StreamingTokenCounter } from '@clarity-chat/token-optimization'

const counter = new StreamingTokenCounter({
  predictionStrategy: 'average', // or 'linear'
  onTokenUpdate: (stats) => {
    console.log(`Current: ${stats.totalTokens}`)
    console.log(`Estimated final: ${stats.estimatedFinalTokens}`)
    console.log(`Confidence: ${(stats.estimationConfidence! * 100).toFixed(0)}%`)
  },
})

// Process each chunk
for await (const chunk of streamingResponse) {
  const stats = counter.processChunk({
    content: chunk.content,
    sequence: chunk.sequence,
    cumulative: chunk.cumulative,
    isFinal: chunk.isFinal,
  })
}
```

### Streaming Cost Tracking

Track costs in real-time with budget monitoring.

```typescript
import {
  StreamingCostTracker,
  StreamingBudgetMonitor,
} from '@clarity-chat/token-optimization'

const costTracker = new StreamingCostTracker({
  inputTokens: 100,
  pricing: {
    model: 'gpt-4o',
    provider: 'openai',
    inputCostPer1M: 2.5,
    outputCostPer1M: 10,
  },
  enableTiming: true,
})

const budgetMonitor = new StreamingBudgetMonitor({
  budgetLimit: 0.10, // $0.10
  warningThreshold: 0.8,
  onWarning: (stats) => console.warn('80% of budget used'),
  onBudgetExceeded: (stats) => console.error('Budget exceeded!'),
})

// Update as stream progresses
const costStats = costTracker.update(tokenStats)
const budgetStatus = budgetMonitor.check(costStats)

console.log(`
  Cost so far: $${costStats.totalCost.toFixed(4)}
  Tokens/sec: ${costStats.tokensPerSecond?.toFixed(1)}
  Budget remaining: $${budgetStatus.budgetRemaining.toFixed(4)}
`)
```

### React Hook for Streaming

```typescript
import { useStreamingOptimization } from '@clarity-chat/token-optimization'

function StreamingChat() {
  const {
    response,
    tokenStats,
    costStats,
    budgetStatus,
    processChunk,
    isStreaming,
  } = useStreamingOptimization({
    pricing: {
      model: 'gpt-4o',
      provider: 'openai',
      inputCostPer1M: 2.5,
      outputCostPer1M: 10,
    },
    budgetLimit: 0.50,
    enablePrediction: true,
  })

  return (
    <div>
      <p>{response}</p>
      {tokenStats && (
        <div>
          <p>Tokens: {tokenStats.totalTokens}</p>
          <p>Est. final: {tokenStats.estimatedFinalTokens}</p>
        </div>
      )}
      {costStats && (
        <p>Cost: ${costStats.totalCost.toFixed(4)}</p>
      )}
    </div>
  )
}
```

**Full Documentation**: [Streaming Optimization Guide](./streaming-optimization.md)

---

## Week 6: OpenTelemetry Integration

### Telemetry Collection

Track all optimization operations with distributed tracing.

```typescript
import { TelemetryCollector } from '@clarity-chat/token-optimization'

const telemetry = new TelemetryCollector({
  serviceName: 'my-app',
  enableTracing: true,
  enableMetrics: true,
  sampleRate: 1.0, // Sample 100%
})

// Start operation
const spanId = telemetry.startSpan('token_optimization', {
  operation: 'compress',
  model: 'gpt-4o',
})

try {
  // Your operation
  telemetry.addEvent(spanId, 'compression_start')
  const result = await optimize(text)
  telemetry.incrementCounter('optimizationsPerformed')
  telemetry.endSpan(spanId, { tokensSaved: result.saved })
} catch (error) {
  telemetry.recordError(spanId, error)
  telemetry.endSpan(spanId)
}
```

### Instrumentation Wrappers

Automatically trace functions with telemetry.

```typescript
import {
  instrumentTokenCount,
  instrumentOptimization,
} from '@clarity-chat/token-optimization'

const collector = new TelemetryCollector({ serviceName: 'app' })

// Wrap token counting function
const countTokens = (text: string) => text.split(' ').length
const instrumentedCount = instrumentTokenCount(countTokens, collector)

const tokens = instrumentedCount(text) // Automatically traced!

// Wrap optimization function
const optimize = async (text: string) => {
  return { optimized: text, tokensSaved: 50 }
}
const instrumentedOptimize = instrumentOptimization(optimize, collector)

await instrumentedOptimize(text) // Automatically traced!
```

### React Hooks

```typescript
import {
  useTelemetry,
  useTelemetryMetrics,
  usePerformanceMonitor,
} from '@clarity-chat/token-optimization'

function TelemetryDashboard() {
  const { metrics, recentSpans, startSpan, endSpan } = useTelemetry({
    serviceName: 'chat-app',
    enableTracing: true,
    autoExportInterval: 5000, // Update UI every 5s
  })

  const { track, stats } = usePerformanceMonitor()

  const handleOperation = async () => {
    await track('optimization', async () => {
      // Your operation
      await optimize(text)
    })
  }

  return (
    <div>
      <h3>Metrics</h3>
      <p>Tokens counted: {metrics.tokensCounted}</p>
      <p>Cache hits: {metrics.cacheHits}</p>
      <p>Errors: {metrics.errorsEncountered}</p>

      <h3>Performance</h3>
      <p>P50: {stats.p50.toFixed(1)}ms</p>
      <p>P95: {stats.p95.toFixed(1)}ms</p>
      <p>P99: {stats.p99.toFixed(1)}ms</p>
    </div>
  )
}
```

**Full Documentation**: [OpenTelemetry Integration Guide](./opentelemetry-integration.md)

---

## Week 7: Function Schema Optimization

### Schema Optimization

Reduce function calling token usage by 30-60%.

```typescript
import { optimizeSchema } from '@clarity-chat/token-optimization'

const schema = {
  name: 'get_weather',
  description: 'Get the current weather for a given location (optional)',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The city and state, e.g. San Francisco, CA',
        title: 'Location',
        examples: ['New York, NY'],
      },
    },
    required: ['location'],
  },
}

const result = optimizeSchema(schema, 'balanced')

console.log(`
  Original: ${result.tokensBefore} tokens
  Optimized: ${result.tokensAfter} tokens
  Saved: ${result.tokensSaved} tokens (${result.percentageSaved.toFixed(1)}%)
  Optimizations: ${result.optimizations.join(', ')}
`)

// Use optimized schema
await openai.chat.completions.create({
  tools: [{ type: 'function', function: result.schema }],
  // ...
})
```

### Optimization Presets

```typescript
// Conservative: 20-35% savings (safest)
const conservative = optimizeSchema(schema, 'conservative')

// Balanced: 40-55% savings (recommended)
const balanced = optimizeSchema(schema, 'balanced')

// Aggressive: 50-70% savings (maximum)
const aggressive = optimizeSchema(schema, 'aggressive')
```

### Schema Analysis

Get recommendations before optimizing.

```typescript
import { analyzeSchema } from '@clarity-chat/token-optimization'

const analysis = analyzeSchema(schema)

console.log(`Total tokens: ${analysis.totalTokens}`)
console.log(`Description: ${analysis.descriptionTokens} (${analysis.breakdown[1].percentage.toFixed(1)}%)`)

console.log('\nRecommendations:')
analysis.recommendations.forEach(rec => {
  console.log(`- ${rec}`)
})
// Output:
// - Description is verbose - shorten to <100 characters
// - Schema contains title fields - these can be removed
// - Schema contains examples - these can be removed
```

### Batch Optimization

```typescript
import { optimizeBatch } from '@clarity-chat/token-optimization'

const schemas = [schema1, schema2, schema3]
const result = optimizeBatch(schemas, { preset: 'balanced' })

console.log(`
  Schemas: ${result.results.length}
  Total saved: ${result.totalTokensSaved} tokens
  Average: ${result.averagePercentageSaved.toFixed(1)}%
`)
```

### React Hooks

```typescript
import {
  useSchemaOptimizer,
  useBatchSchemaOptimizer,
  useSchemaAnalysis,
} from '@clarity-chat/token-optimization'

function SchemaManager() {
  const { optimize, state } = useSchemaOptimizer({
    preset: 'balanced',
  })

  const handleOptimize = () => {
    const result = optimize(mySchema)
    console.log(`Saved ${result.percentageSaved}%`)
  }

  return (
    <div>
      <button onClick={handleOptimize}>Optimize</button>
      {state.optimizedSchema && (
        <div>
          <p>Saved: {state.percentageSaved.toFixed(1)}%</p>
          <ul>
            {state.optimizations.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

**Full Documentation**: [Function Schema Optimization Guide](./function-schema-optimization.md)

---

## Week 8: Final Polish & QA

### Integration Tests

Comprehensive tests ensuring all modules work together.

```bash
npm run test:integration
```

### Performance Benchmarks

Measure actual performance improvements.

```bash
npm run bench
```

**Expected Results:**
- Compression: 20-60% token reduction
- Conversation memory: 50-90% reduction
- Schema optimization: 30-60% reduction
- Vision optimization: 30-70% reduction
- **Overall: 70-90% cost reduction** when combined

### Security Audit

All security considerations documented in [SECURITY.md](../SECURITY.md).

**Security Checklist:**
- ✅ Input validation
- ✅ No data leakage
- ✅ Safe error handling
- ✅ Dependency security
- ✅ Memory limits
- ✅ Type safety

### Production Ready

- ✅ Comprehensive test coverage
- ✅ TypeScript strict mode
- ✅ Full documentation
- ✅ Performance benchmarks
- ✅ Security audit passed
- ✅ Tree-shakeable exports
- ✅ SSR compatible

---

## Complete Example: All Features Combined

```typescript
import {
  useTokenOptimization,
  useContextWindow,
  useQualityRouter,
  useStreamingOptimization,
  useTelemetry,
  optimizeSchema,
} from '@clarity-chat/token-optimization'

function ProductionChat() {
  // Context management
  const { messages, addMessage } = useContextWindow({
    strategy: 'adaptive',
    maxTokens: 8000,
    autoOptimize: true,
  })

  // Quality-based routing
  const { generate } = useQualityRouter({
    providers: {
      fast: { model: 'gpt-4o-mini', maxRetries: 2 },
      premium: { model: 'claude-3-5-sonnet', maxRetries: 3 },
    },
  })

  // Streaming with cost tracking
  const {
    response,
    costStats,
    processChunk,
  } = useStreamingOptimization({
    pricing: { model: 'gpt-4o', provider: 'openai', inputCostPer1M: 2.5, outputCostPer1M: 10 },
    budgetLimit: 1.00,
  })

  // Telemetry
  const { metrics, startSpan, endSpan } = useTelemetry({
    serviceName: 'production-chat',
  })

  // Optimized function schemas
  const optimizedTools = React.useMemo(() => {
    return tools.map(tool => optimizeSchema(tool, 'balanced'))
  }, [tools])

  const handleSend = async (message: string) => {
    const spanId = startSpan('message_processing')

    try {
      // Add to conversation
      addMessage({ role: 'user', content: message })

      // Generate response with streaming
      const stream = await generate(message, {
        quality: 'premium',
        tools: optimizedTools.map(r => r.schema),
      })

      for await (const chunk of stream) {
        processChunk(chunk)
      }

      endSpan(spanId, {
        tokens: costStats?.totalTokens,
        cost: costStats?.totalCost,
      })
    } catch (error) {
      recordError(spanId, error)
      endSpan(spanId)
    }
  }

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{msg.content}</div>
        ))}
        {response && <div>{response}</div>}
      </div>

      <div>
        <p>Cost: ${costStats?.totalCost.toFixed(4) || '0.0000'}</p>
        <p>Cache Hits: {metrics.cacheHits}</p>
        <p>Optimizations: {metrics.optimizationsPerformed}</p>
      </div>
    </div>
  )
}
```

---

## Performance Summary

| Optimization | Token Savings | When to Use |
|-------------|---------------|-------------|
| Compression | 20-60% | Long documents |
| Conversation Memory | 50-90% | Chat history |
| Vision Optimization | 30-70% | Images |
| Schema Optimization | 30-60% | Function calling |
| Streaming | N/A | Real-time UX |
| Caching | 90% | Repeated content |

**Combined Savings: 70-90% overall cost reduction**

---

## Next Steps

1. **Start Simple**: Begin with basic token counting
2. **Add Caching**: Implement tiered caching for 90% savings
3. **Optimize Schemas**: Reduce function calling costs
4. **Add Streaming**: Improve UX with real-time updates
5. **Monitor**: Use telemetry to track savings
6. **Scale**: Add all optimizations for maximum savings

---

## Support

- **Documentation**: See individual guides for each feature
- **Examples**: Check `/examples` directory
- **Issues**: Report bugs on GitHub
- **Security**: See [SECURITY.md](../SECURITY.md)

---

**Version**: 1.0.0
**Status**: Production Ready ✅
