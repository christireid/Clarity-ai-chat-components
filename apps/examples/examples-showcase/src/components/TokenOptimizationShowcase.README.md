# Token Optimization Showcase

Comprehensive interactive demonstration of all token optimization hooks from `@clarity-chat/react`.

## Features

This showcase provides live, interactive demonstrations of three core token optimization hooks:

### 1. useTokenBudgetMonitor

**Purpose**: Track token usage against a configurable budget with visual warnings and auto-trimming.

**Interactive Features**:
- Adjustable budget limits (100-4000 tokens)
- Real-time token counting with debouncing
- Visual status indicators (safe, warning, danger, exceeded)
- Progress bar with animated updates
- Auto-trim functionality when budget is exceeded
- Multiple sample text options

**Use Cases**:
- Enforcing conversation token limits
- Preventing API overages
- User-facing token budgets

### 2. useTokenOptimization

**Purpose**: Unified API for compression, caching, and cost estimation.

**Interactive Features**:
- **Text Compression**:
  - Three strategies: Adaptive, LLMLingua, Extractive
  - Adjustable compression ratio (10%-90%)
  - Live compression results with metrics
  - Quality scores and token savings

- **Response Caching**:
  - Set/get cache operations
  - Cache hit/miss visualization
  - TTL and age tracking

- **Cost Estimation**:
  - Real-time pricing calculations
  - Input/output token costs
  - Model-aware pricing (GPT-4, Claude, etc.)

**Use Cases**:
- Reducing token costs by 30-70%
- Caching frequent queries
- Multi-model routing decisions

### 3. useTokenCounter

**Purpose**: Accurate, real-time token counting with model-aware encoding.

**Interactive Features**:
- Manual token counting with live updates
- Chat message token counting
- Streaming token tracking simulation
- Character-to-token ratio analysis
- Model context window visualization
- Multiple sample texts (short, medium, long, code)

**Use Cases**:
- Real-time input validation
- Token budget UI
- Streaming response monitoring

## Architecture

### Component Structure

```
TokenOptimizationShowcase
├── BudgetMonitorDemo
│   ├── Budget controls
│   ├── Status display
│   ├── Progress visualization
│   └── Text input with trim
├── OptimizationDemo
│   ├── Compression section
│   ├── Caching section
│   └── Cost estimation
└── CounterDemo
    ├── Manual counting
    ├── Chat message counting
    └── Streaming simulation
```

### Styling

**Design System**: Glassmorphism with OKLCH colors
- Translucent backgrounds with backdrop blur
- Gradient accents (blue → purple)
- Smooth animations with Framer Motion
- Responsive grid layouts
- Dark theme optimized

**Key Classes**:
- `.demo-card` - Main container with glass effect
- `.status-card` - Colored status indicators
- `.progress-bar` - Animated progress with shimmer
- `.metric-card` - Individual metric displays
- `.result-card` - Success/completion states

## Usage

```tsx
import { TokenOptimizationShowcase } from './components/TokenOptimizationShowcase'

function App() {
  return <TokenOptimizationShowcase />
}
```

The showcase is self-contained and doesn't require any props or configuration.

## Sample Data

Pre-configured sample texts:
- **Short**: Simple greeting (10-20 tokens)
- **Medium**: Paragraph with explanation (50-100 tokens)
- **Long**: Multi-paragraph article (200-400 tokens)
- **Code**: TypeScript function with types (100-150 tokens)

## Performance Considerations

- Debounced token counting (150ms default)
- Memoized expensive computations
- Lazy-loaded compressor instances
- Virtual scrolling for long content
- Optimized re-renders with React.memo

## Browser Compatibility

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Requires ES2020+ support
- Uses Web Workers for compression (when available)

## Related Documentation

- [useTokenBudgetMonitor API](/docs/api/hooks/use-token-budget-monitor)
- [useTokenOptimization API](/docs/api/hooks/use-token-optimization)
- [useTokenCounter API](/docs/api/hooks/use-token-counter)
- [Token Optimization Guide](/docs/guides/token-optimization)
