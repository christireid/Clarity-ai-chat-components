import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const metadata = {
    title: 'Example: Token Optimization',
    description: 'End-to-end example combining retrieval, compression, and reranking.',
};
export default function TokenOptimizationExample() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Example" }), _jsx("h1", { children: "Token Optimization" }), _jsx("p", { className: "docs-lead", children: "RAG + compression + reranking with live metrics." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Live Demo" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 border rounded">
        <ChatWindow />
      </div>
      <div className="space-y-3">
        <TokenOptimizationPanel />
        <div className="p-2 border rounded">
          <TokenOptimizationBadge savingsPercent={32} />
        </div>
      </div>
    </div>
  )
}

render(<Example />)` })] })] }));
}
//# sourceMappingURL=page.js.map