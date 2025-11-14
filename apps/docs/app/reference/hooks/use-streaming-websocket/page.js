import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useStreamingWebSocket | Clarity Chat',
    description: 'WebSocket streaming with automatic reconnection and message queuing.'
};
export default function UseStreamingWebSocketPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useStreamingWebSocket" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Bidirectional WebSocket streaming with automatic reconnection, message queuing, and heartbeat monitoring." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { useStreamingWebSocket } from '@clarity-chat/react'

const { 
  connect, 
  disconnect, 
  send, 
  status, 
  messages 
} = useStreamingWebSocket({
  url: 'wss://api.example.com/ws',
  onMessage: (data) => {
    console.log('Received:', data)
  },
  autoReconnect: true
})

// Send message
const handleSend = () => {
  send({ type: 'chat', content: 'Hello' })
}` }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Automatic reconnection" }), _jsx("li", { children: "Message queue when disconnected" }), _jsx("li", { children: "Heartbeat/ping-pong" }), _jsx("li", { children: "Binary and text messages" }), _jsx("li", { children: "Connection state tracking" })] })] })] }));
}
//# sourceMappingURL=page.js.map