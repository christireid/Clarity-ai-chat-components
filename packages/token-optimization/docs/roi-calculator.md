# ROI Calculator

Track and calculate return on investment from token optimization. Understand your actual cost savings and break-even timeline.

## Overview

The ROI Calculator helps you:
- **Track actual savings** from token optimization
- **Calculate ROI** on implementation costs
- **Estimate monthly savings** based on usage patterns
- **Compare models** to find the best value
- **Determine break-even** timeline for your investment

## Quick Start

### Basic ROI Calculation

```typescript
import { calculateQuickROI } from '@clarity-chat/token-optimization'

const roi = calculateQuickROI(
  10000,  // Baseline tokens
  3000,   // Optimized tokens
  2400,   // Cached tokens
  5000,   // Output tokens
  'gpt-4o'
)

console.log(`Savings: $${roi.totalSavings.toFixed(4)}`)
console.log(`Percentage: ${roi.savingsPercentage.toFixed(1)}%`)
console.log(`ROI: ${roi.roi}x`)
```

### React Hook Usage

```tsx
import { useROICalculator } from '@clarity-chat/token-optimization'

function ROIDashboard() {
  const { trackUsage, currentROI } = useROICalculator({
    model: 'gpt-4o',
    implementationCost: 5000,
  })

  const handleRequest = () => {
    trackUsage({
      inputTokensBaseline: 1000,
      inputTokensOptimized: 300,
      cachedInputTokens: 240,
      outputTokens: 500,
    })
  }

  return (
    <div>
      <button onClick={handleRequest}>Track Request</button>
      {currentROI && (
        <div>
          <p>Savings: ${currentROI.totalSavings.toFixed(4)}</p>
          <p>Saved: {currentROI.savingsPercentage.toFixed(1)}%</p>
        </div>
      )}
    </div>
  )
}
```

## API Reference

### ROICalculator Class

Main class for tracking ROI over time.

```typescript
class ROICalculator {
  constructor(
    modelOrPricing: string | ModelPricing,
    implementationCost?: number
  )

  calculateROI(usage: UsageStats): ROIResult
  trackPeriod(startDate: Date, endDate: Date, usage: UsageStats): ROIPeriod
  getTotalROI(): ROIResult
  getAverageDailySavings(): number
  getPeriods(): ROIPeriod[]
  clear(): void
}
```

**Example:**
```typescript
const calculator = new ROICalculator('gpt-4o', 5000)

const roi = calculator.calculateROI({
  inputTokensBaseline: 10000,
  inputTokensOptimized: 3000,
  cachedInputTokens: 2400,
  outputTokens: 5000,
  requestCount: 10,
  imageCount: 0,
  functionCallCount: 0,
})

console.log(`Daily savings: $${roi.totalSavings.toFixed(2)}`)
console.log(`Payback period: ${Math.ceil(roi.paybackPeriodDays)} days`)
```

### UsageStats

Track your token usage for ROI calculation.

```typescript
interface UsageStats {
  inputTokensBaseline: number      // Tokens before optimization
  inputTokensOptimized: number     // Tokens after optimization
  cachedInputTokens: number         // Tokens served from cache
  outputTokens: number              // Output tokens generated
  requestCount: number              // Number of API requests
  imageCount: number                // Number of images processed
  functionCallCount: number         // Number of function calls
}
```

### ROIResult

Complete ROI calculation results.

```typescript
interface ROIResult {
  baselineCost: number              // Cost without optimization
  actualCost: number                // Cost with optimization
  totalSavings: number              // Dollar amount saved
  savingsPercentage: number         // Percentage saved
  savingsBreakdown: OptimizationSavings  // Savings by type
  roi: number                       // Return on investment
  paybackPeriodDays: number         // Days to break even
  projectedAnnualSavings: number    // Projected yearly savings
}
```

### OptimizationSavings

Breakdown of savings by optimization type.

```typescript
interface OptimizationSavings {
  compression: number               // Savings from compression
  conversationMemory: number        // Savings from memory optimization
  caching: number                   // Savings from caching
  vision: number                    // Savings from image optimization
  schemaOptimization: number        // Savings from schema optimization
  routing: number                   // Savings from model routing
}
```

## Helper Functions

### calculateQuickROI

Quick one-off ROI calculation.

```typescript
function calculateQuickROI(
  baselineTokens: number,
  optimizedTokens: number,
  cachedTokens: number,
  outputTokens: number,
  model?: string
): ROIResult
```

**Example:**
```typescript
const roi = calculateQuickROI(10000, 3000, 2400, 5000, 'gpt-4o')
console.log(`Saved ${roi.savingsPercentage.toFixed(1)}%`)
```

