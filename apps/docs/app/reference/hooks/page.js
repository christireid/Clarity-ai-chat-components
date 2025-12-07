'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { PropsTable } from '@/components/Enhanced/PropsTable';
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn';
import { ToastProvider } from '@clarity-chat/react';
const useMessageOperationsProps = [
    {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Array of messages to manage',
    },
    {
        name: 'setMessages',
        type: 'React.Dispatch<React.SetStateAction<Message[]>>',
        required: true,
        description: 'State setter function for messages',
    },
    {
        name: 'options',
        type: 'MessageOperationsOptions',
        description: 'Optional configuration object',
    },
];
const useStreamingChatProps = [
    {
        name: 'apiEndpoint',
        type: 'string',
        required: true,
        description: 'API endpoint URL for streaming chat',
    },
    {
        name: 'options',
        type: 'StreamingChatOptions',
        description: 'Optional configuration including onError, onComplete, etc.',
    },
];
const useTokenTrackerProps = [
    {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Array of messages to track tokens for',
    },
    {
        name: 'options',
        type: 'TokenTrackerOptions',
        description: 'Configuration including model, includeSystemPrompts, etc.',
    },
];
export default function HooksPage() {
    return (_jsxs(ToastProvider, { children: [_jsx(Breadcrumbs, {}), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent", children: "Hooks API Reference" }), _jsx("p", { className: "text-xl text-text-secondary leading-relaxed", children: "Complete API reference for all React hooks available in Clarity Chat. Hooks provide a clean, composable API for building chat interfaces." })] }), _jsx(YouWillLearn, { items: [
                    'Understand hook APIs and parameters',
                    'Learn return values and methods',
                    'Discover hook composition patterns',
                    'See practical usage examples',
                ] }), _jsx(Callout, { type: "info", className: "mb-8", children: _jsxs("p", { children: [_jsx("strong", { children: "Note:" }), " All hooks are client-side only and must be used within components marked with ", _jsx("code", { className: "px-1.5 py-0.5 bg-bg-secondary rounded text-sm", children: "'use client'" }), "."] }) }), _jsxs("section", { className: "my-12", children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "Core Hooks" }), _jsxs("div", { className: "space-y-12", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-semibold mb-4", children: "useMessageOperations" }), _jsx("p", { className: "text-text-secondary mb-6", children: "Manage message operations like edit, regenerate, delete, and undo/redo." }), _jsx(EnhancedCodeBlock, { code: `import { useMessageOperations } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([])
  
  const {
    editMessage,
    regenerateMessage,
    deleteMessage,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations(messages, setMessages)

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      onEditMessage={editMessage}
      onRegenerateMessage={regenerateMessage}
      onDeleteMessage={deleteMessage}
    />
  )
}`, language: "tsx", filename: "ChatComponent.tsx", showLineNumbers: true, showCopyButton: true }), _jsx(PropsTable, { props: useMessageOperationsProps, title: "Parameters" }), _jsxs("div", { className: "mt-6", children: [_jsx("h4", { className: "text-xl font-semibold mb-3", children: "Returns" }), _jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-bg-secondary border-b border-border", children: [_jsx("th", { className: "text-left p-4 font-semibold text-text-primary", children: "Name" }), _jsx("th", { className: "text-left p-4 font-semibold text-text-primary", children: "Type" }), _jsx("th", { className: "text-left p-4 font-semibold text-text-primary", children: "Description" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { className: "border-b border-border", children: [_jsx("td", { className: "p-4", children: _jsx("code", { className: "text-sm font-mono", children: "editMessage" }) }), _jsx("td", { className: "p-4", children: _jsxs("code", { className: "text-sm font-mono text-brand-500", children: ["(id: string, content: string) ", '=>', " void"] }) }), _jsx("td", { className: "p-4 text-sm text-text-secondary", children: "Edit a message by ID" })] }), _jsxs("tr", { className: "border-b border-border", children: [_jsx("td", { className: "p-4", children: _jsx("code", { className: "text-sm font-mono", children: "regenerateMessage" }) }), _jsx("td", { className: "p-4", children: _jsxs("code", { className: "text-sm font-mono text-brand-500", children: ["(id: string) ", '=>', " void"] }) }), _jsx("td", { className: "p-4 text-sm text-text-secondary", children: "Regenerate a message" })] }), _jsxs("tr", { className: "border-b border-border", children: [_jsx("td", { className: "p-4", children: _jsx("code", { className: "text-sm font-mono", children: "deleteMessage" }) }), _jsx("td", { className: "p-4", children: _jsxs("code", { className: "text-sm font-mono text-brand-500", children: ["(id: string) ", '=>', " void"] }) }), _jsx("td", { className: "p-4 text-sm text-text-secondary", children: "Delete a message" })] }), _jsxs("tr", { className: "border-b border-border", children: [_jsx("td", { className: "p-4", children: _jsx("code", { className: "text-sm font-mono", children: "undo" }) }), _jsx("td", { className: "p-4", children: _jsxs("code", { className: "text-sm font-mono text-brand-500", children: ["() ", '=>', " void"] }) }), _jsx("td", { className: "p-4 text-sm text-text-secondary", children: "Undo last operation" })] }), _jsxs("tr", { className: "border-b border-border", children: [_jsx("td", { className: "p-4", children: _jsx("code", { className: "text-sm font-mono", children: "redo" }) }), _jsx("td", { className: "p-4", children: _jsxs("code", { className: "text-sm font-mono text-brand-500", children: ["() ", '=>', " void"] }) }), _jsx("td", { className: "p-4 text-sm text-text-secondary", children: "Redo last undone operation" })] }), _jsxs("tr", { className: "border-b border-border", children: [_jsx("td", { className: "p-4", children: _jsx("code", { className: "text-sm font-mono", children: "canUndo" }) }), _jsx("td", { className: "p-4", children: _jsx("code", { className: "text-sm font-mono text-brand-500", children: "boolean" }) }), _jsx("td", { className: "p-4 text-sm text-text-secondary", children: "Whether undo is available" })] }), _jsxs("tr", { children: [_jsx("td", { className: "p-4", children: _jsx("code", { className: "text-sm font-mono", children: "canRedo" }) }), _jsx("td", { className: "p-4", children: _jsx("code", { className: "text-sm font-mono text-brand-500", children: "boolean" }) }), _jsx("td", { className: "p-4 text-sm text-text-secondary", children: "Whether redo is available" })] })] })] }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-semibold mb-4", children: "useStreamingChat" }), _jsx("p", { className: "text-text-secondary mb-6", children: "Handle streaming chat responses with real-time updates." }), _jsx(EnhancedCodeBlock, { code: `import { useStreamingChat } from '@clarity-chat/react'

function StreamingChat() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    stopStreaming,
  } = useStreamingChat({
    apiEndpoint: '/api/chat/stream',
    onError: (error) => {
      console.error('Streaming error:', error)
    },
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    />
  )
}`, language: "tsx", filename: "StreamingChat.tsx", showLineNumbers: true, showCopyButton: true }), _jsx(PropsTable, { props: useStreamingChatProps, title: "Parameters" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-semibold mb-4", children: "useTokenTracker" }), _jsx("p", { className: "text-text-secondary mb-6", children: "Track token usage and estimate costs for AI API calls." }), _jsx(EnhancedCodeBlock, { code: `import { useTokenTracker, TokenCounter } from '@clarity-chat/react'

function ChatWithTracking() {
  const [messages, setMessages] = useState<Message[]>([])
  
  const tokenStats = useTokenTracker(messages, {
    model: 'gpt-4',
    includeSystemPrompts: true,
  })

  return (
    <div>
      <TokenCounter
        inputTokens={tokenStats.inputTokens}
        outputTokens={tokenStats.outputTokens}
        totalTokens={tokenStats.totalTokens}
        estimatedCost={tokenStats.estimatedCost}
      />
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
      />
    </div>
  )
}`, language: "tsx", filename: "ChatWithTracking.tsx", showLineNumbers: true, showCopyButton: true }), _jsx(PropsTable, { props: useTokenTrackerProps, title: "Parameters" })] })] })] }), _jsxs("section", { className: "my-12", children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "Utility Hooks" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "p-6 rounded-lg bg-bg-secondary border border-border", children: [_jsx("h4", { className: "font-semibold text-text-primary mb-2", children: "useLocalStorage" }), _jsx("p", { className: "text-sm text-text-secondary mb-4", children: "Persist state to localStorage with automatic serialization." }), _jsx(EnhancedCodeBlock, { code: `const [chatId, setChatId] = useLocalStorage('chatId', 'default')`, language: "tsx", showCopyButton: true })] }), _jsxs("div", { className: "p-6 rounded-lg bg-bg-secondary border border-border", children: [_jsx("h4", { className: "font-semibold text-text-primary mb-2", children: "useIndexedDB" }), _jsx("p", { className: "text-sm text-text-secondary mb-4", children: "Store large data in IndexedDB for offline support." }), _jsx(EnhancedCodeBlock, { code: `const { data, setData, loading } = useIndexedDB('messages')`, language: "tsx", showCopyButton: true })] }), _jsxs("div", { className: "p-6 rounded-lg bg-bg-secondary border border-border", children: [_jsx("h4", { className: "font-semibold text-text-primary mb-2", children: "useAutoScroll" }), _jsx("p", { className: "text-sm text-text-secondary mb-4", children: "Automatically scroll to bottom when new messages arrive." }), _jsx(EnhancedCodeBlock, { code: `const scrollRef = useAutoScroll(messages, { behavior: 'smooth' })`, language: "tsx", showCopyButton: true })] }), _jsxs("div", { className: "p-6 rounded-lg bg-bg-secondary border border-border", children: [_jsx("h4", { className: "font-semibold text-text-primary mb-2", children: "useErrorRecovery" }), _jsx("p", { className: "text-sm text-text-secondary mb-4", children: "Handle errors with automatic retry and recovery." }), _jsx(EnhancedCodeBlock, { code: `const { retry, isRetrying } = useErrorRecovery({ maxRetries: 3 })`, language: "tsx", showCopyButton: true })] })] })] }), _jsx(Callout, { type: "tip", children: _jsxs("p", { children: [_jsx("strong", { children: "Learn more:" }), " Check out the ", _jsx("a", { href: "/learn/concepts/hooks", className: "text-brand-500 hover:underline", children: "Hooks Concept Guide" }), " for detailed explanations and composition patterns."] }) })] }));
}
//# sourceMappingURL=page.js.map