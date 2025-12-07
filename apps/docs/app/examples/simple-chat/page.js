import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Pagination } from '@/components/Navigation/Pagination';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Simple Chat Example',
    description: 'Build a basic chat interface in minutes',
};
const simpleChatCode = `function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Clarity Chat UI 👋',
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000),
      avatar: {
        src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
        alt: 'Bot',
      },
    },
    {
      id: '2',
      text: 'This is a simple chat interface built with Clarity Chat UI.',
      sender: 'bot',
      timestamp: new Date(Date.now() - 30000),
      avatar: {
        src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
        alt: 'Bot',
      },
    },
  ])

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      avatar: {
        src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        alt: 'You',
      },
    }
    
    setMessages([...messages, newMessage])

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: \`You said: "\${text}". Thanks for trying out Clarity Chat! 🎉\`,
        sender: 'bot',
        timestamp: new Date(),
        avatar: {
          src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
          alt: 'Bot',
        },
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        placeholder="Type your message..."
        showTimestamps
        showAvatars
      />
    </div>
  )
}

render(<App />)`;
export default function SimpleChatExample() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("h1", { children: "Simple Chat Example" }), _jsx("p", { className: "lead", children: "A minimal chat interface that demonstrates the core functionality of Clarity Chat UI. This example includes message display, user input, and a simulated bot response." }), _jsx(Callout, { type: "info", children: _jsxs("p", { children: [_jsx("strong", { children: "What you'll learn:" }), " Basic ChatWindow usage, message state management, and handling user input."] }) }), _jsx("h2", { id: "live-demo", children: "Live Demo" }), _jsx("p", { children: "Try out the chat interface below. Type a message and see it appear instantly!" }), _jsx(CodePlayground, { initialCode: simpleChatCode }), _jsx("h2", { id: "how-it-works", children: "How It Works" }), _jsx("h3", { children: "1. State Management" }), _jsxs("p", { children: ["We use React's ", _jsx("code", { children: "useState" }), " to manage the messages array:"] }), _jsx(CodeBlock, { code: `const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    text: 'Hello! Welcome to Clarity Chat UI 👋',
    sender: 'bot',
    timestamp: new Date(),
  },
])`, language: "tsx", showLineNumbers: true }), _jsx("h3", { children: "2. Handle User Input" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "onSendMessage" }), " callback receives the user's text and adds it to the messages:"] }), _jsx(CodeBlock, { code: `const handleSendMessage = (text: string) => {
  const newMessage: Message = {
    id: Date.now().toString(),
    text,
    sender: 'user',
    timestamp: new Date(),
  }
  
  setMessages([...messages, newMessage])
}`, language: "tsx", showLineNumbers: true }), _jsx("h3", { children: "3. Simulated Bot Response" }), _jsx("p", { children: "For this demo, we simulate a bot response after 1 second:" }), _jsx(CodeBlock, { code: `setTimeout(() => {
  const botMessage: Message = {
    id: (Date.now() + 1).toString(),
    text: \`You said: "\${text}"\`,
    sender: 'bot',
    timestamp: new Date(),
  }
  setMessages((prev) => [...prev, botMessage])
}, 1000)`, language: "tsx", showLineNumbers: true }), _jsx(Callout, { type: "tip", children: _jsx("p", { children: "In a real application, you would replace this with an actual API call or WebSocket connection to your backend." }) }), _jsx("h2", { id: "full-code", children: "Complete Source Code" }), _jsx(CodeBlock, { code: simpleChatCode, language: "tsx", title: "App.tsx", showLineNumbers: true }), _jsx("h2", { id: "next-steps", children: "Next Steps" }), _jsx("p", { children: "Now that you have a basic chat working, try these enhancements:" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Add ", _jsx("a", { href: "/examples/themed-chat", children: "custom theming" })] }), _jsxs("li", { children: ["Implement ", _jsx("a", { href: "/reference/components/typing-indicator", children: "typing indicators" })] }), _jsxs("li", { children: ["Add ", _jsx("a", { href: "/reference/components/message#reactions", children: "message reactions" })] }), _jsxs("li", { children: ["Enable ", _jsx("a", { href: "/reference/components/message#attachments", children: "file attachments" })] }), _jsxs("li", { children: ["Connect to a ", _jsx("a", { href: "/examples/realtime", children: "real-time backend" })] })] }), _jsx("h2", { id: "customization", children: "Customization Ideas" }), _jsx("h3", { children: "Change Avatar Style" }), _jsx("p", { children: "Use different avatar services or your own images:" }), _jsx(CodeBlock, { code: `avatar: {
  src: 'https://ui-avatars.com/api/?name=John+Doe',
  alt: 'John Doe',
}`, language: "tsx" }), _jsx("h3", { children: "Add Timestamps" }), _jsx(CodeBlock, { code: `<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  showTimestamps
/>`, language: "tsx" }), _jsx("h3", { children: "Custom Placeholder" }), _jsx(CodeBlock, { code: `<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  placeholder="Ask me anything..."
/>`, language: "tsx" }), _jsx(Callout, { type: "success", children: _jsxs("p", { children: [_jsx("strong", { children: "Congratulations!" }), " You've built your first chat interface with Clarity Chat UI. Check out more ", _jsx("a", { href: "/examples", children: "examples" }), " to learn advanced features."] }) }), _jsx(Pagination, { next: {
                    title: 'Themed Chat',
                    href: '/examples/themed-chat',
                } })] }));
}
//# sourceMappingURL=page.js.map