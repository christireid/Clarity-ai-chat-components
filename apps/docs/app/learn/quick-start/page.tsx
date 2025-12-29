'use client'

import { ToastProvider } from '@clarity-chat/react/internal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { TutorialStep } from '@/components/Enhanced/TutorialStep'
import { TryItOut } from '@/components/Enhanced/TryItOut'
import { LibraryStats } from '@/components/Diagrams/StatisticsShowcase'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'
import { SuccessCelebration } from '@/components/Enhanced/SuccessCelebration'
import { RelatedPages } from '@/components/Enhanced/RelatedPages'

export default function QuickStartPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <ScrollReveal>
          <div className="mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
              Get Started
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              Quick Start
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Get up and running with Clarity Chat UI in less than 5 minutes.
              This guide will walk you through installation, basic setup, and
              creating your first chat interface.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <YouWillLearn
            items={[
              'How to install Clarity Chat',
              'Create your first chat interface',
              'Handle messages and state',
              'Customize the appearance',
              'Add advanced features',
            ]}
          />
        </ScrollReveal>

        {/* Value Proposition - GTM Section */}
        <ScrollReveal delay={0.15}>
          <div className="my-8 p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  Built-in Token Optimization
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400 mb-3">
                  Clarity Chat includes smart token management that can{' '}
                  <strong>reduce your AI costs by 60-90%</strong> through:
                </p>
                <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                  <li>• Semantic memory compression</li>
                  <li>• Smart context windowing</li>
                  <li>• Prompt caching support</li>
                  <li>• Real-time token counting dashboard</li>
                </ul>
                <a
                  href="/guides/token-optimization"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
                >
                  Learn about token optimization →
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Callout type="tip" className="my-8">
            <strong>Already have a React project?</strong> Jump straight to the
            installation step below.
          </Callout>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <LibraryStats />
        </ScrollReveal>

        <div className="mt-12 space-y-12">
          <ScrollReveal delay={0.4}>
            <TutorialStep step={1} title="Prerequisites">
              <p className="text-text-secondary mb-4">
                Before you begin, make sure you have the following installed:
              </p>

              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 mt-1">✓</span>
                  <div>
                    <strong className="text-text-primary">Node.js 18+</strong>
                    <span className="text-text-secondary">
                      {' '}
                      - Check with{' '}
                      <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">
                        node --version
                      </code>
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 mt-1">✓</span>
                  <div>
                    <strong className="text-text-primary">
                      npm, yarn, or pnpm
                    </strong>
                    <span className="text-text-secondary">
                      {' '}
                      - Any package manager works
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 mt-1">✓</span>
                  <div>
                    <strong className="text-text-primary">React 18+</strong>
                    <span className="text-text-secondary">
                      {' '}
                      - Or create a new React project
                    </span>
                  </div>
                </li>
              </ul>
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <TutorialStep
              step={2}
              title="Installation"
              nextStepHref="#basic-usage"
              nextStepTitle="Basic Usage"
            >
              <p className="text-text-secondary mb-4">
                Install Clarity Chat UI using your preferred package manager:
              </p>

              <EnhancedCodeBlock
                code={`# Using npm
npm install @clarity-chat/react

# Using yarn
yarn add @clarity-chat/react

# Using pnpm
pnpm add @clarity-chat/react`}
                language="bash"
                filename="Terminal"
                showCopyButton
              />

              <Callout type="info" className="mt-4">
                <p>
                  <strong>TypeScript users:</strong> Type definitions are
                  included automatically. No additional <code>@types</code>{' '}
                  package needed.
                </p>
              </Callout>
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.55}>
            <TutorialStep
              step={3}
              title="Fastest Start (Recommended)"
              nextStepHref="#manual-control"
              nextStepTitle="Manual Control"
            >
              <p className="text-text-secondary mb-4">
                Use{' '}
                <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">
                  ClarityChat
                </code>{' '}
                for the simplest integration - just provide an API endpoint:
              </p>

              <EnhancedCodeBlock
                code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}`}
                language="tsx"
                filename="App.tsx"
                showLineNumbers
                showCopyButton
              />

              <Callout type="success" className="mt-6">
                <p>
                  <strong>That's it!</strong> ClarityChat handles all state
                  management, streaming, error handling, and UI internally.
                </p>
              </Callout>

              {/* Success Celebration */}
              <SuccessCelebration
                title="Your first chat is ready!"
                message="You've just created a production-ready AI chat interface. Here's what to explore next:"
                nextSteps={[
                  {
                    title: 'Add Streaming',
                    description: 'See responses in real-time',
                    href: '/guides/streaming',
                    icon: <span className="text-lg">⚡</span>,
                  },
                  {
                    title: 'Customize Theme',
                    description: 'Match your brand',
                    href: '/learn/concepts/theming',
                    icon: <span className="text-lg">🎨</span>,
                  },
                  {
                    title: 'Add Memory',
                    description: 'Remember context',
                    href: '/guides/memory',
                    icon: <span className="text-lg">🧠</span>,
                  },
                ]}
              />
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <TutorialStep
              step={4}
              title="Manual Control (Optional)"
              nextStepHref="#whats-included"
              nextStepTitle="What's Included"
            >
              <p className="text-text-secondary mb-4">
                For more control over state, use{' '}
                <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">
                  ChatWindow
                </code>{' '}
                with the{' '}
                <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">
                  useClarityChat
                </code>{' '}
                hook:
              </p>

              <EnhancedCodeBlock
                code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  const chat = useClarityChat({ api: '/api/chat' })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={(content) => chat.append({ role: 'user', content })}
    />
  )
}`}
                language="tsx"
                filename="App.tsx"
                showLineNumbers
                showCopyButton
              />

              <TryItOut title="Try it out">
                <p className="text-text-secondary mb-4">
                  This pattern gives you full control over the chat while
                  keeping it simple:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li>
                    ✓{' '}
                    <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">
                      useClarityChat
                    </code>{' '}
                    manages all state, streaming, and API calls
                  </li>
                  <li>
                    ✓{' '}
                    <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">
                      ChatWindow
                    </code>{' '}
                    accepts messages directly - no conversion needed
                  </li>
                  <li>
                    ✓ Add memory, tools, or custom behavior via hook options
                  </li>
                </ul>
              </TryItOut>

              <Callout type="success" className="mt-6">
                <p>
                  <strong>That's it!</strong> You now have a fully functional
                  chat interface with beautiful UI, animations, and
                  accessibility built-in.
                </p>
              </Callout>
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.7}>
            <TutorialStep step={5} title="What's Included">
              <p className="text-text-secondary mb-6">
                The basic ChatWindow component includes everything you need for
                a production-ready chat interface:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">📝</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Message Display
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Beautifully formatted messages with timestamps and markdown
                    support
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">⌨️</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Smart Input
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Auto-resize textarea with keyboard shortcuts (Shift+Enter
                    for new line)
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">✨</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Animations
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Smooth enter/exit transitions powered by Framer Motion
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">♿</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Accessibility
                  </h4>
                  <p className="text-sm text-text-secondary">
                    WCAG AAA compliant with full keyboard navigation
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">🎨</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Theming
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Dark mode ready with customizable colors and styles
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Performance
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Optimized with React.memo and virtual scrolling for large
                    lists
                  </p>
                </div>
              </div>
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <TutorialStep
              step={6}
              title="Quick Customization"
              nextStepHref="#next-steps"
              nextStepTitle="Next Steps"
            >
              <p className="text-text-secondary mb-4">
                Customize the appearance and behavior with props:
              </p>

              <EnhancedCodeBlock
                code={`<ChatWindow
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
/>`}
                language="tsx"
                filename="Customized ChatWindow"
                showCopyButton
              />

              <Callout type="tip" className="mt-4">
                <p>
                  <strong>Pro tip:</strong> Check out the{' '}
                  <a
                    href="/reference/components/chat-window"
                    className="text-brand-500 hover:underline"
                  >
                    ChatWindow API reference
                  </a>{' '}
                  for all available props and customization options.
                </p>
              </Callout>
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.9}>
            <div id="next-steps" className="pt-8">
              <h2 className="text-3xl font-bold mb-6">Next Steps</h2>

              <p className="text-text-secondary mb-6">
                Now that you have a basic chat interface, explore more features
                and build something amazing:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <a
                  href="/learn/tutorial"
                  className="p-6 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20 hover:border-brand-500/40 transition-all group"
                >
                  <div className="text-3xl mb-3">📚</div>
                  <h3 className="font-semibold text-text-primary mb-2 group-hover:text-brand-500 transition-colors">
                    Complete Tutorial
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Build a full-featured chat app with streaming, error
                    handling, and more
                  </p>
                </a>

                <a
                  href="/learn/concepts/theming"
                  className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                >
                  <div className="text-3xl mb-3">🎨</div>
                  <h3 className="font-semibold text-text-primary mb-2 group-hover:text-purple-500 transition-colors">
                    Theming Guide
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Customize colors, styles, and create your own theme
                  </p>
                </a>

                <a
                  href="/reference/components"
                  className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all group"
                >
                  <div className="text-3xl mb-3">🔧</div>
                  <h3 className="font-semibold text-text-primary mb-2 group-hover:text-blue-500 transition-colors">
                    Components
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Explore all 200+ components with interactive examples
                  </p>
                </a>

                <a
                  href="/reference/hooks"
                  className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 transition-all group"
                >
                  <div className="text-3xl mb-3">🪝</div>
                  <h3 className="font-semibold text-text-primary mb-2 group-hover:text-green-500 transition-colors">
                    Hooks
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Use powerful React hooks for chat functionality
                  </p>
                </a>

                <a
                  href="/examples"
                  className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 hover:border-orange-500/40 transition-all group"
                >
                  <div className="text-3xl mb-3">💡</div>
                  <h3 className="font-semibold text-text-primary mb-2 group-hover:text-orange-500 transition-colors">
                    Examples
                  </h3>
                  <p className="text-sm text-text-secondary">
                    See real-world implementations and code samples
                  </p>
                </a>

                <a
                  href="/cookbook"
                  className="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 hover:border-pink-500/40 transition-all group"
                >
                  <div className="text-3xl mb-3">📖</div>
                  <h3 className="font-semibold text-text-primary mb-2 group-hover:text-pink-500 transition-colors">
                    Cookbook
                  </h3>
                  <p className="text-sm text-text-secondary">
                    33+ recipes for common patterns and use cases
                  </p>
                </a>
              </div>

              <Callout type="info">
                <p>
                  <strong>Need help?</strong> Check out our{' '}
                  <a
                    href="https://github.com/christireid/Clarity-ai-chat-components/discussions"
                    className="text-brand-500 hover:underline"
                  >
                    GitHub Discussions
                  </a>{' '}
                  or join our{' '}
                  <a
                    href="https://discord.gg/clarity-chat"
                    className="text-brand-500 hover:underline"
                  >
                    Discord community
                  </a>
                  .
                </p>
              </Callout>
            </div>
          </ScrollReveal>
        </div>

        <RelatedPages
          title="Dive Deeper"
          pages={[
            {
              title: 'Streaming Responses',
              description: 'Add real-time streaming for instant feedback',
              href: '/guides/streaming',
              type: 'guide',
            },
            {
              title: 'Token Optimization',
              description:
                'Reduce AI costs by 60-90% with smart context management',
              href: '/guides/token-optimization',
              type: 'guide',
            },
            {
              title: 'Enterprise RAG Integration',
              description:
                'Add document search with citations and confidence scores',
              href: '/cookbook/enterprise-rag',
              type: 'cookbook',
            },
            {
              title: 'Multi-Provider Chat',
              description: 'Switch between OpenAI, Anthropic, and Google',
              href: '/examples/multi-provider',
              type: 'example',
            },
          ]}
        />

        <Pagination
          next={{
            title: 'Installation',
            href: '/learn/installation',
          }}
        />
      </>
    </ToastProvider>
  )
}
