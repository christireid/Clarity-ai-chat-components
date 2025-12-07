import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { TokenOptimizationPanel } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/Analytics/TokenOptimizationPanel',
    component: TokenOptimizationPanel,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# Token Optimization Panel

Displays comprehensive token optimization statistics with real-time monitoring. Shows token savings, cache performance, and detailed breakdowns.

## Features

- **Real-time Stats**: Live token usage and savings
- **Cache Metrics**: Cache hit rates and performance
- **Routing Stats**: Model routing efficiency
- **Cost Savings**: Dollar amount saved
- **Responsive Sizes**: SM, MD, LG variants

## Use Cases

- Admin dashboards
- Developer tools
- Performance monitoring
- Cost optimization tracking
`,
            },
        },
    },
    argTypes: {
        showDetails: {
            control: 'boolean',
            description: 'Show detailed token breakdown',
            table: { defaultValue: { summary: 'true' } },
        },
        showCacheStats: {
            control: 'boolean',
            description: 'Show cache performance metrics',
            table: { defaultValue: { summary: 'true' } },
        },
        showRoutingStats: {
            control: 'boolean',
            description: 'Show model routing statistics',
            table: { defaultValue: { summary: 'true' } },
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size variant',
            table: { defaultValue: { summary: 'md' } },
        },
    },
};
export default meta;
// ============================================================================
// Mock Data
// ============================================================================
const mockStatsLow = {
    totalTokens: 1200,
    tokensSaved: 150,
    costSaved: 0.0045,
    cacheHits: 5,
    cacheMisses: 20,
    routedToSmaller: 2,
    compressionRatio: 0.12,
};
const mockStatsMedium = {
    totalTokens: 15000,
    tokensSaved: 4500,
    costSaved: 0.135,
    cacheHits: 85,
    cacheMisses: 45,
    routedToSmaller: 15,
    compressionRatio: 0.30,
};
const mockStatsHigh = {
    totalTokens: 50000,
    tokensSaved: 18000,
    costSaved: 0.54,
    cacheHits: 320,
    cacheMisses: 80,
    routedToSmaller: 65,
    compressionRatio: 0.36,
};
const mockStatsEnterprise = {
    totalTokens: 500000,
    tokensSaved: 185000,
    costSaved: 5.55,
    cacheHits: 3200,
    cacheMisses: 800,
    routedToSmaller: 450,
    compressionRatio: 0.37,
};
// ============================================================================
// Basic Examples
// ============================================================================
export const Default = {
    args: {
        stats: mockStatsMedium,
        showDetails: true,
        showCacheStats: true,
        showRoutingStats: true,
        size: 'md',
    },
};
export const SmallSize = {
    args: {
        stats: mockStatsLow,
        size: 'sm',
    },
};
export const LargeSize = {
    args: {
        stats: mockStatsHigh,
        size: 'lg',
    },
};
// ============================================================================
// Visibility Configurations
// ============================================================================
export const MinimalView = {
    args: {
        stats: mockStatsMedium,
        showDetails: false,
        showCacheStats: false,
        showRoutingStats: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'Minimal view showing only essential metrics.',
            },
        },
    },
};
export const CacheOnly = {
    args: {
        stats: mockStatsMedium,
        showDetails: false,
        showCacheStats: true,
        showRoutingStats: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'Focus on cache performance metrics.',
            },
        },
    },
};
export const RoutingOnly = {
    args: {
        stats: mockStatsMedium,
        showDetails: false,
        showCacheStats: false,
        showRoutingStats: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Focus on model routing statistics.',
            },
        },
    },
};
// ============================================================================
// Usage Levels
// ============================================================================
export const LowUsage = {
    args: {
        stats: mockStatsLow,
    },
    parameters: {
        docs: {
            description: {
                story: 'Panel with low usage statistics - early stage project.',
            },
        },
    },
};
export const MediumUsage = {
    args: {
        stats: mockStatsMedium,
    },
    parameters: {
        docs: {
            description: {
                story: 'Panel with medium usage - growing application.',
            },
        },
    },
};
export const HighUsage = {
    args: {
        stats: mockStatsHigh,
    },
    parameters: {
        docs: {
            description: {
                story: 'Panel with high usage - production application.',
            },
        },
    },
};
export const EnterpriseUsage = {
    args: {
        stats: mockStatsEnterprise,
    },
    parameters: {
        docs: {
            description: {
                story: 'Panel with enterprise-level usage - large scale deployment.',
            },
        },
    },
};
// ============================================================================
// Real-Time Simulation
// ============================================================================
export const RealTimeUpdates = {
    render: () => {
        const [stats, setStats] = React.useState(mockStatsMedium);
        React.useEffect(() => {
            const interval = setInterval(() => {
                setStats((prev) => ({
                    totalTokens: prev.totalTokens + Math.floor(Math.random() * 500) + 100,
                    tokensSaved: prev.tokensSaved + Math.floor(Math.random() * 100) + 20,
                    costSaved: prev.costSaved + Math.random() * 0.01,
                    cacheHits: prev.cacheHits + Math.floor(Math.random() * 3),
                    cacheMisses: prev.cacheMisses + Math.floor(Math.random() * 2),
                    routedToSmaller: prev.routedToSmaller + Math.floor(Math.random() * 2),
                    compressionRatio: Math.min(0.5, prev.compressionRatio + Math.random() * 0.01),
                }));
            }, 2000);
            return () => clearInterval(interval);
        }, []);
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "p-4 bg-muted rounded-lg", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Stats update every 2 seconds to simulate real-time monitoring" }) }), _jsx(TokenOptimizationPanel, { stats: stats })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Live simulation of real-time stats updates.',
            },
        },
    },
};
// ============================================================================
// Comparison Examples
// ============================================================================
export const SideBySideComparison = {
    render: () => (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Development" }), _jsx(TokenOptimizationPanel, { stats: mockStatsLow, size: "sm" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Production" }), _jsx(TokenOptimizationPanel, { stats: mockStatsHigh, size: "sm" })] })] })),
    parameters: {
        docs: {
            description: {
                story: 'Compare optimization stats across environments.',
            },
        },
    },
};
// ============================================================================
// Interactive Demo
// ============================================================================
export const InteractiveDemo = {
    render: () => {
        const [stats, setStats] = React.useState(mockStatsLow);
        const [showDetails, setShowDetails] = React.useState(true);
        const [showCache, setShowCache] = React.useState(true);
        const [showRouting, setShowRouting] = React.useState(true);
        const simulateActivity = () => {
            setStats((prev) => ({
                totalTokens: prev.totalTokens + Math.floor(Math.random() * 1000) + 500,
                tokensSaved: prev.tokensSaved + Math.floor(Math.random() * 200) + 100,
                costSaved: prev.costSaved + Math.random() * 0.05,
                cacheHits: prev.cacheHits + Math.floor(Math.random() * 5) + 2,
                cacheMisses: prev.cacheMisses + Math.floor(Math.random() * 3),
                routedToSmaller: prev.routedToSmaller + Math.floor(Math.random() * 3) + 1,
                compressionRatio: Math.min(0.5, prev.compressionRatio + Math.random() * 0.05),
            }));
        };
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx("button", { onClick: simulateActivity, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90", children: "Simulate API Calls" }), _jsx("button", { onClick: () => setStats(mockStatsLow), className: "px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80", children: "Reset Stats" })] }), _jsxs("div", { className: "flex flex-wrap gap-4 p-4 bg-muted rounded-lg", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: showDetails, onChange: (e) => setShowDetails(e.target.checked) }), _jsx("span", { className: "text-sm", children: "Show Details" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: showCache, onChange: (e) => setShowCache(e.target.checked) }), _jsx("span", { className: "text-sm", children: "Show Cache Stats" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: showRouting, onChange: (e) => setShowRouting(e.target.checked) }), _jsx("span", { className: "text-sm", children: "Show Routing Stats" })] })] }), _jsx(TokenOptimizationPanel, { stats: stats, showDetails: showDetails, showCacheStats: showCache, showRoutingStats: showRouting })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo with simulated API activity and toggle controls.',
            },
        },
    },
};
//# sourceMappingURL=TokenOptimizationPanel.stories.js.map