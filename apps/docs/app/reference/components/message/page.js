import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { ApiTable } from '@/components/Demo/ApiTable';
export const metadata = {
    title: 'Message',
    description: 'Display individual chat messages with rich content',
};
const messageProps = [
    {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unique identifier for the message',
    },
    {
        name: 'text',
        type: 'string',
        required: true,
        description: 'The message content',
    },
    {
        name: 'sender',
        type: 'string',
        required: true,
        description: 'Identifier for the message sender',
    },
    {
        name: 'timestamp',
        type: 'Date',
        required: true,
        description: 'When the message was sent',
    },
    {
        name: 'avatar',
        type: 'Avatar',
        description: 'User avatar configuration',
    },
    {
        name: 'reactions',
        type: 'Record<string, number>',
        description: 'Emoji reactions with counts',
    },
    {
        name: 'attachments',
        type: 'Attachment[]',
        description: 'File attachments',
    },
    {
        name: 'metadata',
        type: 'Record<string, any>',
        description: 'Custom metadata',
    },
    {
        name: 'isEdited',
        type: 'boolean',
        default: 'false',
        description: 'Whether the message was edited',
    },
    {
        name: 'isDeleted',
        type: 'boolean',
        default: 'false',
        description: 'Whether the message was deleted',
    },
    {
        name: 'variant',
        type: '"default" | "compact" | "bubble"',
        default: '"default"',
        description: 'Visual style variant',
    },
    {
        name: 'align',
        type: '"left" | "right"',
        default: '"left"',
        description: 'Message alignment',
    },
    {
        name: 'showTimestamp',
        type: 'boolean',
        default: 'true',
        description: 'Show timestamp below message',
    },
    {
        name: 'showAvatar',
        type: 'boolean',
        default: 'true',
        description: 'Show user avatar',
    },
    {
        name: 'onReactionClick',
        type: '(emoji: string) => void',
        description: 'Callback when reaction is clicked',
    },
    {
        name: 'onEdit',
        type: '() => void',
        description: 'Callback for edit action',
    },
    {
        name: 'onDelete',
        type: '() => void',
        description: 'Callback for delete action',
    },
    {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes',
    },
];
export default function MessagePage() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("h1", { children: "Message" }), _jsx("p", { className: "lead", children: "The Message component displays individual chat messages with support for avatars, timestamps, reactions, attachments, and more. It's highly customizable and accessible." }), _jsx("h2", { id: "import", children: "Import" }), _jsx(CodeBlock, { code: `import { Message } from '@clarity-chat/react'`, language: "tsx" }), _jsx("h2", { id: "basic-usage", children: "Basic Usage" }), _jsx(CodeBlock, { code: `import { Message } from '@clarity-chat/react'

function MessageExample() {
  const message = {
    id: '1',
    text: 'Hello, how are you?',
    sender: 'user1',
    timestamp: new Date(),
  }

  return <Message {...message} />
}`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "with-avatar", children: "With Avatar" }), _jsx("p", { children: "Add user avatars to personalize messages:" }), _jsx(CodeBlock, { code: `const message = {
  id: '1',
  text: 'Hello!',
  sender: 'user1',
  timestamp: new Date(),
  avatar: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    alt: 'User 1',
  },
}

<Message {...message} showAvatar />`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "variants", children: "Message Variants" }), _jsx("p", { children: "Choose from different visual styles:" }), _jsx(CodeBlock, { code: `// Default style (standard message box)
<Message {...message} variant="default" />

// Compact style (minimal spacing)
<Message {...message} variant="compact" />

// Bubble style (rounded chat bubbles)
<Message {...message} variant="bubble" />`, language: "tsx" }), _jsx("h2", { id: "alignment", children: "Message Alignment" }), _jsx("p", { children: "Align messages left or right based on sender:" }), _jsx(CodeBlock, { code: `// User messages (right-aligned)
<Message 
  {...userMessage} 
  align="right"
  className="bg-brand-500 text-white"
/>

// Bot/other messages (left-aligned)
<Message 
  {...botMessage} 
  align="left"
  className="bg-gray-100"
/>`, language: "tsx" }), _jsx("h2", { id: "reactions", children: "Message Reactions" }), _jsx("p", { children: "Enable emoji reactions on messages:" }), _jsx(CodeBlock, { code: `const [message, setMessage] = useState({
  id: '1',
  text: 'Great idea!',
  sender: 'user1',
  timestamp: new Date(),
  reactions: {
    '👍': 5,
    '❤️': 3,
    '🎉': 2,
  },
})

const handleReactionClick = (emoji: string) => {
  setMessage({
    ...message,
    reactions: {
      ...message.reactions,
      [emoji]: (message.reactions[emoji] || 0) + 1,
    },
  })
}

<Message 
  {...message}
  onReactionClick={handleReactionClick}
/>`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "attachments", children: "File Attachments" }), _jsx("p", { children: "Display file attachments with messages:" }), _jsx(CodeBlock, { code: `const message = {
  id: '1',
  text: 'Here are the documents you requested',
  sender: 'user1',
  timestamp: new Date(),
  attachments: [
    {
      id: '1',
      name: 'presentation.pdf',
      size: 2048000,
      type: 'application/pdf',
      url: '/files/presentation.pdf',
    },
    {
      id: '2',
      name: 'image.png',
      size: 512000,
      type: 'image/png',
      url: '/images/image.png',
      thumbnail: '/images/image-thumb.png',
    },
  ],
}

<Message {...message} />`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "edit-delete", children: "Edit & Delete" }), _jsx("p", { children: "Add edit and delete actions:" }), _jsx(CodeBlock, { code: `const handleEdit = (messageId: string) => {
  // Show edit modal or inline editor
  console.log('Editing message:', messageId)
}

const handleDelete = (messageId: string) => {
  // Confirm and delete message
  console.log('Deleting message:', messageId)
}

<Message
  {...message}
  onEdit={() => handleEdit(message.id)}
  onDelete={() => handleDelete(message.id)}
/>`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "edited-deleted", children: "Edited & Deleted States" }), _jsx(CodeBlock, { code: `// Edited message
<Message 
  {...message}
  isEdited
/>

// Deleted message
<Message 
  {...message}
  isDeleted
  text="This message was deleted"
/>`, language: "tsx" }), _jsx("h2", { id: "markdown", children: "Markdown Support" }), _jsx("p", { children: "Enable markdown rendering in messages:" }), _jsx(CodeBlock, { code: `import { Message } from '@clarity-chat/react'
import ReactMarkdown from 'react-markdown'

function MarkdownMessage({ message }) {
  return (
    <Message {...message}>
      <ReactMarkdown>{message.text}</ReactMarkdown>
    </Message>
  )
}

// Usage
const message = {
  id: '1',
  text: '**Bold text** and *italic text* with [links](https://example.com)',
  sender: 'user1',
  timestamp: new Date(),
}`, language: "tsx", showLineNumbers: true }), _jsx(Callout, { type: "tip", children: _jsxs("p", { children: ["Markdown rendering is not included by default. Use libraries like", ' ', _jsx("code", { children: "react-markdown" }), " or ", _jsx("code", { children: "marked" }), " to parse markdown content."] }) }), _jsx("h2", { id: "props", children: "Props" }), _jsx(ApiTable, { data: messageProps }), _jsx("h2", { id: "types", children: "Type Definitions" }), _jsx("h3", { children: "Avatar Type" }), _jsx(CodeBlock, { code: `interface Avatar {
  src: string
  alt: string
  fallback?: string
}`, language: "tsx" }), _jsx("h3", { children: "Attachment Type" }), _jsx(CodeBlock, { code: `interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  thumbnail?: string
  preview?: string
}`, language: "tsx" }), _jsx("h2", { id: "styling", children: "Custom Styling" }), _jsx("p", { children: "Customize message appearance with CSS classes:" }), _jsx(CodeBlock, { code: `// Custom user message style
<Message
  {...message}
  align="right"
  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg"
/>

// Custom bot message style
<Message
  {...message}
  align="left"
  className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
/>`, language: "tsx" }), _jsx("h2", { id: "accessibility", children: "Accessibility" }), _jsx("p", { children: "Message component includes comprehensive accessibility features:" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Semantic HTML structure" }), _jsx("li", { children: "\u2705 ARIA labels for screen readers" }), _jsx("li", { children: "\u2705 Keyboard navigation for actions" }), _jsx("li", { children: "\u2705 Focus indicators" }), _jsx("li", { children: "\u2705 Time formatting for screen readers" }), _jsx("li", { children: "\u2705 Alt text for avatars and images" })] }), _jsx("h2", { id: "examples", children: "Complete Examples" }), _jsx("h3", { children: "Chat Bubble Style" }), _jsx(CodeBlock, { code: `function ChatBubbleMessages() {
  const messages = [
    {
      id: '1',
      text: 'Hey, how are you?',
      sender: 'user',
      timestamp: new Date(),
      align: 'right' as const,
      variant: 'bubble' as const,
      className: 'bg-brand-500 text-white',
    },
    {
      id: '2',
      text: "I'm good, thanks! How about you?",
      sender: 'bot',
      timestamp: new Date(),
      align: 'left' as const,
      variant: 'bubble' as const,
      className: 'bg-gray-100 dark:bg-gray-800',
    },
  ]

  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <Message key={message.id} {...message} />
      ))}
    </div>
  )
}`, language: "tsx", showLineNumbers: true }), _jsx("h3", { children: "Rich Message with All Features" }), _jsx(CodeBlock, { code: `const richMessage = {
  id: '1',
  text: 'Check out this document and let me know what you think!',
  sender: 'user1',
  timestamp: new Date(),
  avatar: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    alt: 'User 1',
  },
  reactions: {
    '👍': 3,
    '❤️': 1,
  },
  attachments: [
    {
      id: '1',
      name: 'proposal.pdf',
      size: 1024000,
      type: 'application/pdf',
      url: '/files/proposal.pdf',
    },
  ],
  metadata: {
    read: true,
    delivered: true,
  },
}

<Message
  {...richMessage}
  showAvatar
  showTimestamp
  onReactionClick={(emoji) => console.log('Reacted:', emoji)}
  onEdit={() => console.log('Edit message')}
  onDelete={() => console.log('Delete message')}
/>`, language: "tsx", showLineNumbers: true }), _jsx(Callout, { type: "success", children: _jsxs("p", { children: [_jsx("strong", { children: "Next Steps:" }), " Check out the", ' ', _jsx("a", { href: "/reference/components/message-list", children: "MessageList" }), " component to display multiple messages efficiently."] }) }), _jsx(Pagination, { prev: {
                    title: 'ChatWindow',
                    href: '/reference/components/chat-window',
                }, next: {
                    title: 'MessageList',
                    href: '/reference/components/message-list',
                } })] }));
}
//# sourceMappingURL=page.js.map