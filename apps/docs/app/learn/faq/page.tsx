'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ToastProvider } from '@clarity-chat/react/internal'

type FAQItem = {
  question: string
  answer: React.ReactNode
  category:
    | 'getting-started'
    | 'hooks'
    | 'components'
    | 'styling'
    | 'performance'
    | 'errors'
    | 'enterprise'
}

const faqItems: FAQItem[] = [
  // Getting Started
  {
    category: 'getting-started',
    question: 'What is the minimum React version required?',
    answer: (
      <p>
        Clarity Chat requires <strong>React 18.0 or higher</strong>. React 19 is
        fully supported. We use modern React features like automatic batching
        and concurrent rendering.
      </p>
    ),
  },
  {
    category: 'getting-started',
    question: 'Do I need to install any peer dependencies?',
    answer: (
      <div className="space-y-4">
        <p>
          Most peer dependencies are optional. The only required peer dependency
          is <code>react</code> (18+). Optional peer dependencies include:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <code>framer-motion</code> - For animations (auto-installed)
          </li>
          <li>
            <code>tailwindcss</code> - For styling (optional, works without it)
          </li>
          <li>
            AI SDKs - Install only the ones you use (OpenAI, Anthropic, etc.)
          </li>
        </ul>
      </div>
    ),
  },
  {
    category: 'getting-started',
    question: 'Why are my styles not working?',
    answer: (
      <div className="space-y-4">
        <p>Make sure you import the CSS file in your app's entry point:</p>
        <EnhancedCodeBlock
          code={`import '@clarity-chat/react/styles.css'`}
          language="tsx"
          showCopyButton
        />
        <p>
          If you're using Tailwind CSS, also add Clarity Chat to your content
          config:
        </p>
        <EnhancedCodeBlock
          code={`// tailwind.config.js
module.exports = {
  content: [
    // ... your files
    './node_modules/@clarity-chat/react/dist/**/*.js',
  ],
}`}
          language="javascript"
          showCopyButton
        />
      </div>
    ),
  },
  {
    category: 'getting-started',
    question: "What's the quickest way to get started?",
    answer: (
      <div className="space-y-4">
        <p>
          Use the <code>ClarityChat</code> drop-in component with just an API
          endpoint:
        </p>
        <EnhancedCodeBlock
          code={`import { ClarityChat } from '@clarity-chat/react/internal'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}`}
          language="tsx"
          showCopyButton
        />
        <p>
          This gives you a complete chat interface with streaming, error
          handling, and memory support. See the{' '}
          <Link
            href="/learn/quick-start"
            className="text-brand-500 hover:underline"
          >
            Quick Start guide
          </Link>{' '}
          for more details.
        </p>
      </div>
    ),
  },

  // Hooks
  {
    category: 'hooks',
    question: 'Which hook should I use for a basic chat?',
    answer: (
      <div className="space-y-4">
        <p>
          Use <code>useClarityChat</code> for most use cases. It's the
          recommended primary hook that combines chat state, streaming, and
          optional memory support:
        </p>
        <EnhancedCodeBlock
          code={`const { messages, input, setInput, handleSubmit, isLoading } = useClarityChat({
  api: '/api/chat',
})`}
          language="tsx"
          showCopyButton
        />
        <p>
          Not sure? Try our{' '}
          <Link
            href="/reference/hooks/selector"
            className="text-brand-500 hover:underline"
          >
            Hook Selector wizard
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    category: 'hooks',
    question: "What's the difference between useChat and useClarityChat?",
    answer: (
      <div className="space-y-4">
        <p>
          <code>useClarityChat</code> is the recommended hook that extends{' '}
          <code>useChat</code> with:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Built-in memory/context management options</li>
          <li>Token tracking and optimization</li>
          <li>Enhanced error handling with recovery</li>
          <li>WebSocket and SSE streaming support</li>
        </ul>
        <p>
          Use <code>useChat</code> directly only if you need a minimal
          implementation or are migrating from another library.
        </p>
      </div>
    ),
  },
  {
    category: 'hooks',
    question: 'How do I use hooks with Server Components?',
    answer: (
      <div className="space-y-4">
        <p>
          All Clarity Chat hooks are client-side only. Mark your component with{' '}
          <code>'use client'</code>:
        </p>
        <EnhancedCodeBlock
          code={`'use client'

import { useClarityChat } from '@clarity-chat/react/internal'

export function ChatComponent() {
  const { messages } = useClarityChat({ api: '/api/chat' })
  // ...
}`}
          language="tsx"
          showCopyButton
        />
        <p>
          You can still use Server Components for the page layout and pass data
          as props.
        </p>
      </div>
    ),
  },

  // Components
  {
    category: 'components',
    question: 'How do I customize the chat appearance?',
    answer: (
      <div className="space-y-4">
        <p>There are several ways to customize appearance:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>CSS Variables:</strong> Override design tokens
            <EnhancedCodeBlock
              code={`:root {
  --clarity-brand-500: #8b5cf6;
  --clarity-border-radius: 12px;
}`}
              language="css"
              showCopyButton
            />
          </li>
          <li>
            <strong>className props:</strong> Pass Tailwind/CSS classes
          </li>
          <li>
            <strong>Theme prop:</strong> Use built-in themes
            <EnhancedCodeBlock
              code={`<ClarityChat theme="modern-dark" />`}
              language="tsx"
              showCopyButton
            />
          </li>
        </ol>
        <p>
          See the{' '}
          <Link
            href="/learn/concepts/theming"
            className="text-brand-500 hover:underline"
          >
            Theming Guide
          </Link>{' '}
          for details.
        </p>
      </div>
    ),
  },
  {
    category: 'components',
    question: 'How do I show a loading/thinking indicator?',
    answer: (
      <div className="space-y-4">
        <p>
          Use the <code>isLoading</code> prop on <code>ChatWindow</code> or{' '}
          <code>ClarityChat</code>:
        </p>
        <EnhancedCodeBlock
          code={`<ChatWindow
  messages={messages}
  isLoading={isLoading}
  loadingIndicator={<ThinkingIndicator variant="dots" />}
/>`}
          language="tsx"
          showCopyButton
        />
        <p>
          The hook's <code>isLoading</code> state is automatically true during
          streaming.
        </p>
      </div>
    ),
  },
  {
    category: 'components',
    question: 'How do I handle markdown in AI responses?',
    answer: (
      <div className="space-y-4">
        <p>
          Markdown rendering is enabled by default. For advanced rendering (code
          blocks, math, diagrams), use the <code>MarkdownRenderer</code>{' '}
          component:
        </p>
        <EnhancedCodeBlock
          code={`import { MarkdownRenderer } from '@clarity-chat/react/internal'

<MarkdownRenderer
  content={message.content}
  enableMath      // KaTeX support
  enableDiagrams  // Mermaid diagrams
  enableCodeCopy  // Copy button on code blocks
/>`}
          language="tsx"
          showCopyButton
        />
      </div>
    ),
  },

  // Styling
  {
    category: 'styling',
    question: 'Can I use Clarity Chat without Tailwind CSS?',
    answer: (
      <p>
        Yes! The default CSS file (<code>@clarity-chat/react/styles.css</code>)
        includes all necessary styles. Tailwind is optional and only needed if
        you want to use Tailwind classes for customization.
      </p>
    ),
  },
  {
    category: 'styling',
    question: 'How do I enable dark mode?',
    answer: (
      <div className="space-y-4">
        <p>
          Dark mode is automatic if you use the <code>dark</code> class on your
          HTML element (standard Tailwind approach). You can also force a theme:
        </p>
        <EnhancedCodeBlock
          code={`import { ThemeProvider } from '@clarity-chat/react/internal'

<ThemeProvider defaultTheme="dark">
  <ClarityChat api="/api/chat" />
</ThemeProvider>`}
          language="tsx"
          showCopyButton
        />
      </div>
    ),
  },

  // Performance
  {
    category: 'performance',
    question: 'How do I reduce bundle size?',
    answer: (
      <div className="space-y-4">
        <p>
          Use the <code>core-minimal</code> entry point for the smallest bundle
          (~30KB gzipped):
        </p>
        <EnhancedCodeBlock
          code={`import { ChatWindow, useClarityChat } from '@clarity-chat/react/core-minimal'`}
          language="tsx"
          showCopyButton
        />
        <p>
          Then lazy-load features as needed. See the{' '}
          <Link
            href="/learn/guides/bundle-size"
            className="text-brand-500 hover:underline"
          >
            Bundle Size Guide
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    category: 'performance',
    question: 'How do I handle large message histories?',
    answer: (
      <div className="space-y-4">
        <p>Enable virtualization for large message lists (100+ messages):</p>
        <EnhancedCodeBlock
          code={`<MessageList
  messages={messages}
  virtualize={messages.length > 100}
  estimatedItemHeight={120}
/>`}
          language="tsx"
          showCopyButton
        />
        <p>
          Also consider using token optimization to manage context window
          limits:
        </p>
        <EnhancedCodeBlock
          code={`const { optimizedMessages } = useTokenOptimization({
  messages,
  targetTokens: 4000,
  strategy: 'compress',
})`}
          language="tsx"
          showCopyButton
        />
      </div>
    ),
  },

  // Errors
  {
    category: 'errors',
    question: 'I see "Cannot read properties of undefined" errors',
    answer: (
      <div className="space-y-4">
        <p>This usually means:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Missing provider:</strong> Wrap your app with necessary
            providers
            <EnhancedCodeBlock
              code={`import { ToastProvider, ThemeProvider } from '@clarity-chat/react/internal'

<ThemeProvider>
  <ToastProvider>
    <App />
  </ToastProvider>
</ThemeProvider>`}
              language="tsx"
              showCopyButton
            />
          </li>
          <li>
            <strong>SSR issue:</strong> Use <code>'use client'</code> directive
            for client components
          </li>
          <li>
            <strong>Missing Message fields:</strong> Ensure messages have all
            required fields (id, role, content, createdAt, etc.)
          </li>
        </ol>
      </div>
    ),
  },
  {
    category: 'errors',
    question: 'Streaming is not working',
    answer: (
      <div className="space-y-4">
        <p>Check these common issues:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Your API endpoint must return a streaming response with proper
            headers
          </li>
          <li>CORS headers must allow streaming</li>
          <li>
            The response format should match the expected format:
            <EnhancedCodeBlock
              code={`// API Route example (Next.js)
export async function POST(req: Request) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Send chunks with data: prefix for SSE
      controller.enqueue(encoder.encode('data: {"content": "Hello"}\n\n'))
      controller.close()
    }
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}`}
              language="typescript"
              showCopyButton
            />
          </li>
        </ol>
      </div>
    ),
  },
  {
    category: 'errors',
    question: 'TypeScript errors with Message type',
    answer: (
      <div className="space-y-4">
        <p>
          Import types from <code>@clarity-chat/types</code>:
        </p>
        <EnhancedCodeBlock
          code={`import type { Message } from '@clarity-chat/types'

const message: Message = {
  id: '1',
  chatId: 'default',
  role: 'user',         // 'user' | 'assistant' | 'system'
  content: 'Hello',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'sent',       // 'sending' | 'sent' | 'error'
}`}
          language="tsx"
          showCopyButton
        />
      </div>
    ),
  },

  // Enterprise
  {
    category: 'enterprise',
    question: 'Is Clarity Chat suitable for enterprise use?',
    answer: (
      <div className="space-y-4">
        <p>Yes! Clarity Chat includes enterprise features:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>RBAC (Role-Based Access Control)</li>
          <li>Multi-tenancy support</li>
          <li>Usage quotas and rate limiting</li>
          <li>Audit logging</li>
          <li>SSO integration (SAML/OIDC)</li>
          <li>SOC 2 compliance ready</li>
        </ul>
        <p>
          See the{' '}
          <Link href="/enterprise" className="text-brand-500 hover:underline">
            Enterprise documentation
          </Link>{' '}
          for details.
        </p>
      </div>
    ),
  },
  {
    category: 'enterprise',
    question: 'How do I track token usage and costs?',
    answer: (
      <div className="space-y-4">
        <p>Use the token tracking hooks and components:</p>
        <EnhancedCodeBlock
          code={`import { useTokenTracker, TokenCounter } from '@clarity-chat/react/internal'

function Chat() {
  const { messages } = useClarityChat({ api: '/api/chat' })
  const stats = useTokenTracker(messages, { model: 'gpt-4' })

  return (
    <>
      <TokenCounter
        tokens={stats.totalTokens}
        limit={128000}
        estimatedCost={stats.estimatedCost}
      />
      <ChatWindow messages={messages} />
    </>
  )
}`}
          language="tsx"
          showCopyButton
        />
      </div>
    ),
  },
]

const categories = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'hooks', label: 'Hooks' },
  { id: 'components', label: 'Components' },
  { id: 'styling', label: 'Styling' },
  { id: 'performance', label: 'Performance' },
  { id: 'errors', label: 'Common Errors' },
  { id: 'enterprise', label: 'Enterprise' },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const filteredItems = activeCategory
    ? faqItems.filter((item) => item.category === activeCategory)
    : faqItems

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <ToastProvider>
      <Breadcrumbs />

      <div className="mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
          Support
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Find answers to common questions about Clarity Chat.
        </p>
      </div>

      <Callout type="tip" className="mb-8">
        <p>
          Can't find what you're looking for? Check our{' '}
          <Link
            href="/learn/troubleshooting"
            className="text-brand-500 hover:underline"
          >
            Troubleshooting Guide
          </Link>{' '}
          or ask in{' '}
          <a
            href="https://github.com/christireid/Clarity-ai-chat-components/discussions"
            className="text-brand-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Discussions
          </a>
          .
        </p>
      </Callout>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === null
              ? 'bg-brand-500 text-white'
              : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary'
          }`}
        >
          All ({faqItems.length})
        </button>
        {categories.map((cat) => {
          const count = faqItems.filter((i) => i.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary'
              }`}
            >
              {cat.label} ({count})
            </button>
          )
        })}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => {
          const isOpen = openItems.has(index)
          return (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-secondary transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-text-primary pr-4">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-text-secondary flex-shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-text-secondary">
                  {item.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Still Need Help */}
      <div className="mt-12 p-8 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20">
        <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
        <p className="text-text-secondary mb-6">
          Our community and support channels are here to help you succeed.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com/christireid/Clarity-ai-chat-components/discussions"
            className="inline-flex items-center gap-2 px-4 py-2 bg-bg-primary border border-border rounded-lg hover:bg-bg-secondary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub Discussions
          </a>
          <a
            href="https://discord.gg/clarity-chat"
            className="inline-flex items-center gap-2 px-4 py-2 bg-bg-primary border border-border rounded-lg hover:bg-bg-secondary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discord Community
          </a>
          <Link
            href="/learn/troubleshooting"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Troubleshooting Guide
          </Link>
        </div>
      </div>
    </ToastProvider>
  )
}
