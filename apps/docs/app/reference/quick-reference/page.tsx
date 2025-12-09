import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'API Quick Reference | Clarity Chat',
  description: 'Quick reference card for all Clarity Chat hooks and components with signatures and key props.',
}

const topLevelHooks = [
  { name: 'useClarityChat', signature: '(options: UseClarityChatOptions) => UseClarityChatReturn', href: '/reference/hooks/use-clarity-chat', description: 'Primary chat hook' },
  { name: 'useClarityObject', signature: '<T>(options: UseClarityObjectOptions<T>) => UseClarityObjectReturn<T>', href: '/reference/hooks/use-clarity-object', description: 'Structured output' },
]

const chatHooks = [
  { name: 'useClarityChatWithTools', signature: '(options) => { ...chat, toolResults }', href: '/reference/hooks/use-clarity-chat-with-tools', description: 'Chat + tool UI' },
  { name: 'useChatEnhanced', signature: '(options) => UseChatEnhancedReturn', href: '/reference/hooks/use-chat-enhanced', description: 'Enhanced useChat' },
  { name: 'useChatHandlers', signature: '(options) => ChatHandlers', href: '/reference/hooks/use-chat-handlers', description: 'Message handlers' },
  { name: 'useAssistant', signature: '(options) => AssistantReturn', href: '/reference/hooks/use-assistant', description: 'OpenAI Assistants' },
  { name: 'useCompletion', signature: '(options) => CompletionReturn', href: '/reference/hooks/use-completion', description: 'Text completion' },
]

const memoryHooks = [
  { name: 'useMemoryContext', signature: '() => MemoryContextValue | null', href: '/reference/hooks/use-memory-context', description: 'Memory operations' },
  { name: 'useIndexedDB', signature: '<T>(options) => IndexedDBReturn<T>', href: '/reference/hooks/use-indexed-db', description: 'IndexedDB storage' },
  { name: 'useEmbeddings', signature: '(options) => { embed, embedBatch }', href: '/reference/hooks/use-embeddings', description: 'Text embeddings' },
  { name: 'useVectorStore', signature: '(options) => VectorStoreReturn', href: '/reference/hooks/use-vector-store', description: 'Vector operations' },
]

const streamingHooks = [
  { name: 'useStreamingSSE', signature: '(options) => SSEReturn', href: '/reference/hooks/use-streaming-sse', description: 'SSE streaming' },
  { name: 'useStreamingWebSocket', signature: '(options) => WebSocketReturn', href: '/reference/hooks/use-streaming-websocket', description: 'WebSocket streaming' },
  { name: 'useStreamableUI', signature: '() => StreamableUIReturn', href: '/reference/hooks/use-streamable-ui', description: 'Streaming UI state' },
]

const uiHooks = [
  { name: 'useKeyboardShortcuts', signature: '(shortcuts) => void', href: '/reference/hooks/use-keyboard-shortcuts', description: 'Keyboard handling' },
  { name: 'useCommandPalette', signature: '(options) => { isOpen, toggle }', href: '/reference/hooks/use-command-palette', description: 'Cmd+K palette' },
  { name: 'useDesignTokens', signature: '() => DesignTokens', href: '/reference/hooks/use-design-tokens', description: 'Design tokens' },
  { name: 'useTheme', signature: '() => { theme, setTheme }', href: '/reference/hooks/use-theme', description: 'Theme switching' },
]

const utilityHooks = [
  { name: 'useDebounce', signature: '<T>(value: T, delay: number) => T', href: '/reference/hooks/use-debounce', description: 'Debounce values' },
  { name: 'useLocalStorage', signature: '<T>(key, initial) => [T, setter]', href: '/reference/hooks/use-local-storage', description: 'localStorage' },
  { name: 'useTokenTracker', signature: '(messages) => TokenStats', href: '/reference/hooks/use-token-tracker', description: 'Token counting' },
  { name: 'useDashboardData', signature: '<T>(options) => { data, refresh }', href: '/reference/hooks/use-dashboard-data', description: 'Dashboard data' },
]

const coreComponents = [
  { name: 'ClarityChat', props: 'api, memory?, theme?, appearance?', href: '/reference/components/clarity-chat', description: 'Drop-in chat' },
  { name: 'ChatWindow', props: 'messages, onSend, isLoading?', href: '/reference/components/chat-window', description: 'Chat container' },
  { name: 'Message', props: 'role, content, timestamp?', href: '/reference/components/message', description: 'Message display' },
  { name: 'MessageList', props: 'messages, virtualized?', href: '/reference/components/message-list', description: 'Message list' },
  { name: 'ChatInput', props: 'onSubmit, placeholder?', href: '/reference/components/chat-input', description: 'Input field' },
]

const providers = [
  { name: 'MemoryProvider', props: 'config: { maxTokens }', href: '/reference/components/memory-provider', description: 'Memory context' },
]

