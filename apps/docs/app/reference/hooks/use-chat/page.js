import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MessageFlowSequence } from '@/components/Diagrams/MessageFlowSequence';
export const metadata = {
    title: 'useChat Hook | Clarity Chat',
    description: 'Main hook for chat functionality with message management, streaming, and AI interactions.',
};
export default function UseChatPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useChat Hook" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Core React hook for building chat interfaces with message management, streaming responses, and AI model integration." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Message state management with optimistic updates" }), _jsx("li", { children: "Streaming response handling with SSE/WebSocket support" }), _jsx("li", { children: "Multi-model support (OpenAI, Anthropic, Google)" }), _jsx("li", { children: "Automatic token counting and context management" }), _jsx("li", { children: "Error handling and retry logic" }), _jsx("li", { children: "File upload and attachment handling" }), _jsx("li", { children: "Message editing and deletion" }), _jsx("li", { children: "Conversation history persistence" })] })] }), _jsx(MessageFlowSequence, {}), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { useChat } from '@clarity-chat/react'

function ChatComponent() {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    error
  } = useChat({
    apiEndpoint: '/api/chat',
    model: 'gpt-4',
    onError: (error) => console.error(error)
  })

  return (
    <div>
      <MessageList messages={messages} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        disabled={isLoading}
      />
    </div>
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map