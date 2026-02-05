# Performance Monitoring System

A comprehensive real-time performance monitoring system for the Clarity Chat component showcase.

## Overview

The performance monitoring system provides real-time insights into:
- Frame rates (FPS)
- Memory usage
- Render performance
- Network requests
- Bundle size
- Performance warnings and optimization suggestions

## Features

### 1. Real-Time Metrics Dashboard

#### FPS Meter
- Tracks frame rate in real-time
- Target: 60 FPS
- Warning thresholds:
  - ✅ Good: 50-60 FPS (green)
  - ⚠️ Warning: 30-50 FPS (yellow)
  - ❌ Critical: <30 FPS (red)

#### Memory Monitor
- Tracks JavaScript heap usage
- Displays used/limit with percentage
- Warning thresholds:
  - ✅ Good: <50% (green)
  - ⚠️ Warning: 50-75% (yellow)
  - ❌ Critical: >75% (red)

#### Render Performance
- Tracks component render times
- Counts total renders
- Calculates average render time
- Target: <16ms per render (for 60 FPS)

#### Network Monitor
- Tracks all HTTP requests
- Identifies slow requests (>1000ms)
- Counts total network activity

#### Bundle Size
- Estimates total bundle size
- Displays in KB for easy reading

### 2. React Profiler Integration

The system uses React's built-in Profiler API to track component performance:

```tsx
import { withPerformanceProfiler } from '@/components/performance-monitor'

const MyComponent = withPerformanceProfiler(
  ({ data }) => {
    return <div>{data}</div>
  },
  'MyComponent'
)
```

### 3. Performance Warnings

Automatically detects and reports:
- Low FPS (<30 FPS)
- Dropping frame rates (<50 FPS)
- High memory usage (>75%)
- Critical memory usage (>90%)
- Slow renders (>16ms)
- Slow network requests (>1000ms)

### 4. Benchmark Comparisons

Visual before/after comparisons showing:
- Unoptimized vs. optimized components
- Render time improvements
- Memory usage reductions
- Real performance gains (e.g., "82% faster with virtualization")

Example comparisons:
- **Unoptimized List**: 45.3ms render, 12.4MB memory
- **Virtualized List**: 8.2ms render, 3.1MB memory → **82% faster**
- **Heavy Component**: 32.1ms render, 8.7MB memory
- **Memoized Component**: 2.4ms render, 2.1MB memory → **93% faster**

### 5. Optimization Suggestions

Smart recommendations based on current metrics:

#### High Priority Suggestions
- **Use React.memo**: When average render time >10ms
- **Implement Virtual Scrolling**: When render count >100
- **Optimize Memory**: When memory usage >70%

#### Medium Priority Suggestions
- **Code Splitting**: When bundle size >500KB
- **Reduce Network Calls**: When requests >50
- **Debounce Updates**: When high render count with slow renders

### 6. Test Components

Interactive demo components to test monitoring:

#### Fast Component
- Minimal computation
- Quick renders
- Demonstrates optimal performance

#### Heavy Component
- Configurable iterations (100-10,000)
- Simulates complex calculations
- Shows performance impact of heavy work
- Slider to adjust computational load

### 7. Performance Score

Overall performance score (0-100) calculated from:
- **FPS** (40 points): Based on frame rate vs. 60 FPS target
- **Memory** (30 points): Based on memory usage percentage
- **Render Time** (30 points): Based on average render time vs. 16ms target

Score categories:
- 🟢 **90-100**: Excellent performance
- 🟡 **70-89**: Good performance with room for improvement
- 🔴 **0-69**: Needs optimization

## Usage

### Global Monitor (Floating Widget)

The performance monitor is available globally in the bottom-right corner:

1. **Collapsed State**: Shows "Performance" button with live indicator
2. **Expanded State**: Full metrics dashboard with all data

### Dedicated Page

Visit `/performance` for the full performance dashboard with:
- Real-time metrics grid
- Performance score
- Test components
- Benchmark comparisons
- Optimization suggestions

### Programmatic Usage

```tsx
import { usePerformanceMonitor } from '@/components/performance-monitor'

function MyComponent() {
  const { metrics, warnings, isMonitoring, startMonitoring, stopMonitoring } =
    usePerformanceMonitor()

  return (
    <div>
      <p>FPS: {metrics.fps}</p>
      <p>Memory: {metrics.memory.percentage}%</p>
      <p>Renders: {metrics.renderCount}</p>
      <button onClick={startMonitoring}>Start</button>
      <button onClick={stopMonitoring}>Stop</button>
    </div>
  )
}
```

### Component Profiling

Wrap any component with the performance profiler:

```tsx
import { withPerformanceProfiler } from '@/components/performance-monitor'

const OptimizedComponent = withPerformanceProfiler(
  ({ data }) => {
    // Component logic
    return <div>{data}</div>
  },
  'OptimizedComponent' // Component name for tracking
)
```

## Implementation Details

### Architecture

