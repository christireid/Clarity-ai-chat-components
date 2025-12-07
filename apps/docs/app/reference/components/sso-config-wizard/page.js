import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'SSOConfigWizard - Clarity Chat Components',
    description: 'Enterprise: guided setup for SSO providers and metadata.',
};
export default function SSOConfigWizardPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Enterprise" }), _jsx("h1", { children: "SSOConfigWizard" }), _jsx("p", { className: "docs-lead", children: "Simplifies configuring SAML/OIDC providers and testing logins." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-4">
      <SSOConfigWizard />
    </div>
  )
}

render(<Example />)` })] })] }));
}
//# sourceMappingURL=page.js.map