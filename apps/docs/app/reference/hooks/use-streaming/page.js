import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useStreaming Hook | Clarity Chat',
    description: 'Hook for handling streaming AI responses with SSE and WebSocket support.'
};
export default function UseStreamingPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useStreaming Hook" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "React hook for managing streaming AI responses with support for Server-Sent Events (SSE) and WebSocket protocols." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "SSE and WebSocket protocol support" }), _jsx("li", { children: "Automatic reconnection on connection loss" }), _jsx("li", { children: "Buffered streaming with smooth text rendering" }), _jsx("li", { children: "Progress tracking and completion detection" }), _jsx("li", { children: "Error handling and recovery" }), _jsx("li", { children: "Abort/cancel streaming capability" }), _jsx("li", { children: "Token usage tracking during streaming" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { useStreaming } from '@clarity-chat/react'

function StreamingChat() {
  const {
    streamedText,
    isStreaming,
    error,
    startStreaming,
    stopStreaming
  } = useStreaming({
    endpoint: '/api/stream',
    protocol: 'sse',
    onComplete: (fullText) => console.log('Done:', fullText)
  })

  return (
    <div>
      <p>{streamedText}</p>
      {isStreaming && <LoadingDots />}
      <button onClick={stopStreaming}>Stop</button>
    </div>
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map