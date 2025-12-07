'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ToastProvider } from '@clarity-chat/react';
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn';
import { TutorialStep } from '@/components/Enhanced/TutorialStep';
import { TryItOut } from '@/components/Enhanced/TryItOut';
import { LibraryStats } from '@/components/Diagrams/StatisticsShowcase';
export const dynamic = 'force-dynamic';
export default function QuickStartPage() {
    return (_jsx(ToastProvider, { children: _jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent", children: "Quick Start" }), _jsx("p", { className: "text-xl text-text-secondary leading-relaxed", children: "Get up and running with Clarity Chat UI in less than 5 minutes. This guide will walk you through installation, basic setup, and creating your first chat interface." })] }), _jsx(YouWillLearn, { items: [
                        'How to install Clarity Chat',
                        'Create your first chat interface',
                        'Handle messages and state',
                        'Customize the appearance',
                        'Add advanced features',
                    ] }), _jsxs(Callout, { type: "tip", children: [_jsx("strong", { children: "Already have a React project?" }), " Jump straight to the installation step below."] }), _jsx(LibraryStats, {}), _jsxs(TutorialStep, { step: 1, title: "Prerequisites", children: [_jsx("p", { className: "text-text-secondary mb-4", children: "Before you begin, make sure you have the following installed:" }), _jsxs("ul", { className: "space-y-2 mb-4", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-brand-500 mt-1", children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { className: "text-text-primary", children: "Node.js 18+" }), _jsxs("span", { className: "text-text-secondary", children: [" - Check with ", _jsx("code", { className: "px-1.5 py-0.5 bg-bg-secondary rounded text-sm", children: "node --version" })] })] })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-brand-500 mt-1", children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { className: "text-text-primary", children: "npm, yarn, or pnpm" }), _jsx("span", { className: "text-text-secondary", children: " - Any package manager works" })] })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-brand-500 mt-1", children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { className: "text-text-primary", children: "React 18+" }), _jsx("span", { className: "text-text-secondary", children: " - Or create a new React project" })] })] })] })] }), _jsxs(TutorialStep, { step: 2, title: "Installation", nextStepHref: "#basic-usage", nextStepTitle: "Basic Usage", children: [_jsx("p", { className: "text-text-secondary mb-4", children: "Install Clarity Chat UI using your preferred package manager:" }), _jsx(EnhancedCodeBlock, { code: `# Using npm
npm install @clarity-chat/react

# Using yarn
yarn add @clarity-chat/react

# Using pnpm
pnpm add @clarity-chat/react`, language: "bash", filename: "Terminal", showCopyButton: true }), _jsx(Callout, { type: "info", className: "mt-4", children: _jsxs("p", { children: [_jsx("strong", { children: "TypeScript users:" }), " Type definitions are included automatically. No additional ", _jsx("code", { children: "@types" }), " package needed."] }) })] }), _jsxs(TutorialStep, { step: 3, title: "Basic Usage", nextStepHref: "#whats-included", nextStepTitle: "What's Included", children: [_jsx("p", { className: "text-text-secondary mb-4", children: "Import and use the ChatWindow component in your React application. Here's a complete example:" }), _jsx(EnhancedCodeBlock, { code: `import { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      chatId: 'default-chat',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    },
  ])

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      chatId: 'default-chat',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    setMessages(prev => [...prev, userMessage])

    // Call your AI API here
    // const response = await fetch('/api/chat', { ... })
  }

  return (
    <ToastProvider>
    <div style={{ height: '100vh' }}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        emptyState={
          <div className="text-center text-text-secondary">
            <p>Start a conversation</p>
          </div>
        }
      />
    </div>
    </ToastProvider>
  )
}

export default App`, language: "tsx", filename: "App.tsx", showLineNumbers: true, showCopyButton: true }), _jsxs(TryItOut, { title: "Try it out", children: [_jsx("p", { className: "text-text-secondary mb-4", children: "Copy the code above into your React app. Make sure to:" }), _jsxs("ul", { className: "space-y-2 text-text-secondary", children: [_jsx("li", { children: "\u2713 Import the CSS file for default styles" }), _jsxs("li", { children: ["\u2713 Use proper TypeScript types from ", _jsx("code", { className: "px-1.5 py-0.5 bg-bg-secondary rounded text-sm", children: "@clarity-chat/types" })] }), _jsx("li", { children: "\u2713 Include all required Message fields (id, chatId, role, content, createdAt, updatedAt, status)" })] })] }), _jsx(Callout, { type: "success", className: "mt-6", children: _jsxs("p", { children: [_jsx("strong", { children: "That's it!" }), " You now have a fully functional chat interface with beautiful UI, animations, and accessibility built-in."] }) })] }), _jsxs(TutorialStep, { step: 4, title: "What's Included", children: [_jsx("p", { className: "text-text-secondary mb-4", children: "The basic ChatWindow component includes everything you need for a production-ready chat interface:" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDCDD" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "Message Display" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Beautifully formatted messages with timestamps and markdown support" })] }), _jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\u2328\uFE0F" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "Smart Input" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Auto-resize textarea with keyboard shortcuts (Shift+Enter for new line)" })] }), _jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\u2728" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "Animations" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Smooth enter/exit transitions powered by Framer Motion" })] }), _jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\u267F" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "Accessibility" }), _jsx("p", { className: "text-sm text-text-secondary", children: "WCAG AAA compliant with full keyboard navigation" })] }), _jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83C\uDFA8" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "Theming" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Dark mode ready with customizable colors and styles" })] }), _jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\u26A1" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "Performance" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Optimized with React.memo and virtual scrolling for large lists" })] })] })] }), _jsxs(TutorialStep, { step: 5, title: "Quick Customization", nextStepHref: "#next-steps", nextStepTitle: "Next Steps", children: [_jsx("p", { className: "text-text-secondary mb-4", children: "Customize the appearance and behavior with props:" }), _jsx(EnhancedCodeBlock, { code: `<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  placeholder="Ask me anything..."
  isLoading={isLoading}
  emptyState={
    <div className="text-center">
      <p>No messages yet. Start a conversation!</p>
    </div>
  }
  onEditMessage={handleEdit}
  onRegenerateMessage={handleRegenerate}
  onDeleteMessage={handleDelete}
  enableMarkdown
  showTimestamps
  showAvatars
