'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '@clarity-chat/primitives';
import { Skeleton as BaseSkeleton } from './skeleton';
import { DURATION_SECONDS as durations } from '../../animations/constants';
/**
 * Hook to announce loading state changes to screen readers.
 *
 * Announces when loading completes, not just when it starts.
 * Uses polite aria-live to avoid interrupting current announcements.
 *
 * @example
 * ```tsx
 * function Dashboard({ isLoading, data }) {
 *   const announcement = useLoadingAnnouncement(isLoading, 'Dashboard')
 *
 *   return (
 *     <div>
 *       {announcement}
 *       {isLoading ? <Skeleton /> : <Content data={data} />}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLoadingAnnouncement(isLoading, contentName = 'Content') {
    const [announcement, setAnnouncement] = React.useState('');
    const wasLoadingRef = React.useRef(isLoading);
    React.useEffect(() => {
        // Announce when loading completes (transition from loading to not loading)
        if (wasLoadingRef.current && !isLoading) {
            setAnnouncement(`${contentName} loaded successfully`);
            // Clear announcement after screen reader has time to read it
            const timer = setTimeout(() => setAnnouncement(''), 1000);
            wasLoadingRef.current = isLoading;
            return () => clearTimeout(timer);
        }
        wasLoadingRef.current = isLoading;
        return undefined;
    }, [isLoading, contentName]);
    if (!announcement)
        return null;
    return (_jsx("div", { role: "status", "aria-live": "polite", "aria-atomic": "true", className: "sr-only", children: announcement }));
}
/**
 * Component that announces loading state changes.
 * Alternative to the hook for class components or simpler usage.
 *
 * @example
 * ```tsx
 * <LoadingAnnouncer isLoading={isLoading} contentName="Analytics Dashboard" />
 * ```
 */
export function LoadingAnnouncer({ isLoading, contentName = 'Content', }) {
    const announcement = useLoadingAnnouncement(isLoading, contentName);
    return _jsx(_Fragment, { children: announcement });
}
LoadingAnnouncer.displayName = 'LoadingAnnouncer';
/**
 * Animation variants for state transitions.
 * Uses fade and subtle scale for smooth transitions.
 */
const stateTransitionVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};
const stateTransitionConfig = {
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
    variants: stateTransitionVariants,
    transition: { duration: durations.normal, ease: 'easeOut' },
};
/**
 * Wrapper component that handles animated transitions between
 * loading, error, and content states for dashboards.
 *
 * Uses Framer Motion for smooth fade transitions.
 * Respects prefers-reduced-motion automatically.
 *
 * @example
 * ```tsx
 * <DashboardStateTransition
 *   isLoading={isLoading}
 *   error={error}
 *   skeleton={<AnalyticsDashboardSkeleton />}
 *   dashboardName="Analytics"
 * >
 *   <AnalyticsDashboard data={data} />
 * </DashboardStateTransition>
 * ```
 */
