import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'React Components API Reference - Clarity Chat',
    description: 'Comprehensive API documentation for all React components in the Clarity Chat component library.',
};
export default function ReactComponentsAPIPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "API Reference" }), _jsx("h1", { children: "React Components API Documentation" }), _jsx("p", { className: "docs-lead", children: "Comprehensive API documentation for all React components in the Clarity Chat component library." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "ChatInput" }), _jsx("p", { children: "Enhanced chat input component with smooth animations, character counting, and comprehensive state management." }), _jsx("h3", { children: "Import" }), _jsx(CodeBlock, { language: "tsx", code: `import { ChatInput } from '@clarity-chat/react'` }), _jsx("h3", { children: "Features" }), _jsxs("ul", { children: [_jsx("li", { children: "Smooth expand/contract animation as user types" }), _jsx("li", { children: "Character counter with color-coded feedback" }), _jsx("li", { children: "Progress bar showing character limit" }), _jsx("li", { children: "Glowing focus ring with pulse animation" }), _jsx("li", { children: "Send button state transitions (idle \u2192 loading \u2192 success \u2192 error)" }), _jsx("li", { children: "Auto-resize textarea up to 6 lines" }), _jsx("li", { children: "Error shake animation when over limit" }), _jsx("li", { children: "Keyboard shortcuts (Enter to send, Shift+Enter for new line)" })] }), _jsx("h3", { children: "Example" }), _jsx(CodeBlock, { language: "tsx", code: `<ChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  maxLength={500}
  showCharCounter
/>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Message" }), _jsx("p", { children: "Enhanced message component for displaying chat messages with animations, feedback, and interactive features." }), _jsx("h3", { children: "Import" }), _jsx(CodeBlock, { language: "tsx", code: `import { Message } from '@clarity-chat/react'` }), _jsx("h3", { children: "Message Type" }), _jsx(CodeBlock, { language: "tsx", code: `interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  status?: 'streaming' | 'complete' | 'error'
  timestamp?: Date
  feedback?: {
    type: 'up' | 'down'
  }
}` }), _jsx("h3", { children: "Features" }), _jsxs("ul", { children: [_jsx("li", { children: "Slide-in animations" }), _jsx("li", { children: "Hover actions" }), _jsx("li", { children: "Feedback buttons with confetti" }), _jsx("li", { children: "Copy to clipboard" }), _jsx("li", { children: "Edit and regenerate" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/api/primitives", children: "Primitives API" }), " - Basic components"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components", children: "Components Overview" }), " - Browse all components"] }), _jsxs("li", { children: [_jsx("a", { href: "/guides/components", children: "Components Guide" }), " - Usage guide"] })] })] })] }));
}
//# sourceMappingURL=page.js.map