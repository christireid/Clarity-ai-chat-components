/**
 * Performance Monitoring Utilities
 *
 * Hooks and utilities for monitoring and optimizing component performance.
 */
import * as React from 'react';
/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
    renderCount: number;
    renderTime: number;
    lastRenderTime: number;
    averageRenderTime: number;
}
/**
 * Hook to monitor component render performance
 */
export declare function useRenderPerformance(componentName: string): PerformanceMetrics;
/**
 * Hook to track why component re-rendered
 */
export declare function useWhyDidYouUpdate(name: string, props: Record<string, any>): void;
/**
 * Hook to measure component mount time
 */
export declare function useMountTime(componentName: string): void;
/**
 * Hook to detect slow renders
 */
export declare function useSlowRenderDetection(threshold?: number, onSlowRender?: (renderTime: number) => void): void;
/**
 * Performance report component
 */
export interface PerformanceReportProps {
    metrics: PerformanceMetrics;
    threshold?: number;
}
export declare const PerformanceReport: React.FC<PerformanceReportProps>;
/**
 * Hook for lazy loading components
 */
export declare function useLazyLoad<T>(loader: () => Promise<T>, deps?: React.DependencyList): {
    data: T | null;
    loading: boolean;
    error: Error | null;
};
/**
 * Hook to debounce expensive operations
 */
export declare function useDebouncePerformance<T>(value: T, delay?: number): T;
/**
 * Hook to throttle expensive operations
 */
export declare function useThrottlePerformance<T>(value: T, limit?: number): T;
/**
 * Memory leak detector
 */
export declare function useMemoryLeakDetector(componentName: string): void;
//# sourceMappingURL=use-performance.d.ts.map