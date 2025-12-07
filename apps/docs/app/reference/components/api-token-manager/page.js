import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'ApiTokenManager - Clarity Chat Components',
    description: 'Enterprise: manage API tokens, rotation, and access policies.',
};
export default function ApiTokenManagerPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Enterprise" }), _jsx("h1", { children: "ApiTokenManager" }), _jsx("p", { className: "docs-lead", children: "CRUD and rotation flows for API tokens with audit trails." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-4">
      <ApiTokenManager />
    </div>
  )
}

render(<Example />)` })] })] }));
}
//# sourceMappingURL=page.js.map