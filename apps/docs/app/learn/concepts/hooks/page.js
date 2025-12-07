'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ToastProvider } from '@clarity-chat/react';
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn';
import { TryItOut } from '@/components/Enhanced/TryItOut';
export const dynamic = 'force-dynamic';
export default function HooksConceptPage() {
    return (_jsx(ToastProvider, { children: _jsxs("div", { children: [_jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4", children: "Concept" }), _jsx("h1", { className: "text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent", children: "React Hooks" }), _jsx("p", { className: "text-xl text-text-secondary leading-relaxed", children: "Clarity Chat provides 35+ React hooks to handle chat functionality, state management, streaming, and more. Hooks provide a clean, composable API for building chat interfaces." })] }), _jsx(YouWillLearn, { items: [
                        'Understand the hook architecture and patterns',
                        'Learn core hooks for chat functionality',
                        'Discover hooks for advanced features',
                        'Explore hook composition patterns',
                    ] }), _jsxs("section", { className: "my-12", children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "Core Hooks" }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-semibold mb-3", children: "useMessageOperations" }), _jsx("p", { className: "text-text-secondary mb-4", children: "Manage message operations like edit, regenerate, delete, and undo/redo." }), _jsx(EnhancedCodeBlock, { code: `import { useMessageOperations } from '@clarity-chat/react'
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
    <ToastProvider>
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      onEditMessage={editMessage}
      onRegenerateMessage={regenerateMessage}
      onDeleteMessage={deleteMessage}
    />
  )
}`, language: "tsx", filename: "ChatComponent.tsx", showLineNumbers: true, showCopyButton: true })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-semibold mb-3", children: "useStreamingChat" }), _jsx("p", { className: "text-text-secondary mb-4", children: "Handle streaming chat responses with real-time updates." }), _jsx(EnhancedCodeBlock, { code: `import { useStreamingChat } from '@clarity-chat/react'

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
    <ToastProvider>
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    />
  )
}`, language: "tsx", filename: "StreamingChat.tsx", showLineNumbers: true, showCopyButton: true })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-semibold mb-3", children: "useTokenTracker" }), _jsx("p", { className: "text-text-secondary mb-4", children: "Track token usage and estimate costs for AI API calls." }), _jsx(EnhancedCodeBlock, { code: `import { useTokenTracker, TokenCounter } from '@clarity-chat/react'

function ChatWithTracking() {
  const [messages, setMessages] = useState<Message[]>([])
  
  const tokenStats = useTokenTracker(messages, {
    model: 'gpt-4',
    includeSystemPrompts: true,
  })

  return (
    <ToastProvider>
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
    </ToastProvider>
  )
}`, language: "tsx", filename: "ChatWithTracking.tsx", showLineNumbers: true, showCopyButton: true })] })] })] }), _jsxs("section", { className: "my-12", children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "Utility Hooks" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "p-6 rounded-lg bg-bg-secondary border border-border", children: [_jsx("h4", { className: "font-semibold text-text-primary mb-2", children: "useLocalStorage" }), _jsx("p", { className: "text-sm text-text-secondary mb-4", children: "Persist state to localStorage with automatic serialization." }), _jsx(EnhancedCodeBlock, { code: `const [chatId, setChatId] = useLocalStorage('chatId', 'default')`, language: "tsx", showCopyButton: true })] }), _jsxs("div", { className: "p-6 rounded-lg bg-bg-secondary border border-border", children: [_jsx("h4", { className: "font-semibold text-text-primary mb-2", children: "useIndexedDB" }), _jsx("p", { className: "text-sm text-text-secondary mb-4", children: "Store large data in IndexedDB for offline support." }), _jsx(EnhancedCodeBlock, { code: `const { data, setData, loading } = useIndexedDB('messages')`, language: "tsx", showCopyButton: true })] }), _jsxs("div", { className: "p-6 rounded-lg bg-bg-secondary border border-border", children: [_jsx("h4", { className: "font-semibold text-text-primary mb-2", children: "useAutoScroll" }), _jsx("p", { className: "text-sm text-text-secondary mb-4", children: "Automatically scroll to bottom when new messages arrive." }), _jsx(EnhancedCodeBlock, { code: `const scrollRef = useAutoScroll(messages, { behavior: 'smooth' })`, language: "tsx", showCopyButton: true })] }), _jsxs("div", { className: "p-6 rounded-lg bg-bg-secondary border border-border", children: [_jsx("h4", { className: "font-semibold text-text-primary mb-2", children: "useErrorRecovery" }), _jsx("p", { className: "text-sm text-text-secondary mb-4", children: "Handle errors with automatic retry and recovery." }), _jsx(EnhancedCodeBlock, { code: `const { retry, isRetrying } = useErrorRecovery({ maxRetries: 3 })`, language: "tsx", showCopyButton: true })] })] })] }), _jsxs("section", { className: "my-12", children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "Hook Composition" }), _jsx("p", { className: "text-text-secondary mb-6", children: "Hooks are designed to be composed together. Here's an example combining multiple hooks:" }), _jsx(EnhancedCodeBlock, { code: `import {
  useMessageOperations,
  useStreamingChat,
  useTokenTracker,
  useLocalStorage,
  useAutoScroll,
} from '@clarity-chat/react'

function AdvancedChat() {
  // Persist chat ID
  const [chatId, setChatId] = useLocalStorage('chatId', 'default')
  
  // Handle streaming
  const {
    messages,
    isLoading,
    sendMessage,
  } = useStreamingChat({
    apiEndpoint: '/api/chat/stream',
    chatId,
  })
  
  // Message operations
  const {
    editMessage,
    regenerateMessage,
    deleteMessage,
  } = useMessageOperations(messages, setMessages)
  
  // Token tracking
  const tokenStats = useTokenTracker(messages)
  
  // Auto-scroll
  const scrollRef = useAutoScroll(messages)
  
  return (
    <ToastProvider>
    <div ref={scrollRef}>
      <TokenCounter {...tokenStats} />
      <ChatWindow
        messages={messages}
        onSendMessage={sendMessage}
        onEditMessage={editMessage}
        onRegenerateMessage={regenerateMessage}
        onDeleteMessage={deleteMessage}
        isLoading={isLoading}
      />
    </div>
    </ToastProvider>
  )
}`, language: "tsx", filename: "AdvancedChat.tsx", showLineNumbers: true, showCopyButton: true }), _jsx(TryItOut, { title: "Try composing hooks", children: _jsx("p", { className: "text-text-secondary mb-4", children: "Experiment with combining different hooks. Each hook handles a specific concern, making your code more maintainable and testable." }) })] }), _jsx(Callout, { type: "info", children: _jsxs("p", { children: [_jsx("strong", { children: "Tip:" }), " Check out the ", _jsx("a", { href: "/reference/hooks", className: "text-brand-500 hover:underline", children: "Hooks API Reference" }), " for complete documentation of all available hooks."] }) })] }) }));
}
//# sourceMappingURL=page.js.map