### estimateMonthlySavings

Estimate monthly savings based on daily usage.

```typescript
function estimateMonthlySavings(
  dailyRequests: number,
  avgTokensPerRequest: number,
  optimizationPercentage?: number,  // Default: 70
  cacheHitRate?: number,             // Default: 0.8
  model?: string                     // Default: 'gpt-4o'
): {
  baselineMonthlyCost: number
  optimizedMonthlyCost: number
  monthlySavings: number
  savingsPercentage: number
}
```

**Example:**
```typescript
const estimate = estimateMonthlySavings(
  10000,  // 10k requests/day
  500,    // 500 tokens/request
  70,     // 70% optimization
  0.8,    // 80% cache hit rate
  'gpt-4o'
)

console.log(`Monthly baseline: $${estimate.baselineMonthlyCost.toFixed(2)}`)
console.log(`Monthly optimized: $${estimate.optimizedMonthlyCost.toFixed(2)}`)
console.log(`Monthly savings: $${estimate.monthlySavings.toFixed(2)}`)
console.log(`Annual savings: $${(estimate.monthlySavings * 12).toFixed(2)}`)
```

### compareModels

Compare ROI across different models.

```typescript
function compareModels(
  usage: UsageStats,
  models: string[]
): Array<{ model: string; roi: ROIResult }>
```

**Example:**
```typescript
const comparison = compareModels(
  myUsageStats,
  ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet']
)

comparison.forEach(({ model, roi }) => {
  console.log(`${model}: $${roi.actualCost.toFixed(4)}`)
})

// Find cheapest
const cheapest = comparison.sort(
  (a, b) => a.roi.actualCost - b.roi.actualCost
)[0]
console.log(`Best value: ${cheapest.model}`)
```

### calculateBreakEven

Calculate break-even timeline.

```typescript
function calculateBreakEven(
  implementationCost: number,
  dailyRequests: number,
  avgTokensPerRequest: number,
  optimizationPercentage?: number,
  model?: string
): {
  daysToBreakEven: number
  breakEvenDate: Date
  dailySavings: number
}
```

**Example:**
```typescript
const breakEven = calculateBreakEven(
  5000,   // $5k implementation cost
  10000,  // 10k requests/day
  500,    // 500 tokens/request
  70,     // 70% optimization
  'gpt-4o'
)

console.log(`Break even in ${breakEven.daysToBreakEven} days`)
console.log(`Break even date: ${breakEven.breakEvenDate.toLocaleDateString()}`)
console.log(`Daily savings: $${breakEven.dailySavings.toFixed(2)}`)
```

## React Hooks

### useROICalculator

Main ROI tracking hook.

```typescript
function useROICalculator(config: UseROICalculatorConfig): {
  trackUsage: (usage: Partial<UsageStats>) => void
  completePeriod: () => ROIPeriod
  startTracking: () => void
  stopTracking: () => void
  clear: () => void
  currentROI: ROIResult | null
  totalROI: ROIResult | null
  periods: ROIPeriod[]
  currentUsage: UsageStats
  averageDailySavings: number
  isTracking: boolean
}
```

**Example:**
```tsx
function App() {
  const {
    trackUsage,
    completePeriod,
    currentROI,
    totalROI,
    periods,
  } = useROICalculator({
    model: 'gpt-4o',
    implementationCost: 5000,
    autoTrack: true,
    trackInterval: 86400000, // 24 hours
  })

  const handleRequest = (tokens: number) => {
    trackUsage({
      inputTokensBaseline: tokens,
      inputTokensOptimized: tokens * 0.3,
      cachedInputTokens: tokens * 0.24,
      outputTokens: tokens * 0.5,
    })
  }

  return (
    <div>
      <h2>Current Period</h2>
      {currentROI && (
        <p>Savings: ${currentROI.totalSavings.toFixed(2)}</p>
      )}

      <h2>Total ({periods.length} periods)</h2>
      {totalROI && (
        <p>Total saved: ${totalROI.totalSavings.toFixed(2)}</p>
      )}
    </div>
  )
}
```

### useQuickROI

Simple ROI estimation without tracking.

```typescript
function useQuickROI(config: {
  baselineTokens: number
  optimizedTokens: number
  cachedTokens: number
  outputTokens: number
  model?: string
}): ROIResult
```

