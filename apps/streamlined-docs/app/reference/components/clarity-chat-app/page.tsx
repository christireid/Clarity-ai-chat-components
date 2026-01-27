'use client'

/**
 * ClarityChatApp Component - API Reference Documentation
 *
 * The unified, top-level chat component that encapsulates all advanced features
 * behind simple flags and curated defaults. This is the primary entry point for
 * the entire library - one component with everything built in.
 */

import * as React from 'react'
import {
  Box,
  Zap,
  Shield,
  Settings,
  Brain,
  FileText,
  Wrench,
  MessageSquare,
} from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../components/Docs/Section'
import { PropsTable, type PropDefinition } from '../../../../components/Docs/PropsTable'
import { LiveDemoContainer } from '../../../../components/Docs/LiveDemoContainer'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'
import type { TocItem } from '../../../../components/Docs/TableOfContents'

// ISR Configuration: Revalidate every hour
export const revalidate = 3600

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'demo', title: 'Live Demo', level: 2 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  { id: 'presets', title: 'Configuration Presets', level: 2 },
  { id: 'props', title: 'Props Reference', level: 2 },
  { id: 'advanced', title: 'Advanced Examples', level: 2 },
  { id: 'api-route', title: 'API Route Setup', level: 2 },
  { id: 'related', title: 'Related APIs', level: 2 },
]

// ============================================================================
// Props Definitions
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'api',
    type: 'string',
    required: true,
    description: 'API endpoint for chat requests. Should handle POST requests with messages array.',
  },
  {
    name: 'preset',
    type: "'simple' | 'pro' | 'memory' | 'rag' | 'tools' | 'enterprise'",
    default: "'simple'",
    description: 'Configuration preset for common use cases. Determines which features are enabled by default.',
  },
  {
    name: 'initialMessages',
    type: 'Message[]',
    description: 'Initial messages to display in the chat. Useful for resuming conversations or providing context.',
  },
  {
    name: 'systemPrompt',
    type: 'string',
    description: 'System prompt to guide the AI behavior. Sets context and personality for the assistant.',
  },
]

const featureProps: PropDefinition[] = [
  {
    name: 'features',
    type: 'ClarityFeatureFlags',
    description: 'Feature flags to enable/disable specific capabilities. Overrides preset defaults.',
  },
  {
    name: 'features.memory',
    type: 'boolean',
    default: 'false',
    description: 'Enable conversation memory system for context persistence and injection.',
  },
  {
    name: 'features.tokenOptimization',
    type: 'boolean',
    default: 'false',
    description: 'Enable automatic token counting, budget management, and optimization.',
  },
  {
    name: 'features.tools',
    type: 'boolean',
    default: 'false',
    description: 'Enable tool calling capabilities with approval workflow.',
  },
  {
    name: 'features.rag',
    type: 'boolean',
    default: 'false',
    description: 'Enable Retrieval Augmented Generation for document-based responses.',
  },
  {
    name: 'features.safety',
    type: 'boolean',
    default: 'false',
    description: 'Enable safety features: PII redaction, prompt injection detection, content moderation.',
  },
  {
    name: 'features.streaming',
    type: 'boolean',
    default: 'true',
    description: 'Enable streaming responses for progressive message display.',
  },
  {
    name: 'features.errorRecovery',
    type: 'boolean',
    default: 'true',
    description: 'Enable automatic retry logic with exponential backoff.',
  },
]

const configProps: PropDefinition[] = [
  {
    name: 'config',
    type: 'ClarityAppConfig',
    description: 'Detailed configuration overrides for fine-grained control. Extends preset defaults.',
  },
  {
    name: 'config.memory',
    type: 'MemoryConfig',
    description: 'Memory system configuration: strategy, limits, storage adapter.',
  },
  {
    name: 'config.tokenOptimization',
    type: 'TokenOptimizationConfig',
    description: 'Token optimization settings: model, budget, compression, caching.',
  },
  {
    name: 'config.tools',
    type: 'ToolsConfig',
    description: 'Tool calling configuration: registry, approval mode, timeout.',
  },
  {
    name: 'config.rag',
    type: 'RAGConfig',
    description: 'RAG configuration: chunking strategy, embedding model, similarity threshold.',
  },
  {
    name: 'config.safety',
    type: 'SafetyConfig',
    description: 'Safety configuration: level, PII redaction, prompt injection detection.',
  },
  {
    name: 'config.ui',
    type: 'UIConfig',
    description: 'UI customization: theme, component overrides, layout variant.',
  },
]

