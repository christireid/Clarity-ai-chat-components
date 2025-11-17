import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Error Reporter | Clarity Chat',
    description: 'Error tracking and reporting utilities with provider integrations.'
};
export default function ErrorReporterPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Error Reporter" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Comprehensive error tracking system with integrations for Sentry, LogRocket, and custom providers." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Multiple provider support (Sentry, LogRocket, custom)" }), _jsx("li", { children: "Automatic error capture and reporting" }), _jsx("li", { children: "User feedback collection" }), _jsx("li", { children: "Error severity classification" }), _jsx("li", { children: "Context enrichment with user data" }), _jsx("li", { children: "Performance impact monitoring" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { ErrorReporter } from '@clarity-chat/react/error'

ErrorReporter.init({
  provider: 'sentry',
  dsn: 'your-sentry-dsn',
  environment: 'production'
})

ErrorReporter.captureError(error, {
  severity: 'error',
  context: { userId: '123' }
})` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map