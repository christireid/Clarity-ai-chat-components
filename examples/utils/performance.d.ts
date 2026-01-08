/**
 * Performance Monitoring Utilities
 *
 * Lightweight utilities for tracking performance metrics in demo applications.
 * Uses standard Web Performance APIs.
 *
 * @module performance
 */
export interface PerformanceMetrics {
    /** First Contentful Paint time in milliseconds */
    fcp: number | null;
    /** Largest Contentful Paint time in milliseconds */
    lcp: number | null;
    /** First Input Delay in milliseconds */
    fid: number | null;
    /** Cumulative Layout Shift score */
    cls: number | null;
    /** Time to First Byte in milliseconds */
    ttfb: number | null;
    /** DOM Content Loaded time in milliseconds */
    domContentLoaded: number | null;
    /** Full page load time in milliseconds */
    loadTime: number | null;
}
export interface RenderMetrics {
    /** Component name */
    componentName: string;
    /** Render count */
    renderCount: number;
    /** Average render time in milliseconds */
    avgRenderTime: number;
    /** Last render time in milliseconds */
    lastRenderTime: number;
}
export interface MemoryMetrics {
    /** Used JS heap size in bytes */
    usedJSHeapSize: number | null;
    /** Total JS heap size in bytes */
    totalJSHeapSize: number | null;
    /** JS heap size limit in bytes */
    jsHeapSizeLimit: number | null;
    /** Usage percentage */
    usagePercent: number | null;
}
type MetricsCallback = (metrics: Partial<PerformanceMetrics>) => void;
/**
 * Creates a Web Vitals observer that tracks Core Web Vitals metrics.
 *
 * @param callback - Function called when metrics are collected
 * @returns Cleanup function to stop observing
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   return observeWebVitals((metrics) => {
 *     console.log('Web Vitals:', metrics)
 *   })
 * }, [])
 * ```
 */
export declare function observeWebVitals(callback: MetricsCallback): () => void;
/**
 * Tracks render performance for a component.
 *
 * @param componentName - Name of the component being tracked
 * @returns Object with start and end functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const tracker = useRef(trackRender('MyComponent'))
 *
 *   useEffect(() => {
 *     tracker.current.start()
 *     // render logic
 *     tracker.current.end()
 *   })
 * }
 * ```
 */
export declare function trackRender(componentName: string): {
    start: () => void;
    end: () => number;
    getMetrics: () => RenderMetrics | null;
};
/**
 * Gets all render metrics for all tracked components.
 */
export declare function getAllRenderMetrics(): RenderMetrics[];
/**
 * Clears all render metrics.
 */
export declare function clearRenderMetrics(): void;
/**
 * Gets current memory usage metrics.
 * Only available in Chrome-based browsers.
 *
 * @returns Memory metrics or null if not supported
 */
export declare function getMemoryMetrics(): MemoryMetrics | null;
interface UsePerformanceOptions {
    /** Update interval in milliseconds */
    updateInterval?: number;
    /** Enable Web Vitals tracking */
    trackWebVitals?: boolean;
    /** Enable memory tracking */
    trackMemory?: boolean;
    /** Component name for render tracking */
    componentName?: string;
}
interface UsePerformanceResult {
    /** Web Vitals metrics */
    webVitals: Partial<PerformanceMetrics>;
    /** Memory metrics */
    memory: MemoryMetrics | null;
    /** Render metrics for this component */
    renderMetrics: RenderMetrics | null;
    /** All render metrics */
    allRenderMetrics: RenderMetrics[];
    /** FPS counter */
    fps: number;
    /** Mark render start */
    markRenderStart: () => void;
    /** Mark render end */
    markRenderEnd: () => number;
}
/**
 * Hook for tracking performance metrics.
 *
 * @param options - Configuration options
 * @returns Performance metrics and tracking functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { webVitals, memory, fps } = usePerformance({
 *     trackWebVitals: true,
 *     trackMemory: true,
 *   })
 *
 *   return (
 *     <div>
 *       <p>FPS: {fps}</p>
 *       <p>LCP: {webVitals.lcp}ms</p>
 *       <p>Memory: {memory?.usagePercent}%</p>
 *     </div>
 *   )
 * }
 * ```
 */
export declare function usePerformance(options?: UsePerformanceOptions): UsePerformanceResult;
/**
 * Formats bytes to human-readable string.
 */
export declare function formatBytes(bytes: number): string;
/**
 * Formats milliseconds to human-readable string.
 */
export declare function formatMs(ms: number): string;
export {};
//# sourceMappingURL=performance.d.ts.map