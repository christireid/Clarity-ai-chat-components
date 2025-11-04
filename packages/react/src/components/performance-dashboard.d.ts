/**
 * Performance Monitoring Dashboard
 *
 * Visual dashboard for performance metrics
 */
export interface PerformanceDashboardProps {
    /**
     * Show detailed metrics
     */
    detailed?: boolean;
    /**
     * Update interval in ms
     */
    updateInterval?: number;
    /**
     * Custom className
     */
    className?: string;
}
/**
 * Performance Dashboard Component
 *
 * Real-time performance monitoring UI
 *
 * @example
 * ```tsx
 * <PerformanceDashboard
 *   detailed
 *   updateInterval={1000}
 * />
 * ```
 */
export declare function PerformanceDashboard({ detailed, updateInterval, className, }: PerformanceDashboardProps): import("react/jsx-runtime").JSX.Element;
/**
 * Compact Performance Badge
 *
 * Small performance indicator for corners
 */
export declare function PerformanceBadge({ className }: {
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=performance-dashboard.d.ts.map