import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { ApiTable } from '@/components/Demo/ApiTable';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'VirtualizedMessageList',
    description: 'High-performance message rendering for conversations with thousands of entries.',
};
const props = [
    {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Messages to render in the timeline.',
    },
    {
        name: 'renderMessage',
        type: '(message: Message, index: number) => React.ReactNode',
        required: true,
        description: 'Render prop for individual messages.',
    },
    {
        name: 'estimatedItemSize',
        type: 'number',
        default: '150',
        description: 'Initial height estimate (px) used before measurement.',
    },
    {
        name: 'overscanCount',
        type: 'number',
        default: '3',
        description: 'Extra messages to render above/below the viewport to avoid blank gaps.',
    },
    {
        name: 'autoScrollToBottom',
        type: 'boolean',
        default: 'true',
        description: 'Automatically scroll to bottom when new messages arrive (if user is near bottom).',
    },
    {
        name: 'onScroll',
        type: '(scrollOffset: number) => void',
        description: 'Callback fired on scroll; useful for analytics or multi-pane layouts.',
    },
    {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes for the container.',
    },
    {
        name: 'itemKey',
        type: '(index: number, data: Message[]) => string',
        description: 'Custom key resolver to support optimistic updates or synthetic ids.',
    },
];
const hookProps = [
    {
        name: 'virtualizationThreshold',
        type: 'number',
        default: '100',
        description: 'Message count at which the smart `MessageList` switches into virtualization mode.',
    },
];
export default function VirtualizedMessageListPage() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("h1", { children: "VirtualizedMessageList" }), _jsx("p", { className: "lead", children: "Render thousands of messages without sacrificing scroll performance. Powered by react-window with intelligent height measurement, auto-scroll, and jump-to-bottom helpers." }), _jsx(Callout, { type: "info", children: _jsxs("p", { children: ["Use ", _jsx("code", { children: "MessageList" }), " for an auto-switching version that renders normally below a threshold and virtualizes above it."] }) }), _jsx("h2", { id: "import", children: "Import" }), _jsx(CodeBlock, { language: "tsx", code: `import {
  VirtualizedMessageList,
  MessageList,
  useMessageListScroll,
  useJumpToBottom,
} from '@clarity-chat/react'` }), _jsx("h2", { id: "basic-usage", children: "Basic Usage" }), _jsx(CodeBlock, { language: "tsx", title: "Rendering 10k messages", code: `import { VirtualizedMessageList, Message } from '@clarity-chat/react'

export function Transcript({ messages }: { messages: Message[] }) {
  return (
    <div className="h-[600px] border rounded-lg">
      <VirtualizedMessageList
        messages={messages}
        renderMessage={(message) => (
          <div className="px-4 py-3 border-b border-border/50">
            <strong>{message.role}</strong>: {message.content}
          </div>
        )}
      />
    </div>
  )
}` }), _jsx("h2", { id: "smart-mode", children: "Smart MessageList" }), _jsxs("p", { children: ["Prefer ", _jsx("code", { children: "MessageList" }), " when you want the library to decide when virtualization is needed. Set the", ' ', _jsx("code", { children: "virtualizationThreshold" }), " to control the switch."] }), _jsx(CodeBlock, { language: "tsx", code: `<MessageList
  messages={messages}
  renderMessage={renderMessage}
  virtualizationThreshold={150}
/>` }), _jsx("h2", { id: "scroll-management", children: "Scroll Management" }), _jsxs("p", { children: ["Combine ", _jsx("code", { children: "useMessageListScroll" }), " and ", _jsx("code", { children: "useJumpToBottom" }), " hooks to manage sticky scrolling, unread badges, and \u201Cjump to latest\u201D buttons."] }), _jsx(CodeBlock, { language: "tsx", code: `const { isNearBottom, handleScroll, shouldAutoScroll } = useMessageListScroll(messages)
const { showButton, newMessageCount, resetNewMessages } = useJumpToBottom(isNearBottom)

return (
  <>
    <VirtualizedMessageList
      messages={messages}
      renderMessage={renderMessage}
      onScroll={handleScroll}
      autoScrollToBottom={shouldAutoScroll}
    />
    {showButton && (
      <button onClick={resetNewMessages} className="jump-to-bottom">
        {newMessageCount} new messages • Jump to latest
      </button>
    )}
  </>
)` }), _jsx("h2", { id: "performance", children: "Performance Tips" }), _jsxs("ul", { children: [_jsx("li", { children: "Provide stable message IDs to keep height cache accurate." }), _jsxs("li", { children: ["Pipe analytics through ", _jsx("code", { children: "onScroll" }), " only when needed\u2014debounce for high-volume streams."] }), _jsxs("li", { children: ["Wrap ", _jsx("code", { children: "renderMessage" }), " in ", _jsx("code", { children: "useCallback" }), " or define it outside render to avoid re-renders."] }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "estimatedItemSize" }), " close to your average message height for smoother initial rendering."] })] }), _jsx("h2", { id: "props", children: "Props" }), _jsx(ApiTable, { data: props }), _jsx("h2", { id: "message-list-props", children: "MessageList Props" }), _jsx(ApiTable, { data: hookProps }), _jsx(Pagination, { prev: { href: '/reference/components/message-list', title: 'MessageList' }, next: { href: '/reference/components/conversation-branch-visualizer', title: 'ConversationBranchVisualizer' } })] }));
}
//# sourceMappingURL=page.js.map