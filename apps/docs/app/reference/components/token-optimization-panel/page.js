import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const metadata = {
    title: 'TokenOptimizationPanel - Clarity Chat Components',
    description: 'Interactive panel to configure and visualize token optimization.',
};
export default function TokenOptimizationPanelPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "TokenOptimizationPanel" }), _jsx("p", { className: "docs-lead", children: "Configure compression, chunking, reranking, and memory trimming strategies." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-6">
      <TokenOptimizationPanel />
    </div>
  )
}

render(<Example />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "/guides/token-optimization", children: "Token Optimization Guide" }) }), _jsx("li", { children: _jsx("a", { href: "/reference/components/token-optimization-dashboard", children: "Dashboard" }) }), _jsx("li", { children: _jsx("a", { href: "/reference/components/token-optimization-badge", children: "Badge" }) })] })] })] }));
}
//# sourceMappingURL=page.js.map