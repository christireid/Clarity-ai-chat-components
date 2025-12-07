import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'StreamBlock - Clarity Chat Components',
    description: 'Render a block of streaming content with partial updates.',
};
export default function StreamBlockPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "StreamBlock" }), _jsx("p", { className: "docs-lead", children: "Controlled unit for chunked updates in a message." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-4">
      <StreamBlock content="Streaming..." />
    </div>
  )
}

render(<Example />)` })] })] }));
}
//# sourceMappingURL=page.js.map