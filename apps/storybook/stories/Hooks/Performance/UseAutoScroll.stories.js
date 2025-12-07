import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useAutoScroll } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
const meta = {
    title: 'Hooks/Performance/UseAutoScroll',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
# useAutoScroll

Automatically scroll to the bottom of a container when new content is added, with intelligent user scroll detection.

## Features

- **Smart Scrolling**: Only scrolls if user is near bottom
- **User Control**: Respects manual scrolling
- **Smooth Animation**: Configurable scroll behavior
- **Threshold Detection**: Customizable "near bottom" threshold
- **Manual Control**: Force scroll or toggle enabled state
- **Performance**: Efficient with debounced checks

## Use Cases

- **Chat Messages**: Auto-scroll as messages arrive
- **Live Feeds**: Keep up with real-time updates
- **Logs**: Automatically show latest log entries
- **Notifications**: Show newest notifications
- **Comments**: Scroll to latest comments

## Basic Usage

\`\`\`tsx
const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
  dependencies: [messages],
  threshold: 100,
  behavior: 'smooth',
})

return (
  <div ref={scrollRef} className="h-96 overflow-y-auto">
    {messages.map(msg => <div key={msg.id}>{msg.content}</div>)}
    {!isNearBottom && (
      <button onClick={scrollToBottom}>↓ Scroll to Bottom</button>
    )}
  </div>
)
\`\`\`

## API Reference

### Options

- \`enabled\`: Enable/disable auto-scroll (default: true)
- \`behavior\`: Scroll behavior - 'smooth' or 'auto' (default: 'smooth')
- \`threshold\`: Distance from bottom in px to trigger (default: 100)
- \`dependencies\`: React deps that trigger scroll check

### Returns

- \`scrollRef\`: Ref to attach to scrollable container
- \`isNearBottom\`: Whether user is near bottom
- \`scrollToBottom()\`: Manually scroll to bottom
- \`setEnabled(boolean)\`: Toggle auto-scroll on/off
`,
            },
        },
    },
};
export default meta;
// ============================================================================
// Basic Chat Example
// ============================================================================
export const ChatExample = {
    render: () => {
        const [messages, setMessages] = React.useState([
            { id: 1, content: 'Hello!', sender: 'user' },
            { id: 2, content: 'Hi there! How can I help?', sender: 'bot' },
        ]);
        const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
            dependencies: [messages],
            threshold: 50,
        });
        const addMessage = () => {
            const newMessage = {
                id: messages.length + 1,
                content: `Message ${messages.length + 1}`,
                sender: messages.length % 2 === 0 ? 'user' : 'bot',
            };
            setMessages([...messages, newMessage]);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: addMessage, children: "Add Message" }), _jsx(Button, { onClick: () => setMessages([]), variant: "outline", children: "Clear All" })] }), _jsx("div", { ref: scrollRef, className: "h-96 overflow-y-auto border rounded-lg p-4 space-y-2 bg-muted/20", children: messages.map((msg) => (_jsx("div", { className: `p-3 rounded-lg max-w-[80%] ${msg.sender === 'user'
                            ? 'ml-auto bg-primary text-primary-foreground'
                            : 'bg-card'}`, children: msg.content }, msg.id))) }), !isNearBottom && (_jsx(Button, { onClick: scrollToBottom, className: "w-full", children: "\u2193 New Messages - Scroll to Bottom" }))] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Chat interface with auto-scroll that respects user scrolling.',
            },
        },
    },
};
// ============================================================================
// Live Feed Example
// ============================================================================
export const LiveFeedExample = {
    render: () => {
        const [items, setItems] = React.useState([]);
        const [isLive, setIsLive] = React.useState(false);
        const { scrollRef, isNearBottom, scrollToBottom, setEnabled } = useAutoScroll({
            dependencies: [items],
            behavior: 'smooth',
        });
        React.useEffect(() => {
            if (!isLive)
                return;
            const interval = setInterval(() => {
                const newItem = {
                    id: Date.now(),
                    text: `Event ${items.length + 1}: ${['Info', 'Warning', 'Error', 'Success'][Math.floor(Math.random() * 4)]}`,
                    time: new Date().toLocaleTimeString(),
                };
                setItems((prev) => [...prev, newItem]);
            }, 2000);
            return () => clearInterval(interval);
        }, [isLive, items.length]);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold", children: "Live Event Feed" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { onClick: () => setIsLive(!isLive), variant: isLive ? 'destructive' : 'default', size: "sm", children: [isLive ? 'Stop' : 'Start', " Feed"] }), _jsx(Button, { onClick: () => setItems([]), variant: "outline", size: "sm", children: "Clear" })] })] }), _jsx("div", { ref: scrollRef, className: "h-80 overflow-y-auto border rounded-lg p-4 bg-muted/20 font-mono text-sm", children: items.length === 0 ? (_jsx("div", { className: "h-full flex items-center justify-center text-muted-foreground", children: "Click \"Start Feed\" to begin" })) : (items.map((item) => (_jsxs("div", { className: "py-1", children: [_jsxs("span", { className: "text-muted-foreground", children: ["[", item.time, "]"] }), ' ', _jsx("span", { children: item.text })] }, item.id)))) }), _jsxs("div", { className: "flex items-center gap-4 text-sm", children: [_jsxs("div", { className: `flex items-center gap-2 ${isNearBottom ? 'text-green-600' : 'text-yellow-600'}`, children: [_jsx("div", { className: `w-2 h-2 rounded-full ${isNearBottom ? 'bg-green-500' : 'bg-yellow-500'}` }), _jsx("span", { children: isNearBottom ? 'Auto-scrolling' : 'Paused (scroll manually)' })] }), !isNearBottom && (_jsx(Button, { onClick: scrollToBottom, size: "sm", variant: "outline", children: "\u2193 Jump to Latest" }))] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Live feed that auto-scrolls but pauses when user scrolls up.',
            },
        },
    },
};
// ============================================================================
// Manual Control
// ============================================================================
export const ManualControlExample = {
    render: () => {
        const [items, setItems] = React.useState(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));
        const [autoScrollEnabled, setAutoScrollEnabled] = React.useState(true);
        const { scrollRef, isNearBottom, scrollToBottom, setEnabled } = useAutoScroll({
            dependencies: [items],
            enabled: autoScrollEnabled,
        });
        React.useEffect(() => {
            setEnabled(autoScrollEnabled);
        }, [autoScrollEnabled, setEnabled]);
        const addItems = (count) => {
            const newItems = Array.from({ length: count }, (_, i) => `Item ${items.length + i + 1}`);
            setItems([...items, ...newItems]);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4 p-4 bg-muted rounded-lg", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: autoScrollEnabled, onChange: (e) => setAutoScrollEnabled(e.target.checked) }), _jsx("span", { className: "text-sm", children: "Auto-scroll enabled" })] }), _jsx("div", { className: "flex-1" }), _jsx(Button, { onClick: () => addItems(5), size: "sm", children: "Add 5 Items" }), _jsx(Button, { onClick: () => addItems(1), size: "sm", variant: "outline", children: "Add 1 Item" })] }), _jsx("div", { ref: scrollRef, className: "h-64 overflow-y-auto border rounded-lg p-4", children: items.map((item, index) => (_jsx("div", { className: "py-2 border-b last:border-0", children: item }, index))) }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("div", { className: "text-muted-foreground", children: isNearBottom ? '✓ At bottom' : '⚠ Scrolled up' }), _jsx(Button, { onClick: scrollToBottom, variant: "outline", size: "sm", disabled: isNearBottom, children: "Scroll to Bottom" })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates manual control over auto-scroll behavior.',
            },
        },
    },
};
//# sourceMappingURL=UseAutoScroll.stories.js.map