import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Virtualized Chat Example - Clarity Chat Components',
    description: 'Render 10k+ messages smoothly with VirtualizedMessageList and MessageList smart threshold.',
};
export default function VirtualizedChatExamplePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Example" }), _jsx("span", { className: "docs-badge", children: "Performance" }), _jsx("h1", { children: "Virtualized Chat Transcript" }), _jsx("p", { className: "docs-lead", children: "Scale to enterprise-sized transcripts without janky scrolling. Virtualization keeps memory usage low and integrates with jump-to-bottom controls." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: ["This example renders 5,000+ messages and demonstrates how ", _jsx("code", { children: "VirtualizedMessageList" }), " cooperates with", _jsx("code", { children: "useMessageListScroll" }), " to manage sticky scrolling, unread counts, and jump buttons."] }), _jsxs("ul", { children: [_jsxs("li", { children: ["Automatic virtualization when message count crosses ", _jsx("code", { children: "virtualizationThreshold" }), "."] }), _jsx("li", { children: "\u201CJump to latest\u201D button appears when the user scrolls up." }), _jsx("li", { children: "Scroll analytics hook to track engagement and attach observers." })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Live Demo" }), _jsx(CodePlayground, { initialCode: `import { useMemo, useState } from 'react'
import {
  MessageList,
  useMessageListScroll,
  useJumpToBottom,
  Message,
} from '@clarity-chat/react'

function generateMessages(count: number): Message[] {
  return Array.from({ length: count }, (_, index) => ({
    id: \`msg-\${index}\`,
    role: index % 2 === 0 ? 'assistant' : 'user',
    content: index % 2 === 0
      ? \`Insight #\${index}: Virtualization keeps the UI fast.\`
      : \`User question #\${index}: How does virtualization work?\`,
  }))
}

export default function VirtualizedChat() {
  const initialMessages = useMemo(() => generateMessages(5000), [])
  const [messages, setMessages] = useState(initialMessages)
  const { isNearBottom, handleScroll, shouldAutoScroll } = useMessageListScroll(messages)
  const { showButton, newMessageCount, resetNewMessages, incrementNewMessages } = useJumpToBottom(isNearBottom)

  const addMessage = () => {
    const nextIndex = messages.length + 1
    setMessages((prev) => [
      ...prev,
      {
        id: \`msg-\${nextIndex}\`,
        role: nextIndex % 2 === 0 ? 'assistant' : 'user',
        content: \`New message \${nextIndex} added on demand.\`,
      },
    ])
    incrementNewMessages()
  }

  return (
    <div className="h-[520px] flex flex-col border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-secondary border-b border-border">
        <h2 className="font-semibold text-sm uppercase tracking-wide">Virtualized Conversation</h2>
        <button onClick={addMessage} className="px-3 py-1 text-sm bg-brand-500 text-white rounded">
          Add message
        </button>
      </div>
      <div className="flex-1 relative">
        <MessageList
          virtualizationThreshold={120}
          messages={messages}
          renderMessage={(message) => (
            <div className="px-4 py-2 border-b border-border/60 text-sm">
              <span className="font-semibold mr-2">{message.role === 'assistant' ? '🤖' : '🙋‍♀️'}</span>
              {message.content}
            </div>
          )}
          onScroll={handleScroll}
          autoScrollToBottom={shouldAutoScroll}
        />
        {showButton && (
          <button
            onClick={() => {
              resetNewMessages()
            }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-brand-500 text-white rounded-full shadow-lg"
          >
            {newMessageCount} new messages — Jump to latest
          </button>
        )}
      </div>
    </div>
  )
}

render(<generateMessages />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Recommendations" }), _jsx(Callout, { type: "tip", children: _jsxs("p", { children: ["For analytics dashboards, hook into ", _jsx("code", { children: "onScroll" }), " and ", _jsx("code", { children: "useMessageListPerformance" }), " to stream metrics about scroll depth, time spent, and render duration."] }) })] })] }));
}
//# sourceMappingURL=page.js.map