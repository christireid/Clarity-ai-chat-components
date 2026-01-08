import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Loading State
 *
 * Displayed while the page is loading. Shows skeleton for
 * the tool calling chat interface.
 */
export default function Loading() {
    return (_jsxs("div", { className: "flex flex-col h-screen max-w-3xl mx-auto", "aria-busy": "true", "aria-label": "Loading tool calling chat", children: [_jsxs("header", { className: "p-4 border-b", children: [_jsx("div", { className: "h-6 w-40 bg-muted animate-pulse rounded" }), _jsx("div", { className: "h-4 w-64 bg-muted animate-pulse rounded mt-2" })] }), _jsx("main", { className: "flex-1 overflow-hidden p-4 space-y-4", children: _jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [_jsx("div", { className: "w-16 h-16 bg-muted animate-pulse rounded-full mb-4" }), _jsx("div", { className: "h-6 w-40 bg-muted animate-pulse rounded mb-2" }), _jsx("div", { className: "h-4 w-64 bg-muted animate-pulse rounded mb-6" }), _jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: [...Array(4)].map((_, i) => (_jsx("div", { className: "h-8 w-48 bg-muted animate-pulse rounded-lg" }, i))) })] }) }), _jsx("footer", { className: "p-4 border-t", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "flex-1 h-12 bg-muted animate-pulse rounded-xl" }), _jsx("div", { className: "h-12 w-20 bg-muted animate-pulse rounded-xl" })] }) }), _jsx("span", { className: "sr-only", children: "Loading tool calling chat..." })] }));
}
//# sourceMappingURL=loading.js.map