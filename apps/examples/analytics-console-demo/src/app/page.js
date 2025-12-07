'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
// Disable static optimization
export const dynamic = 'force-dynamic';
export default function AnalyticsConsolePage() {
    const [stats, setStats] = useState(null);
    const [dailyData, setDailyData] = useState([]);
    const [recentEntries, setRecentEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [timeRange, setTimeRange] = useState(30);
    useEffect(() => {
        setIsMounted(true);
        loadData();
    }, [timeRange]);
    async function loadData() {
        setIsLoading(true);
        try {
            // Load summary stats
            const summaryRes = await fetch('/api/analytics/summary');
            const summaryData = await summaryRes.json();
            setStats(summaryData);
            // Load daily data
            const dailyRes = await fetch(`/api/analytics/daily?days=${timeRange}`);
            const dailyJson = await dailyRes.json();
            setDailyData(dailyJson.summaries || []);
            // Load recent entries
            const recentRes = await fetch('/api/analytics/recent?limit=10');
            const recentJson = await recentRes.json();
            setRecentEntries(recentJson.entries || []);
        }
        catch (error) {
            console.error('Failed to load analytics:', error);
        }
        finally {
            setIsLoading(false);
        }
    }
    if (!isMounted || isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading analytics..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "\uD83D\uDCCA Analytics Console" }), _jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Token usage tracking & cost analytics for AI applications" })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsx(SummaryCard, { title: "Total Requests", value: stats?.totalRequests.toLocaleString() || '0', icon: "\uD83D\uDCCA", color: "blue" }), _jsx(SummaryCard, { title: "Total Tokens", value: stats?.totalTokens.toLocaleString() || '0', icon: "\uD83D\uDD22", color: "purple" }), _jsx(SummaryCard, { title: "Total Cost", value: `$${(stats?.totalCost || 0).toFixed(4)}`, icon: "\uD83D\uDCB0", color: "green" }), _jsx(SummaryCard, { title: "Avg Response", value: `${Math.round(stats?.avgResponseTime || 0)}ms`, icon: "\u26A1", color: "yellow" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Usage Trend" }), _jsxs("div", { className: "flex gap-2 mb-4", children: [_jsx("button", { onClick: () => setTimeRange(7), className: `px-3 py-1 text-sm rounded ${timeRange === 7 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`, children: "7 days" }), _jsx("button", { onClick: () => setTimeRange(30), className: `px-3 py-1 text-sm rounded ${timeRange === 30 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`, children: "30 days" }), _jsx("button", { onClick: () => setTimeRange(90), className: `px-3 py-1 text-sm rounded ${timeRange === 90 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`, children: "90 days" })] }), dailyData.length > 0 ? (_jsx("div", { className: "space-y-2", children: dailyData.slice(-10).map((day) => (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: day.date }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "text-gray-900", children: [day.totalRequests, " req"] }), _jsxs("span", { className: "text-green-600 font-mono", children: ["$", day.totalCost.toFixed(4)] })] })] }, day.date))) })) : (_jsx("p", { className: "text-gray-400 text-center py-8", children: "No data yet" }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Provider Distribution" }), stats && Object.keys(stats.byProvider).length > 0 ? (_jsx("div", { className: "space-y-4", children: Object.entries(stats.byProvider).map(([provider, data]) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { className: "font-medium capitalize", children: provider }), _jsxs("span", { className: "text-gray-600", children: [data.requests, " requests"] })] }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500 mb-2", children: [_jsxs("span", { children: [data.tokens.toLocaleString(), " tokens"] }), _jsxs("span", { className: "font-mono", children: ["$", data.cost.toFixed(4)] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-500 h-2 rounded-full", style: {
                                                            width: `${(data.requests / stats.totalRequests) * 100}%`
                                                        } }) })] }, provider))) })) : (_jsx("p", { className: "text-gray-400 text-center py-8", children: "No data yet" }))] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Model Statistics" }), stats && Object.keys(stats.byModel).length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left py-2 px-4 text-sm font-medium text-gray-600", children: "Model" }), _jsx("th", { className: "text-right py-2 px-4 text-sm font-medium text-gray-600", children: "Requests" }), _jsx("th", { className: "text-right py-2 px-4 text-sm font-medium text-gray-600", children: "Tokens" }), _jsx("th", { className: "text-right py-2 px-4 text-sm font-medium text-gray-600", children: "Cost" }), _jsx("th", { className: "text-right py-2 px-4 text-sm font-medium text-gray-600", children: "Avg Response" })] }) }), _jsx("tbody", { children: Object.entries(stats.byModel).map(([model, data]) => (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "py-2 px-4 text-sm font-medium", children: model }), _jsx("td", { className: "py-2 px-4 text-sm text-right", children: data.requests }), _jsx("td", { className: "py-2 px-4 text-sm text-right", children: data.tokens.toLocaleString() }), _jsxs("td", { className: "py-2 px-4 text-sm text-right font-mono", children: ["$", data.cost.toFixed(4)] }), _jsxs("td", { className: "py-2 px-4 text-sm text-right", children: [Math.round(data.avgResponseTime), "ms"] })] }, model))) })] }) })) : (_jsx("p", { className: "text-gray-400 text-center py-8", children: "No data yet" }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Recent Activity" }), recentEntries.length > 0 ? (_jsx("div", { className: "space-y-3", children: recentEntries.map((entry) => (_jsxs("div", { className: "flex items-center justify-between py-2 border-b last:border-0", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-sm", children: entry.model }), _jsxs("span", { className: "text-xs text-gray-500 capitalize", children: ["(", entry.provider, ")"] })] }), _jsxs("div", { className: "text-xs text-gray-600 mt-1", children: [entry.totalTokens, " tokens \u2022 ", entry.responseTime, "ms"] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "font-mono text-sm", children: ["$", entry.cost.toFixed(6)] }), _jsx("div", { className: "text-xs text-gray-500", suppressHydrationWarning: true, children: new Date(entry.timestamp).toLocaleTimeString() })] })] }, entry.id))) })) : (_jsx("p", { className: "text-gray-400 text-center py-8", children: "No recent activity" }))] })] })] }));
}
function SummaryCard({ title, value, icon, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200',
        purple: 'bg-purple-50 border-purple-200',
        green: 'bg-green-50 border-green-200',
        yellow: 'bg-yellow-50 border-yellow-200',
    };
    return (_jsx("div", { className: `rounded-lg border p-6 ${colorClasses[color]}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: title }), _jsx("p", { className: "text-2xl font-bold", children: value })] }), _jsx("div", { className: "text-3xl", children: icon })] }) }));
}
//# sourceMappingURL=page.js.map