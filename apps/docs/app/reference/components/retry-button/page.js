import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Retry Button | Clarity Chat',
    description: 'Smart retry button with exponential backoff, type-specific error messages, and attempt tracking.'
};
export default function RetryButtonPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Retry Button" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Production-ready retry button with exponential backoff, error type detection, and visual feedback." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Exponential backoff with configurable delays [1s, 3s, 10s]" }), _jsx("li", { children: "Error type detection: network, ratelimit, server, auth, unknown" }), _jsx("li", { children: "Visual countdown timer during backoff period" }), _jsx("li", { children: "Maximum attempts enforcement (default: 3)" }), _jsx("li", { children: "Success/failure callbacks for analytics" }), _jsx("li", { children: "Loading states during retry operation" }), _jsx("li", { children: "Size variants: sm, md, lg" }), _jsx("li", { children: "Style variants: default, ghost, outline" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { RetryButton } from '@clarity-chat/react'

<RetryButton
  onRetry={async () => await sendMessage()}
  errorType="network"
  maxAttempts={3}
  backoffMs={[1000, 3000, 10000]}
  onRetrySuccess={(attempt) => console.log('Success on attempt', attempt)}
  onMaxAttemptsReached={() => alert('Max retries reached')}
/>` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map