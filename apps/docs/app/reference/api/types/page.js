import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'Type Definitions - Clarity Chat',
    description: 'All packages expose strict TypeScript definitions for safer integrations.',
};
export default function TypesAPIPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "API Reference" }), _jsx("h1", { children: "Type Definitions" }), _jsx("p", { className: "docs-lead", children: "All packages expose strict TypeScript definitions for safer integrations." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Core Types" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "Message" }), " \u2013 canonical chat message shape used across hooks and components."] }), _jsxs("li", { children: [_jsx("code", { children: "ChatParticipant" }), " \u2013 describes system, user, assistant, or tool identities."] }), _jsxs("li", { children: [_jsx("code", { children: "Attachment" }), " \u2013 metadata for uploaded files, including name, size, type, and URL."] }), _jsxs("li", { children: [_jsx("code", { children: "ToolInvocation" }), " \u2013 captures tool call requests and responses."] })] }), _jsx(CodeBlock, { language: "ts", code: `import type { Message, Attachment } from '@clarity-chat/types'

const message: Message = {
  id: '1',
  chatId: 'demo',
  role: 'assistant',
  content: 'Your order ships tomorrow!',
  createdAt: new Date(),
  status: 'sent',
  attachments: [
    {
      id: 'invoice',
      name: 'invoice.pdf',
      url: 'https://cdn.example.com/invoice.pdf',
      type: 'application/pdf',
      size: 1024,
    } satisfies Attachment,
  ],
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Utility Types" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "ModelConfig" }), " \u2013 unify provider-specific options (temperature, top_p, maxTokens)."] }), _jsxs("li", { children: [_jsx("code", { children: "StreamingAdapter" }), " \u2013 interface for SSE/WebSocket streaming implementations."] }), _jsxs("li", { children: [_jsx("code", { children: "CostBreakdown" }), " \u2013 track prompt/output tokens and currency-converted totals."] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Type Augmentation" }), _jsx("p", { children: "Extend types to include domain-specific metadata:" }), _jsx(CodeBlock, { language: "ts", code: `declare module '@clarity-chat/types' {
  interface MessageMetadata {
    ticketId?: string
    sentiment?: 'positive' | 'neutral' | 'negative'
  }
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsx("ul", { children: _jsxs("li", { children: ["Continue to the ", _jsx("a", { href: "/reference/api/utilities", children: "Utilities" }), " reference for helper functions and adapters"] }) })] })] }));
}
//# sourceMappingURL=page.js.map