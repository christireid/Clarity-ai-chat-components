import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Context Visualizer | Clarity Chat',
    description: 'Visualize conversation context window with token tracking and pruning.'
};
export default function ContextVisualizerPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Context Visualizer" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Visual representation of conversation context window showing which messages are included and token usage." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { ContextVisualizer } from '@clarity-chat/react'

<ContextVisualizer
  messages={messages}
  maxTokens={4096}
  currentTokens={2048}
  showTokens={true}
  highlightIncluded={true}
  onPrune={(ids) => pruneMessages(ids)}
  onToggleMessage={(id, include) => toggleMessage(id, include)}
/>` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Visual token usage tracking" }), _jsx("li", { children: "Included/excluded message highlighting" }), _jsx("li", { children: "Exclusion reason display" }), _jsx("li", { children: "Manual message toggle" }), _jsx("li", { children: "Prune suggestions" }), _jsx("li", { children: "Compact/detailed view modes" })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Exclusion Reasons" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "token_limit:" }), " Exceeds max tokens"] }), _jsxs("li", { children: [_jsx("strong", { children: "pruned:" }), " Manually pruned"] }), _jsxs("li", { children: [_jsx("strong", { children: "too_old:" }), " Outside context window"] }), _jsxs("li", { children: [_jsx("strong", { children: "manual:" }), " User excluded"] })] })] })] }));
}
//# sourceMappingURL=page.js.map