'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock, DollarSign, Shield, TrendingUp, Zap, RefreshCw, Settings, } from 'lucide-react';
// =============================================================================
// Mock Data Generators
// =============================================================================
function generateMockUsageData() {
    const now = new Date();
    const data = [];
    for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now);
        timestamp.setHours(timestamp.getHours() - i);
        data.push({
            timestamp: timestamp.toLocaleTimeString('en-US', { hour: '2-digit' }),
            requests: Math.floor(Math.random() * 500) + 100,
            tokens: Math.floor(Math.random() * 50000) + 10000,
            cost: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
        });
    }
    return data;
}
function generateMockAlerts() {
    return [
        {
            id: '1',
            level: 'high',
            message: 'Potential PII detected in user prompt',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            resolved: false,
        },
        {
            id: '2',
            level: 'medium',
            message: 'Unusual token usage spike detected',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            resolved: false,
        },
        {
            id: '3',
            level: 'low',
            message: 'Response latency above threshold (>2s)',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            resolved: true,
        },
    ];
}
// =============================================================================
// Components
// =============================================================================
function StatCard({ label, value, change, changeType, icon: Icon, }) {
    return (_jsx("div", { className: "p-6 bg-card border rounded-lg", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: label }), _jsx("p", { className: "text-2xl font-bold mt-1", children: value }), change && (_jsx("p", { className: `text-sm mt-1 ${changeType === 'positive'
                                ? 'text-green-600'
                                : changeType === 'negative'
                                    ? 'text-red-600'
                                    : 'text-muted-foreground'}`, children: change }))] }), _jsx("div", { className: "p-2 bg-primary/10 rounded-lg", children: _jsx(Icon, { className: "w-5 h-5 text-primary", "aria-hidden": "true" }) })] }) }));
}
function SafetyAlertItem({ alert, onResolve, }) {
    const levelColors = {
        low: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        medium: 'bg-orange-100 text-orange-800 border-orange-200',
        high: 'bg-red-100 text-red-800 border-red-200',
    };
    return (_jsx("div", { className: `p-4 border rounded-lg ${alert.resolved ? 'opacity-50' : ''}`, children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [alert.level === 'high' ? (_jsx(AlertTriangle, { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" })) : (_jsx(Shield, { className: "w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" })), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: `text-xs px-2 py-0.5 rounded-full border ${levelColors[alert.level]}`, children: alert.level.toUpperCase() }), alert.resolved && (_jsxs("span", { className: "text-xs text-green-600 flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), "Resolved"] }))] }), _jsx("p", { className: "text-sm font-medium", children: alert.message }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: alert.timestamp.toLocaleTimeString() })] })] }), !alert.resolved && (_jsx("button", { onClick: () => onResolve(alert.id), className: "text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring", children: "Resolve" }))] }) }));
}
function UsageChart({ data }) {
    const maxRequests = Math.max(...data.map((d) => d.requests));
    return (_jsxs("div", { className: "p-6 bg-card border rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Request Volume (24h)" }), _jsx("div", { className: "h-48 flex items-end gap-1", children: data.map((d, i) => (_jsxs("div", { className: "flex-1 flex flex-col items-center gap-1", title: `${d.timestamp}: ${d.requests} requests`, children: [_jsx("div", { className: "w-full bg-primary/80 hover:bg-primary rounded-t transition-colors", style: {
                                height: `${(d.requests / maxRequests) * 100}%`,
                                minHeight: '4px',
                            } }), i % 4 === 0 && (_jsx("span", { className: "text-[10px] text-muted-foreground", children: d.timestamp }))] }, i))) })] }));
}
function TokenBreakdown() {
    const breakdown = [
        {
            label: 'Input Tokens',
            value: 1250000,
            percentage: 45,
            color: 'bg-blue-500',
        },
        {
            label: 'Output Tokens',
            value: 850000,
            percentage: 30,
            color: 'bg-green-500',
        },
        {
            label: 'Cached Tokens',
            value: 450000,
            percentage: 16,
            color: 'bg-purple-500',
        },
        {
            label: 'System Tokens',
            value: 250000,
            percentage: 9,
            color: 'bg-orange-500',
        },
    ];
    return (_jsxs("div", { className: "p-6 bg-card border rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Token Breakdown" }), _jsx("div", { className: "space-y-4", children: breakdown.map((item, i) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { children: item.label }), _jsxs("span", { className: "text-muted-foreground", children: [(item.value / 1000000).toFixed(2), "M (", item.percentage, "%)"] })] }), _jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: `h-full ${item.color} rounded-full transition-all`, style: { width: `${item.percentage}%` } }) })] }, i))) })] }));
}
function ModelPerformance() {
    const models = [
        { name: 'gpt-4o', latency: 1.2, accuracy: 94, cost: 2.5 },
        { name: 'gpt-4o-mini', latency: 0.4, accuracy: 89, cost: 0.3 },
        { name: 'claude-3.5-sonnet', latency: 0.9, accuracy: 92, cost: 1.5 },
    ];
    return (_jsxs("div", { className: "p-6 bg-card border rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Model Performance" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", role: "table", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left py-2 font-medium", children: "Model" }), _jsx("th", { className: "text-right py-2 font-medium", children: "Latency" }), _jsx("th", { className: "text-right py-2 font-medium", children: "Accuracy" }), _jsx("th", { className: "text-right py-2 font-medium", children: "Cost/1K" })] }) }), _jsx("tbody", { children: models.map((model, i) => (_jsxs("tr", { className: "border-b last:border-0", children: [_jsx("td", { className: "py-3 font-medium", children: model.name }), _jsxs("td", { className: "py-3 text-right text-muted-foreground", children: [model.latency, "s"] }), _jsx("td", { className: "py-3 text-right", children: _jsxs("span", { className: `${model.accuracy >= 90
                                                ? 'text-green-600'
                                                : model.accuracy >= 80
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'}`, children: [model.accuracy, "%"] }) }), _jsxs("td", { className: "py-3 text-right text-muted-foreground", children: ["$", model.cost.toFixed(2)] })] }, i))) })] }) })] }));
}
// =============================================================================
// Main Dashboard
// =============================================================================
export default function EnterpriseAIOpsPage() {
    const [usageData, setUsageData] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    // Initialize data
    useEffect(() => {
        setUsageData(generateMockUsageData());
        setAlerts(generateMockAlerts());
    }, []);
    // Refresh data
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUsageData(generateMockUsageData());
        setLastRefresh(new Date());
        setIsRefreshing(false);
    };
    // Resolve alert
    const handleResolveAlert = (id) => {
        setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
    };
    // Calculate metrics
    const totalRequests = usageData.reduce((sum, d) => sum + d.requests, 0);
    const totalTokens = usageData.reduce((sum, d) => sum + d.tokens, 0);
    const totalCost = usageData.reduce((sum, d) => sum + d.cost, 0);
    const avgLatency = 0.8; // Mock average latency
    const metrics = [
        {
            label: 'Total Requests (24h)',
            value: totalRequests.toLocaleString(),
            change: '+12% vs yesterday',
            changeType: 'positive',
            icon: Activity,
        },
        {
            label: 'Tokens Used',
            value: `${(totalTokens / 1000000).toFixed(2)}M`,
            change: '-5% vs yesterday',
            changeType: 'positive',
            icon: Zap,
        },
        {
            label: 'Total Cost',
            value: `$${totalCost.toFixed(2)}`,
            change: '+8% vs yesterday',
            changeType: 'negative',
            icon: DollarSign,
        },
        {
            label: 'Avg Latency',
            value: `${avgLatency}s`,
            change: 'Within SLA',
            changeType: 'positive',
            icon: Clock,
        },
    ];
    const unresolvedAlerts = alerts.filter((a) => !a.resolved).length;
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("header", { className: "border-b bg-background/95 backdrop-blur sticky top-0 z-10", children: _jsxs("div", { className: "container flex h-16 items-center justify-between px-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-primary/10 rounded-lg", children: _jsx(TrendingUp, { className: "w-5 h-5 text-primary" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-lg font-semibold", children: "Enterprise AI Ops" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Last updated: ", lastRefresh.toLocaleTimeString()] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [unresolvedAlerts > 0 && (_jsxs("span", { className: "flex items-center gap-1 text-sm text-orange-600", children: [_jsx(AlertTriangle, { className: "w-4 h-4" }), unresolvedAlerts, " alert", unresolvedAlerts > 1 ? 's' : ''] })), _jsx("button", { onClick: handleRefresh, disabled: isRefreshing, className: "p-2 hover:bg-muted rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50", "aria-label": "Refresh data", children: _jsx(RefreshCw, { className: `w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}` }) }), _jsx("button", { className: "p-2 hover:bg-muted rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring", "aria-label": "Settings", children: _jsx(Settings, { className: "w-5 h-5" }) })] })] }) }), _jsxs("main", { className: "container px-4 py-8", children: [_jsxs("section", { "aria-labelledby": "metrics-heading", className: "mb-8", children: [_jsx("h2", { id: "metrics-heading", className: "sr-only", children: "Key Metrics" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: metrics.map((metric, i) => (_jsx(StatCard, { ...metric }, i))) })] }), _jsxs("section", { "aria-labelledby": "analytics-heading", className: "mb-8", children: [_jsx("h2", { id: "analytics-heading", className: "sr-only", children: "Analytics" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(UsageChart, { data: usageData }), _jsx(TokenBreakdown, {})] })] }), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "p-6 bg-card border rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [_jsx(Shield, { className: "w-5 h-5 text-primary" }), "Safety Alerts"] }), _jsxs("span", { className: "text-sm text-muted-foreground", children: [unresolvedAlerts, " unresolved"] })] }), _jsx("div", { className: "space-y-3", children: alerts.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "No alerts to display" })) : (alerts.map((alert) => (_jsx(SafetyAlertItem, { alert: alert, onResolve: handleResolveAlert }, alert.id)))) })] }), _jsx(ModelPerformance, {})] })] })] }));
}
//# sourceMappingURL=page.js.map