import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Tool Invocation Card | Clarity Chat',
    description: 'Display function/tool calls with approval flow, execution status, and result visualization.'
};
export default function ToolInvocationCardPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Tool Invocation Card" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Interactive card for displaying AI tool/function calls with approval workflow and result visualization." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Six status states: pending, approved, rejected, executing, success, error" }), _jsx("li", { children: "Approval workflow with approve/reject buttons" }), _jsx("li", { children: "Color-coded status indicators and icons" }), _jsx("li", { children: "Formatted JSON display for function arguments" }), _jsx("li", { children: "Expandable result section for output visualization" }), _jsx("li", { children: "Retry functionality for failed executions" }), _jsx("li", { children: "Loading animations during execution" }), _jsx("li", { children: "Framer Motion animations for smooth transitions" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { ToolInvocationCard } from '@clarity-chat/react'

const toolCall = {
  id: 'call_123',
  function: { name: 'search', arguments: '{"query":"AI"}' },
  type: 'function'
}

<ToolInvocationCard
  toolCall={toolCall}
  status="pending"
  requiresApproval
  onApprove={(call) => executeToolCall(call)}
  onReject={(call) => console.log('Rejected', call)}
  formatArguments
  expandableResult
/>` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map