export function DashboardStateTransition({ isLoading, error, children, skeleton, errorComponent, dashboardName = 'Dashboard', animate = true, className, }) {
    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const shouldAnimate = animate && !prefersReducedMotion;
    // Generate unique key for AnimatePresence
    const stateKey = isLoading ? 'loading' : error ? 'error' : 'content';
    // Default error component
    const defaultErrorComponent = error && (_jsxs("div", { className: "flex flex-col items-center justify-center gap-3 text-center py-8 px-4 rounded-lg border border-destructive/30 bg-destructive/5", role: "alert", "aria-live": "assertive", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10", children: _jsx("svg", { className: "h-5 w-5 text-destructive", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }), _jsxs("div", { className: "space-y-1", children: [_jsxs("p", { className: "text-sm font-medium text-foreground", children: ["Failed to load ", dashboardName.toLowerCase()] }), _jsx("p", { className: "text-xs text-muted-foreground", children: error instanceof Error ? error.message : String(error) })] })] }));
    // Import AnimatePresence dynamically to avoid SSR issues
    // For now, we'll use a simpler CSS-based approach that works universally
    const content = isLoading
        ? skeleton
        : error
            ? errorComponent || defaultErrorComponent
            : children;
    if (!shouldAnimate) {
        return (_jsxs("div", { className: className, children: [_jsx(LoadingAnnouncer, { isLoading: isLoading, contentName: dashboardName }), content] }));
    }
    return (_jsxs("div", { className: className, children: [_jsx(LoadingAnnouncer, { isLoading: isLoading, contentName: dashboardName }), _jsx("div", { className: "animate-in fade-in-0 slide-in-from-bottom-2 duration-200", children: content }, stateKey)] }));
}
DashboardStateTransition.displayName = 'DashboardStateTransition';
// Export the variants for custom usage
export { stateTransitionVariants, stateTransitionConfig };
/**
 * Internal skeleton wrapper that uses the main Skeleton component.
 * Provides a simpler interface for dashboard skeletons.
 */
function Skeleton({ className, animate = true, ...props }) {
    return (_jsx(BaseSkeleton, { variant: animate ? 'pulse' : 'none', className: className, ...props }));
}
/**
 * Skeleton for a single metric card.
 * Matches the structure of MetricCard in analytics-dashboard.
 */
export function MetricCardSkeleton({ className, animate = true, }) {
    return (_jsxs("div", { className: cn('rounded-lg border border-border/50 bg-gradient-to-br from-background/70 via-background/40 to-accent/10 p-5 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]', className), role: "presentation", "aria-label": "Loading metric", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Skeleton, { className: "h-6 w-6 rounded", animate: animate }), _jsx(Skeleton, { className: "h-4 w-12", animate: animate })] }), _jsx(Skeleton, { className: "mt-4 h-4 w-24", animate: animate }), _jsx(Skeleton, { className: "mt-2 h-8 w-32", animate: animate })] }));
}
MetricCardSkeleton.displayName = 'MetricCardSkeleton';
/**
 * Skeleton for progress bar widgets.
 * Used in usage dashboards and optimization displays.
 */
export function ProgressWidgetSkeleton({ className, animate = true, }) {
    return (_jsxs("div", { className: cn('rounded-lg border border-border/50 bg-card/80 p-5', className), role: "presentation", "aria-label": "Loading progress widget", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Skeleton, { className: "h-4 w-24", animate: animate }), _jsx(Skeleton, { className: "h-4 w-12", animate: animate })] }), _jsx(Skeleton, { className: "mt-3 h-2 w-full rounded-full", animate: animate }), _jsx(Skeleton, { className: "mt-2 h-3 w-48", animate: animate })] }));
}
ProgressWidgetSkeleton.displayName = 'ProgressWidgetSkeleton';
/**
 * Skeleton for list/leaderboard items.
 */
export function ListItemSkeleton({ className, animate = true, }) {
    return (_jsxs("div", { className: cn('flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/60 px-3 py-2', className), role: "presentation", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { className: "h-5 w-5", animate: animate }), _jsx(Skeleton, { className: "h-4 w-32", animate: animate })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Skeleton, { className: "h-5 w-16", animate: animate }), _jsx(Skeleton, { className: "h-4 w-10", animate: animate })] })] }));
}
ListItemSkeleton.displayName = 'ListItemSkeleton';
/**
 * Skeleton for chart/visualization areas.
 */
export function ChartSkeleton({ className, animate = true, height = 200, }) {
    return (_jsxs("div", { className: cn('rounded-lg border border-border/50 bg-card/80 p-5', className), role: "presentation", "aria-label": "Loading chart", children: [_jsx(Skeleton, { className: "h-4 w-32 mb-4", animate: animate }), _jsx(Skeleton, { className: "w-full rounded-lg", style: { height }, animate: animate })] }));
}
ChartSkeleton.displayName = 'ChartSkeleton';
/**
 * Full Analytics Dashboard skeleton.
 * Matches the layout of AnalyticsDashboard component.
 *
 * @example
 * ```tsx
 * {isLoading ? <AnalyticsDashboardSkeleton /> : <AnalyticsDashboard {...props} />}
 * ```
 */