const eventProps: PropDefinition[] = [
  {
    name: 'onEvent',
    type: '(event: ClarityEvent) => void',
    description: 'Event handler for instrumentation and analytics. Receives all system events.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Error handler called when requests fail. Use for custom error logging or UI.',
  },
  {
    name: 'onMessageSent',
    type: '(message: Message) => void',
    description: 'Called when user sends a message. Useful for analytics or persistence.',
  },
  {
    name: 'onMessageReceived',
    type: '(message: Message) => void',
    description: 'Called when AI responds. Useful for processing or storing responses.',
  },
]

const customizationProps: PropDefinition[] = [
  {
    name: 'model',
    type: 'string',
    description: 'AI model identifier to use. Passed to the API endpoint.',
  },
  {
    name: 'sources',
    type: 'RAGSource[]',
    description: 'RAG sources for document-based responses. Shorthand for config.rag.sources.',
  },
  {
    name: 'header',
    type: 'ReactNode',
    description: 'Custom header content. Replaces default header.',
  },
  {
    name: 'footer',
    type: 'ReactNode',
    description: 'Custom footer content. Added below input area.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the root container.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Children for advanced composition patterns.',
  },
]

// ============================================================================
// Live Demo
// ============================================================================

function ClarityChatAppDemo() {
  const [preset, setPreset] = React.useState<'simple' | 'pro' | 'memory'>('simple')
  const [showTokens, setShowTokens] = React.useState(false)

  return (
    <LiveDemoContainer
      title="Interactive ClarityChatApp Demo"
      description="Try different presets to see how features change"
      controls={
        <>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium">Preset:</span>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as any)}
              className="px-2 py-1 rounded border border-border/50 bg-background"
            >
              <option value="simple">Simple</option>
              <option value="pro">Pro</option>
              <option value="memory">Memory</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showTokens}
              onChange={(e) => setShowTokens(e.target.checked)}
            />
            <span>Show Token Stats</span>
          </label>
        </>
      }
      onReset={() => {
        setPreset('simple')
        setShowTokens(false)
      }}
    >
      <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-border/50 overflow-hidden">
          {/* Mock Chat Header */}
          <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Chat Assistant</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600">
                  {preset}
                </span>
                {showTokens && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                    Tokens: 1,234 / 8,192
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mock Messages */}
          <div className="p-4 space-y-4 min-h-[300px]">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-brand-500 text-white px-4 py-2 rounded-lg max-w-[80%]">
                Hello! Can you help me?
              </div>
            </div>

            {/* AI Message */}
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-2 rounded-lg max-w-[80%]">
                <p className="text-foreground">
                  Of course! I'd be happy to help. What do you need assistance with?
                </p>
                {preset === 'memory' && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    💭 Memory enabled - I'll remember our conversation
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mock Input */}
          <div className="px-4 py-3 border-t border-border/50 bg-muted/10">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                disabled
                className="flex-1 px-3 py-2 rounded-lg border border-border/50 bg-background text-sm"
              />
              <button
                disabled
                className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>

          {/* Token Stats (if enabled) */}
          {showTokens && (
            <div className="px-4 py-2 border-t border-border/50 bg-muted/20 text-xs text-muted-foreground flex gap-4">
              <span>Input: 45</span>
              <span>Output: 82</span>
              <span>Budget: 7,065 remaining</span>
              <span>Utilization: 15.1%</span>
            </div>
          )}
        </div>
      </div>
    </LiveDemoContainer>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function ClarityChatAppPage() {
  return (
    <DocumentationPage
      title="ClarityChatApp"
      description="The unified, top-level chat component that serves as the primary entry point for the entire library. Enable memory, token optimization, tools, RAG, and safety with zero additional imports - everything you need in one component."
      icon={MessageSquare}
      badges={[{ label: 'Stable', variant: 'stable' }]}
      packageName="@clarity-chat/react"
      features={[
        {
          icon: Zap,
          label: 'Full Integration',
          description: 'All features in one component',
        },
        {
          icon: Settings,
          label: 'Provider Setup',
          description: 'Built-in context providers',
        },
        {
          icon: Shield,
          label: 'Type Safe',
          description: 'Full TypeScript support',
        },
        {
          icon: Box,
          label: 'Zero Config',
          description: 'Sensible defaults included',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={[
        {
          name: 'useClarityChatApp',
          type: 'hook',
          description: 'Headless hook for custom UI implementations',
          href: '/reference/hooks/use-clarity-chat-app',
        },
        {
          name: 'ClarityChat',
          type: 'component',
          description: 'Mid-level component with more customization',
          href: '/reference/components/clarity-chat',
        },
        {
          name: 'ChatWindow',
          type: 'component',
          description: 'Lower-level composable chat window',
          href: '/reference/components/chat-window',
        },
      ]}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground">
            <code className="text-brand-600 dark:text-brand-400">ClarityChatApp</code> is the
            flagship component of the Clarity AI Chat Components library. It provides a complete,
            production-ready chat interface with all advanced features built in - memory,
            token optimization, tool calling, RAG, and safety - all controlled through simple
            configuration presets.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Key Features</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Brain className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-foreground">Memory System:</strong> Conversation
                persistence with sliding-window, vector store, or hybrid strategies
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-foreground">Token Optimization:</strong> Automatic token
                counting, budget management, and quality-aware compression
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Wrench className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-foreground">Tool Calling:</strong> Registry-based tool
                execution with approval workflows and risk assessment
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-foreground">RAG Integration:</strong> Document-based
                responses with chunking, embeddings, and source citations
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-foreground">Safety Features:</strong> PII redaction,
                prompt injection detection, and content moderation
              </span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">When to Use</h3>
          <div className="bg-brand-500/5 border border-brand-500/20 rounded-lg p-4 my-4">
            <p className="text-foreground font-medium mb-2">Perfect for:</p>
            <ul className="space-y-1 text-muted-foreground text-sm">
              <li>• Quick prototyping and MVPs (3-minute setup)</li>
              <li>• Production applications needing advanced features</li>
              <li>• Projects requiring memory, RAG, or tool calling</li>
              <li>• Teams wanting opinionated, well-tested defaults</li>
            </ul>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 my-4">
            <p className="text-foreground font-medium mb-2">Consider alternatives if:</p>
            <ul className="space-y-1 text-muted-foreground text-sm">
              <li>
                • You need complete UI customization →{' '}
                <a href="/reference/hooks/use-clarity-chat-app" className="text-brand-600 dark:text-brand-400 hover:underline">
                  useClarityChatApp
                </a>
              </li>
              <li>
                • You want to compose your own layout →{' '}
                <a href="/reference/components/chat-window" className="text-brand-600 dark:text-brand-400 hover:underline">
                  ChatWindow
                </a>
              </li>
              <li>
                • You need granular control over rendering →{' '}
                <a href="/reference/components/message-list" className="text-brand-600 dark:text-brand-400 hover:underline">
                  MessageList
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Installation */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Install the package using your preferred package manager:
          </p>
          <CodeBlock
            language="bash"
            code={`# npm
npm install @clarity-chat/react

# pnpm
pnpm add @clarity-chat/react

# yarn
yarn add @clarity-chat/react`}
          />
        </div>
      </Section>

      {/* Live Demo */}
      <Section id="demo" title="Live Demo">
        <ClarityChatAppDemo />
      </Section>

      {/* Basic Usage */}
      <Section id="basic-usage" title="Basic Usage">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Minimal Example (3 minutes)
            </h3>
            <p className="text-muted-foreground mb-4">
              The simplest possible setup - just provide an API endpoint:
            </p>
            <CodeBlock
              language="tsx"
              code={`import { ClarityChatApp } from '@clarity-chat/react'

export default function ChatPage() {
  return (
    <div style={{ height: '600px' }}>
      <ClarityChatApp api="/api/chat" />
    </div>
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              With Initial Messages
            </h3>
            <p className="text-muted-foreground mb-4">
              Start the conversation with predefined messages:
            </p>
            <CodeBlock
              language="tsx"
              code={`import { ClarityChatApp } from '@clarity-chat/react'

const initialMessages = [
  {
    id: '1',
    chatId: 'default',
    role: 'assistant',
    content: 'Hello! How can I help you today?',
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function ChatPage() {
  return (
    <ClarityChatApp
      api="/api/chat"
      initialMessages={initialMessages}
      systemPrompt="You are a helpful AI assistant focused on providing clear, concise answers."
    />
  )
}`}
            />
          </div>
        </div>
      </Section>

      {/* Configuration Presets */}
      <Section id="presets" title="Configuration Presets">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Presets provide curated configurations for common use cases. Each preset enables
            specific features with sensible defaults:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Simple Preset */}
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Simple (Default)
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Streaming, retries, accessible UI. Minimal extras for fast prototyping.
              </p>
              <CodeBlock
                language="tsx"
                code={`<ClarityChatApp
  api="/api/chat"
  preset="simple"
/>`}
              />
            </div>

            {/* Pro Preset */}
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Pro
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Adds token stats, optimization, and basic safety features.
              </p>
              <CodeBlock
                language="tsx"
                code={`<ClarityChatApp
  api="/api/chat"
  preset="pro"
/>`}
              />
            </div>

            {/* Memory Preset */}
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                Memory
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Conversation persistence with sliding-window strategy.
              </p>
              <CodeBlock
                language="tsx"
                code={`<ClarityChatApp
  api="/api/chat"
  preset="memory"
/>`}
              />
            </div>

            {/* RAG Preset */}
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-500" />
                RAG
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Document-based responses with chunking and retrieval.
              </p>
              <CodeBlock
                language="tsx"
                code={`<ClarityChatApp
  api="/api/chat"
  preset="rag"
  sources={[
    { type: 'text', content: '...' }
  ]}
/>`}
              />
            </div>

            {/* Tools Preset */}
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-500" />
                Tools
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Tool calling with registry pattern and approval workflow.
              </p>
              <CodeBlock
                language="tsx"
                code={`<ClarityChatApp
  api="/api/chat"
  preset="tools"
  config={{
    tools: { registry: [...] }
  }}
/>`}
              />
            </div>

            {/* Enterprise Preset */}
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                Enterprise
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                All features enabled: memory, optimization, safety, observability.
              </p>
              <CodeBlock
                language="tsx"
                code={`<ClarityChatApp
  api="/api/chat"
  preset="enterprise"
/>`}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Props Reference */}
      <Section id="props" title="Props Reference">
        <div className="space-y-8">
          <PropsTable props={coreProps} title="Core Props" />
          <PropsTable props={featureProps} title="Feature Flags" />
          <PropsTable props={configProps} title="Configuration Objects" />
          <PropsTable props={eventProps} title="Event Handlers" />
          <PropsTable props={customizationProps} title="Customization" />
        </div>
      </Section>

      {/* Advanced Examples */}
      <Section id="advanced" title="Advanced Examples">
        <div className="space-y-8">
          {/* Custom Features */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Custom Feature Configuration
            </h3>
            <p className="text-muted-foreground mb-4">
              Override preset defaults by specifying individual features:
            </p>
            <CodeBlock
              language="tsx"
              code={`<ClarityChatApp
  api="/api/chat"
  preset="pro"
  features={{
    memory: true,           // Enable memory
    tokenOptimization: true, // Already enabled by 'pro'
    streaming: true,         // Already enabled by 'pro'
    rag: false,             // Explicitly disable
  }}
  config={{
    memory: {
      strategy: 'sliding-window',
      limit: 20,
    },
    tokenOptimization: {
      budget: 8192,
      showStats: true,
    },
  }}
/>`}
            />
          </div>

          {/* RAG with Documents */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              RAG with Document Sources
            </h3>
            <p className="text-muted-foreground mb-4">
              Add document-based responses with automatic chunking:
            </p>
            <CodeBlock
              language="tsx"
              code={`const documentation = \`
# Product Documentation
Our product helps teams collaborate...
\`

<ClarityChatApp
  api="/api/chat"
  preset="rag"
  sources={[
    {
      type: 'text',
      content: documentation,
      metadata: { source: 'Product Docs' },
    },
    {
      type: 'url',
      url: 'https://docs.example.com/api',
      metadata: { source: 'API Docs' },
    },
  ]}
  config={{
    rag: {
      showCitations: true,
      topK: 3,
      similarityThreshold: 0.7,
    },
  }}
/>`}
            />
          </div>

          {/* Event Tracking */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Event Tracking and Analytics
            </h3>
            <p className="text-muted-foreground mb-4">
              Monitor all system events for analytics and observability:
            </p>
            <CodeBlock
              language="tsx"
              code={`function ChatWithAnalytics() {
  const handleEvent = (event: ClarityEvent) => {
    // Log to analytics service
    analytics.track(event.type, {
      timestamp: event.timestamp,
      ...event.data,
    })

    // Example: Track token usage
    if (event.type === 'token:counted') {
      console.log('Token usage:', event.data)
    }
  }

  const handleError = (error: Error) => {
    // Log to error tracking service
    errorTracker.captureException(error)
  }

  return (
    <ClarityChatApp
      api="/api/chat"
      preset="enterprise"
      onEvent={handleEvent}
      onError={handleError}
      onMessageSent={(msg) => console.log('Sent:', msg.content)}
      onMessageReceived={(msg) => console.log('Received:', msg.content)}
    />
  )
}`}
            />
          </div>

          {/* Full Customization */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Complete Enterprise Setup
            </h3>
            <p className="text-muted-foreground mb-4">
              Production-ready configuration with all features enabled:
            </p>
            <CodeBlock
              language="tsx"
              code={`<ClarityChatApp
  api="/api/chat"
  preset="enterprise"
  model="gpt-4"
  systemPrompt="You are a knowledgeable assistant..."
  initialMessages={conversationHistory}
  sources={knowledgeBaseSources}
  features={{
    memory: true,
    tokenOptimization: true,
    tools: true,
    rag: true,
    safety: true,
    streaming: true,
    errorRecovery: true,
    observability: true,
  }}
  config={{
    memory: {
      strategy: 'hybrid',
      limit: 50,
      vectorSwitchThreshold: 30,
    },
    tokenOptimization: {
      budget: 16000,
      showStats: true,
      caching: true,
      compression: 'basic',
    },
    tools: {
      registry: toolDefinitions,
      approvalMode: 'manual',
      autoApproveRiskLevels: ['safe', 'low'],
    },
    rag: {
      topK: 5,
      showCitations: true,
      similarityThreshold: 0.75,
    },
    safety: {
      level: 'strict',
      piiRedaction: true,
      promptInjectionDetection: true,
      auditLog: true,
    },
    ui: {
      theme: 'system',
      animations: true,
      showTypingIndicator: true,
    },
  }}
  onEvent={trackAnalytics}
  onError={logError}
  className="my-custom-chat"
/>`}
            />
          </div>
        </div>
      </Section>

      {/* API Route Setup */}
      <Section id="api-route" title="API Route Setup">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Create a Next.js API route to handle chat requests. The component expects a POST
            endpoint that accepts messages and returns AI responses:
          </p>
          <CodeBlock
            language="typescript"
            code={`// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt, model = 'gpt-4', stream = false } = await request.json()

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
        ...messages,
      ],
      stream,
    })

    if (stream) {
      // Handle streaming response
      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || ''
            controller.enqueue(encoder.encode(text))
          }
          controller.close()
        },
      })
      return new Response(readable)
    }

    // Non-streaming response
    return NextResponse.json({
      content: response.choices[0].message.content,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}`}
          />
        </div>
      </Section>
    </DocumentationPage>
  )
}
