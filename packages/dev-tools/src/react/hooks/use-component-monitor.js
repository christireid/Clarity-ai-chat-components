/**
 * React hook for Component Performance Monitor
 *
 * Tracks component renders and provides performance metrics, warnings,
 * and optimization recommendations.
 *
 * @module useComponentMonitor
 *
 * @example
 * ```tsx
 * import { useComponentMonitor } from '@clarity-chat/dev-tools'
 *
 * function MyComponent() {
 *   const { metrics, renderCount, warnings, onRender } = useComponentMonitor({
 *     componentName: 'MyComponent',
 *     trackProps: true,
 *     thresholds: { maxRenderTime: 16 }
 *   })
 *
 *   useEffect(() => {
 *     onRender() // Call at end of render
 *   })
 *
 *   return <div>{renderCount} renders</div>
 * }
 * ```
 */
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { getComponentMonitor, createComponentMonitor, } from '../../debug/component-monitor';
/**
 * Hook to monitor component render performance and detect optimization opportunities
 *
 * @param options - Configuration options for the monitor
 * @returns Object containing metrics, warnings, and control functions
 *
 * @see {@link ComponentMonitor} for the underlying implementation
 */
export function useComponentMonitor(options = {}) {
    const { componentName = 'Unknown', enabled = process.env.NODE_ENV === 'development', trackProps = true, trackState = true, thresholds, } = options;
    const monitor = React.useMemo(() => {
        if (thresholds) {
            const m = createComponentMonitor({ enabled, thresholds });
            return m;
        }
        return getComponentMonitor();
    }, [enabled, thresholds]);
    const instanceIdRef = React.useRef('');
    const renderStartRef = React.useRef(0);
    const prevPropsRef = React.useRef({});
    const renderCountRef = React.useRef(0);
    const [metrics, setMetrics] = React.useState(null);
    // Generate instance ID on mount
    React.useEffect(() => {
        if (!enabled)
            return;
        instanceIdRef.current = `${componentName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        monitor.onMount(componentName, instanceIdRef.current);
        // Subscribe to metrics updates
        const unsubscribe = monitor.addListener((updatedMetrics) => {
            if (updatedMetrics.instanceId === instanceIdRef.current) {
                setMetrics({ ...updatedMetrics });
            }
        });
        return () => {
            unsubscribe();
            if (instanceIdRef.current) {
                monitor.onUnmount(instanceIdRef.current);
            }
        };
    }, [componentName, enabled, monitor]);
    // Track render start
    renderStartRef.current = performance.now();
    // Record render on effect
    React.useEffect(() => {
        if (!enabled || !instanceIdRef.current)
            return;
        const duration = performance.now() - renderStartRef.current;
        renderCountRef.current++;
        monitor.onRender(instanceIdRef.current, duration, {
            phase: renderCountRef.current === 1 ? 'mount' : 'update',
        });
    });
    const onRender = React.useCallback(() => {
        if (!enabled || !instanceIdRef.current)
            return;
        const duration = performance.now() - renderStartRef.current;
        monitor.onRender(instanceIdRef.current, duration, {
            phase: 'update',
        });
    }, [enabled, monitor]);
    const getReport = React.useCallback(() => {
        monitor.printReport();
    }, [monitor]);
    return {
        metrics,
        renderCount: metrics?.renderCount ?? 0,
        avgRenderTime: metrics?.avgRenderTime ?? 0,
        warnings: metrics?.warnings ?? [],
        onRender,
        getReport,
    };
}
/**
 * Higher-order component for automatic performance monitoring
 */
export function withComponentMonitor(WrappedComponent, options) {
    const displayName = WrappedComponent.displayName ?? WrappedComponent.name ?? 'Unknown';
    function MonitoredComponent(props) {
        useComponentMonitor({
            componentName: displayName,
            ...options,
        });
        return _jsx(WrappedComponent, { ...props });
    }
    MonitoredComponent.displayName = `withComponentMonitor(${displayName})`;
    return MonitoredComponent;
}
export default useComponentMonitor;
//# sourceMappingURL=use-component-monitor.js.map