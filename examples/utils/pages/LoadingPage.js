import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function LoadingPage({ title = 'Loading...', description = 'Please wait while we load your content.', }) {
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: _jsxs("div", { className: "text-center space-y-4", children: [_jsx("div", { className: "mx-auto w-16 h-16 rounded-full border-4 border-muted border-t-primary animate-spin", role: "status", "aria-label": title }), _jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-xl font-medium", children: title }), _jsx("p", { className: "text-muted-foreground", children: description })] }), _jsx("span", { className: "sr-only", children: title })] }) }));
}
export default LoadingPage;
//# sourceMappingURL=LoadingPage.js.map