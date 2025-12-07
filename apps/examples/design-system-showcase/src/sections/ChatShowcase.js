import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Chat Showcase
 *
 * Demonstrates chat-specific components
 */
import { Message, ChatInput, ThinkingIndicator, EmptyState } from '@clarity-chat/react';
import { useState } from 'react';
export function ChatShowcase() {
    const [inputValue, setInputValue] = useState('');
    const messages = [
        {
            id: '1',
            chatId: 'showcase',
            role: 'assistant',
            content: 'Hello! How can I help you today?',
            createdAt: new Date(Date.now() - 60000),
            updatedAt: new Date(Date.now() - 60000),
            status: 'sent',
        },
        {
            id: '2',
            chatId: 'showcase',
            role: 'user',
            content: 'I need help understanding the design system patterns.',
            createdAt: new Date(Date.now() - 30000),
            updatedAt: new Date(Date.now() - 30000),
            status: 'sent',
        },
        {
            id: '3',
            chatId: 'showcase',
            role: 'assistant',
            content: "I'd be happy to help! The design system uses 6 core patterns: ring-based borders, refined shadows, consistent radius, enhanced focus states, precise hover effects, and consistent opacity. Which would you like to learn about?",
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'sent',
        },
    ];
    return (_jsxs("div", { className: "space-y-12", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold mb-2", children: "Chat Components" }), _jsx("p", { className: "text-muted-foreground", children: "Specialized components for building chat interfaces" })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Message Bubbles" }), _jsx("div", { className: "space-y-4 max-w-2xl", children: messages.map((message) => (_jsx(Message, { message: message }, message.id))) }), _jsxs("div", { className: "mt-4 p-4 rounded-lg ring-1 ring-border/30 bg-muted/30", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Message Features:" }), _jsxs("ul", { className: "text-sm text-muted-foreground space-y-1", children: [_jsx("li", { children: "\u2022 Assistant messages: rounded-lg with subtle background" }), _jsx("li", { children: "\u2022 User messages: rounded-md with primary color ring" }), _jsx("li", { children: "\u2022 Hover effects: bg-muted/30 shadow-xs" }), _jsx("li", { children: "\u2022 Timestamp support" }), _jsx("li", { children: "\u2022 Avatar integration" })] })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Thinking Indicator" }), _jsx("div", { className: "max-w-2xl", children: _jsx(ThinkingIndicator, {}) }), _jsxs("div", { className: "mt-4 p-4 rounded-lg ring-1 ring-border/30 bg-muted/30", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Thinking Indicator Features:" }), _jsxs("ul", { className: "text-sm text-muted-foreground space-y-1", children: [_jsx("li", { children: "\u2022 Animated dots to show AI is processing" }), _jsx("li", { children: "\u2022 rounded-md ring-1 ring-border/30" }), _jsx("li", { children: "\u2022 bg-muted/30 for subtle background" }), _jsx("li", { children: "\u2022 shadow-xs for depth" })] })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Chat Input" }), _jsx("div", { className: "max-w-2xl", children: _jsx(ChatInput, { value: inputValue, onChange: (value) => setInputValue(value), onSubmit: () => {
                                console.log('Submitted:', inputValue);
                                setInputValue('');
                            }, placeholder: "Type your message..." }) }), _jsxs("div", { className: "mt-4 p-4 rounded-lg ring-1 ring-border/30 bg-muted/30", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Chat Input Features:" }), _jsxs("ul", { className: "text-sm text-muted-foreground space-y-1", children: [_jsx("li", { children: "\u2022 Auto-expanding textarea" }), _jsx("li", { children: "\u2022 Send button with hover effects" }), _jsx("li", { children: "\u2022 Enter to send, Shift+Enter for new line" }), _jsx("li", { children: "\u2022 Character counter support" }), _jsx("li", { children: "\u2022 File attachment support" })] })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Empty State" }), _jsx("div", { className: "max-w-2xl", children: _jsx(EmptyState, { icon: _jsx("svg", { className: "w-12 h-12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }), title: "No messages yet", description: "Start a conversation to see messages appear here", action: {
                                label: 'Start Chatting',
                                onClick: () => console.log('Start chatting clicked')
                            } }) }), _jsxs("div", { className: "mt-4 p-4 rounded-lg ring-1 ring-border/30 bg-muted/30", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Empty State Features:" }), _jsxs("ul", { className: "text-sm text-muted-foreground space-y-1", children: [_jsx("li", { children: "\u2022 Icon with gradient background" }), _jsx("li", { children: "\u2022 Clear title and description" }), _jsx("li", { children: "\u2022 Optional action button" }), _jsx("li", { children: "\u2022 Centered layout" })] })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Complete Chat Interface" }), _jsxs("div", { className: "max-w-3xl h-[600px] rounded-lg ring-1 ring-border/30 shadow-sm bg-background overflow-hidden flex flex-col", children: [_jsx("div", { className: "px-6 py-4 border-b border-border/50 backdrop-blur-sm", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center", children: _jsx("svg", { className: "w-5 h-5 text-primary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: "AI Assistant" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Online" })] })] }) }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: [messages.map((message) => (_jsx(Message, { message: message }, message.id))), _jsx(ThinkingIndicator, {})] }), _jsx("div", { className: "border-t ring-1 ring-border/50 shadow-xs", children: _jsx(ChatInput, { value: inputValue, onChange: (value) => setInputValue(value), onSubmit: () => {
                                        console.log('Submitted:', inputValue);
                                        setInputValue('');
                                    }, placeholder: "Type your message..." }) })] })] }), _jsxs("section", { className: "bg-muted/30 rounded-lg p-6 ring-1 ring-border/30", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Code Example" }), _jsx("pre", { className: "bg-background rounded-md p-4 overflow-x-auto text-sm ring-1 ring-border/30", children: _jsx("code", { children: `import { Message, ChatInput, ThinkingIndicator, EmptyState } from '@clarity-chat/react'

// Message
<Message
  message={{
    id: '1',
    role: 'assistant',
    content: 'Hello!',
    createdAt: new Date()
  }}
/>

// Thinking Indicator
<ThinkingIndicator />

// Chat Input
<ChatInput
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onSubmit={handleSubmit}
  placeholder="Type your message..."
/>

// Empty State
<EmptyState
  icon={<Icon />}
  title="No messages"
  description="Start chatting"
  action={<Button>Start</Button>}
/>` }) })] })] }));
}
//# sourceMappingURL=ChatShowcase.js.map