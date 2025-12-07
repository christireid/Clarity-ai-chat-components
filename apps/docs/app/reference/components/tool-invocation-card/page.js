import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'ToolInvocationCard - Clarity Chat Components',
    description: 'Visualize tool calls, inputs, and results inside conversations.',
};
export default function ToolInvocationCardPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "ToolInvocationCard" }), _jsx("p", { className: "docs-lead", children: "Display a tool execution with status, logs, and output." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  const run = {
    id: 'run_123',
    name: 'web.search',
    status: 'succeeded',
    input: { q: 'weather san francisco' },
    output: { tempF: 64 }
  }
  return (
    <div className="p-4">
      <ToolInvocationCard run={run} />
    </div>
  )
}

render(<Example />)` })] })] }));
}
//# sourceMappingURL=page.js.map