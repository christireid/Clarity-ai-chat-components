'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Zap, MessageSquare, ThumbsUp, Database, Clock, BarChart3, RefreshCw, } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
export function AnalyticsDashboard({ className, refreshInterval, period = '7d', }) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/analytics?period=${period}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            setSummary(data.data);
            setLastUpdated(new Date());
        }
        catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError(err instanceof Error ? err.message : 'Failed to load analytics');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAnalytics();
        if (refreshInterval) {
            const interval = setInterval(fetchAnalytics, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [period, refreshInterval]);
    if (loading && !summary) {
        return (_jsx("div", { className: cn('flex items-center justify-center p-8', className), children: _jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }), _jsx("span", { children: "Loading analytics..." })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: cn('p-8', className), children: _jsxs("div", { className: "bg-destructive/10 border border-destructive/20 rounded-lg p-4", children: [_jsxs("p", { className: "text-sm text-destructive", children: ["Failed to load analytics: ", error] }), _jsx("button", { onClick: fetchAnalytics, className: "mt-2 text-xs text-destructive underline", children: "Try again" })] }) }));
    }
    if (!summary) {
        return null;
    }
    return (_jsxs("div", { className: cn('space-y-6', className), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "AI Assistant Analytics" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [new Date(summary.period.start).toLocaleDateString(), " -", ' ', new Date(summary.period.end).toLocaleDateString(), " (", summary.period.durationDays, " days)"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-xs text-muted-foreground", children: ["Updated ", lastUpdated.toLocaleTimeString()] }), _jsx("button", { onClick: fetchAnalytics, disabled: loading, className: cn('p-2 rounded-md', 'bg-secondary hover:bg-secondary/80', 'transition-colors', loading && 'opacity-50 cursor-not-allowed'), "aria-label": "Refresh", children: _jsx(RefreshCw, { className: cn('w-4 h-4', loading && 'animate-spin') }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(MetricCard, { title: "Total Queries", value: summary.queries.total.toLocaleString(), subtitle: `${summary.queries.averagePerDay.toFixed(1)} per day`, icon: MessageSquare, trend: summary.queries.followUpRate > 0
                            ? `${summary.queries.followUpRate.toFixed(1)}% follow-ups`
                            : undefined, color: "blue" }), _jsx(MetricCard, { title: "Total Cost", value: `$${summary.costs.total.toFixed(2)}`, subtitle: `$${summary.costs.averagePerQuery.toFixed(4)} per query`, icon: DollarSign, trend: `Est. $${summary.costs.estimatedMonthlyCost.toFixed(2)}/month`, color: "green" }), _jsx(MetricCard, { title: "Cache Hit Rate", value: `${summary.cache.hitRate.toFixed(1)}%`, subtitle: `${summary.cache.hits} hits, ${summary.cache.misses} misses`, icon: Zap, trend: `Saved $${summary.cache.estimatedSavings.toFixed(2)}`, color: "purple" }), _jsx(MetricCard, { title: "Satisfaction", value: `${summary.feedback.positiveRate.toFixed(1)}%`, subtitle: `${summary.feedback.total} ratings`, icon: ThumbsUp, trend: `${summary.feedback.positive} 👍 / ${summary.feedback.negative} 👎`, color: "yellow" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-card border border-border rounded-lg p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx(BarChart3, { className: "w-5 h-5 text-primary" }), "Popular Topics"] }), summary.popularTopics.length > 0 ? (_jsx("div", { className: "space-y-3", children: summary.popularTopics.map((topic, index) => (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "font-medium", children: topic.topic }), _jsxs("span", { className: "text-muted-foreground", children: [topic.count, " (", topic.percentage.toFixed(1), "%)"] })] }), _jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${topic.percentage}%` }, transition: { duration: 0.5, delay: index * 0.1 }, className: "h-full bg-primary" }) })] }, index))) })) : (_jsx("p", { className: "text-sm text-muted-foreground", children: "No topics data yet" }))] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx(MessageSquare, { className: "w-5 h-5 text-primary" }), "Popular Queries"] }), summary.popularQueries.length > 0 ? (_jsx("div", { className: "space-y-2", children: summary.popularQueries.slice(0, 5).map((query, index) => (_jsxs("div", { className: "flex items-start justify-between text-sm p-2 rounded-md hover:bg-accent", children: [_jsx("span", { className: "flex-1 truncate pr-2", children: query.query }), _jsxs("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded flex-shrink-0", children: [query.count, "x"] })] }, index))) })) : (_jsx("p", { className: "text-sm text-muted-foreground", children: "No queries data yet" }))] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx(Database, { className: "w-5 h-5 text-primary" }), "RAG Performance"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between text-sm mb-1", children: [_jsx("span", { className: "text-muted-foreground", children: "Usage Rate" }), _jsxs("span", { className: "font-medium", children: [summary.rag.usageRate.toFixed(1), "%"] })] }), _jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-blue-500", style: { width: `${summary.rag.usageRate}%` } }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "text-center p-3 bg-muted/50 rounded-md", children: [_jsx("p", { className: "text-2xl font-bold", children: summary.rag.averageSourcesReturned.toFixed(1) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Avg Sources" })] }), _jsxs("div", { className: "text-center p-3 bg-muted/50 rounded-md", children: [_jsxs("p", { className: "text-2xl font-bold", children: [(summary.rag.averageRelevanceScore * 100).toFixed(0), "%"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Avg Relevance" })] })] })] })] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5 text-primary" }), "Performance"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-center p-4 bg-muted/50 rounded-md", children: [_jsxs("p", { className: "text-3xl font-bold", children: [summary.queries.averageResponseTime.toFixed(0), _jsx("span", { className: "text-lg text-muted-foreground ml-1", children: "ms" })] }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Average Response Time" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "text-center p-3 bg-green-500/10 border border-green-500/20 rounded-md", children: [_jsx("p", { className: "text-xl font-bold text-green-600 dark:text-green-400", children: summary.cache.hits }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Cache Hits" })] }), _jsxs("div", { className: "text-center p-3 bg-orange-500/10 border border-orange-500/20 rounded-md", children: [_jsx("p", { className: "text-xl font-bold text-orange-600 dark:text-orange-400", children: summary.cache.misses }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Cache Misses" })] })] })] })] })] }), Object.keys(summary.modelUsage).length > 0 && (_jsxs("div", { className: "bg-card border border-border rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Model Usage" }), _jsx("div", { className: "flex flex-wrap gap-2", children: Object.entries(summary.modelUsage).map(([model, count]) => (_jsxs("div", { className: "px-3 py-2 bg-secondary rounded-md text-sm", children: [_jsx("span", { className: "font-medium", children: model }), _jsxs("span", { className: "text-muted-foreground ml-2", children: ["(", count, ")"] })] }, model))) })] }))] }));
}
function MetricCard({ title, value, subtitle, icon: Icon, trend, color, }) {
    const colors = {
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        green: 'bg-green-500/10 text-green-600 dark:text-green-400',
        purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    };
    return (_jsxs("div", { className: "bg-card border border-border rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("p", { className: "text-sm font-medium text-muted-foreground", children: title }), _jsx("div", { className: cn('p-2 rounded-md', colors[color]), children: _jsx(Icon, { className: "w-4 h-4" }) })] }), _jsx("p", { className: "text-3xl font-bold mb-1", children: value }), _jsx("p", { className: "text-xs text-muted-foreground", children: subtitle }), trend && (_jsx("div", { className: "mt-3 pt-3 border-t border-border", children: _jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [_jsx(TrendingUp, { className: "w-3 h-3" }), _jsx("span", { children: trend })] }) }))] }));
}
//# sourceMappingURL=AnalyticsDashboard.js.map