import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useClipboard Hook | Clarity Chat',
    description: 'Hook for clipboard operations with copy/paste functionality and user feedback.'
};
export default function UseClipboardPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useClipboard Hook" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "React hook for clipboard operations with copy/paste functionality, success feedback, and error handling." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Copy text to clipboard with one function call" }), _jsx("li", { children: "Success state tracking with auto-reset" }), _jsx("li", { children: "Error handling for failed operations" }), _jsx("li", { children: "Browser API compatibility detection" }), _jsx("li", { children: "Fallback for older browsers" }), _jsx("li", { children: "TypeScript support with proper typing" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { useClipboard } from '@clarity-chat/react'

function CopyButton({ text }) {
  const { copy, copied, error } = useClipboard({
    successDuration: 2000
  })

  return (
    <button onClick={() => copy(text)}>
      {copied ? 'Copied!' : 'Copy'}
      {error && <span>Failed to copy</span>}
    </button>
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map