```
PerformanceMonitorProvider (Context)
├── FPS Counter (requestAnimationFrame)
├── Memory Monitor (performance.memory)
├── Network Observer (PerformanceObserver)
├── Render Tracker (React.Profiler)
└── Warning System (threshold-based)

Components:
├── PerformanceMonitorDisplay (floating widget)
├── PerformanceDashboard (full page)
├── BenchmarkComparison (visual comparisons)
└── OptimizationSuggestions (smart recommendations)
```

### Key Technologies

- **React Profiler API**: Component render tracking
- **requestAnimationFrame**: FPS measurement
- **Performance API**: Memory and network monitoring
- **PerformanceObserver**: Network request tracking
- **Context API**: State management

### Browser Compatibility

- **FPS Tracking**: All modern browsers (requestAnimationFrame)
- **Memory Tracking**: Chrome, Edge (performance.memory)
- **Network Tracking**: All modern browsers (PerformanceObserver)

## Performance Impact

The monitoring system itself is optimized:
- FPS counter runs on RAF (minimal overhead)
- Memory checks run every 1 second
- Network observer is passive
- Render tracking via React's built-in Profiler
- No impact when monitoring is disabled

## Best Practices

1. **Use sparingly in production**: Enable only for debugging
2. **Profile specific components**: Use `withPerformanceProfiler` selectively
3. **Watch the warnings**: Address high-priority issues first
4. **Test with real data**: Use actual workloads for accurate metrics
5. **Compare before/after**: Always benchmark optimizations

## Optimization Strategies

### For Low FPS
1. Reduce render frequency
2. Optimize animations (use transform/opacity)
3. Implement virtualization for long lists
4. Use React.memo for pure components

### For High Memory
1. Clean up event listeners
2. Cancel subscriptions on unmount
3. Avoid memory leaks in useEffect
4. Implement proper cleanup functions

### For Slow Renders
1. Use React.memo to prevent unnecessary renders
2. Optimize expensive calculations with useMemo
3. Split large components into smaller ones
4. Defer non-critical updates

### For Network Issues
1. Batch requests
2. Implement caching
3. Use CDN for static assets
4. Optimize API payloads

## Metrics Reference

### FPS (Frames Per Second)
- **Ideal**: 60 FPS
- **Good**: 50-60 FPS
- **Acceptable**: 30-50 FPS
- **Poor**: <30 FPS

### Render Time
- **Ideal**: <16ms (60 FPS)
- **Good**: 16-33ms (30-60 FPS)
- **Poor**: >33ms (<30 FPS)

### Memory Usage
- **Low**: <50% of heap
- **Medium**: 50-75% of heap
- **High**: 75-90% of heap
- **Critical**: >90% of heap

## Examples

### Example 1: Monitoring a List Component

```tsx
const ListComponent = withPerformanceProfiler(
  ({ items }) => {
    return (
      <div>
        {items.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    )
  },
  'ListComponent'
)

// Use in your app
<ListComponent items={largeArray} />
```

### Example 2: Conditional Monitoring

```tsx
function MyApp() {
  const [enableMonitoring, setEnableMonitoring] = useState(false)
  const { startMonitoring, stopMonitoring } = usePerformanceMonitor()

  useEffect(() => {
    if (enableMonitoring) {
      startMonitoring()
    } else {
      stopMonitoring()
    }
  }, [enableMonitoring, startMonitoring, stopMonitoring])

  return (
    <div>
      <button onClick={() => setEnableMonitoring(!enableMonitoring)}>
        Toggle Monitoring
      </button>
      {/* App content */}
    </div>
  )
}
```

### Example 3: Performance Benchmarking

```tsx
function BenchmarkTest() {
  const { metrics } = usePerformanceMonitor()
  const [results, setResults] = useState([])

  const runBenchmark = () => {
    // Record initial state
    const before = { ...metrics }

    // Perform operations
    // ... your code ...

    // Record final state
    setTimeout(() => {
      const after = { ...metrics }
      setResults([...results, { before, after }])
    }, 1000)
  }

  return (
    <div>
      <button onClick={runBenchmark}>Run Benchmark</button>
      {results.map((result, i) => (
        <div key={i}>
          <p>Renders: {result.after.renderCount - result.before.renderCount}</p>
          <p>Avg Time: {result.after.averageRenderTime.toFixed(2)}ms</p>
        </div>
      ))}
    </div>
  )
}
```

## Troubleshooting

### High Memory Usage
- Check for memory leaks in useEffect
- Ensure proper cleanup of event listeners
- Verify subscriptions are cancelled
- Look for circular references

### Low FPS
- Profile components to find slow renders
- Check for expensive calculations in render
- Verify animations use GPU-accelerated properties
- Look for unnecessary re-renders

### Slow Renders
- Use React DevTools Profiler for detailed analysis
- Identify components with high render times
- Apply React.memo where appropriate
- Move expensive operations to useEffect

## Future Enhancements

Planned features:
- [ ] Export performance reports
- [ ] Historical performance tracking
- [ ] Component dependency graph
- [ ] Automated optimization suggestions
- [ ] Performance regression detection
- [ ] Custom metric thresholds
- [ ] Performance alerts
- [ ] Integration with CI/CD

## Resources

- [React Profiler API](https://react.dev/reference/react/Profiler)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Web Vitals](https://web.dev/vitals/)
