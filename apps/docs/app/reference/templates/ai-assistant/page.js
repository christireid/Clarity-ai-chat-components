import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'AI Assistant Template | Clarity Chat',
    description: 'Pre-built AI assistant chat template with modern UI and full feature set.'
};
export default function AIAssistantTemplatePage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "AI Assistant Template" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Complete AI assistant chat interface template with streaming, file uploads, and conversation management." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Modern chat UI with message bubbles" }), _jsx("li", { children: "Streaming response support" }), _jsx("li", { children: "File attachment handling" }), _jsx("li", { children: "Code syntax highlighting" }), _jsx("li", { children: "Markdown rendering" }), _jsx("li", { children: "Conversation history" }), _jsx("li", { children: "Model selection dropdown" }), _jsx("li", { children: "Settings panel" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { AIAssistant } from '@clarity-chat/react/templates'

function App() {
  return (
    <AIAssistant
      apiEndpoint="/api/chat"
      defaultModel="gpt-4-turbo"
      enableFileUpload
      enableVoiceInput
    />
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map