'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity } from 'lucide-react';
const mockData = [
    { time: '00:00', requests: 1200, latency: 200, errors: 5 },
    { time: '01:00', requests: 1350, latency: 245, errors: 8 },
    { time: '02:00', requests: 1100, latency: 180, errors: 3 },
    { time: '03:00', requests: 1450, latency: 280, errors: 12 },
    { time: '04:00', requests: 1300, latency: 220, errors: 6 },
    { time: '05:00', requests: 1500, latency: 250, errors: 9 },
];
export function RealTimeMonitor() {
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Activity, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }), _jsx("h2", { className: "text-xl font-semibold", children: "Real-Time Monitoring" })] }), _jsxs("div", { className: "flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }), _jsx("span", { children: "Live" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-4", children: "Request Rate (per hour)" }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(AreaChart, { data: mockData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "time", stroke: "#6b7280" }), _jsx(YAxis, { stroke: "#6b7280" }), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "requests", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.3 })] }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-4", children: "Average Latency (ms)" }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(LineChart, { data: mockData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "time", stroke: "#6b7280" }), _jsx(YAxis, { stroke: "#6b7280" }), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "latency", stroke: "#8b5cf6", strokeWidth: 2 })] }) })] })] })] }));
}
//# sourceMappingURL=RealTimeMonitor.js.map