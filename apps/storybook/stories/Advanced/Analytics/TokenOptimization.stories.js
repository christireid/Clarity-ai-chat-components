import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { TokenOptimizationPanel, TokenOptimizationBadge, TokenOptimizationDashboard, } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/Analytics/TokenOptimization',
    component: TokenOptimizationDashboard,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Visual components for monitoring and communicating token efficiency across your AI stack. Pair with the `useTokenOptimization` hook to drive live metrics.',
            },
        },
    },
};
export default meta;
const sampleStats = {
    tokensSaved: 14850,
    percentageSaved: 34.2,
    cacheHits: 312,
    cacheMisses: 88,
    requestsThrottled: 56,
    simpleModelRoutes: 214,
    complexModelRoutes: 96,
    costSavings: 0.742,
};
const sampleMetrics = {
    totalTokens: 52842,
    tokensSaved: 14850,
    costSaved: 0.742,
    savingsPercent: 34.2,
    breakdown: {
        promptCompression: { tokens: 4650, percent: 18.5 },
        caching: { hits: 312, savings: 6100 },
        modelRouting: { savings: 2850, percent: 12.0 },
        responseLimiting: { tokens: 1320, percent: 5.4 },
        batching: { requests: 42, savings: 560 },
        throttling: { callsSaved: 78 },
        referencing: { bytesSaved: 58200, percent: 24.8 },
    },
};
const TokenOptimizationPanelDemo = () => {
    const [showDetails, setShowDetails] = React.useState(true);
    const [showRouting, setShowRouting] = React.useState(true);
    const [statistics, setStatistics] = React.useState(sampleStats);
    React.useEffect(() => {
        const interval = setInterval(() => {
            setStatistics((prev) => ({
                ...prev,
                tokensSaved: prev.tokensSaved + Math.floor(Math.random() * 25),
                percentageSaved: prev.percentageSaved + Math.random() * 0.05,
                cacheHits: prev.cacheHits + Math.floor(Math.random() * 5),
                requestsThrottled: prev.requestsThrottled + Math.floor(Math.random() * 2),
            }));
        }, 4000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(TokenOptimizationPanel, { stats: statistics, showDetails: showDetails, showRoutingStats: showRouting, showCacheStats: true }), _jsxs("div", { className: "flex flex-wrap gap-3 text-xs", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: showDetails, onChange: (event) => setShowDetails(event.currentTarget.checked) }), "Show detailed breakdown"] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: showRouting, onChange: (event) => setShowRouting(event.currentTarget.checked) }), "Include routing analytics"] })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Tip: Drive these numbers from `useTokenOptimization` to monitor production behaviour or surface cost savings to customers." })] }));
};
const TokenOptimizationDashboardLive = () => {
    const [metrics, setMetrics] = React.useState(sampleMetrics);
    const [realTime, setRealTime] = React.useState(true);
    React.useEffect(() => {
        if (!realTime)
            return;
        const interval = setInterval(() => {
            setMetrics((prev) => {
                const delta = Math.random() * 0.25;
                return {
                    ...prev,
                    tokensSaved: prev.tokensSaved + Math.floor(Math.random() * 120),
                    costSaved: prev.costSaved + delta / 100,
                    savingsPercent: Math.min(40, prev.savingsPercent + delta),
                    breakdown: {
                        ...prev.breakdown,
                        promptCompression: {
                            ...prev.breakdown.promptCompression,
                            tokens: prev.breakdown.promptCompression.tokens + Math.floor(Math.random() * 40),
                        },
                        caching: {
                            ...prev.breakdown.caching,
                            hits: prev.breakdown.caching.hits + Math.floor(Math.random() * 4),
                            savings: prev.breakdown.caching.savings + Math.floor(Math.random() * 70),
                        },
                        modelRouting: {
                            ...prev.breakdown.modelRouting,
                            savings: prev.breakdown.modelRouting.savings + Math.floor(Math.random() * 60),
                        },
                    },
                };
            });
        }, 3500);
        return () => clearInterval(interval);
    }, [realTime]);
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(TokenOptimizationDashboard, { metrics: metrics, realTime: realTime, showBreakdown: true, refreshInterval: 3000 }), _jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsx("span", { children: realTime
                            ? 'Streaming live metrics for dashboard-grade monitoring.'
                            : 'Real-time updates paused. Metrics frozen for analysis.' }), _jsx("button", { type: "button", onClick: () => setRealTime((value) => !value), className: "rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:text-primary", children: realTime ? 'Pause live updates' : 'Resume live updates' })] })] }));
};
export const Panel = {
    render: () => _jsx(TokenOptimizationPanelDemo, {}),
    name: 'Optimization Panel',
    parameters: {
        docs: {
            description: {
                story: 'Compact panel ideal for sidebars or admin surfaces. Highlights tokens saved, cache performance, routing decisions, and throttling activity.',
            },
        },
    },
};
export const Dashboard = {
    render: () => _jsx(TokenOptimizationDashboardLive, {}),
    name: 'Optimization Dashboard',
    parameters: {
        docs: {
            description: {
                story: 'Full dashboard experience with KPI cards, optimization breakdowns, and optional real-time indicators. Embed inside executive views or cost analytics workflows.',
            },
        },
    },
};
export const Badge = {
    render: () => (_jsxs("div", { className: "space-y-3", children: [_jsx(TokenOptimizationBadge, { tokensSaved: 14850, savingsPercent: 34.2 }), _jsx(TokenOptimizationBadge, { tokensSaved: 4250, savingsPercent: 12.6, className: "bg-success/5" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Pair the badge with messaging inside chat transcripts to communicate efficiency wins back to end users or stakeholders." })] })),
    name: 'Savings Badge',
    parameters: {
        docs: {
            description: {
                story: 'Lightweight badge for surfacing savings inline — e.g., after exporting transcripts or at the end of conversations.',
            },
        },
    },
};
//# sourceMappingURL=TokenOptimization.stories.js.map