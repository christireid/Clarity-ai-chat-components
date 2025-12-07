import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Streaming Chat Demo - Clarity Chat',
    description: 'Advanced streaming experience that renders tokens as soon as they arrive from the server.',
};
export default function StreamingPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Example" }), _jsx("h1", { children: "Streaming Chat Demo" }), _jsx("p", { className: "docs-lead", children: "Advanced streaming experience that renders tokens as soon as they arrive from the server." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Features" }), _jsxs("ul", { children: [_jsx("li", { children: "Server-Sent Events (SSE) based streaming endpoint." }), _jsx("li", { children: "Typing indicator and retry controls during long responses." }), _jsx("li", { children: "Graceful cancellation and abort handling." }), _jsx("li", { children: "Transcript persistence for refreshing or sharing links." })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Running Locally" }), _jsx(CodeBlock, { language: "bash", code: `cd examples/streaming-chat
npm install
npm run dev` }), _jsxs("p", { children: ["Ensure the ", _jsx("code", { children: ".env.local" }), " file contains your API key and SSE endpoint configuration."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Architecture" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "API Route" }), " \u2013 Next.js route streams data using ", _jsx("code", { children: "TextEncoderStream" }), "."] }), _jsxs("li", { children: [_jsx("strong", { children: "Client Hook" }), " \u2013 ", _jsx("code", { children: "useStreamingChat" }), " collects partial deltas and updates messages."] }), _jsxs("li", { children: [_jsx("strong", { children: "UI" }), " \u2013 ", _jsx("code", { children: "StreamingMessage" }), " animates text reveal and caret."] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Implementation Snippet" }), _jsx(CodeBlock, { language: "tsx", code: `import { useStreamingChat } from '@clarity-chat/react'

const { messages, streamMessage } = useStreamingChat({ chatId: 'streaming-demo' })

await streamMessage({
  role: 'user',
  content: 'Outline a migration plan from REST to GraphQL',
})` }), _jsxs("p", { children: ["Inspect ", _jsx("code", { children: "examples/streaming-chat" }), " for environment setup, API handlers, and UI integration tips."] })] })] }));
}
//# sourceMappingURL=page.js.map