**Example:**
```tsx
function QuickEstimate() {
  const roi = useQuickROI({
    baselineTokens: 10000,
    optimizedTokens: 3000,
    cachedTokens: 2400,
    outputTokens: 5000,
    model: 'gpt-4o',
  })

  return (
    <div>
      <p>Estimated savings: ${roi.totalSavings.toFixed(4)}</p>
      <p>Percentage: {roi.savingsPercentage.toFixed(1)}%</p>
    </div>
  )
}
```

### useMonthlySavings

Monthly savings estimation hook.

```typescript
function useMonthlySavings(config: {
  dailyRequests: number
  avgTokensPerRequest: number
  optimizationPercentage?: number
  cacheHitRate?: number
  model?: string
}): {
  baselineMonthlyCost: number
  optimizedMonthlyCost: number
  monthlySavings: number
  savingsPercentage: number
}
```

### useModelComparison

Compare models hook.

```typescript
function useModelComparison(config: {
  usage: UsageStats
  models: string[]
}): Array<{ model: string; roi: ROIResult }>
```

### useBreakEven

Break-even calculation hook.

```typescript
function useBreakEven(config: {
  implementationCost: number
  dailyRequests: number
  avgTokensPerRequest: number
  optimizationPercentage?: number
  model?: string
}): {
  daysToBreakEven: number
  breakEvenDate: Date
  dailySavings: number
}
```

### useROIDashboard

Comprehensive dashboard hook with all metrics.

```typescript
function useROIDashboard(config: {
  model: string
  implementationCost: number
  dailyRequests: number
  avgTokensPerRequest: number
  optimizationPercentage?: number
  cacheHitRate?: number
}): {
  // All useROICalculator methods/properties
  monthlySavings: MonthlyEstimate
  breakEven: BreakEvenResult
  modelComparison: ModelComparison[]
}
```

## Complete Examples

### Example 1: Track Daily Savings

```tsx
import { useROICalculator } from '@clarity-chat/token-optimization'

function DailySavingsTracker() {
  const { trackUsage, completePeriod, currentROI, periods } = useROICalculator({
    model: 'gpt-4o',
    implementationCost: 5000,
  })

  const handleDayEnd = () => {
    const period = completePeriod()
    console.log(`Day ${periods.length}: Saved $${period.roi.totalSavings.toFixed(2)}`)
  }

  return (
    <div>
      <h2>Today's Savings</h2>
      {currentROI && (
        <div>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>
            ${currentROI.totalSavings.toFixed(2)}
          </p>
          <p>{currentROI.savingsPercentage.toFixed(1)}% saved</p>
          <button onClick={handleDayEnd}>Complete Day</button>
        </div>
      )}

      <h3>History ({periods.length} days)</h3>
      <ul>
        {periods.map((period, i) => (
          <li key={i}>
            Day {i + 1}: ${period.roi.totalSavings.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Example 2: Monthly Savings Estimator

```tsx
import { useMonthlySavings } from '@clarity-chat/token-optimization'

function MonthlySavingsEstimator() {
  const [dailyRequests, setDailyRequests] = useState(10000)

  const estimate = useMonthlySavings({
    dailyRequests,
    avgTokensPerRequest: 500,
    optimizationPercentage: 70,
    cacheHitRate: 0.8,
    model: 'gpt-4o',
  })

  return (
    <div>
      <label>
        Daily Requests: {dailyRequests.toLocaleString()}
        <input
          type="range"
          min="1000"
          max="100000"
          value={dailyRequests}
          onChange={(e) => setDailyRequests(Number(e.target.value))}
        />
      </label>

      <h3>Estimated Monthly Savings</h3>
      <p>Baseline: ${estimate.baselineMonthlyCost.toFixed(2)}</p>
      <p>Optimized: ${estimate.optimizedMonthlyCost.toFixed(2)}</p>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
        Savings: ${estimate.monthlySavings.toFixed(2)}
      </p>
      <p>Annual: ${(estimate.monthlySavings * 12).toFixed(2)}</p>
    </div>
  )
}
```

### Example 3: Break-Even Calculator

```tsx
import { useBreakEven } from '@clarity-chat/token-optimization'

