import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Integration Guide - Clarity Chat',
    description: 'Complete guide for integrating Clarity Chat into your application.',
};
export default function IntegrationGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Integration Guide" }), _jsx("p", { className: "docs-lead", children: "Complete guide for integrating Clarity Chat into your application." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Quick Start" }), _jsx("h3", { children: "Installation" }), _jsx(CodeBlock, { language: "bash", code: `npm install @clarity-chat/react` }), _jsx("h3", { children: "Basic Setup" }), _jsx(CodeBlock, { language: "tsx", code: `import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
      />
    </ThemeProvider>
  )
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Component Integration" }), _jsx("h3", { children: "Enhanced Markdown Rendering" }), _jsx(CodeBlock, { language: "tsx", code: `import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

<EnhancedMarkdownRenderer
  content={markdownContent}
  config={{
    enableKaTeX: true,
    enableMermaid: true,
    enableSyntaxHighlight: true,
  }}
  isStreaming={isStreaming}
/>` }), _jsx("h3", { children: "Prompt Suggestions" }), _jsx(CodeBlock, { language: "tsx", code: `import { PromptSuggestions, usePromptSuggestions } from '@clarity-chat/react'

const suggestions = usePromptSuggestions(messages)
<PromptSuggestions
  suggestions={suggestions}
  onSelect={(s) => sendMessage(s.text)}
  layout="chips"
/>` }), _jsx("h3", { children: "Advanced Search" }), _jsx(CodeBlock, { language: "tsx", code: `import { AdvancedMessageSearch } from '@clarity-chat/react'

<AdvancedMessageSearch
  messages={messages}
  enableAdvancedFilters
  onResultsChange={setFiltered}
/>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Configuration" }), _jsx("h3", { children: "Using Configuration Builder" }), _jsx(CodeBlock, { language: "tsx", code: `import { createChatConfig } from '@clarity-chat/react'

const config = createChatConfig()
  .withStreaming({
    provider: 'openai',
    endpoint: '/api/chat',
    retryPolicy: 'exponential',
  })
  .withAccessibility({
    screenReader: true,
    keyboardNav: true,
  })
  .build()` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/guides/getting-started", children: "Getting Started" }), " - Learn the basics"] }), _jsxs("li", { children: [_jsx("a", { href: "/guides/best-practices", children: "Best Practices" }), " - Best practices guide"] }), _jsxs("li", { children: [_jsx("a", { href: "/integrations/nextjs", children: "Next.js Integration" }), " - Framework-specific guide"] })] })] })] }));
}
//# sourceMappingURL=page.js.map