/>`, language: "tsx", filename: "Customized ChatWindow", showCopyButton: true }), _jsx(Callout, { type: "tip", className: "mt-4", children: _jsxs("p", { children: [_jsx("strong", { children: "Pro tip:" }), " Check out the ", _jsx("a", { href: "/reference/components/chat-window", className: "text-brand-500 hover:underline", children: "ChatWindow API reference" }), " for all available props and customization options."] }) })] }), _jsxs("div", { id: "next-steps", className: "mt-12", children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "Next Steps" }), _jsx("p", { className: "text-text-secondary mb-6", children: "Now that you have a basic chat interface, explore more features and build something amazing:" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 mb-8", children: [_jsxs("a", { href: "/learn/tutorial", className: "p-6 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20 hover:border-brand-500/40 transition-all group", children: [_jsx("div", { className: "text-3xl mb-3", children: "\uD83D\uDCDA" }), _jsx("h3", { className: "font-semibold text-text-primary mb-2 group-hover:text-brand-500 transition-colors", children: "Complete Tutorial" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Build a full-featured chat app with streaming, error handling, and more" })] }), _jsxs("a", { href: "/learn/concepts/theming", className: "p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all group", children: [_jsx("div", { className: "text-3xl mb-3", children: "\uD83C\uDFA8" }), _jsx("h3", { className: "font-semibold text-text-primary mb-2 group-hover:text-purple-500 transition-colors", children: "Theming Guide" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Customize colors, styles, and create your own theme" })] }), _jsxs("a", { href: "/reference/components", className: "p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all group", children: [_jsx("div", { className: "text-3xl mb-3", children: "\uD83D\uDD27" }), _jsx("h3", { className: "font-semibold text-text-primary mb-2 group-hover:text-blue-500 transition-colors", children: "Components" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Explore all 70+ components with interactive examples" })] }), _jsxs("a", { href: "/reference/hooks", className: "p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 transition-all group", children: [_jsx("div", { className: "text-3xl mb-3", children: "\uD83E\uDE9D" }), _jsx("h3", { className: "font-semibold text-text-primary mb-2 group-hover:text-green-500 transition-colors", children: "Hooks" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Use powerful React hooks for chat functionality" })] }), _jsxs("a", { href: "/examples", className: "p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 hover:border-orange-500/40 transition-all group", children: [_jsx("div", { className: "text-3xl mb-3", children: "\uD83D\uDCA1" }), _jsx("h3", { className: "font-semibold text-text-primary mb-2 group-hover:text-orange-500 transition-colors", children: "Examples" }), _jsx("p", { className: "text-sm text-text-secondary", children: "See real-world implementations and code samples" })] }), _jsxs("a", { href: "/cookbook", className: "p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 hover:border-pink-500/40 transition-all group", children: [_jsx("div", { className: "text-3xl mb-3", children: "\uD83D\uDCD6" }), _jsx("h3", { className: "font-semibold text-text-primary mb-2 group-hover:text-pink-500 transition-colors", children: "Cookbook" }), _jsx("p", { className: "text-sm text-text-secondary", children: "33+ recipes for common patterns and use cases" })] })] }), _jsx(Callout, { type: "info", children: _jsxs("p", { children: [_jsx("strong", { children: "Need help?" }), " Check out our", ' ', _jsx("a", { href: "https://github.com/clarity-chat/ui/discussions", className: "text-brand-500 hover:underline", children: "GitHub Discussions" }), ' ', "or join our ", _jsx("a", { href: "https://discord.gg/clarity-chat", className: "text-brand-500 hover:underline", children: "Discord community" }), "."] }) })] }), _jsx(Pagination, { next: {
                        title: 'Installation',
                        href: '/learn/installation',
                    } })] }) }));
}
//# sourceMappingURL=page.js.map