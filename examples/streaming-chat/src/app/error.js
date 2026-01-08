'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
/**
 * Error Boundary Page
 *
 * Catches runtime errors and displays a user-friendly error message
 * with a retry option. This follows Next.js App Router conventions.
 */
export default function Error({ error, reset, }) {
    useEffect(() => {
        // Log error to your error reporting service
        console.error('Application error:', error);
    }, [error]);
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: _jsxs("div", { className: "text-center space-y-4 max-w-md", children: [_jsx("div", { className: "mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center", children: _jsx(AlertCircle, { className: "w-8 h-8 text-destructive", "aria-hidden": "true" }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Something went wrong" }), _jsx("p", { className: "text-muted-foreground", children: error.message || 'An unexpected error occurred. Please try again.' })] }), error.digest && (_jsxs("p", { className: "text-xs text-muted-foreground font-mono bg-muted px-3 py-1 rounded", children: ["Error ID: ", error.digest] })), _jsxs("button", { onClick: reset, className: "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors", children: [_jsx(RefreshCw, { className: "w-4 h-4", "aria-hidden": "true" }), "Try again"] })] }) }));
}
//# sourceMappingURL=error.js.map