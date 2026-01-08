'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
export function ErrorPage({ error, reset, title = 'Something went wrong', description, }) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: _jsxs("div", { className: "text-center space-y-4 max-w-md", children: [_jsx("div", { className: "mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center", "aria-hidden": "true", children: _jsx("svg", { className: "w-8 h-8 text-red-600 dark:text-red-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-2xl font-semibold", children: title }), _jsx("p", { className: "text-muted-foreground", children: description ||
                                error.message ||
                                'An unexpected error occurred. Please try again.' })] }), error.digest && (_jsxs("p", { className: "text-xs text-muted-foreground font-mono bg-muted px-3 py-1 rounded inline-block", children: ["Error ID: ", error.digest] })), _jsxs("button", { onClick: reset, className: "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors", "aria-label": "Try again", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }), "Try again"] })] }) }));
}
export default ErrorPage;
//# sourceMappingURL=ErrorPage.js.map