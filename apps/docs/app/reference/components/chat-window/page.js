import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { ApiTable } from '@/components/Demo/ApiTable';
import { ComponentPreview } from '@/components/Demo/ComponentPreview';
export const metadata = {
    title: 'ChatWindow',
    description: 'The main container component for chat interfaces',
};
const chatWindowProps = [
    {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Array of message objects to display in the chat',
    },
    {
        name: 'onSendMessage',
        type: '(text: string) => void',
        required: true,
        description: 'Callback function triggered when user sends a message',
    },
    {
        name: 'placeholder',
        type: 'string',
        default: '"Type a message..."',
        description: 'Placeholder text for the message input field',
    },
    {
        name: 'height',
        type: 'string | number',
        default: '"100%"',
        description: 'Height of the chat window (CSS value or pixels)',
    },
    {
        name: 'theme',
        type: '"light" | "dark" | "auto"',
        default: '"auto"',
        description: 'Color theme for the chat interface',
    },
    {
        name: 'showTimestamps',
        type: 'boolean',
        default: 'true',
        description: 'Whether to display message timestamps',
    },
    {
        name: 'showAvatars',
        type: 'boolean',
        default: 'true',
        description: 'Whether to display user avatars',
    },
    {
        name: 'enableMarkdown',
        type: 'boolean',
        default: 'false',
        description: 'Enable markdown rendering in messages',
    },
    {
        name: 'enableReactions',
        type: 'boolean',
        default: 'false',
        description: 'Allow users to react to messages with emojis',
    },
    {
        name: 'typingUsers',
        type: 'User[]',
        description: 'Array of users currently typing',
    },
    {
        name: 'onReaction',
        type: '(messageId: string, emoji: string) => void',
        description: 'Callback when user adds a reaction to a message',
    },
    {
        name: 'onMessageEdit',
        type: '(messageId: string, newText: string) => void',
        description: 'Callback when user edits a message',
    },
    {
        name: 'onMessageDelete',
        type: '(messageId: string) => void',
        description: 'Callback when user deletes a message',
    },
    {
        name: 'animationPreset',
        type: '"none" | "smooth" | "bouncy" | "spring"',
        default: '"smooth"',
        description: 'Animation style for message transitions',
    },
    {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes to apply to the container',
    },
];
export default function ChatWindowPage() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("h1", { children: "ChatWindow" }), _jsx("p", { className: "lead", children: "The ChatWindow component is the primary container for building chat interfaces. It handles message display, input, and all core chat functionality." }), _jsx(Callout, { type: "info", children: _jsx("p", { children: "This component is highly customizable and works out-of-the-box with sensible defaults. You can progressively enhance it with features like reactions, typing indicators, and more." }) }), _jsx("h2", { id: "import", children: "Import" }), _jsx(CodeBlock, { code: `import { ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`, language: "tsx" }), _jsx("h2", { id: "basic-usage", children: "Basic Usage" }), _jsx(ComponentPreview, { title: "Simple Chat Interface", description: "A minimal chat window with messages and input", code: `import { useState } from 'react'
import { ChatWindow, Message } from '@clarity-chat/react'

function BasicChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to the chat.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])

  const handleSend = (text: string) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }])
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      height="400px"
    />
  )
}`, children: _jsx("div", { className: "w-full max-w-2xl", children: _jsx("div", { className: "border border-border rounded-lg p-4 bg-bg-secondary", children: _jsx("p", { className: "text-sm text-text-secondary text-center", children: "\uD83D\uDCAC Interactive preview would render here" }) }) }) }), _jsx("h2", { id: "with-avatars", children: "With Avatars" }), _jsx("p", { children: "Add user avatars to messages for a more personalized experience:" }), _jsx(CodeBlock, { code: `const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    text: 'Hello!',
    sender: 'bot',
    timestamp: new Date(),
    avatar: {
      src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
      alt: 'Bot Avatar',
    },
  },
])

return (
  <ChatWindow
    messages={messages}
    onSendMessage={handleSend}
    showAvatars
  />
)`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "typing-indicator", children: "Typing Indicator" }), _jsx("p", { children: "Show when other users are typing:" }), _jsx(CodeBlock, { code: `const [typingUsers, setTypingUsers] = useState([
  { id: 'bot', name: 'Assistant' }
])

return (
  <ChatWindow
    messages={messages}
    onSendMessage={handleSend}
    typingUsers={typingUsers}
  />
)`, language: "tsx" }), _jsx("h2", { id: "message-reactions", children: "Message Reactions" }), _jsx("p", { children: "Enable emoji reactions for messages:" }), _jsx(CodeBlock, { code: `const handleReaction = (messageId: string, emoji: string) => {
  setMessages(messages.map(msg => 
    msg.id === messageId
      ? {
          ...msg,
          reactions: {
            ...msg.reactions,
            [emoji]: (msg.reactions?.[emoji] || 0) + 1
          }
        }
      : msg
  ))
}

return (
  <ChatWindow
    messages={messages}
    onSendMessage={handleSend}
    onReaction={handleReaction}
    enableReactions
  />
)`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "themes", children: "Theming" }), _jsx("p", { children: "ChatWindow supports light, dark, and auto themes:" }), _jsx(CodeBlock, { code: `<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  theme="dark"
/>`, language: "tsx" }), _jsx(Callout, { type: "tip", children: _jsxs("p", { children: ["Use ", _jsx("code", { children: "theme=\"auto\"" }), " to automatically match the system theme preference."] }) }), _jsx("h2", { id: "animation-presets", children: "Animation Presets" }), _jsx("p", { children: "Choose from different animation styles:" }), _jsx(CodeBlock, { code: `// Smooth animations (default)
<ChatWindow animationPreset="smooth" {...props} />

// Bouncy animations
<ChatWindow animationPreset="bouncy" {...props} />

// Spring physics
<ChatWindow animationPreset="spring" {...props} />

// No animations
<ChatWindow animationPreset="none" {...props} />`, language: "tsx" }), _jsx("h2", { id: "props", children: "Props" }), _jsx(ApiTable, { data: chatWindowProps }), _jsx("h2", { id: "message-type", children: "Message Type" }), _jsx("p", { children: "The Message interface defines the structure of chat messages:" }), _jsx(CodeBlock, { code: `interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  avatar?: {
    src: string
    alt: string
  }
  reactions?: Record<string, number>
  attachments?: Attachment[]
  metadata?: Record<string, any>
}`, language: "tsx" }), _jsx("h2", { id: "examples", children: "Examples" }), _jsx("h3", { children: "Multi-User Chat" }), _jsx(CodeBlock, { code: `const users = {
  user1: {
    id: 'user1',
    name: 'Alice',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
  },
  user2: {
    id: 'user2',
    name: 'Bob',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
  }
}

const [messages, setMessages] = useState([
  {
    id: '1',
    text: 'Hey everyone!',
    sender: 'user1',
    timestamp: new Date(),
    avatar: { src: users.user1.avatar, alt: users.user1.name }
  },
  {
    id: '2',
    text: 'Hi Alice!',
    sender: 'user2',
    timestamp: new Date(),
    avatar: { src: users.user2.avatar, alt: users.user2.name }
  }
])

return (
  <ChatWindow
    messages={messages}
    onSendMessage={handleSend}
    showAvatars
    showTimestamps
  />
)`, language: "tsx", showLineNumbers: true }), _jsx("h3", { children: "With File Attachments" }), _jsx(CodeBlock, { code: `const [messages, setMessages] = useState([
  {
    id: '1',
    text: 'Check out this document!',
    sender: 'user',
    timestamp: new Date(),
    attachments: [
      {
        id: '1',
        name: 'document.pdf',
        size: 2048000,
        type: 'application/pdf',
        url: '/files/document.pdf'
      }
    ]
  }
])

return (
  <ChatWindow
    messages={messages}
    onSendMessage={handleSend}
  />
)`, language: "tsx", showLineNumbers: true }), _jsx(Callout, { type: "success", children: _jsxs("p", { children: [_jsx("strong", { children: "Great job!" }), " You now know how to use the ChatWindow component. Check out the", ' ', _jsx("a", { href: "/examples/simple-chat", children: "Simple Chat example" }), " for a complete implementation."] }) }), _jsx("h2", { id: "accessibility", children: "Accessibility" }), _jsx("p", { children: "ChatWindow is built with accessibility in mind:" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Full keyboard navigation support" }), _jsx("li", { children: "\u2705 ARIA labels and roles for screen readers" }), _jsx("li", { children: "\u2705 Focus management for input and buttons" }), _jsx("li", { children: "\u2705 High contrast mode compatible" }), _jsx("li", { children: "\u2705 Reduced motion support" })] }), _jsx("h2", { id: "performance", children: "Performance Tips" }), _jsxs(Callout, { type: "tip", children: [_jsx("p", { children: "For optimal performance with large message lists:" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Use ", _jsx("code", { children: "React.memo" }), " for message components"] }), _jsx("li", { children: "Implement virtual scrolling for 1000+ messages" }), _jsx("li", { children: "Debounce typing indicators" }), _jsx("li", { children: "Lazy load message attachments" })] })] }), _jsx(Pagination, { next: {
                    title: 'Message',
                    href: '/reference/components/message',
                } })] }));
}
//# sourceMappingURL=page.js.map