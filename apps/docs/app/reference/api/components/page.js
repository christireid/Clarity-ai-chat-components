import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'Components API Reference - Clarity Chat',
    description: 'Complete reference for all Clarity Chat components.',
};
export default function ComponentsAPIPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "API Reference" }), _jsx("h1", { children: "Components API" }), _jsx("p", { className: "docs-lead", children: "Complete reference for all Clarity Chat components." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "ChatWindow" }), _jsx("p", { children: "The main container component that orchestrates the entire chat interface." }), _jsx("h3", { children: "Props" }), _jsx(CodeBlock, { language: "typescript", code: `interface ChatWindowProps {
  messages: Message[]
  isLoading?: boolean
  onSendMessage: (content: string) => void | Promise<void>
  onCancel?: () => void
  onEditMessage?: (messageId: string, newContent: string) => void
  onRegenerateMessage?: (messageId: string) => void
  onDeleteMessage?: (messageId: string) => void
  onBranchMessage?: (messageId: string) => void
  onFileUpload?: (files: File[]) => void
  placeholder?: string
  maxHeight?: string | number
  enableFileUpload?: boolean
  enableMessageOperations?: boolean
  enableMarkdown?: boolean
  enableCodeHighlight?: boolean
  theme?: ThemeConfig
  className?: string
}` }), _jsx("h3", { children: "Usage" }), _jsx(CodeBlock, { language: "tsx", code: `<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSendMessage}
  onCancel={handleCancel}
  placeholder="Type your message..."
  maxHeight="600px"
  enableFileUpload
  enableMessageOperations
/>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "MessageList" }), _jsx("p", { children: "Displays a scrollable list of messages with auto-scroll and virtualization." }), _jsx("h3", { children: "Props" }), _jsx(CodeBlock, { language: "typescript", code: `interface MessageListProps {
  messages: Message[]
  onEditMessage?: (messageId: string, newContent: string) => void
  onRegenerateMessage?: (messageId: string) => void
  onDeleteMessage?: (messageId: string) => void
  onCopyMessage?: (messageId: string) => void
  enableMessageOperations?: boolean
  enableMarkdown?: boolean
  enableCodeHighlight?: boolean
  virtualizeMessages?: boolean
  className?: string
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Message" }), _jsx("p", { children: "Individual message component with role-based styling." }), _jsx("h3", { children: "Props" }), _jsx(CodeBlock, { language: "typescript", code: `interface MessageProps {
  message: Message
  onEdit?: (messageId: string, newContent: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onCopy?: (messageId: string) => void
  enableOperations?: boolean
  enableMarkdown?: boolean
  enableCodeHighlight?: boolean
  className?: string
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Common Types" }), _jsx("h3", { children: "Message" }), _jsx(CodeBlock, { language: "typescript", code: `interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  isStreaming?: boolean
  error?: boolean
  metadata?: Record<string, any>
}` }), _jsx("h3", { children: "ThemeConfig" }), _jsx(CodeBlock, { language: "typescript", code: `interface ThemeConfig {
  primaryColor?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderRadius?: string
  fontFamily?: string
  fontSize?: string
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/hooks", children: "Hooks API" }), " - Learn about available hooks"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/api/types", children: "Types" }), " - Complete type definitions"] }), _jsxs("li", { children: [_jsx("a", { href: "/guides/theming", children: "Theming" }), " - Customize appearance"] }), _jsxs("li", { children: [_jsx("a", { href: "/examples", children: "Examples" }), " - See components in action"] })] })] })] }));
}
//# sourceMappingURL=page.js.map