import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Test fixture: Security issues
export function UnsafeComponent({ userContent, userUrl }) {
    return (_jsxs("div", { children: [_jsx("div", { dangerouslySetInnerHTML: { __html: userContent } }), _jsx("a", { href: userUrl, children: "Link" }), _jsx("img", { src: userUrl, alt: "User image" })] }));
}
//# sourceMappingURL=bad-security.js.map