export default function QuickReferencePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">API Quick Reference</h1>
        <p className="text-xl text-muted-foreground">
          Scannable reference for all Clarity Chat hooks and components.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Click any item to view full documentation.
        </p>
      </div>

      {/* Hooks Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Hooks</h2>

        {/* Top-Level */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-3">
            Top-Level (Drop-in Ready)
          </h3>
          <div className="border rounded-lg divide-y">
            {topLevelHooks.map((hook) => (
              <Link
                key={hook.name}
                href={hook.href}
                className="flex items-start gap-4 p-3 hover:bg-muted transition-colors"
              >
                <code className="font-mono font-semibold text-sm whitespace-nowrap">{hook.name}</code>
                <code className="text-xs text-muted-foreground flex-1 font-mono">{hook.signature}</code>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{hook.description}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Chat Hooks */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-3">
            Chat State
          </h3>
          <div className="border rounded-lg divide-y">
            {chatHooks.map((hook) => (
              <Link
                key={hook.name}
                href={hook.href}
                className="flex items-start gap-4 p-3 hover:bg-muted transition-colors"
              >
                <code className="font-mono font-semibold text-sm whitespace-nowrap">{hook.name}</code>
                <code className="text-xs text-muted-foreground flex-1 font-mono">{hook.signature}</code>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{hook.description}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Memory Hooks */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
            Memory &amp; Context
          </h3>
          <div className="border rounded-lg divide-y">
            {memoryHooks.map((hook) => (
              <Link
                key={hook.name}
                href={hook.href}
                className="flex items-start gap-4 p-3 hover:bg-muted transition-colors"
              >
                <code className="font-mono font-semibold text-sm whitespace-nowrap">{hook.name}</code>
                <code className="text-xs text-muted-foreground flex-1 font-mono">{hook.signature}</code>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{hook.description}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Streaming Hooks */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
            Streaming
          </h3>
          <div className="border rounded-lg divide-y">
            {streamingHooks.map((hook) => (
              <Link
                key={hook.name}
                href={hook.href}
                className="flex items-start gap-4 p-3 hover:bg-muted transition-colors"
              >
                <code className="font-mono font-semibold text-sm whitespace-nowrap">{hook.name}</code>
                <code className="text-xs text-muted-foreground flex-1 font-mono">{hook.signature}</code>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{hook.description}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* UI Hooks */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3">
            UI &amp; Theming
          </h3>
          <div className="border rounded-lg divide-y">
            {uiHooks.map((hook) => (
              <Link
                key={hook.name}
                href={hook.href}
                className="flex items-start gap-4 p-3 hover:bg-muted transition-colors"
              >
                <code className="font-mono font-semibold text-sm whitespace-nowrap">{hook.name}</code>
                <code className="text-xs text-muted-foreground flex-1 font-mono">{hook.signature}</code>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{hook.description}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Utility Hooks */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Utilities
          </h3>
          <div className="border rounded-lg divide-y">
            {utilityHooks.map((hook) => (
              <Link
                key={hook.name}
                href={hook.href}
                className="flex items-start gap-4 p-3 hover:bg-muted transition-colors"
              >
                <code className="font-mono font-semibold text-sm whitespace-nowrap">{hook.name}</code>
                <code className="text-xs text-muted-foreground flex-1 font-mono">{hook.signature}</code>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{hook.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Components Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Components</h2>

        {/* Core Components */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-3">
            Core
          </h3>
          <div className="border rounded-lg divide-y">
            {coreComponents.map((comp) => (
              <Link
                key={comp.name}
                href={comp.href}
                className="flex items-start gap-4 p-3 hover:bg-muted transition-colors"
              >
                <code className="font-mono font-semibold text-sm whitespace-nowrap">&lt;{comp.name}&gt;</code>
                <code className="text-xs text-muted-foreground flex-1 font-mono">{comp.props}</code>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{comp.description}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Providers */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
            Providers
          </h3>
          <div className="border rounded-lg divide-y">
            {providers.map((comp) => (
              <Link
                key={comp.name}
                href={comp.href}
                className="flex items-start gap-4 p-3 hover:bg-muted transition-colors"
              >
                <code className="font-mono font-semibold text-sm whitespace-nowrap">&lt;{comp.name}&gt;</code>
                <code className="text-xs text-muted-foreground flex-1 font-mono">{comp.props}</code>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{comp.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Minimal Setup</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`import { ClarityChat } from '@clarity-chat/react'

function App() {
  return <ClarityChat api="/api/chat" />
}`}</code>
        </pre>
      </section>

      {/* Footer Links */}
      <div className="flex gap-4 text-sm">
        <Link href="/reference/hooks" className="text-brand-600 dark:text-brand-400 hover:underline">
          All Hooks →
        </Link>
        <Link href="/reference/components" className="text-brand-600 dark:text-brand-400 hover:underline">
          All Components →
        </Link>
        <Link href="/reference/hooks/selector" className="text-brand-600 dark:text-brand-400 hover:underline">
          Hook Selector →
        </Link>
      </div>
    </div>
  )
}
