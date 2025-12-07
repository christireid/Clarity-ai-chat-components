import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'TokenOptimizationBadge - Clarity Chat Components',
    description: 'Compact indicator for token optimization status and savings.',
};
export default function TokenOptimizationBadgePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "TokenOptimizationBadge" }), _jsx("p", { className: "docs-lead", children: "Small badge showing token savings and optimization status in context." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-6">
      <TokenOptimizationBadge savingsPercent={37} />
    </div>
  )
}

render(<Example />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx("pre", { children: _jsx("code", { children: `interface TokenOptimizationBadgeProps {
  className?: string
  savingsPercent?: number // 0-100
  status?: 'idle' | 'optimizing' | 'optimized' | 'error'
}` }) })] })] }));
}
//# sourceMappingURL=page.js.map