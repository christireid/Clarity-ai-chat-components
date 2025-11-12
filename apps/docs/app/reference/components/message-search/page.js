import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Message Search | Clarity Chat',
    description: 'Search messages with React Concurrent features for responsive UI.'
};
export default function MessageSearchPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Message Search" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Search through messages with deferred filtering for responsive input even with large message lists." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { MessageSearch } from '@clarity-chat/react'

<MessageSearch
  messages={messages}
  onResultsChange={(filtered) => setFiltered(filtered)}
  placeholder="Search messages..."
/>` }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "React Concurrent useDeferredValue" }), _jsx("li", { children: "Responsive input with large lists" }), _jsx("li", { children: "Loading indicator" }), _jsx("li", { children: "Real-time filtering" }), _jsx("li", { children: "Search icon" })] })] })] }));
}
//# sourceMappingURL=page.js.map