export function AnalyticsDashboardSkeleton({ className, animate = true, }) {
    return (_jsxs("div", { className: cn('space-y-6 rounded-lg border border-border/50 bg-card/70 p-6', className), role: "status", "aria-label": "Loading analytics dashboard", "aria-busy": "true", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(Skeleton, { className: "h-7 w-48", animate: animate }), _jsx(Skeleton, { className: "h-4 w-64", animate: animate })] }), _jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: Array.from({ length: 4 }).map((_, i) => (_jsx(MetricCardSkeleton, { animate: animate }, i))) }), _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsx(ProgressWidgetSkeleton, { animate: animate }), _jsx(ProgressWidgetSkeleton, { animate: animate })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [_jsxs("div", { className: "rounded-lg border border-border/50 bg-card/80 p-5", children: [_jsx(Skeleton, { className: "h-5 w-32 mb-4", animate: animate }), _jsx("div", { className: "space-y-3", children: Array.from({ length: 3 }).map((_, i) => (_jsx(ListItemSkeleton, { animate: animate }, i))) })] }), _jsxs("div", { className: "rounded-lg border border-border/50 bg-card/80 p-5", children: [_jsx(Skeleton, { className: "h-5 w-32 mb-4", animate: animate }), _jsx("div", { className: "space-y-3", children: Array.from({ length: 3 }).map((_, i) => (_jsx(ListItemSkeleton, { animate: animate }, i))) })] })] }), _jsx("span", { className: "sr-only", children: "Loading dashboard data, please wait..." })] }));
}
AnalyticsDashboardSkeleton.displayName = 'AnalyticsDashboardSkeleton';
/**
 * Usage Dashboard skeleton.
 * Matches the layout of UsageDashboard component.
 */
export function UsageDashboardSkeleton({ className, animate = true, }) {
    return (_jsxs("div", { className: cn('rounded-xl border bg-card h-full flex flex-col', className), role: "status", "aria-label": "Loading usage dashboard", "aria-busy": "true", children: [_jsx("div", { className: "p-6 pb-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Skeleton, { className: "h-6 w-40", animate: animate }), _jsx(Skeleton, { className: "h-5 w-20 rounded-full", animate: animate })] }), _jsx(Skeleton, { className: "h-4 w-56", animate: animate })] }), _jsx(Skeleton, { className: "h-8 w-24 rounded-md", animate: animate })] }) }), _jsx("div", { className: "flex-1 overflow-hidden px-6 pb-6", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx(Skeleton, { className: "h-4 w-28", animate: animate }), _jsxs("div", { className: "text-right space-y-1", children: [_jsx(Skeleton, { className: "h-7 w-20", animate: animate }), _jsx(Skeleton, { className: "h-3 w-24", animate: animate })] })] }), _jsx(Skeleton, { className: "h-3 w-full rounded-full", animate: animate })] }), _jsxs("div", { children: [_jsx(Skeleton, { className: "h-4 w-32 mb-3", animate: animate }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: Array.from({ length: 6 }).map((_, i) => (_jsxs("div", { className: "p-4 rounded-xl border border-border/40", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Skeleton, { className: "h-8 w-8", animate: animate }), _jsxs("div", { className: "flex-1 space-y-1", children: [_jsx(Skeleton, { className: "h-3 w-16", animate: animate }), _jsx(Skeleton, { className: "h-5 w-12", animate: animate })] })] }), _jsx(Skeleton, { className: "h-1.5 w-full rounded-full", animate: animate })] }, i))) })] }), _jsxs("div", { children: [_jsx(Skeleton, { className: "h-4 w-28 mb-3", animate: animate }), _jsx("div", { className: "space-y-2", children: Array.from({ length: 3 }).map((_, i) => (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40", children: [_jsxs("div", { className: "flex-1 space-y-1", children: [_jsx(Skeleton, { className: "h-4 w-24", animate: animate }), _jsx(Skeleton, { className: "h-3 w-32", animate: animate })] }), _jsx(Skeleton, { className: "h-4 w-16", animate: animate })] }, i))) })] })] }) }), _jsx("span", { className: "sr-only", children: "Loading usage data, please wait..." })] }));
}
UsageDashboardSkeleton.displayName = 'UsageDashboardSkeleton';
/**
 * Token Optimization Dashboard skeleton.
 */
