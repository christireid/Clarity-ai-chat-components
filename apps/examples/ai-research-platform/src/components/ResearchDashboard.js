'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, memo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, FileText, Clock, Zap } from 'lucide-react';
// Extract and memoize StatCard component
const StatCard = memo(({ icon, label, value, color }) => {
    const colorClasses = {
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm", children: [_jsx("div", { className: `w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`, children: icon }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: label }), _jsx("p", { className: "text-2xl font-bold", children: value })] }));
});
StatCard.displayName = 'StatCard';
export function ResearchDashboard({ messages, metrics, researchTopic }) {
    const stats = useMemo(() => {
        const agentMessages = messages.filter(m => m.role === 'assistant');
        const citations = messages.reduce((acc, m) => acc + (m.citations?.length || 0), 0);
        return {
            totalMessages: messages.length,
            agentResponses: agentMessages.length,
            citationsFound: citations,
            avgResponseTime: 2.3,
            documentsProcessed: 12,
            chunksAnalyzed: 245,
        };
    }, [messages]);
    // Memoize chart data to prevent recreation
    const chartData = useMemo(() => [
        { name: 'Researcher', value: 45, color: '#6366f1' },
        { name: 'Analyst', value: 30, color: '#8b5cf6' },
        { name: 'Writer', value: 25, color: '#ec4899' },
    ], []);
    const timelineData = useMemo(() => [
        { time: '00:00', queries: 12 },
        { time: '01:00', queries: 19 },
        { time: '02:00', queries: 8 },
        { time: '03:00', queries: 15 },
        { time: '04:00', queries: 22 },
    ], []);
    return (_jsx("div", { className: "h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "Research Dashboard" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: researchTopic || 'No active research topic' })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(StatCard, { icon: _jsx(FileText, { className: "w-5 h-5" }), label: "Documents Processed", value: stats.documentsProcessed, color: "blue" }), _jsx(StatCard, { icon: _jsx(TrendingUp, { className: "w-5 h-5" }), label: "Citations Found", value: stats.citationsFound, color: "purple" }), _jsx(StatCard, { icon: _jsx(Clock, { className: "w-5 h-5" }), label: "Avg Response Time", value: `${stats.avgResponseTime}s`, color: "green" }), _jsx(StatCard, { icon: _jsx(Zap, { className: "w-5 h-5" }), label: "Tokens Saved", value: `${metrics?.tokensSaved || 0}`, color: "orange" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Agent Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: chartData, cx: "50%", cy: "50%", labelLine: false, label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: chartData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Query Timeline" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: timelineData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "time" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "queries", stroke: "#6366f1", strokeWidth: 2 })] }) })] })] }), metrics && (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Token Optimization" }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Tokens" }), _jsx("p", { className: "text-2xl font-bold", children: metrics.totalTokens?.toLocaleString() || 0 })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Tokens Saved" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: metrics.tokensSaved?.toLocaleString() || 0 })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Savings %" }), _jsxs("p", { className: "text-2xl font-bold text-purple-600", children: [metrics.savingsPercent || 0, "%"] })] })] })] }))] }) }));
}
//# sourceMappingURL=ResearchDashboard.js.map