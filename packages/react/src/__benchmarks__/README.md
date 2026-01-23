# Performance Benchmarks

This directory contains comprehensive performance benchmarks for streaming and virtualization features.

## Available Benchmarks

### 1. Long Message List (`long-message-list.bench.tsx`)
Tests rendering performance with varying message counts (100-5000 messages).
```bash
pnpm bench:long-list
```

### 2. Streaming Performance (`streaming.bench.tsx`)
Tests streaming at different token rates (10-200 tokens/sec).
```bash
pnpm bench:streaming
```

### 3. Virtualization (`virtualization.bench.tsx`)
Tests virtualization at different thresholds and scroll performance.
```bash
pnpm bench:virtualization
```

### 4. Concurrent Streams (`concurrent-streams.bench.tsx`)
Tests multiple simultaneous streams (1-10 concurrent).
```bash
pnpm bench:concurrent
```

### 5. Layout Thrashing (`layout-thrashing.bench.tsx`)
Detects and measures layout thrashing patterns.
```bash
pnpm bench:layout
```

## Quick Start

```bash
# Run all benchmarks
pnpm bench

# Run specific benchmark
pnpm bench:streaming

# Export results to JSON
pnpm bench:json
```

## Documentation

See [benchmarks.md](../../benchmarks.md) for comprehensive documentation on:
- Running benchmarks
- Interpreting results
- Performance budgets
- Device simulation
- CI/CD integration

## Profiling Tools

### PerformanceProfiler
Located at `../utils/profiling/performance-profiler.ts`

Provides:
- Render timing measurement
- Layout recalculation tracking
- Memory snapshots
- FPS measurement
- Report export (JSON, HTML, Markdown)

### DeviceSimulator
Located at `../utils/profiling/device-simulation.ts`

Provides:
- CPU throttling
- Memory constraints
- Network throttling
- Viewport simulation

## Example Usage

```typescript
import { PerformanceProfiler } from '../utils/profiling/performance-profiler'
import { createDeviceSimulator, DEVICE_PROFILES } from '../utils/profiling/device-simulation'

const profiler = new PerformanceProfiler()
profiler.start()

// Measure render
const endRender = profiler.measureRender('MyComponent')
// ... render component
endRender()

// Simulate low-end device
const simulator = createDeviceSimulator(DEVICE_PROFILES.lowEnd)
simulator.start()

// Stop and generate report
profiler.stop()
const report = profiler.exportHTML()
```

## Performance Budgets

| Metric              | Target  | Acceptable | Critical |
|---------------------|---------|------------|----------|
| Initial render      | < 50ms  | < 100ms    | > 100ms  |
| FPS                 | 60      | 30+        | < 30     |
| Memory (1000 msgs)  | < 100MB | < 200MB    | > 200MB  |
| Memory leaked       | < 1MB   | < 5MB      | > 5MB    |

## Contributing

To add new benchmarks:

1. Create `*.bench.tsx` file in this directory
2. Use `PerformanceProfiler` for profiling
3. Follow existing benchmark patterns
4. Update this README
5. Update main benchmarks.md documentation
