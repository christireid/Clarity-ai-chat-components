import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useStreamingSSE | Clarity Chat',
    description: 'Server-Sent Events streaming with automatic reconnection.'
};
export default function UseStreamingSSEPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useStreamingSSE" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Handle Server-Sent Events (SSE) streams with automatic reconnection, error recovery, and event parsing." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { useStreamingSSE } from '@clarity-chat/react'

const { connect, disconnect, status, events } = useStreamingSSE({
  url: '/api/stream',
  method: 'POST',
  body: { query: 'Hello' },
  onMessage: (event) => {
    console.log('Received:', event.data)
  },
  autoReconnect: true,
  maxReconnectAttempts: 5
})

// Connect to stream
useEffect(() => {
  connect()
  return () => disconnect()
}, [])` }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Automatic reconnection with exponential backoff" }), _jsx("li", { children: "Event ID tracking for resume" }), _jsx("li", { children: "Heartbeat monitoring" }), _jsx("li", { children: "JSON parsing" }), _jsx("li", { children: "POST request support" })] })] })] }));
}
//# sourceMappingURL=page.js.map