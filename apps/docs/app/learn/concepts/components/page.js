'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock';
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn';
export default function ComponentsConceptPage() {
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4", children: "Concept" }), _jsx("h1", { className: "text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent", children: "Component System" }), _jsx("p", { className: "text-xl text-text-secondary leading-relaxed", children: "Clarity Chat ships 70+ composable components. This overview helps you pick the right building blocks for conversations, streaming, analytics, and enterprise workflows." })] }), _jsx(YouWillLearn, { items: [
                        'Understand the component architecture and families',
                        'Learn how to compose components for different use cases',
                        'Discover component composition patterns',
                        'Explore component customization options',
                    ] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Component Families" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Conversation Core" }), ": ", _jsx("code", { children: "ChatWindow" }), ",", ' ', _jsx("code", { children: "Message" }), ", ", _jsx("code", { children: "MessageList" }), ", ", _jsx("code", { children: "ChatInput" })] }), _jsxs("li", { children: [_jsx("strong", { children: "Context & Knowledge" }), ": ", _jsx("code", { children: "ContextCard" }), ",", ' ', _jsx("code", { children: "KnowledgeBaseViewer" }), ", ", _jsx("code", { children: "MultiModalPreview" })] }), _jsxs("li", { children: [_jsx("strong", { children: "Streaming & Status" }), ":", ' ', _jsx("code", { children: "StreamingMessage" }), ", ", _jsx("code", { children: "ThinkingIndicator" }), ",", ' ', _jsx("code", { children: "StreamCancellation" })] }), _jsxs("li", { children: [_jsx("strong", { children: "Branching & History" }), ":", ' ', _jsx("code", { children: "ConversationBranchVisualizer" }), ", ", _jsx("code", { children: "ConversationList" })] }), _jsxs("li", { children: [_jsx("strong", { children: "Productivity" }), ": ", _jsx("code", { children: "CommandPalette" }), ",", ' ', _jsx("code", { children: "PromptLibrary" }), ", ", _jsx("code", { children: "FollowUpSuggestions" })] }), _jsxs("li", { children: [_jsx("strong", { children: "Enterprise & Analytics" }), ":", ' ', _jsx("code", { children: "UsageDashboard" }), ", ", _jsx("code", { children: "PerformanceDashboard" }), ",", ' ', _jsx("code", { children: "SafetyStatusCard" }), ", ", _jsx("code", { children: "TokenCounter" })] }), _jsxs("li", { children: [_jsx("strong", { children: "AI Ops" }), ": ", _jsx("code", { children: "AgentRunFeed" }), ", ", _jsx("code", { children: "ToolInvocationCard" }), ",", ' ', _jsx("code", { children: "SessionSummaryCard" })] })] }), _jsx(Callout, { type: "info", children: "Every component is tree-shakeable. Only the pieces you import end up in your bundle." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Composing a Page" }), _jsx("p", { children: "Components are designed to be composed like regular React building blocks. Here is a typical product page layout:" }), _jsx(EnhancedCodeBlock, { language: "tsx", code: `import {
  ChatWindow,
  ConversationList,
  ContextVisualizer,
  UsageDashboard,
  useChat,
} from '@clarity-chat/react'

export function CustomerSuccessWorkspace() {
  const chat = useChat({ id: 'customer-success', api: '/api/chat/cs' })

  return (
    <>
    <div className="grid lg:grid-cols-[280px,minmax(0,1fr),320px] h-[calc(100vh-64px)]">
      <ConversationList
        conversations={chat.conversations}
        activeConversationId={chat.id}
        onSelectConversation={chat.setConversationId}
      />

      <ChatWindow
        messages={chat.messages}
        onSendMessage={chat.handleSubmit}
        onRegenerateMessage={chat.regenerateMessage}
        contextPanel={
          <ContextVisualizer
            contextItems={chat.context}
            onRemoveContext={chat.removeContextItem}
          />
        }
      />

      <UsageDashboard
        stats={chat.usage}
        limits={chat.limits}
        className="hidden xl:block border-l border-border"
      />
    </div>
    </>
  )
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Customising Behaviour" }), _jsx("p", { children: "Components expose granular props, slot-like overrides, and render props so you can adjust copy, icons, and layouts without forking." }), _jsx(EnhancedCodeBlock, { language: "tsx", code: `<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  components={{
    Message: (props) => (
      <Message
        {...props}
        avatar={props.message.role === 'assistant' ? assistantAvatar : userAvatar}
        className={
          props.message.role === 'assistant'
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200'
            : 'bg-surface border-border'
        }
      />
    ),
    Toolbar: ({ children }) => (
      <div className="flex items-center gap-2 border-t border-border bg-muted/30 px-3 py-2">
        <CommandPalette.Trigger />
        <PromptLibrary.Trigger />
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    ),
  }}
/>` }), _jsxs(Callout, { type: "tip", children: ["Need full control? Each component has a counterpart in the", ' ', _jsx("code", { children: "primitives" }), " package (Radix-style) so you can construct your own UI with the same accessibility guarantees."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "When to Reach for Storybook" }), _jsxs("p", { children: ["The Storybook workspace (", _jsx("code", { children: "npm run storybook" }), ") showcases every component with knobs for props and best practice notes. Use it to:"] }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83D\uDCDA Explore variants before integrating into your app" }), _jsx("li", { children: "\uD83C\uDFA8 Copy/paste code snippets for faster prototyping" }), _jsx("li", { children: "\uD83E\uDDEA Verify accessibility & responsive behaviour in isolation" }), _jsx("li", { children: "\uD83D\uDCDD Share interactive docs with design and product teams" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Key Takeaways" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Start with ", _jsx("code", { children: "ChatWindow" }), "; it covers 80% of use cases."] }), _jsx("li", { children: "Add specialised components (branching, tooling, dashboards) as product needs grow." }), _jsx("li", { children: "Override slots/render props for brand-specific UI without rewriting logic." }), _jsx("li", { children: "Use Storybook and the docs site to explore new components as they ship." })] })] })] }) }));
}
//# sourceMappingURL=page.js.map