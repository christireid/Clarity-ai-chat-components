import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'TokenOptimizationDashboard - Clarity Chat Components',
    description: 'Dashboard view of token optimization strategies and results.',
};
export default function TokenOptimizationDashboardPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "TokenOptimizationDashboard" }), _jsx("p", { className: "docs-lead", children: "High-level view of compression, reranking, and memory policies across sessions." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-6">
      <TokenOptimizationDashboard />
    </div>
  )
}

render(<Example />)` })] })] }));
}
//# sourceMappingURL=page.js.map