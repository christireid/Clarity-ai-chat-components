# Performance Benchmarks - Quick Start Guide

## 🚀 5-Minute Quick Start

### 1. Run All Benchmarks
```bash
cd packages/react
pnpm bench
```

### 2. Run Specific Benchmark
```bash
pnpm bench:streaming    # Streaming performance
pnpm bench:long-list    # Long message lists
pnpm bench:layout       # Layout thrashing
```

### 3. Export Results
```bash
pnpm bench:json         # Saves to benchmark-results.json
```

### 4. Compare with Baseline
```bash
node scripts/compare-benchmarks.mjs \
  baseline-benchmark-results.json \
  benchmark-results.json
```

## 📊 Available Benchmarks

| Command | Tests | Run Time |
|---------|-------|----------|
| `pnpm bench:long-list` | Message list rendering (100-5000 msgs) | ~30s |
| `pnpm bench:streaming` | Streaming at 10-200 tokens/sec | ~45s |
| `pnpm bench:virtualization` | Virtualization & scrolling | ~40s |
| `pnpm bench:concurrent` | 1-10 concurrent streams | ~60s |
| `pnpm bench:layout` | Layout thrashing detection | ~30s |

## 🎯 What to Look For

### ✅ Good Performance
```
✓ Render 100 messages (virtualized)    38ms   (target: <50ms)
✓ Stream at 100 tokens/sec (batched)    25ms   (FPS: 55+)
✓ Memory leak check                     0.8MB  (target: <1MB)
```

### ⚠️ Performance Warnings
```
⚠ Render 500 messages (non-virt)      220ms   (consider virtualization)
⚠ Stream at 200 tokens/sec             140ms   (FPS: 50, use batching)
```

### ❌ Critical Issues
```
❌ Render 5000 messages (non-virt)    2300ms   (MUST use virtualization)
❌ FPS during streaming                 25fps   (janky, needs optimization)
❌ Memory leak detected                 8.5MB   (fix memory leaks)
```

## 🔧 Quick Profiling

### Profile a Component
```typescript
import { PerformanceProfiler } from './utils/profiling/performance-profiler'

const profiler = new PerformanceProfiler()
profiler.start()

const endRender = profiler.measureRender('MyComponent')
// ... render your component
endRender()

profiler.stop()
console.log(profiler.exportMarkdown())
```

### Simulate Low-End Device
```typescript
import { createDeviceSimulator, DEVICE_PROFILES } from './utils/profiling/device-simulation'

const simulator = createDeviceSimulator(DEVICE_PROFILES.lowEnd)
simulator.start()

// Run your tests...

simulator.stop()
```

## 📈 Performance Budgets

| Metric | Target | Max | Critical |
|--------|--------|-----|----------|
| Render time | <50ms | <100ms | >100ms |
| FPS | 60 | 30+ | <30 |
| Memory (1000 msgs) | <100MB | <200MB | >200MB |
| Memory leak | <1MB | <5MB | >5MB |

## 🔍 Troubleshooting

### Benchmark Fails
```bash
# Increase memory
NODE_OPTIONS='--max-old-space-size=8192' pnpm bench

# Run single test
pnpm bench streaming -t "Stream at 50"
```

### High Memory Usage
1. Enable virtualization for lists >100 items
2. Implement batching for streaming
3. Check for memory leaks (unmount cleanup)

### Low FPS
1. Use batching (5-10 token batches)
2. Use `requestAnimationFrame` for updates
3. Memoize expensive renders

### Layout Thrashing
1. Batch DOM reads before writes
2. Use RAF for layout reads
3. Cache layout values

## 📚 Full Documentation

- **Comprehensive Guide**: `benchmarks.md` (80+ pages)
- **Summary**: `PERFORMANCE_BENCHMARKS_SUMMARY.md`
- **Benchmark README**: `src/__benchmarks__/README.md`

## 🎓 Common Use Cases

### Before Committing Performance Changes
```bash
# 1. Run benchmarks and save current results
pnpm bench:json
cp benchmark-results.json before.json

# 2. Make your changes

# 3. Re-run and compare
pnpm bench:json
node scripts/compare-benchmarks.mjs before.json benchmark-results.json
```

### Testing on Low-End Device
All benchmarks include low-end device scenarios automatically.
Look for tests with "Low-end device" in the name.

### Detecting Memory Leaks
```bash
pnpm bench:concurrent -t "Memory leak check"
```

### Finding Layout Thrashing
```bash
pnpm bench:layout
```
Look for differences between "thrashing" and "optimized" variants.

## 💡 Pro Tips

1. **Close other apps** before running benchmarks
2. **Run 3 times** and take the average
3. **Use production build** for accurate results
4. **Test on target hardware** (mobile devices)
5. **Profile before optimizing** - measure first!

## 🚨 When to Be Concerned

| Observation | Action |
|-------------|--------|
| FPS < 30 | Profile and optimize immediately |
| Memory leak > 5MB | Check cleanup in useEffect |
| Render > 100ms | Use virtualization or memoization |
| Layout recalc > 100 | Batch reads/writes |

## ✅ Success Criteria

Your changes are good if:
- No regressions > 10% from baseline
- FPS maintains 30+ (target: 60)
- Memory leaks < 1MB
- Render times within budget

---

**Need Help?** See full documentation in `benchmarks.md`
