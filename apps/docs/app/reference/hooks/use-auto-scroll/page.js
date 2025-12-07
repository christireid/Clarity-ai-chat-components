import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useAutoScroll | Clarity Chat',
    description: 'Auto-scroll to bottom of container when new content added.'
};
export default function UseAutoScrollPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useAutoScroll" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Automatically scroll to bottom when new content is added, with smart detection to avoid disrupting manual scrolling." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { useAutoScroll } from '@clarity-chat/react'

const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
  dependencies: [messages],
  threshold: 100,
  behavior: 'smooth'
})

return (
  <div ref={scrollRef} className="overflow-y-auto h-96">
    {messages.map(msg => <Message key={msg.id} {...msg} />)}
    {!isNearBottom && (
      <button onClick={scrollToBottom}>
        Scroll to bottom ↓
      </button>
    )}
  </div>
)` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Parameters" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "enabled:" }), " Enable/disable auto-scroll (default: true)"] }), _jsxs("li", { children: [_jsx("strong", { children: "behavior:" }), " 'smooth' or 'instant' (default: 'smooth')"] }), _jsxs("li", { children: [_jsx("strong", { children: "threshold:" }), " Distance from bottom in px to trigger (default: 100)"] }), _jsxs("li", { children: [_jsx("strong", { children: "dependencies:" }), " Values that trigger scroll check"] })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Returns" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "scrollRef:" }), " Ref to attach to scrollable element"] }), _jsxs("li", { children: [_jsx("strong", { children: "isNearBottom:" }), " Whether user is near bottom"] }), _jsxs("li", { children: [_jsx("strong", { children: "scrollToBottom:" }), " Function to manually scroll"] }), _jsxs("li", { children: [_jsx("strong", { children: "setEnabled:" }), " Enable/disable auto-scroll"] })] })] })] }));
}
//# sourceMappingURL=page.js.map