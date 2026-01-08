import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Loading State
 *
 * Displayed while the page is loading. Uses skeleton components
 * to show a preview of the chat interface layout.
 */
export default function Loading() {
    return (_jsxs("div", { className: "flex flex-col h-screen", "aria-busy": "true", "aria-label": "Loading chat", children: [_jsx("header", { className: "border-b bg-background/95 backdrop-blur", children: _jsxs("div", { className: "container flex h-14 items-center justify-between px-4", children: [_jsx("div", { className: "h-6 w-40 bg-muted animate-pulse rounded" }), _jsx("div", { className: "h-8 w-32 bg-muted animate-pulse rounded" })] }) }), _jsx("main", { className: "flex-1 overflow-hidden", children: _jsx("div", { className: "h-full max-w-3xl mx-auto p-4 space-y-4", children: [...Array(3)].map((_, i) => (_jsx("div", { className: `flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[80%] space-y-2 ${i % 2 === 0 ? 'items-end' : 'items-start'}`, children: [_jsx("div", { className: "h-4 w-20 bg-muted animate-pulse rounded" }), _jsxs("div", { className: "p-4 bg-muted animate-pulse rounded-lg space-y-2", children: [_jsx("div", { className: "h-4 w-48 bg-muted-foreground/10 rounded" }), _jsx("div", { className: "h-4 w-36 bg-muted-foreground/10 rounded" })] })] }) }, i))) }) }), _jsx("footer", { className: "border-t bg-background/95 backdrop-blur p-4", children: _jsx("div", { className: "max-w-3xl mx-auto", children: _jsx("div", { className: "h-12 bg-muted animate-pulse rounded-lg" }) }) }), _jsx("span", { className: "sr-only", children: "Loading chat interface..." })] }));
}
//# sourceMappingURL=loading.js.map