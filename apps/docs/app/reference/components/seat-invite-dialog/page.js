import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'SeatInviteDialog - Clarity Chat Components',
    description: 'Enterprise: invite users and assign roles to tenants.',
};
export default function SeatInviteDialogPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Enterprise" }), _jsx("h1", { children: "SeatInviteDialog" }), _jsx("p", { className: "docs-lead", children: "Invite team members, set roles, and send emails." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-4">
      <SeatInviteDialog />
    </div>
  )
}

render(<Example />)` })] })] }));
}
//# sourceMappingURL=page.js.map