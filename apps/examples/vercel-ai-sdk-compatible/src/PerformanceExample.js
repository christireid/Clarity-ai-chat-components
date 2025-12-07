import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Performance Example: Demonstrates optimized hooks and performance monitoring
 */
import * as React from 'react';
import { useChatOptimized } from '@clarity-chat/react';
import { PerformanceMonitor, measurePerformance } from '@clarity-chat/react';
function PerformanceExample() {
    const [perfMonitor] = React.useState(() => new PerformanceMonitor());
    const [metrics, setMetrics] = React.useState({});
    const { messages, append, isLoading, debouncedInput } = useChatOptimized({
        api: '/api/chat',
        debounceMs: 300,
        memoizeMessages: true,
        batchUpdates: true,
    });
    const handleSend = async () => {
        const stopTimer = perfMonitor.start('message-send');
        await measurePerformance('append-message', async () => {
            await append({
                role: 'user',
                content: `Test message ${Date.now()}`,
            });
        });
        stopTimer();
        // Update metrics
        setMetrics(perfMonitor.getReport());
    };
    React.useEffect(() => {
        // Update metrics periodically
        const interval = setInterval(() => {
            setMetrics(perfMonitor.getReport());
        }, 1000);
        return () => clearInterval(interval);
    }, [perfMonitor]);
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Performance Monitoring" }), _jsxs("div", { className: "mb-4 p-4 bg-gray-50 rounded-lg", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Performance Metrics" }), _jsx("div", { className: "space-y-1 text-sm", children: Object.entries(metrics).map(([label, stats]) => (_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { className: "font-mono", children: [label, ":"] }), _jsxs("span", { children: ["avg: ", stats.avg.toFixed(2), "ms, min: ", stats.min.toFixed(2), "ms, max: ", stats.max.toFixed(2), "ms, count: ", stats.count] })] }, label))) })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "text-sm text-gray-600 mb-2", children: ["Input (debounced): ", debouncedInput || '(empty)'] }), _jsx("button", { onClick: handleSend, disabled: isLoading, className: "px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50", children: "Send Message (Tracked)" })] }), _jsx("div", { className: "space-y-2 max-h-96 overflow-y-auto", children: messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'}`, children: [_jsx("div", { className: "text-sm font-semibold mb-1", children: msg.role }), _jsx("div", { children: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) })] }, msg.id))) }), isLoading && _jsx("div", { className: "text-gray-500 mt-2", children: "Processing..." })] }));
}
export default PerformanceExample;
//# sourceMappingURL=PerformanceExample.js.map