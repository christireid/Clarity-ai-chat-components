import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'Hooks API Reference - Clarity Chat',
    description: 'Complete reference for all Clarity Chat hooks.',
};
export default function HooksAPIPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "API Reference" }), _jsx("h1", { children: "Hooks API" }), _jsx("p", { className: "docs-lead", children: "Complete reference for all Clarity Chat hooks." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "useChat" }), _jsx("p", { children: "Main hook for managing chat state and operations." }), _jsx("h3", { children: "Signature" }), _jsx(CodeBlock, { language: "typescript", code: `function useChat(options?: UseChatOptions): UseChatReturn` }), _jsx("h3", { children: "Options" }), _jsx(CodeBlock, { language: "typescript", code: `interface UseChatOptions {
  initialMessages?: Message[]
  onError?: (error: Error) => void
  maxMessages?: number
}` }), _jsx("h3", { children: "Return Value" }), _jsx(CodeBlock, { language: "typescript", code: `interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}` }), _jsx("h3", { children: "Usage" }), _jsx(CodeBlock, { language: "typescript", code: `const { 
  messages, 
  isLoading, 
  sendMessage,
  undo,
  redo,
} = useChat({
  initialMessages: [{
    id: '1',
    role: 'assistant',
    content: 'Hello!',
    timestamp: Date.now(),
  }],
  onError: (error) => console.error(error),
})` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "useStreamingChat" }), _jsx("p", { children: "Hook for handling streaming AI responses with Server-Sent Events." }), _jsx("h3", { children: "Signature" }), _jsx(CodeBlock, { language: "typescript", code: `function useStreamingChat(options: UseStreamingChatOptions): UseStreamingChatReturn` }), _jsx("h3", { children: "Options" }), _jsx(CodeBlock, { language: "typescript", code: `interface UseStreamingChatOptions {
  apiEndpoint: string
  onChunk?: (chunk: string) => void
  onComplete?: (fullMessage: string) => void
  onError?: (error: Error) => void
}` }), _jsx("h3", { children: "Return Value" }), _jsx(CodeBlock, { language: "typescript", code: `interface UseStreamingChatReturn {
  messages: Message[]
  isStreaming: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  cancelStream: () => void
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "useMessageOperations" }), _jsx("p", { children: "Hook for message editing, regeneration, and branching." }), _jsx("h3", { children: "Signature" }), _jsx(CodeBlock, { language: "typescript", code: `function useMessageOperations(messages: Message[]): UseMessageOperationsReturn` }), _jsx("h3", { children: "Return Value" }), _jsx(CodeBlock, { language: "typescript", code: `interface UseMessageOperationsReturn {
  messages: Message[]
  editMessage: (id: string, newContent: string) => void
  deleteMessage: (id: string) => void
  regenerateMessage: (id: string) => Promise<void>
  branchFromMessage: (id: string) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/components", children: "Components API" }), " - Component reference"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/api/types", children: "Types" }), " - Type definitions"] }), _jsxs("li", { children: [_jsx("a", { href: "/examples", children: "Examples" }), " - See hooks in action"] }), _jsxs("li", { children: [_jsx("a", { href: "/cookbook", children: "Cookbook" }), " - Common patterns"] })] })] })] }));
}
//# sourceMappingURL=page.js.map