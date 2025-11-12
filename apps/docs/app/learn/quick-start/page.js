import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { LibraryStats } from '@/components/Diagrams/StatisticsShowcase';
export const metadata = {
    title: 'Quick Start',
    description: 'Get started with Clarity Chat UI in 5 minutes',
};
export default function QuickStartPage() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("h1", { children: "Quick Start" }), _jsx("p", { className: "lead", children: "Get up and running with Clarity Chat UI in less than 5 minutes. This guide will walk you through installation, basic setup, and creating your first chat interface." }), _jsx(Callout, { type: "tip", children: "Already have a React project? Jump straight to the installation step below." }), _jsx(LibraryStats, {}), _jsx("h2", { id: "prerequisites", children: "Prerequisites" }), _jsx("p", { children: "Before you begin, make sure you have:" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Node.js 18+" }), " installed on your machine"] }), _jsxs("li", { children: [_jsx("strong", { children: "npm, yarn, or pnpm" }), " package manager"] }), _jsxs("li", { children: [_jsx("strong", { children: "React 18+" }), " project (or create a new one)"] })] }), _jsx("h2", { id: "installation", children: "Installation" }), _jsx("p", { children: "Install Clarity Chat UI using your preferred package manager:" }), _jsx(CodeBlock, { code: `# Using npm
npm install @clarity-chat/react

# Using yarn
yarn add @clarity-chat/react

# Using pnpm
pnpm add @clarity-chat/react`, language: "bash", title: "Terminal" }), _jsx("h2", { id: "basic-usage", children: "Basic Usage" }), _jsx("p", { children: "Import and use the ChatWindow component in your React application:" }), _jsx(CodeBlock, { code: `import { useState } from 'react'
import { ChatWindow, Message } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages([...messages, newMessage])
  }

  return (
    <div style={{ height: '100vh' }}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        placeholder="Type your message..."
      />
    </div>
  )
}

export default App`, language: "tsx", showLineNumbers: true }), _jsx(Callout, { type: "success", children: _jsxs("p", { children: [_jsx("strong", { children: "That's it!" }), " You now have a fully functional chat interface."] }) }), _jsx("h2", { id: "whats-included", children: "What's Included?" }), _jsx("p", { children: "The basic ChatWindow component includes:" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\uD83D\uDCDD ", _jsx("strong", { children: "Message Display" }), " - Beautifully formatted messages with timestamps"] }), _jsxs("li", { children: ["\u2328\uFE0F ", _jsx("strong", { children: "Input Field" }), " - Textarea with auto-resize and keyboard shortcuts"] }), _jsxs("li", { children: ["\u2728 ", _jsx("strong", { children: "Animations" }), " - Smooth enter/exit transitions"] }), _jsxs("li", { children: ["\u267F ", _jsx("strong", { children: "Accessibility" }), " - Full keyboard navigation and screen reader support"] }), _jsxs("li", { children: ["\uD83C\uDFA8 ", _jsx("strong", { children: "Theming" }), " - Dark mode ready with customizable colors"] })] }), _jsx("h2", { id: "customization", children: "Quick Customization" }), _jsx("p", { children: "Customize the appearance with props:" }), _jsx(CodeBlock, { code: `<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  placeholder="Ask me anything..."
  theme="dark"
  height="600px"
  showTimestamps
  showAvatars
  enableMarkdown
  animationPreset="smooth"
/>`, language: "tsx" }), _jsx("h2", { id: "next-steps", children: "Next Steps" }), _jsx("p", { children: "Now that you have a basic chat interface, explore more features:" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\uD83D\uDCDA ", _jsx("a", { href: "/learn/tutorial", children: "Complete Tutorial" }), " - Build a full-featured chat app"] }), _jsxs("li", { children: ["\uD83C\uDFA8 ", _jsx("a", { href: "/learn/concepts/theming", children: "Theming Guide" }), " - Customize colors and styles"] }), _jsxs("li", { children: ["\uD83D\uDD27 ", _jsx("a", { href: "/reference/components", children: "Components" }), " - Explore all 70+ components"] }), _jsxs("li", { children: ["\uD83E\uDE9D ", _jsx("a", { href: "/reference/hooks", children: "Hooks" }), " - Use powerful React hooks"] }), _jsxs("li", { children: ["\uD83D\uDCA1 ", _jsx("a", { href: "/examples", children: "Examples" }), " - See real-world implementations"] })] }), _jsx(Callout, { type: "info", children: _jsxs("p", { children: [_jsx("strong", { children: "Need help?" }), " Check out our", ' ', _jsx("a", { href: "https://github.com/clarity-chat/ui/discussions", children: "GitHub Discussions" }), ' ', "or join our ", _jsx("a", { href: "https://discord.gg/clarity-chat", children: "Discord community" }), "."] }) }), _jsx(Pagination, { next: {
                    title: 'Installation',
                    href: '/learn/installation',
                } })] }));
}
//# sourceMappingURL=page.js.map