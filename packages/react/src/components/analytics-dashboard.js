import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@clarity-chat/primitives';
const metricDefinitions = [
    {
        key: 'totalRevenue',
        label: 'Total Revenue',
        icon: '💰',
        format: (value) => (value != null ? formatCurrency(value) : '—'),
    },
    {
        key: 'conversionRate',
        label: 'Conversion Rate',
        icon: '🎯',
        format: (value) => (value != null ? `${value.toFixed(1)}%` : '—'),
    },
    {
        key: 'averageDealSize',
        label: 'Avg Deal Size',
        icon: '📈',
        format: (value) => (value != null ? formatCurrency(value) : '—'),
    },
    {
        key: 'averageSalesCycle',
        label: 'Sales Cycle',
        icon: '⏱️',
        format: (value) => (value != null ? `${Math.round(value)} days` : '—'),
    },
];
export function AnalyticsDashboard({ metrics, previousMetrics, leaderboard, insights, recentActivities, className, title = 'Analytics Overview', subtitle, }) {
    return (_jsxs("div", { className: cn('space-y-6 rounded-lg border border-border/50 bg-card/70 p-6 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] backdrop-blur-sm', className), children: [_jsxs("header", { className: "space-y-1", children: [_jsx("h2", { className: "text-2xl font-semibold text-foreground", children: title }), subtitle ? (_jsx("p", { className: "text-sm text-muted-foreground", children: subtitle })) : null] }), _jsx("section", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: metricDefinitions.map(({ key, label, icon, format }) => {
                    const value = metrics[key];
                    const previous = previousMetrics?.[key];
                    const change = calculateChange(value, previous);
                    return (_jsx(MetricCard, { icon: icon, label: label, value: format(value), change: change }, key));
                }) }), metrics.pipelineValue != null || metrics.winRate != null ? (_jsxs("section", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [metrics.pipelineValue != null ? (_jsx(PipelineSummary, { value: metrics.pipelineValue, previous: previousMetrics?.pipelineValue })) : null, metrics.winRate != null ? (_jsx(WinRateSummary, { value: metrics.winRate, previous: previousMetrics?.winRate })) : null] })) : null, leaderboard?.length ? (_jsxs("section", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [_jsx(Leaderboard, { entries: leaderboard }), _jsx(ActivityList, { activities: recentActivities })] })) : (_jsx(ActivityList, { activities: recentActivities })), _jsx(InsightsPanel, { insights: insights })] }));
}
function MetricCard({ icon, label, value, change, }) {
    const changeClass = change.direction === 'up'
        ? 'text-emerald-600 dark:text-emerald-400'
        : change.direction === 'down'
            ? 'text-red-600 dark:text-red-400'
            : 'text-muted-foreground';
    return (_jsxs("div", { className: "rounded-lg border border-border/50 bg-gradient-to-br from-background/70 via-background/40 to-accent/10 p-5 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] backdrop-blur-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-lg", children: icon }), change.direction !== 'none' ? (_jsxs("span", { className: cn('text-xs font-medium', changeClass), children: [change.direction === 'up' ? '▲' : '▼', " ", change.percent, "%"] })) : null] }), _jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: label }), _jsx("p", { className: "mt-1 text-2xl font-semibold text-foreground", children: value })] }));
}
function PipelineSummary({ value, previous, }) {
    const change = calculateChange(value, previous);
    return (_jsxs("div", { className: "rounded-lg border border-border/50 bg-card/80 p-5 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Pipeline Value" }), change.direction !== 'none' ? (_jsxs("span", { className: cn('text-xs font-medium', change.direction === 'up' ? 'text-emerald-600' : 'text-red-600'), children: [change.direction === 'up' ? '+' : '-', change.percent, "%"] })) : null] }), _jsx("p", { className: "mt-2 text-2xl font-semibold text-foreground", children: formatCurrency(value) }), _jsx("div", { className: "mt-4 h-2 w-full overflow-hidden rounded-full bg-muted", children: _jsx("div", { className: "h-full rounded-full bg-primary transition-all", style: { width: `${Math.min((value / 1_000_000) * 100, 100)}%` } }) }), _jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Showing active deals in pipeline. Target: $1M" })] }));
}
function WinRateSummary({ value, previous, }) {
    const change = calculateChange(value, previous);
    return (_jsxs("div", { className: "rounded-lg border border-border/50 bg-card/80 p-5 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", children: [_jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Win Rate" }), _jsxs("div", { className: "mt-2 flex items-baseline gap-2", children: [_jsxs("span", { className: "text-2xl font-semibold text-foreground", children: [value.toFixed(1), "%"] }), change.direction !== 'none' ? (_jsxs("span", { className: cn('text-xs font-medium', change.direction === 'up' ? 'text-emerald-600' : 'text-red-600'), children: [change.direction === 'up' ? '+' : '-', change.percent, "%"] })) : null] }), _jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Close rate for qualified opportunities." }), _jsxs("div", { className: "mt-4 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsx("span", { children: "Won deals" }), _jsx("span", { children: Math.round(value * 1.2) })] }), _jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsx("span", { children: "Lost deals" }), _jsx("span", { children: Math.round((100 - value) * 0.8) })] })] })] }));
}
function Leaderboard({ entries }) {
    if (!entries?.length) {
        return null;
    }
    return (_jsxs("div", { className: "rounded-lg border border-border/50 bg-card/80 p-5 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", children: [_jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Top Performers" }), _jsx("ul", { className: "mt-4 space-y-3", children: entries.map((entry, index) => (_jsxs("li", { className: "flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/60 px-3 py-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "font-medium text-muted-foreground", children: [index + 1, "."] }), _jsx("span", { className: "font-medium text-foreground", children: entry.label })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("span", { className: "font-semibold text-foreground", children: entry.value.toLocaleString() }), entry.change != null ? (_jsxs("span", { className: cn('text-xs font-medium', entry.trend === 'down' ? 'text-red-600' : 'text-emerald-600'), children: [entry.trend === 'down' ? '▼' : '▲', " ", entry.change, "%"] })) : null] })] }, entry.label))) })] }));
}
function ActivityList({ activities }) {
    if (!activities?.length) {
        return null;
    }
    return (_jsxs("div", { className: "rounded-lg border border-border/50 bg-card/80 p-5 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", children: [_jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Recent Activity" }), _jsx("ul", { className: "mt-4 space-y-3", children: activities.map((activity) => (_jsxs("li", { className: "rounded-lg border border-border/60 bg-background/60 px-3 py-2", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsx("span", { children: formatTimestamp(activity.timestamp) }), activity.owner ? (_jsx("span", { className: "font-medium text-foreground/80", children: activity.owner })) : null] }), _jsx("p", { className: "mt-1 text-sm text-foreground", children: activity.description }), activity.metadata ? (_jsx("div", { className: "mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground/90", children: Object.entries(activity.metadata).map(([key, value]) => (_jsxs("span", { className: "rounded-full bg-muted px-2 py-0.5", children: [key, ": ", value] }, key))) })) : null] }, activity.id))) })] }));
}
function InsightsPanel({ insights, }) {
    if (!insights?.length) {
        return null;
    }
    return (_jsxs("div", { className: "rounded-lg border border-primary/20 bg-primary/5 p-5 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", children: [_jsx("h3", { className: "text-sm font-semibold text-primary", children: "AI-Generated Insights" }), _jsx("ul", { className: "mt-3 space-y-3", children: insights.map((insight, index) => {
                    if (typeof insight === 'string') {
                        return (_jsxs("li", { className: "flex items-start gap-2 text-sm text-primary-foreground/90", children: [_jsx("span", { className: "mt-1 text-primary", children: "\u2022" }), _jsx("span", { children: insight })] }, index));
                    }
                    const color = insight.type === 'positive'
                        ? 'text-emerald-600'
                        : insight.type === 'risk'
                            ? 'text-red-600'
                            : 'text-primary-foreground/90';
                    return (_jsxs("li", { className: "space-y-1", children: [insight.title ? (_jsx("p", { className: cn('text-sm font-semibold', color), children: insight.title })) : null, _jsx("p", { className: "text-sm text-primary-foreground/80", children: insight.description })] }, index));
                }) })] }));
}
function calculateChange(current, previous) {
    if (current == null ||
        previous == null ||
        Number.isNaN(current) ||
        Number.isNaN(previous) ||
        previous === 0) {
        return { direction: 'none', percent: 0 };
    }
    const delta = ((current - previous) / Math.abs(previous)) * 100;
    if (Math.abs(delta) < 0.1) {
        return { direction: 'none', percent: 0 };
    }
    return {
        direction: delta > 0 ? 'up' : 'down',
        percent: Math.abs(delta).toFixed(1),
    };
}
function formatCurrency(value) {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: value >= 1000 ? 0 : 2,
    }).format(value);
}
function formatTimestamp(value) {
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) {
        return value.toString();
    }
    return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
//# sourceMappingURL=analytics-dashboard.js.map