export function TokenOptimizationDashboardSkeleton({ className, animate = true, }) {
    return (_jsxs("div", { className: cn('p-6 bg-card rounded-lg border border-border/50', className), role: "status", "aria-label": "Loading token optimization dashboard", "aria-busy": "true", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-5 w-40", animate: animate }), _jsx(Skeleton, { className: "h-4 w-56", animate: animate })] }), _jsx(Skeleton, { className: "h-4 w-12", animate: animate })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: Array.from({ length: 3 }).map((_, i) => (_jsxs("div", { className: "p-4 rounded-lg border border-border/30", children: [_jsx(Skeleton, { className: "h-7 w-24 mb-2", animate: animate }), _jsx(Skeleton, { className: "h-4 w-20", animate: animate }), _jsx(Skeleton, { className: "h-3 w-28 mt-2", animate: animate })] }, i))) }), _jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { className: "h-4 w-40 mb-3", animate: animate }), Array.from({ length: 4 }).map((_, i) => (_jsxs("div", { className: "flex items-center gap-3 p-3 bg-muted/50 rounded-lg", children: [_jsx(Skeleton, { className: "h-8 w-8", animate: animate }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx(Skeleton, { className: "h-4 w-32", animate: animate }), _jsx(Skeleton, { className: "h-4 w-16", animate: animate })] }), _jsx(Skeleton, { className: "h-3 w-48", animate: animate }), _jsx(Skeleton, { className: "h-1.5 w-full rounded-full mt-2", animate: animate })] })] }, i)))] }), _jsx("span", { className: "sr-only", children: "Loading optimization data, please wait..." })] }));
}
TokenOptimizationDashboardSkeleton.displayName =
    'TokenOptimizationDashboardSkeleton';
/**
 * Performance Dashboard skeleton.
 */
export function PerformanceDashboardSkeleton({ className, animate = true, }) {
    return (_jsxs("div", { className: cn('p-4 rounded-lg border border-border bg-card', className), role: "status", "aria-label": "Loading performance dashboard", "aria-busy": "true", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx(Skeleton, { className: "h-5 w-40", animate: animate }), _jsx("div", { className: "flex gap-2", children: Array.from({ length: 3 }).map((_, i) => (_jsx(Skeleton, { className: "h-4 w-14", animate: animate }, i))) })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: Array.from({ length: 6 }).map((_, i) => (_jsxs("div", { className: "p-3 rounded-lg border border-border/50 bg-muted/30", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx(Skeleton, { className: "h-3 w-20", animate: animate }), _jsx(Skeleton, { className: "h-2 w-2 rounded-full", animate: animate })] }), _jsx(Skeleton, { className: "h-7 w-16", animate: animate })] }, i))) }), _jsx("span", { className: "sr-only", children: "Loading performance metrics, please wait..." })] }));
}
PerformanceDashboardSkeleton.displayName = 'PerformanceDashboardSkeleton';
export function DashboardEmptyState({ title, description, icon, actionLabel, onAction, className, }) {
    return (_jsxs("div", { className: cn('flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border/60 bg-muted/20 p-8 text-center', className), role: "status", "aria-label": title, children: [icon ? (_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-muted", children: icon })) : (_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-muted", children: _jsx("svg", { className: "h-6 w-6 text-muted-foreground", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) })), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: title }), _jsx("p", { className: "text-xs text-muted-foreground max-w-[280px]", children: description })] }), actionLabel && onAction && (_jsxs("button", { type: "button", onClick: onAction, className: "mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2", children: [actionLabel, _jsx("svg", { className: "h-3 w-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] }))] }));
}
DashboardEmptyState.displayName = 'DashboardEmptyState';
//# sourceMappingURL=dashboard-skeleton.js.map