import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { TokenOptimizationBadge } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/Analytics/TokenOptimizationBadge',
    component: TokenOptimizationBadge,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# Token Optimization Badge

Compact badge displaying token savings and optimization status. Perfect for headers, toolbars, or anywhere space is limited.

## Features

- **Compact Display**: Minimal footprint
- **Token Savings**: Shows tokens saved
- **Cost Display**: Optional cost savings
- **Multiple Sizes**: SM, MD, LG variants
- **Status Indicator**: Visual optimization status

## Use Cases

- App headers and navigation
- Dashboard widgets
- Compact monitoring displays
- Status bars
`,
            },
        },
    },
    argTypes: {
        showCost: {
            control: 'boolean',
            description: 'Show cost savings',
            table: { defaultValue: { summary: 'false' } },
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Badge size',
            table: { defaultValue: { summary: 'md' } },
        },
    },
};
export default meta;
// ============================================================================
// Mock Data
// ============================================================================
const mockStats = {
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
    costSaved: 2.45,
    cacheHits: 320,
    cacheMisses: 80,
    routedToSmaller: 65,
    compressionRatio: 0.36,
};
// ============================================================================
// Basic Examples
// ============================================================================
export const Default = {
    args: {
        stats: mockStats,
        showCost: false,
        size: 'md',
    },
};
export const WithCost = {
    args: {
        stats: mockStats,
        showCost: true,
        size: 'md',
    },
    parameters: {
        docs: {
            description: {
                story: 'Badge displaying both token savings and cost savings.',
            },
        },
    },
};
// ============================================================================
// Size Variants
// ============================================================================
export const SmallBadge = {
    args: {
        stats: mockStats,
        size: 'sm',
    },
};
export const MediumBadge = {
    args: {
        stats: mockStats,
        size: 'md',
    },
};
export const LargeBadge = {
    args: {
        stats: mockStats,
        size: 'lg',
    },
};
export const SizeComparison = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm text-muted-foreground w-20", children: "Small:" }), _jsx(TokenOptimizationBadge, { stats: mockStats, size: "sm" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm text-muted-foreground w-20", children: "Medium:" }), _jsx(TokenOptimizationBadge, { stats: mockStats, size: "md" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm text-muted-foreground w-20", children: "Large:" }), _jsx(TokenOptimizationBadge, { stats: mockStats, size: "lg" })] })] })),
    parameters: {
        docs: {
            description: {
                story: 'All badge sizes side by side.',
            },
        },
    },
};
// ============================================================================
// Context Examples
// ============================================================================
export const InHeader = {
    render: () => (_jsxs("header", { className: "flex items-center justify-between p-4 border-b bg-card", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("h1", { className: "text-xl font-bold", children: "AI Chat Dashboard" }), _jsx(TokenOptimizationBadge, { stats: mockStats, showCost: true, size: "sm" })] }), _jsxs("nav", { className: "flex items-center gap-2", children: [_jsx("button", { className: "px-3 py-1.5 text-sm rounded hover:bg-accent", children: "Settings" }), _jsx("button", { className: "px-3 py-1.5 text-sm rounded hover:bg-accent", children: "Help" })] })] })),
    parameters: {
        docs: {
            description: {
                story: 'Badge in a typical application header.',
            },
        },
    },
};
export const InToolbar = {
    render: () => (_jsxs("div", { className: "flex items-center gap-2 p-3 bg-muted rounded-lg", children: [_jsx("button", { className: "px-3 py-1.5 text-sm border rounded hover:bg-card", children: "Export" }), _jsx("button", { className: "px-3 py-1.5 text-sm border rounded hover:bg-card", children: "Share" }), _jsx("div", { className: "flex-1" }), _jsx(TokenOptimizationBadge, { stats: mockStats, size: "sm" }), _jsx("button", { className: "px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90", children: "Save" })] })),
    parameters: {
        docs: {
            description: {
                story: 'Badge in a toolbar with action buttons.',
            },
        },
    },
};
export const InSidebar = {
    render: () => (_jsxs("aside", { className: "w-64 p-4 border-r space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Navigation" }), _jsxs("nav", { className: "space-y-1", children: [_jsx("button", { className: "w-full text-left px-3 py-2 text-sm rounded hover:bg-accent", children: "Dashboard" }), _jsx("button", { className: "w-full text-left px-3 py-2 text-sm rounded hover:bg-accent", children: "Conversations" }), _jsx("button", { className: "w-full text-left px-3 py-2 text-sm rounded hover:bg-accent", children: "Settings" })] })] }), _jsxs("div", { className: "pt-4 border-t", children: [_jsx("h4", { className: "text-xs font-semibold mb-2 text-muted-foreground", children: "Optimization" }), _jsx(TokenOptimizationBadge, { stats: mockStats, showCost: true, size: "sm" })] })] })),
    parameters: {
        docs: {
            description: {
                story: 'Badge in a sidebar navigation.',
            },
        },
    },
};
// ============================================================================
// Real-Time Updates
// ============================================================================
export const LiveUpdates = {
    render: () => {
        const [stats, setStats] = React.useState(mockStats);
        React.useEffect(() => {
            const interval = setInterval(() => {
                setStats((prev) => ({
                    ...prev,
                    totalTokens: prev.totalTokens + Math.floor(Math.random() * 200) + 50,
                    tokensSaved: prev.tokensSaved + Math.floor(Math.random() * 50) + 10,
                    costSaved: prev.costSaved + Math.random() * 0.01,
                }));
            }, 2000);
            return () => clearInterval(interval);
        }, []);
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "p-4 bg-muted rounded-lg", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Badge updates every 2 seconds with simulated activity" }) }), _jsx(TokenOptimizationBadge, { stats: stats, showCost: true })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Badge with live updating statistics.',
            },
        },
    },
};
// ============================================================================
// Status Levels
// ============================================================================
export const DifferentSavingsLevels = {
    render: () => {
        const lowSavings = {
            totalTokens: 5000,
            tokensSaved: 500,
            costSaved: 0.015,
            cacheHits: 10,
            cacheMisses: 40,
            routedToSmaller: 2,
            compressionRatio: 0.10,
        };
        const mediumSavings = {
            totalTokens: 15000,
            tokensSaved: 4500,
            costSaved: 0.135,
            cacheHits: 85,
            cacheMisses: 45,
            routedToSmaller: 15,
            compressionRatio: 0.30,
        };
        const highSavings = {
            totalTokens: 50000,
            tokensSaved: 20000,
            costSaved: 0.60,
            cacheHits: 320,
            cacheMisses: 80,
            routedToSmaller: 65,
            compressionRatio: 0.40,
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Low Optimization (10% savings)" }), _jsx(TokenOptimizationBadge, { stats: lowSavings, showCost: true })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Medium Optimization (30% savings)" }), _jsx(TokenOptimizationBadge, { stats: mediumSavings, showCost: true })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "High Optimization (40% savings)" }), _jsx(TokenOptimizationBadge, { stats: highSavings, showCost: true })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Badges showing different levels of optimization efficiency.',
            },
        },
    },
};
// ============================================================================
// Interactive Demo
// ============================================================================
export const InteractiveDemo = {
    render: () => {
        const [stats, setStats] = React.useState(mockStats);
        const [showCost, setShowCost] = React.useState(false);
        const [size, setSize] = React.useState('md');
        const addActivity = () => {
            setStats((prev) => ({
                ...prev,
                totalTokens: prev.totalTokens + Math.floor(Math.random() * 500) + 200,
                tokensSaved: prev.tokensSaved + Math.floor(Math.random() * 150) + 50,
                costSaved: prev.costSaved + Math.random() * 0.05,
            }));
        };
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx("button", { onClick: addActivity, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90", children: "Simulate Activity" }), _jsx("button", { onClick: () => setStats(mockStats), className: "px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80", children: "Reset" })] }), _jsxs("div", { className: "flex flex-wrap gap-4 p-4 bg-muted rounded-lg", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: showCost, onChange: (e) => setShowCost(e.target.checked) }), _jsx("span", { className: "text-sm", children: "Show Cost" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm", children: "Size:" }), _jsxs("select", { value: size, onChange: (e) => setSize(e.target.value), className: "px-2 py-1 border rounded text-sm", children: [_jsx("option", { value: "sm", children: "Small" }), _jsx("option", { value: "md", children: "Medium" }), _jsx("option", { value: "lg", children: "Large" })] })] })] }), _jsx(TokenOptimizationBadge, { stats: stats, showCost: showCost, size: size })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo with controls to customize the badge.',
            },
        },
    },
};
//# sourceMappingURL=TokenOptimizationBadge.stories.js.map