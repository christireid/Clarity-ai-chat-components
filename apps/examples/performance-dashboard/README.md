# Performance Monitoring Dashboard

Real-time performance monitoring and benchmarking dashboard for Clarity Chat Components.

## Features

- **Live Performance Metrics** - Monitor component render times
- **Memory Usage Tracking** - Track memory consumption
- **Benchmark Comparisons** - Compare performance across versions
- **Interactive Charts** - Visualize performance data with Recharts
- **Component Profiling** - Profile individual components
- **Performance Reports** - Generate detailed performance reports

## Running

```bash
npm install
npm run dev
```

Then open http://localhost:5176

## What You Can Monitor

### Render Performance
- Initial render time
- Re-render time
- Average render duration
- Render count

### Memory Usage
- Heap size
- Used memory
- Memory allocation rate
- Memory leaks detection

### Component Metrics
- Time to interactive
- First contentful paint
- Largest contentful paint
- Cumulative layout shift

### Benchmarks
- Component vs component comparison
- Version vs version comparison
- Before vs after optimization
- Industry standard comparisons

## Using the Dashboard

### 1. Run Performance Tests
```bash
# The dashboard automatically runs tests
# Or manually trigger with the "Run Tests" button
```

### 2. View Metrics
- Select component from dropdown
- View real-time performance data
- See historical trends
- Compare with baselines

### 3. Generate Reports
- Click "Generate Report"
- Export as JSON or PDF
- Share with team
- Track over time

### 4. Set Performance Budgets
- Define max render time
- Set memory limits
- Configure thresholds
- Get alerts on violations

## Performance Budgets

Recommended performance budgets:

```typescript
{
  primitives: {
    Button: { maxRender: 16 },      // 1 frame (60fps)
    Input: { maxRender: 16 },
    Card: { maxRender: 16 },
  },
  react: {
    Message: { maxRender: 33 },     // 2 frames
    ChatWindow: { maxRender: 50 },  // 3 frames
    ChatInput: { maxRender: 33 },
  }
}
```

## Integration with Testing Utils

The dashboard uses `@clarity-chat/testing-utils`:

```typescript
import { measureRenderPerformance, measureAveragePerformance } from '@clarity-chat/testing-utils'

// Measure single render
const metrics = await measureRenderPerformance(() => {
  renderWithProviders(<Button />)
})

// Measure average over 10 runs
const avg = await measureAveragePerformance(renderFn, 10)
```

## Continuous Monitoring

Set up continuous performance monitoring:

1. **CI/CD Integration** - Run performance tests in CI
2. **Automated Reports** - Generate reports on each build
3. **Trend Analysis** - Track performance over time
4. **Regression Detection** - Alert on performance regressions

## Exporting Data

Export performance data in multiple formats:

- **JSON** - For programmatic analysis
- **CSV** - For spreadsheet analysis
- **PDF** - For sharing reports
- **PNG** - For embedding charts

## Tips for Optimization

1. **Memoize expensive components** with `React.memo`
2. **Use virtual scrolling** for long lists
3. **Lazy load** heavy components
4. **Debounce** expensive operations
5. **Profile regularly** to catch regressions early