function BreakEvenCalculator() {
  const breakEven = useBreakEven({
    implementationCost: 5000,
    dailyRequests: 10000,
    avgTokensPerRequest: 500,
    optimizationPercentage: 70,
  })

  const months = breakEven.daysToBreakEven / 30

  return (
    <div>
      <h2>Break-Even Analysis</h2>
      <p>Daily savings: ${breakEven.dailySavings.toFixed(2)}</p>
      <p>
        Break-even: {Math.ceil(breakEven.daysToBreakEven)} days
        ({months.toFixed(1)} months)
      </p>
      <p>Break-even date: {breakEven.breakEvenDate.toLocaleDateString()}</p>

      <h3>Timeline</h3>
      <div style={{ marginTop: '20px' }}>
        <div>Month 1: -${(5000 - breakEven.dailySavings * 30).toFixed(2)}</div>
        <div>Month 2: +${(breakEven.dailySavings * 60 - 5000).toFixed(2)}</div>
        <div>Year 1: +${(breakEven.dailySavings * 365 - 5000).toFixed(2)}</div>
      </div>
    </div>
  )
}
```

## Model Pricing

Pre-configured pricing for major LLM providers:

| Model | Input ($/1M) | Output ($/1M) | Cached ($/1M) |
|-------|--------------|---------------|---------------|
| gpt-4o | $2.50 | $10.00 | $1.25 (50% off) |
| gpt-4o-mini | $0.15 | $0.60 | $0.08 (50% off) |
| claude-3-5-sonnet | $3.00 | $15.00 | $0.30 (90% off) |
| claude-3-5-haiku | $0.80 | $4.00 | $0.08 (90% off) |
| gemini-1.5-pro | $1.25 | $5.00 | $0.31 (75% off) |
| gemini-1.5-flash | $0.08 | $0.30 | $0.02 (75% off) |

## Typical Savings

Based on real-world usage with all optimizations enabled:

| Optimization | Typical Savings |
|-------------|-----------------|
| Text Compression | 20-40% |
| Conversation Memory | 50-90% |
| Provider Caching | 50-90% (cached tokens) |
| Vision Optimization | 30-70% |
| Schema Optimization | 30-60% |
| **Combined** | **70-90%** |

## Best Practices

### 1. Track Real Usage

Don't estimate - track actual usage:

```typescript
const { trackUsage } = useROICalculator({ model: 'gpt-4o' })

// Track every request
const handleRequest = async () => {
  const baselineTokens = await countTokens(originalText)
  const optimizedTokens = await countTokens(optimizedText)

  trackUsage({
    inputTokensBaseline: baselineTokens,
    inputTokensOptimized: optimizedTokens,
    cachedInputTokens: optimizedTokens * 0.8,
    outputTokens: responseTokens,
  })
}
```

### 2. Compare Models Regularly

Find the best value model for your use case:

```typescript
const comparison = useModelComparison({
  usage: myUsageStats,
  models: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet'],
})

// Switch to most cost-effective model
const bestModel = comparison.sort(
  (a, b) => a.roi.actualCost - b.roi.actualCost
)[0].model
```

### 3. Monitor Payback Period

Track how quickly you recover implementation costs:

```typescript
const { currentROI, totalROI } = useROICalculator({
  model: 'gpt-4o',
  implementationCost: 5000,
})

if (totalROI && totalROI.totalSavings >= 5000) {
  console.log('🎉 Implementation costs recovered!')
}
```

### 4. Use Realistic Estimates

When estimating, use conservative numbers:

```typescript
const estimate = estimateMonthlySavings(
  dailyRequests,
  avgTokensPerRequest,
  60,  // Conservative 60% optimization (not 70%)
  0.7  // Conservative 70% cache hit rate (not 80%)
)
```

## Troubleshooting

### ROI seems too high

**Issue**: ROI calculations show unrealistic savings

**Solution**: Verify your usage tracking:
```typescript
// Make sure baseline and optimized are correct
trackUsage({
  inputTokensBaseline: 10000,  // BEFORE optimization
  inputTokensOptimized: 3000,   // AFTER optimization
  cachedInputTokens: 2400,      // FROM cache
  outputTokens: 5000,
})
```

### Break-even is Infinity

**Issue**: `paybackPeriodDays` is Infinity

**Cause**: Either:
1. Implementation cost is 0
2. Daily savings are 0

**Solution**:
```typescript
// Set implementation cost if tracking payback
const calculator = new ROICalculator('gpt-4o', 5000)

// Ensure you're tracking usage
trackUsage({ /* your usage */ })
```

### Savings don't match reality

**Issue**: Calculated savings differ from actual bill

**Solution**: Track real token counts from API responses:
```typescript
const response = await openai.chat.completions.create(/* ... */)

trackUsage({
  inputTokensBaseline: /* what it would have been */,
  inputTokensOptimized: response.usage.prompt_tokens,
  cachedInputTokens: response.usage.prompt_tokens_details?.cached_tokens || 0,
  outputTokens: response.usage.completion_tokens,
})
```

---

**Ready to track your savings?** Start with [Basic ROI Tracking](../examples/roi-calculator-usage.tsx) →
