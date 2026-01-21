# Performance Monitoring System

A comprehensive performance monitoring system for Clarity Chat components that tracks render times, memory usage, and provides actionable optimization insights.

## Overview

The performance monitoring system helps developers:
- **Track component performance** in real-time
- **Identify performance bottlenecks** before they impact users
- **Monitor memory usage** and detect leaks
- **Get actionable insights** for optimization

## Quick Start

### Basic Usage

```tsx
import { usePerformanceTracking } from '@clarity-chat/react'

function MyComponent() {
  usePerformanceTracking({
    componentName: 'MyComponent',
    trackMemory: true,
    metadata: { variant: 'large' }
  })

  return <div>My content</div>
}
```

### Performance Dashboard

```tsx
import { PerformanceDashboard } from '@clarity-chat/react'

function DevTools() {
  return (
    <PerformanceDashboard
      autoRefresh={true}
      refreshInterval={5000}
    />
  )
}
```

### Bundle Analysis

```bash
# Analyze bundle sizes and component impact
pnpm bundle-analysis
```

## API Reference

### `usePerformanceTracking(options)`

Tracks component performance metrics.

```typescript
interface UsePerformanceTrackingOptions {
  componentName: string           // Component identifier
  trackMemory?: boolean          // Track memory usage (default: false)
  metadata?: Record<string, any> // Additional context
  config?: Partial<PerformanceConfig> // Override defaults
}
```

### `PerformanceDashboard`

Real-time performance monitoring UI.

```typescript
interface PerformanceDashboardProps {
  className?: string
  autoRefresh?: boolean         // Auto-refresh data (default: true)
  refreshInterval?: number      // Refresh interval in ms (default: 5000)
}
```

### Performance Utilities

```typescript
import {
  measureExecutionTime,      // Time function execution
  withPerformanceTracking,   // HOC for performance tracking
  getPerformanceSummary,     // Get aggregated metrics
  getMemoryUsage,           // Get current memory usage
} from '@clarity-chat/react'
```

## Performance Metrics

### What Gets Tracked

- **Render Time**: Time to render component (ms)
- **Memory Delta**: Change in memory usage (bytes)
- **Component Name**: Identifier for tracking
- **Metadata**: Custom context (props, variants, etc.)
- **Timestamp**: When measurement occurred

### Thresholds

- **Slow Render**: > 16ms (drops below 60fps)
- **Memory Leak**: > 1MB increase
- **Warning**: 8-16ms render time

## Console Output

Performance metrics are logged to console in development:

```
🟢 Performance: EnhancedMarkdownRenderer
   Render time: 5.23ms
   Memory delta: +45KB

🔴 Performance: HeavyComponent
   Render time: 24.67ms
   Memory delta: +2.1MB
```

## Local Storage

Metrics are stored in `localStorage` for analysis:

```javascript
// Access stored metrics
const metrics = JSON.parse(localStorage.getItem('clarity-performance-metrics'))

// Get summary
const summary = getPerformanceSummary()
```

## Best Practices

### When to Use Performance Tracking

**Use for:**
- Complex components with heavy computations
- Components that render frequently
- Components with large prop changes
- Critical user journey components

**Avoid for:**
- Simple presentational components
- Components that rarely re-render
- Development-only components

### Memory Tracking

```tsx
// Only enable memory tracking for components that might leak
usePerformanceTracking({
  componentName: 'ComplexList',
  trackMemory: true,  // Expensive, use sparingly
})
```

### Metadata for Insights

```tsx
// Include relevant context for analysis
usePerformanceTracking({
  componentName: 'MessageList',
  metadata: {
    messageCount: messages.length,
    virtualized: true,
    theme: currentTheme,
  }
})
```

## Bundle Analysis

### Running Analysis

```bash
# Generate comprehensive bundle report
pnpm bundle-analysis
```

### Understanding Results

```
📦 Bundle Sizes:
  🟢 @clarity-chat/react (core): 350KB (75.2%)
  🟢 @clarity-chat/primitives: 25KB (83.3%)

🏗️ Component Impact Analysis:
  📄 EnhancedMarkdownRenderer (Typography)
     Size: 45KB (6.4% of core bundle)
     💡 Recommendations:
        • Consider lazy loading KaTeX
        • Implement syntax highlighting on-demand
```

### Size Limits

Current bundle size limits (from `.size-limit.json`):
- Core bundle: 350KB
- Full bundle: 650KB
- Primitives: 30KB

## Optimization Strategies

### Based on Analysis

1. **Lazy Loading**: Heavy dependencies (KaTeX, Mermaid)
2. **Code Splitting**: Syntax highlighting themes
3. **Virtual Scrolling**: Large message lists
4. **Memoization**: Expensive computations

### Performance Budgets

```json
{
  "budgets": [
    {
      "name": "Content Components",
      "size": "50KB",
      "type": "content"
    }
  ]
}
```

## Troubleshooting

### Common Issues

**No metrics showing**
- Check if `NODE_ENV === 'development'`
- Verify localStorage is available
- Check console for errors

**High memory usage**
- Reduce `trackMemory: true` usage
- Implement proper cleanup in useEffect
- Check for memory leaks in event listeners

**Slow renders**
- Add React.memo for stable props
- Use useMemo for expensive calculations
- Implement virtualization for large lists

### Debugging

```tsx
// Debug specific component
usePerformanceTracking({
  componentName: 'DebugComponent',
  config: {
    enabled: true,
    logToConsole: true,
    sendToAnalytics: false,
  }
})
```

## Integration with DevTools

### React DevTools Profiler

The system integrates with React DevTools Profiler:

```tsx
// Add profiler callback
import { createProfilerCallback } from '@clarity-chat/react'

<MyComponent onRender={createProfilerCallback('MyComponent')} />
```

### Chrome DevTools

- Use "Performance" tab to record interactions
- Look for long "Layout" and "Paint" phases
- Monitor memory usage over time

## Contributing

When adding performance monitoring:

1. **Use sparingly**: Only add to components that benefit from tracking
2. **Include metadata**: Add relevant context for analysis
3. **Test thoroughly**: Ensure monitoring doesn't impact performance
4. **Document changes**: Update component docs with performance notes

## Future Enhancements

- **Automated regression detection**
- **Performance budgets with CI checks**
- **Real user monitoring (RUM) integration**
- **Component usage analytics**
- **Performance comparison across versions**