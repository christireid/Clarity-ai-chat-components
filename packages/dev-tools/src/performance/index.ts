/**
 * Performance utilities
 *
 * Provides profiling tools for both Node.js (CLI) and browser (React) environments.
 *
 * - profiler.ts: Node.js/CLI profiling (API timing, token throughput, streaming)
 * - browser/: Browser/React profiling (FPS, render timing, memory, device simulation)
 */

// Node.js/CLI profiler
export {
  Profiler,
  getProfiler,
  createProfiler,
  calculateTokenThroughput,
  type PerformanceMetrics,
  type StreamingMetrics,
} from './profiler'

// Browser/React profiler (with renamed createProfiler to avoid collision)
export {
  PerformanceProfiler,
  createProfiler as createBrowserProfiler,
  profiler as browserProfiler,
  type MemorySnapshot,
  type RenderTiming,
  type LayoutMetrics,
  type FPSMetrics,
  type PerformanceReport,
} from './browser/profiler'

// Device simulation
export {
  CPUThrottler,
  MemoryConstraints,
  NetworkThrottler,
  DeviceSimulator,
  createDeviceSimulator,
  NETWORK_PROFILES,
  VIEWPORT_SIZES,
  DEVICE_PROFILES,
  type NetworkProfile,
  type ViewportSize,
  type DeviceSimulationOptions,
} from './browser/device-simulation'
