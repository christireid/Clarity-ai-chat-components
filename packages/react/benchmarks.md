# Performance Benchmarking & Profiling Guide

Comprehensive guide for running performance benchmarks and profiling the Clarity Chat streaming and virtualization features.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Benchmark Files](#benchmark-files)
- [Running Benchmarks](#running-benchmarks)
- [Profiling Tools](#profiling-tools)
- [Performance Budgets](#performance-budgets)
- [Interpreting Results](#interpreting-results)
- [Device Simulation](#device-simulation)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Overview

This benchmarking suite provides comprehensive performance testing for:

- **Long message lists** (100-5000 messages)
- **Streaming performance** (10-200 tokens/sec)
- **Virtualization** (fixed and dynamic heights)
- **Concurrent streams** (1-10 simultaneous streams)
- **Layout thrashing** (detection and prevention)

## Quick Start

```bash
# Run all benchmarks
pnpm vitest bench

# Run specific benchmark suite
pnpm vitest bench long-message-list
pnpm vitest bench streaming
pnpm vitest bench virtualization
pnpm vitest bench concurrent-streams
pnpm vitest bench layout-thrashing

# Run with verbose output
pnpm vitest bench --reporter=verbose

# Export results to JSON
pnpm vitest bench --outputFile=benchmark-results.json
```

## Benchmark Files

### 1. Long Message List Benchmark
**File:** `src/__benchmarks__/long-message-list.bench.tsx`

Tests rendering performance with varying message counts:
- 100 messages
- 500 messages
- 1000 messages
- 5000 messages

**Comparisons:**
- Non-virtualized vs Virtualized
- Memory usage
- Low-end device performance
- Incremental message addition

**Run:**
```bash
pnpm vitest bench long-message-list
```

### 2. Streaming Performance Benchmark
**File:** `src/__benchmarks__/streaming.bench.tsx`

Tests streaming at different token rates:
- 10 tokens/sec
- 50 tokens/sec
- 100 tokens/sec
- 200 tokens/sec

**Scenarios:**
- Simple streaming (no batching)
- Batched streaming
- RAF-based streaming
- Memory accumulation
- FPS during streaming

**Run:**
```bash
pnpm vitest bench streaming
```

### 3. Virtualization Benchmark
**File:** `src/__benchmarks__/virtualization.bench.tsx`

Tests virtualization at different thresholds:
- Threshold impact (50, 100, 200)
- Scroll performance
- Height recalculation overhead
- Fixed vs Dynamic heights

**Run:**
```bash
pnpm vitest bench virtualization
```

### 4. Concurrent Streams Benchmark
**File:** `src/__benchmarks__/concurrent-streams.bench.tsx`

Tests multiple simultaneous streams:
- 1, 2, 5, 10 concurrent streams
- State update frequency
- Memory leak detection
- High throughput scenarios

**Run:**
```bash
pnpm vitest bench concurrent-streams
```

### 5. Layout Thrashing Benchmark
**File:** `src/__benchmarks__/layout-thrashing.bench.tsx`

Detects and measures layout thrashing:
- Forced synchronous layouts
- Read/write batching
- Scroll position tracking
- Animation performance

**Run:**
```bash
pnpm vitest bench layout-thrashing
```

## Profiling Tools

### PerformanceProfiler

Located at `src/utils/profiling/performance-profiler.ts`

**Features:**
- Render timing measurement
- Layout recalculation tracking
- Memory snapshots
- FPS measurement
- Export reports (JSON, HTML, Markdown)

**Usage:**

```typescript
import { PerformanceProfiler } from './utils/profiling/performance-profiler'

const profiler = new PerformanceProfiler()

// Start profiling
profiler.start()

// Measure render
const endRender = profiler.measureRender('MyComponent')
// ... render component
endRender()

// Capture memory
profiler.captureMemorySnapshot()

// Track FPS
profiler.startFPSTracking((fps) => {
  console.log('Current FPS:', fps)
})

// Stop and generate report
profiler.stop()
const report = profiler.generateReport()

// Export report
const html = profiler.exportHTML()
const json = profiler.exportJSON()
const markdown = profiler.exportMarkdown()
```

### Device Simulator

Located at `src/utils/profiling/device-simulation.ts`

**Features:**
- CPU throttling (1x-6x slowdown)
- Memory constraints (256MB-8GB)
- Network throttling (offline, 3G, 4G, WiFi)
- Viewport simulation (mobile, tablet, desktop)

**Usage:**

```typescript
import { createDeviceSimulator, DEVICE_PROFILES } from './utils/profiling/device-simulation'

// Use predefined profile
const simulator = createDeviceSimulator(DEVICE_PROFILES.lowEnd)
simulator.start()

// ... run tests

simulator.stop()

// Or custom profile
const customSimulator = createDeviceSimulator({
  cpuThrottleFactor: 4,
  maxMemoryMB: 512,
  networkProfile: NETWORK_PROFILES.slow3G,
})
```

**Predefined Profiles:**
- `highEnd`: Modern desktop/laptop
- `midRange`: Average smartphone
- `lowEnd`: Budget smartphone
- `veryLowEnd`: Entry-level device

## Performance Budgets

### Target Metrics

#### Rendering
- **Initial render**: < 100ms (target: 50ms)
- **Update render**: < 16ms (60fps)
- **95th percentile**: < 100ms

#### Memory
- **Initial**: < 50MB
- **Peak**: < 200MB (1000 messages)
- **Leaked**: < 1MB after cleanup

#### FPS
- **Target**: 60 fps
- **Acceptable**: 30+ fps
- **Janky frames**: < 5% of total

#### User Experience
- **Time to interactive**: < 500ms
- **Total blocking time**: < 200ms
- **Long tasks**: < 5

### Virtualization Thresholds

| Message Count | Virtualization | Expected Render Time |
|---------------|----------------|----------------------|
| < 50          | No             | < 50ms               |
| 50-100        | Optional       | < 100ms              |
| 100-500       | Recommended    | < 200ms              |
| 500+          | Required       | < 300ms              |

### Streaming Performance

| Tokens/Sec | Batching      | Expected FPS |
|------------|---------------|--------------|
| 10         | Not needed    | 60           |
| 50         | Recommended   | 60           |
| 100        | Required      | 55+          |
| 200        | Required      | 50+          |

## Interpreting Results

### Benchmark Output

```
✓ src/__benchmarks__/long-message-list.bench.tsx (15)
  ✓ Non-Virtualized Message List (4)
    name                              hz     min     max    mean     p75     p99    p995    p999     rme  samples
  · Render 100 messages           12.50  76.50  102.30   80.00   85.20   98.40  100.20  101.80  ±2.50%       50
  · Render 500 messages            2.30 410.20  480.50  434.78  455.30  475.60  478.90  479.80  ±3.20%       20
```

**Key Columns:**
- **hz**: Operations per second (higher is better)
- **mean**: Average time in milliseconds
- **p99**: 99th percentile (1% of operations are slower)
- **rme**: Relative margin of error

### Performance Report

When using `PerformanceProfiler.exportHTML()`:

```html
=== Performance Report ===

FPS Metrics:
- Average FPS: 58.2
- Min FPS: 45
- Janky Frames: 3
- Long Tasks: 1

Memory Usage:
- Initial: 45.2 MB
- Peak: 156.8 MB
- Leaked: 0.8 MB

Render Performance:
- Component: MessageList
- Render Count: 25
- Last Duration: 42.5ms
```

### Warning Indicators

**🔴 Critical Issues:**
- FPS < 30
- Render time > 100ms
- Memory leak > 5MB
- Layout recalculations > 100

**🟡 Performance Warnings:**
- FPS 30-45
- Render time 50-100ms
- Memory leak 1-5MB
- Layout recalculations 50-100

**🟢 Good Performance:**
- FPS > 55
- Render time < 50ms
- Memory leak < 1MB
- Layout recalculations < 50

## Device Simulation

### Low-End Device Testing

```typescript
import { createDeviceSimulator, DEVICE_PROFILES } from './utils/profiling/device-simulation'

const simulator = createDeviceSimulator(DEVICE_PROFILES.lowEnd)
simulator.start()

// Run your benchmarks
// ...

simulator.stop()
```

### Custom Device Profile

```typescript
const customProfile = {
  cpuThrottleFactor: 6,      // 6x CPU slowdown
  maxMemoryMB: 256,          // 256MB memory limit
  networkProfile: {
    name: 'Slow 2G',
    downloadSpeed: 250 * 1024,  // 250 Kbps
    uploadSpeed: 250 * 1024,
    latency: 800,
    packetLoss: 0,
  },
  viewport: {
    name: 'Small Mobile',
    width: 320,
    height: 568,
    devicePixelRatio: 2,
  },
}

const simulator = createDeviceSimulator(customProfile)
```

### Network Profiles

Available network profiles:
- `offline`: No connectivity
- `slow3G`: 400 Kbps, 400ms latency
- `fast3G`: 1.6 Mbps, 150ms latency
- `slow4G`: 4 Mbps, 100ms latency
- `fast4G`: 10 Mbps, 50ms latency
- `wifi`: 30 Mbps, 10ms latency

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Performance Benchmarks

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0' # Weekly

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run benchmarks
        run: |
          cd packages/react
          pnpm vitest bench --reporter=json --outputFile=benchmark-results.json

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: benchmark-results
          path: packages/react/benchmark-results.json

      - name: Compare with baseline
        run: |
          node scripts/compare-benchmarks.js \
            baseline-benchmark-results.json \
            benchmark-results.json
```

### Regression Detection

Create a script to compare benchmark results:

```javascript
// scripts/compare-benchmarks.js
const baseline = require('../baseline-benchmark-results.json')
const current = require('../benchmark-results.json')

const REGRESSION_THRESHOLD = 0.1 // 10% slower is a regression

function detectRegressions(baseline, current) {
  const regressions = []

  for (const [name, baselineResult] of Object.entries(baseline)) {
    const currentResult = current[name]
    if (!currentResult) continue

    const baselineMean = baselineResult.mean
    const currentMean = currentResult.mean
    const delta = (currentMean - baselineMean) / baselineMean

    if (delta > REGRESSION_THRESHOLD) {
      regressions.push({
        name,
        baselineMean,
        currentMean,
        delta: (delta * 100).toFixed(2) + '%',
      })
    }
  }

  return regressions
}

const regressions = detectRegressions(baseline, current)

if (regressions.length > 0) {
  console.error('❌ Performance regressions detected:')
  regressions.forEach(r => {
    console.error(`  ${r.name}: ${r.baselineMean}ms → ${r.currentMean}ms (+${r.delta})`)
  })
  process.exit(1)
} else {
  console.log('✅ No performance regressions detected')
}
```

## Best Practices

### Running Benchmarks

1. **Close unnecessary applications** to reduce noise
2. **Run multiple times** to account for variance
3. **Use consistent hardware** for comparison
4. **Disable power-saving modes** on laptops
5. **Clear cache** between runs if testing cold starts

### Benchmark Design

1. **Test realistic scenarios** (e.g., actual message counts)
2. **Isolate what you're measuring** (render vs layout vs paint)
3. **Use production builds** for accurate results
4. **Warm up** before measuring (first render is often slower)
5. **Measure what matters** (user-perceived performance)

### Performance Optimization Workflow

1. **Establish baseline** - Run benchmarks on current code
2. **Identify bottlenecks** - Use profiler to find slow code
3. **Make changes** - Implement optimizations
4. **Re-benchmark** - Verify improvements
5. **Document** - Record results and reasoning

### Common Pitfalls

❌ **Don't:**
- Test in development mode (slower than production)
- Compare results across different machines
- Optimize prematurely without profiling
- Focus solely on micro-optimizations
- Ignore real-world usage patterns

✅ **Do:**
- Profile first, optimize second
- Test on target devices (low-end mobile)
- Measure user-perceived performance
- Consider network conditions
- Monitor memory leaks

## Baseline Results

### Example Baseline (MacBook Pro M1, 16GB RAM)

#### Long Message List
| Messages | Non-Virtualized | Virtualized | Memory (Non-V) | Memory (V) |
|----------|----------------|-------------|----------------|------------|
| 100      | 45ms           | 38ms        | 12MB           | 8MB        |
| 500      | 220ms          | 42ms        | 55MB           | 15MB       |
| 1000     | 450ms          | 48ms        | 110MB          | 22MB       |
| 5000     | 2300ms         | 65ms        | 520MB          | 45MB       |

#### Streaming Performance
| Tokens/Sec | Simple | Batched | RAF-Based | FPS    |
|------------|--------|---------|-----------|--------|
| 10         | 8ms    | 7ms     | 6ms       | 60     |
| 50         | 35ms   | 15ms    | 12ms      | 58     |
| 100        | 70ms   | 25ms    | 18ms      | 55     |
| 200        | 140ms  | 45ms    | 32ms      | 50     |

#### Concurrent Streams
| Streams | Simple | Batched | Memory | Leaked |
|---------|--------|---------|--------|--------|
| 1       | 25ms   | 20ms    | 15MB   | 0.2MB  |
| 2       | 45ms   | 35ms    | 28MB   | 0.4MB  |
| 5       | 110ms  | 75ms    | 65MB   | 0.8MB  |
| 10      | 220ms  | 140ms   | 125MB  | 1.2MB  |

## Troubleshooting

### High Memory Usage

**Problem:** Memory usage exceeds budget

**Solutions:**
1. Enable virtualization for long lists
2. Implement batching for streaming
3. Clean up event listeners on unmount
4. Use `React.memo` for expensive components
5. Profile with Chrome DevTools Memory panel

### Low FPS During Streaming

**Problem:** FPS drops below 30 during streaming

**Solutions:**
1. Implement batching (batch size 5-10)
2. Use `requestAnimationFrame` for updates
3. Debounce/throttle state updates
4. Reduce render overhead (memoization)
5. Profile with Chrome DevTools Performance panel

### Layout Thrashing

**Problem:** Many forced synchronous layouts

**Solutions:**
1. Batch DOM reads before writes
2. Use `requestAnimationFrame` for reads
3. Cache layout values
4. Avoid reading layout properties in loops
5. Use CSS transforms instead of position changes

## Resources

- [Vitest Benchmark Guide](https://vitest.dev/guide/features.html#benchmarking)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Web Vitals](https://web.dev/vitals/)
- [React Profiler API](https://react.dev/reference/react/Profiler)

## Contributing

To add new benchmarks:

1. Create file in `src/__benchmarks__/`
2. Follow naming convention: `*.bench.tsx`
3. Use `PerformanceProfiler` for profiling
4. Document expected results
5. Update this guide with new benchmark

---

**Last Updated:** January 2026
**Benchmark Suite Version:** 1.0.0
