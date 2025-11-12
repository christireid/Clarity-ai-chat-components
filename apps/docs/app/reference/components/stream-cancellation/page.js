import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = { title: 'Stream Cancellation | Clarity Chat', description: 'Cancel button for active streaming operations.' };
export default function StreamCancellationPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Stream Cancellation" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Accessible cancel button for stopping active streams with optional progress indicator." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { StreamCancellation } from '@clarity-chat/react'

<StreamCancellation
  isStreaming={status === 'streaming'}
  onCancel={() => disconnect()}
  showProgress={true}
  progressMessage="Generating response..."
/>` }) })] })] }));
}
//# sourceMappingURL=page.js.map