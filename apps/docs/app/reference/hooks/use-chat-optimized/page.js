import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useChatOptimized Hook | Clarity Chat',
    description: 'High-performance variant of useChat with memoization, batching, and debounced input state.',
};
export default function UseChatOptimizedPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8 space-y-12", children: [_jsxs("header", { children: [_jsx("h1", { className: "text-4xl font-bold mb-3", children: "useChatOptimized" }), _jsxs("p", { className: "text-lg text-muted-foreground", children: ["Blueprint v2.1 upgrade: a drop-in enhancement to ", _jsx("code", { children: "useChat" }), " that reduces unnecessary renders and smooths streaming performance for enterprise dashboards."] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-3", children: "When to Use" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Conversation panels with token counters, analytics widgets, or heavy memoized subtrees." }), _jsx("li", { children: "Large-scale deployments streaming multiple assistants simultaneously." }), _jsx("li", { children: "UIs that require debounced input for autosave, search, or rate-limited endpoints." })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-3", children: "Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { useChatOptimized } from '@clarity-chat/react'

const {
  messages,
  append,
  setMessages,
  debouncedInput,
  input,
  setInput,
  isLoading,
} = useChatOptimized({
  api: '/api/chat',
  model: 'gpt-4o-mini',
  debounceMs: 120,
  memoizeMessages: true,
  batchUpdates: true,
})` }) }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-3", children: "Options" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("code", { children: "debounceMs" }), " \u2013 debounce timing for ", _jsx("code", { children: "debouncedInput" }), ". Defaults to ", _jsx("code", { children: "0" }), "."] }), _jsxs("li", { children: [_jsx("code", { children: "memoizeMessages" }), " \u2013 memoize message array to keep referential equality. Defaults to", ' ', _jsx("code", { children: "true" }), "."] }), _jsxs("li", { children: [_jsx("code", { children: "batchUpdates" }), " \u2013 run ", _jsx("code", { children: "append" }), " and ", _jsx("code", { children: "setMessages" }), " inside", ' ', _jsx("code", { children: "startTransition" }), " to cooperate with concurrent rendering. Defaults to ", _jsx("code", { children: "true" }), "."] }), _jsxs("li", { children: ["All other ", _jsx("code", { children: "useChat" }), " options are supported and forwarded."] })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-3", children: "Return Values" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("code", { children: "debouncedInput" }), " \u2013 debounced input string for analytics/search."] }), _jsxs("li", { children: ["All other return values mirror ", _jsx("code", { children: "useChat" }), ", including ", _jsx("code", { children: "messages" }), ",", ' ', _jsx("code", { children: "append" }), ", ", _jsx("code", { children: "isLoading" }), ", etc."] })] })] })] }));
}
//# sourceMappingURL=page.js.map