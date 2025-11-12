import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Error Boundary Enhanced | Clarity Chat',
    description: 'Enhanced error boundary with error tracking, user feedback, and automatic reporting.'
};
export default function ErrorBoundaryEnhancedPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Error Boundary Enhanced" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Production-ready error boundary with automatic error reporting, user feedback collection, and customizable fallback UI." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Automatic error reporting to configured providers" }), _jsx("li", { children: "User feedback collection with modal interface" }), _jsx("li", { children: "Customizable fallback UI with error context" }), _jsx("li", { children: "Severity levels: fatal, error, warning" }), _jsx("li", { children: "Development mode detailed error display" }), _jsx("li", { children: "Reset functionality to recover from errors" }), _jsx("li", { children: "Integration with useErrorReporter hook" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { ErrorBoundaryEnhanced } from '@clarity-chat/react'

<ErrorBoundaryEnhanced
  enableFeedback
  severity="error"
  errorContext={{ userId: '123', page: 'chat' }}
  onError={(error, errorInfo) => {
    console.error('Error caught:', error)
  }}
>
  <YourApp />
</ErrorBoundaryEnhanced>` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map