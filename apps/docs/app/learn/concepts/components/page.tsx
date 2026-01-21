'use client'

import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'
import {
  MessageSquare,
  Database,
  Zap,
  GitBranch,
  Command,
  BarChart,
  Shield,
} from 'lucide-react'
import { LIBRARY_STATS } from '@/lib/library-stats'

export default function ComponentsConceptPage() {
  return (
    <>
      <div className="docs-content">
        <ScrollReveal>
          <div className="mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
              Concept
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              Component System
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Clarity Chat ships {LIBRARY_STATS.components} composable components. This overview helps
              you pick the right building blocks for conversations, streaming,
              analytics, and enterprise workflows.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <YouWillLearn
            items={[
              'Understand the component architecture and families',
              'Learn how to compose components for different use cases',
              'Discover component composition patterns',
              'Explore component customization options',
            ]}
          />
        </ScrollReveal>

        <section className="docs-section mt-12">
          <ScrollReveal delay={0.2}>
            <h2>Component Families</h2>
            <p className="mb-6">
              Our components are organized into logical families. You can mix
              and match them to build anything from a simple chatbot to a
              full-scale AI workspace.
            </p>
          </ScrollReveal>

          <ScrollReveal
            stagger
            staggerDelay={0.1}
            className="grid md:grid-cols-2 gap-4"
          >
            <ScrollRevealItem>
              <div className="p-6 rounded-xl border border-border bg-card h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold m-0">
                    Conversation Core
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  The essential elements of any chat interface.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['ChatWindow', 'Message', 'MessageList', 'ChatInput'].map(
                    (c) => (
                      <code
                        key={c}
                        className="px-2 py-1 bg-muted rounded text-xs font-mono"
                      >
                        {c}
                      </code>
                    )
                  )}
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <div className="p-6 rounded-xl border border-border bg-card h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold m-0">
                    Context &amp; Knowledge
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Display RAG context and documents.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'ContextCard',
                    'KnowledgeBaseViewer',
                    'MultiModalPreview',
                  ].map((c) => (
                    <code
                      key={c}
                      className="px-2 py-1 bg-muted rounded text-xs font-mono"
                    >
                      {c}
                    </code>
                  ))}
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <div className="p-6 rounded-xl border border-border bg-card h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold m-0">
                    Streaming &amp; Status
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Handle real-time AI responses.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'StreamingMessage',
                    'ThinkingIndicator',
                    'StreamCancellation',
                  ].map((c) => (
                    <code
                      key={c}
                      className="px-2 py-1 bg-muted rounded text-xs font-mono"
                    >
                      {c}
                    </code>
                  ))}
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <div className="p-6 rounded-xl border border-border bg-card h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold m-0">
                    Branching &amp; History
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Navigate complex conversation trees.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['ConversationBranchVisualizer', 'ConversationList'].map(
                    (c) => (
                      <code
                        key={c}
                        className="px-2 py-1 bg-muted rounded text-xs font-mono"
                      >
                        {c}
                      </code>
                    )
                  )}
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <div className="p-6 rounded-xl border border-border bg-card h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-lg">
                    <Command className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold m-0">Productivity</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Power user tools and shortcuts.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'CommandPalette',
                    'PromptLibrary',
                    'FollowUpSuggestions',
                  ].map((c) => (
                    <code
                      key={c}
                      className="px-2 py-1 bg-muted rounded text-xs font-mono"
                    >
                      {c}
                    </code>
                  ))}
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <div className="p-6 rounded-xl border border-border bg-card h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                    <BarChart className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold m-0">
                    Enterprise &amp; Analytics
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Monitor usage, costs, and performance.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'UsageDashboard',
                    'PerformanceDashboard',
                    'TokenCounter',
                  ].map((c) => (
                    <code
                      key={c}
                      className="px-2 py-1 bg-muted rounded text-xs font-mono"
                    >
                      {c}
                    </code>
                  ))}
                </div>
              </div>
            </ScrollRevealItem>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <Callout type="info" className="mt-6">
              Every component is tree-shakeable. Only the pieces you import end
              up in your bundle.
            </Callout>
          </ScrollReveal>
        </section>

        <ScrollReveal delay={0.5}>
          <section className="docs-section">
            <h2>Composing a Page</h2>
            <p>
              Components are designed to be composed like regular React building
              blocks. Here is a typical product page layout:
            </p>
            <EnhancedCodeBlock
              language="tsx"
              code={`import {
  ChatWindow,
  ConversationList,
  ContextVisualizer,
  UsageDashboard,
  useChat,
} from '@clarity-chat/react'

export function CustomerSuccessWorkspace() {
  const chat = useChat({ id: 'customer-success', api: '/api/chat/cs' })

  return (
    <>
    <div className="grid lg:grid-cols-[280px,minmax(0,1fr),320px] h-[calc(100vh-64px)]">
      <ConversationList
        conversations={chat.conversations}
        activeConversationId={chat.id}
        onSelectConversation={chat.setConversationId}
      />

      <ChatWindow
        messages={chat.messages}
        onSendMessage={chat.handleSubmit}
        onRegenerateMessage={chat.regenerateMessage}
        contextPanel={
          <ContextVisualizer
            contextItems={chat.context}
            onRemoveContext={chat.removeContextItem}
          />
        }
      />

      <UsageDashboard
        stats={chat.usage}
        limits={chat.limits}
        className="hidden xl:block border-l border-border"
      />
    </div>
    </>
  )
}`}
            />
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.6}>
          <section className="docs-section">
            <h2>Customising Behaviour</h2>
            <p>
              Components expose granular props, slot-like overrides, and render
              props so you can adjust copy, icons, and layouts without forking.
            </p>
            <EnhancedCodeBlock
              language="tsx"
              code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  components={{
    Message: (props) => (
      <Message
        {...props}
        avatar={props.message.role === 'assistant' ? assistantAvatar : userAvatar}
        className={
          props.message.role === 'assistant'
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200'
            : 'bg-surface border-border'
        }
      />
    ),
    Toolbar: ({ children }) => (
      <div className="flex items-center gap-2 border-t border-border bg-muted/30 px-3 py-2">
        <CommandPalette.Trigger />
        <PromptLibrary.Trigger />
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    ),
  }}
/>`}
            />
            <Callout type="tip">
              Need full control? Each component has a counterpart in the{' '}
              <code>primitives</code> package (Radix-style) so you can construct
              your own UI with the same accessibility guarantees.
            </Callout>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.7}>
          <section className="docs-section">
            <h2>When to Reach for Storybook</h2>
            <p>
              The Storybook workspace (<code>npm run storybook</code>) showcases
              every component with knobs for props and best practice notes. Use
              it to:
            </p>
            <ul>
              <li>📚 Explore variants before integrating into your app</li>
              <li>🎨 Copy/paste code snippets for faster prototyping</li>
              <li>
                🧪 Verify accessibility &amp; responsive behaviour in isolation
              </li>
              <li>📝 Share interactive docs with design and product teams</li>
            </ul>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.8}>
          <section className="docs-section">
            <h2>Key Takeaways</h2>
            <ul>
              <li>
                Start with <code>ChatWindow</code>; it covers 80% of use cases.
              </li>
              <li>
                Add specialised components (branching, tooling, dashboards) as
                product needs grow.
              </li>
              <li>
                Override slots/render props for brand-specific UI without
                rewriting logic.
              </li>
              <li>
                Use Storybook and the docs site to explore new components as
                they ship.
              </li>
            </ul>
          </section>
        </ScrollReveal>
      </div>
    </>
  )
}
