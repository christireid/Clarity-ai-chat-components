# Performance Monitor - Quick Start Guide

## 🚀 Getting Started in 30 Seconds

### Option 1: Use the Floating Widget

1. Look for the **"Performance"** button in the bottom-right corner
2. Click to expand the dashboard
3. Click **"Start"** to begin monitoring
4. Watch real-time metrics update

### Option 2: Visit the Dashboard

1. Navigate to `/performance` in the sidebar
2. Monitoring starts automatically
3. Explore all features and metrics

### Option 3: Profile Your Components

```tsx
import { withPerformanceProfiler } from '@/components/performance-monitor'

// Wrap your component
const MyComponent = withPerformanceProfiler(
  ({ data }) => <div>{data}</div>,
  'MyComponent' // Name for tracking
)

// Use normally
<MyComponent data={myData} />
```

## 📊 What You'll See

### Metrics Dashboard

```
┌─────────────────────────────────────────┐
│  Performance Monitor                    │
│  [Stop] [Minimize]                      │
├─────────────────────────────────────────┤
│  ⚡ FPS: 60         Target: 60 FPS      │
│  ████████████████████████████ 100%      │
│                                          │
│  💾 Memory: 45.2%  Used: 128.4 MB       │
│  ████████████░░░░░░░░░░░░░░░ 45%        │
│                                          │
│  ⚙️  Renders: 143   Avg: 8.2ms          │
│  🌐 Network: 23     Requests             │
│  📦 Bundle: 245 KB  Size                 │
├─────────────────────────────────────────┤
│  ⚠️ Recent Warnings                      │
│  • Slow render: HeavyComponent (24ms)   │
│  • FPS dropping: 48 FPS                 │
└─────────────────────────────────────────┘
```

## 🎯 Key Features

### 1. Real-Time Metrics
- **FPS**: 60 FPS target, updates every frame
- **Memory**: Heap usage with percentage
- **Renders**: Count and average time
- **Network**: Request tracking
- **Bundle**: Estimated size

### 2. Performance Warnings
- 🔴 **Error**: Critical issues (FPS <30, Memory >90%)
- 🟡 **Warning**: Attention needed (FPS 30-50, Memory 75-90%)
- 🔵 **Info**: Informational messages

### 3. Optimization Suggestions

When metrics indicate issues, you'll see:
- What to optimize
- Why it matters
- How to fix it
- Priority level

### 4. Benchmark Comparisons

See before/after improvements:
```
Unoptimized List:  45.3ms render ❌
Virtualized List:   8.2ms render ✅  (82% faster!)
```

## 🔧 Common Use Cases

### Development
```tsx
// Profile during development
const MyNewComponent = withPerformanceProfiler(
  MyNewComponent,
  'MyNewComponent'
)
```

### Debugging
1. Open performance dashboard
2. Interact with slow feature
3. Check warnings for issues
4. Apply suggested optimizations

### Optimization
1. Record baseline metrics
2. Apply optimization
3. Compare before/after
4. Verify improvement

### Testing
1. Navigate to `/performance`
2. Toggle "Heavy Component"
3. Adjust iteration slider
4. Watch metrics respond

## 📈 Performance Targets

| Metric | Target | Your Goal |
|--------|--------|-----------|
| **FPS** | 60 | Stay above 50 |
| **Memory** | <50% | Keep under 75% |
| **Render Time** | <16ms | Aim for <10ms |
| **Score** | 90+ | Achieve "Excellent" |

## 🎨 Visual Indicators

### Colors
- 🟢 **Green**: All good
- 🟡 **Yellow**: Watch this
- 🔴 **Red**: Needs attention

### Icons
- ⚡ FPS / Frame rate
- 💾 Memory usage
- ⚙️ CPU / Renders
- 🌐 Network requests
- 📦 Bundle size
- ⚠️ Warnings
- 🎯 Optimization tips

## 🛠️ Pro Tips

### 1. Start Monitoring Before Testing
Always start monitoring before running the feature you want to test.

### 2. Watch the Warnings
Warnings tell you exactly what's slow and where.

### 3. Use Test Components
The heavy component lets you simulate performance issues.

### 4. Check Memory Leaks
If memory keeps growing, you have a leak.

### 5. Profile Specific Components
Only profile components you're optimizing to reduce noise.

## ⚡ Quick Actions

### Start Monitoring
```tsx
const { startMonitoring } = usePerformanceMonitor()
startMonitoring()
```

### Get Current Metrics
```tsx
const { metrics } = usePerformanceMonitor()
console.log(`FPS: ${metrics.fps}`)
console.log(`Memory: ${metrics.memory.percentage}%`)
```

### Check for Issues
```tsx
const { warnings } = usePerformanceMonitor()
if (warnings.some(w => w.type === 'error')) {
  console.warn('Critical performance issues detected!')
}
```

## 🐛 Troubleshooting

### "No metrics updating"
- Check if monitoring is started
- Verify browser supports Performance API
- Open browser console for errors

### "Memory tracking not working"
- Memory API only works in Chrome/Edge
- Use CPU/render metrics instead

### "High memory usage"
- Check for memory leaks
- Review useEffect cleanup functions
- Verify subscriptions are cancelled

### "Low FPS"
- Profile slow components
- Check for expensive calculations
- Use React.memo and useMemo
- Consider virtualization

## 📚 Learn More

- **Full Documentation**: See `PERFORMANCE_MONITORING.md`
- **Implementation Details**: See `PERFORMANCE_IMPLEMENTATION_SUMMARY.md`
- **API Reference**: See documentation "API Reference" section

## 🎓 Examples

### Example 1: Basic Usage
```tsx
import { usePerformanceMonitor } from '@/components/performance-monitor'

function MyApp() {
  const { metrics, isMonitoring, startMonitoring } = usePerformanceMonitor()

  return (
    <div>
      {!isMonitoring && (
        <button onClick={startMonitoring}>Start Monitoring</button>
      )}
      {isMonitoring && (
        <div>
          <p>FPS: {metrics.fps}</p>
          <p>Memory: {metrics.memory.percentage}%</p>
        </div>
      )}
    </div>
  )
}
```

### Example 2: Component Profiling
```tsx
import { withPerformanceProfiler } from '@/components/performance-monitor'

const SlowList = ({ items }) => (
  <div>
    {items.map(item => <div key={item.id}>{item.name}</div>)}
  </div>
)

export default withPerformanceProfiler(SlowList, 'SlowList')
```

### Example 3: Conditional Monitoring
```tsx
function DevTools() {
  const { isMonitoring, startMonitoring, stopMonitoring } = usePerformanceMonitor()

  useEffect(() => {
    // Only monitor in development
    if (process.env.NODE_ENV === 'development') {
      startMonitoring()
    }
    return () => stopMonitoring()
  }, [startMonitoring, stopMonitoring])

  return null
}
```

## ✅ Checklist

Before going to production:
- [ ] Profile all major components
- [ ] Address all error-level warnings
- [ ] Achieve performance score >70
- [ ] Verify FPS stays above 30
- [ ] Check memory usage stays <75%
- [ ] Test on target devices
- [ ] Disable monitoring in production (or gate behind feature flag)

## 🎉 You're Ready!

Start monitoring your app's performance right now:
1. Open the floating widget
2. Click "Start"
3. Explore your components
4. Optimize based on warnings

Happy optimizing! 🚀
