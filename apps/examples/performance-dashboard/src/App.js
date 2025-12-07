import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck - Recharts has type compatibility issues with React 18
/**
 * Performance Monitoring Dashboard
 *
 * Real-time performance monitoring for components
 */
import { useState } from 'react';
import { Button, Card } from '@clarity-chat/primitives';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const PERFORMANCE_BUDGETS = {
    Button: 16,
    Input: 16,
    Card: 16,
    Message: 33,
    ChatWindow: 50,
    ChatInput: 33,
};
export default function App() {
    const [metrics, setMetrics] = useState([]);
    const [benchmarks, setBenchmarks] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState('Button');
    const [isRunning, setIsRunning] = useState(false);
    const components = Object.keys(PERFORMANCE_BUDGETS);
    const runBenchmark = async (component) => {
        setIsRunning(true);
        const iterations = 100;
        const results = [];
        const memoryResults = [];
        for (let i = 0; i < iterations; i++) {
            const startTime = performance.now();
            const startMemory = performance.memory?.usedJSHeapSize || 0;
            // Simulate component render
            await new Promise(resolve => setTimeout(resolve, Math.random() * 20));
            const endTime = performance.now();
            const endMemory = performance.memory?.usedJSHeapSize || 0;
            results.push(endTime - startTime);
            memoryResults.push(endMemory - startMemory);
            // Add to metrics for live chart
            setMetrics(prev => [...prev, {
                    component,
                    renderTime: endTime - startTime,
                    memoryUsed: endMemory - startMemory,
                    timestamp: Date.now(),
                }].slice(-50));
        }
        const benchmark = {
            component,
            avgRenderTime: results.reduce((a, b) => a + b, 0) / iterations,
            minRenderTime: Math.min(...results),
            maxRenderTime: Math.max(...results),
            avgMemory: memoryResults.reduce((a, b) => a + b, 0) / iterations,
            iterations,
        };
        setBenchmarks(prev => {
            const filtered = prev.filter(b => b.component !== component);
            return [...filtered, benchmark];
        });
        setIsRunning(false);
    };
    const runAllBenchmarks = async () => {
        for (const component of components) {
            await runBenchmark(component);
        }
    };
    const getStatus = (component, renderTime) => {
        const budget = PERFORMANCE_BUDGETS[component];
        if (renderTime <= budget)
            return 'good';
        if (renderTime <= budget * 1.5)
            return 'warning';
        return 'poor';
    };
    const exportData = () => {
        const data = {
            metrics,
            benchmarks,
            timestamp: new Date().toISOString(),
            budgets: PERFORMANCE_BUDGETS,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${Date.now()}.json`;
        a.click();
    };
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("header", { className: "border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10", children: _jsxs("div", { className: "container mx-auto px-4 py-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Performance Dashboard" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Real-time component performance monitoring" })] }) }), _jsxs("div", { className: "container mx-auto px-4 py-8 space-y-8", children: [_jsx(Card, { className: "p-6", children: _jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsx("select", { value: selectedComponent, onChange: (e) => setSelectedComponent(e.target.value), className: "px-4 py-2 rounded-md ring-1 ring-border/50 bg-background", children: components.map(comp => (_jsx("option", { value: comp, children: comp }, comp))) }), _jsx(Button, { onClick: () => runBenchmark(selectedComponent), disabled: isRunning, children: isRunning ? 'Running...' : 'Run Benchmark' }), _jsx(Button, { onClick: runAllBenchmarks, variant: "outline", disabled: isRunning, children: "Run All" }), _jsx(Button, { onClick: exportData, variant: "ghost", children: "Export Data" })] }) }), _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Live Render Performance" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: metrics, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp", tickFormatter: (value) => new Date(value).toLocaleTimeString() }), _jsx(YAxis, { label: { value: 'Render Time (ms)', angle: -90, position: 'insideLeft' } }), _jsx(Tooltip, { labelFormatter: (value) => new Date(value).toLocaleTimeString(), formatter: (value) => `${value.toFixed(2)}ms` }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "renderTime", stroke: "#3b82f6", name: "Render Time" })] }) })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Benchmark Results" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: benchmarks, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "component" }), _jsx(YAxis, { label: { value: 'Avg Render Time (ms)', angle: -90, position: 'insideLeft' } }), _jsx(Tooltip, { formatter: (value) => `${value.toFixed(2)}ms` }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "avgRenderTime", fill: "#3b82f6", name: "Avg Render Time" })] }) })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Performance Budget Status" }), _jsx("div", { className: "space-y-3", children: benchmarks.map(benchmark => {
                                    const budget = PERFORMANCE_BUDGETS[benchmark.component];
                                    const status = getStatus(benchmark.component, benchmark.avgRenderTime);
                                    const percentage = (benchmark.avgRenderTime / budget) * 100;
                                    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-medium", children: benchmark.component }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-sm text-muted-foreground", children: [benchmark.avgRenderTime.toFixed(2), "ms / ", budget, "ms"] }), _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${status === 'good' ? 'bg-green-500/10 text-green-600' :
                                                                    status === 'warning' ? 'bg-yellow-500/10 text-yellow-600' :
                                                                        'bg-red-500/10 text-red-600'}`, children: status === 'good' ? '✓ Good' : status === 'warning' ? '⚠ Warning' : '✗ Poor' })] })] }), _jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: `h-full transition-all duration-300 ${status === 'good' ? 'bg-green-500' :
                                                        status === 'warning' ? 'bg-yellow-500' :
                                                            'bg-red-500'}`, style: { width: `${Math.min(percentage, 100)}%` } }) })] }, benchmark.component));
                                }) })] }), benchmarks.length > 0 && (_jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Detailed Statistics" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border/50", children: [_jsx("th", { className: "text-left py-2 px-4", children: "Component" }), _jsx("th", { className: "text-right py-2 px-4", children: "Avg Time" }), _jsx("th", { className: "text-right py-2 px-4", children: "Min Time" }), _jsx("th", { className: "text-right py-2 px-4", children: "Max Time" }), _jsx("th", { className: "text-right py-2 px-4", children: "Avg Memory" }), _jsx("th", { className: "text-right py-2 px-4", children: "Iterations" })] }) }), _jsx("tbody", { children: benchmarks.map(benchmark => (_jsxs("tr", { className: "border-b border-border/30", children: [_jsx("td", { className: "py-2 px-4 font-medium", children: benchmark.component }), _jsxs("td", { className: "text-right py-2 px-4", children: [benchmark.avgRenderTime.toFixed(2), "ms"] }), _jsxs("td", { className: "text-right py-2 px-4", children: [benchmark.minRenderTime.toFixed(2), "ms"] }), _jsxs("td", { className: "text-right py-2 px-4", children: [benchmark.maxRenderTime.toFixed(2), "ms"] }), _jsxs("td", { className: "text-right py-2 px-4", children: [(benchmark.avgMemory / 1024).toFixed(2), "KB"] }), _jsx("td", { className: "text-right py-2 px-4", children: benchmark.iterations })] }, benchmark.component))) })] }) })] }))] })] }));
}
//# sourceMappingURL=App.js.map