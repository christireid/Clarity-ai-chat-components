import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'TypeScript Quickstart - Learn Clarity Chat',
    description: 'How to get full IntelliSense, strict typings, and safe adapters when using Clarity Chat.',
};
export default function LearnTypeScriptGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Quick Guide" }), _jsx("h1", { children: "TypeScript" }), _jsxs("p", { className: "docs-lead", children: ["Clarity Chat is built in TypeScript with 100% type coverage. Use this quickstart to wire up types correctly and avoid implicit ", _jsx("code", { children: "any" }), ' ', "sneaking into your codebase."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Install Types" }), _jsxs("p", { children: ["The primary package exports types, but you can optionally install", ' ', _jsx("code", { children: "@clarity-chat/types" }), " for shared models between frontend and backend."] }), _jsx(CodeBlock, { language: "bash", code: `npm install @clarity-chat/react @clarity-chat/types` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Typed Messages" }), _jsx("p", { children: "Import base interfaces for messages, tools, and adapters. They keep your API routes and client components aligned." }), _jsx(CodeBlock, { language: "ts", code: `import type {
  Message,
  ToolInvocation,
  ProviderResponse,
} from '@clarity-chat/types'

const messages: Message[] = [
  { id: '1', role: 'user', content: 'Hello!', createdAt: new Date() },
]

function handleToolInvocation(tool: ToolInvocation) {
  if (tool.name === 'search_docs') {
    // ...
  }
}

function normalizeResponse(response: ProviderResponse) {
  return response.choices[0].message
}
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Custom Hooks & Components" }), _jsx("p", { children: "Extend the built-in hooks with your own typed wrappers. The generics make it easy to plug in custom message metadata." }), _jsx(CodeBlock, { language: "ts", code: `import type { Message } from '@clarity-chat/types'
import { useChat } from '@clarity-chat/react'

interface SupportMessage extends Message {
  sentiment?: 'positive' | 'neutral' | 'negative'
  ticketId?: string
}

export function useSupportChat() {
  return useChat<SupportMessage>({
    id: 'support',
    initialMessages: [],
  })
}
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Strict Type Safety Tips" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Enable ", _jsx("code", { children: "\"strict\": true" }), " in ", _jsx("code", { children: "tsconfig.json" })] }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "ProviderConfig" }), " and ", _jsx("code", { children: "AdapterConfig" }), " types to validate adapters"] }), _jsxs("li", { children: ["For streaming handlers, type responses with ", _jsx("code", { children: "StreamingChunk" })] }), _jsxs("li", { children: ["Wrap API routes with ", _jsx("code", { children: "ValidatedRequest" }), " to catch schema mismatches"] })] })] }), _jsx("section", { className: "docs-section", children: _jsxs(Callout, { type: "success", children: ["Want to see exhaustive examples (mock providers, testing helpers, error boundaries)? Visit the", ' ', _jsx(Link, { href: "/guides/testing", children: "Testing Strategy Guide" }), " and", ' ', _jsx(Link, { href: "/guides/state-management", children: "State Management Guide" }), "."] }) })] }));
}
//# sourceMappingURL=page.js.map