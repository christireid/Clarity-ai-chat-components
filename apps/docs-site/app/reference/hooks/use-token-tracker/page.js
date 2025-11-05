import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useTokenTracker Hook | Clarity Chat',
    description: 'Hook for tracking token usage, costs, and context limits in AI conversations.'
};
export default function UseTokenTrackerPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useTokenTracker Hook" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "React hook for tracking token usage, estimating costs, and managing context window limits." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Real-time token counting for messages" }), _jsx("li", { children: "Cost estimation by model and provider" }), _jsx("li", { children: "Context window limit tracking" }), _jsx("li", { children: "Warning at configurable thresholds (80%, 95%)" }), _jsx("li", { children: "Automatic context pruning suggestions" }), _jsx("li", { children: "History tracking for token usage over time" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { useTokenTracker } from '@clarity-chat/react'

function TokenDisplay() {
  const {
    totalTokens,
    estimatedCost,
    percentageUsed,
    isNearLimit,
    pruneMessages
  } = useTokenTracker({
    messages,
    model: 'gpt-4-turbo',
    contextLimit: 128000
  })

  return (
    <div>
      <span>{totalTokens} tokens</span>
      <span>\${estimatedCost.toFixed(4)}</span>
      {isNearLimit && (
        <button onClick={pruneMessages}>Optimize Context</button>
      )}
    </div>
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map