/**
 * Shared hook and component metadata for documentation
 * Single source of truth for hook selector, quick reference, and other pages
 */

export type HookCategory =
  | 'top-level'
  | 'chat'
  | 'memory'
  | 'streaming'
  | 'ui'
  | 'utility'
  | 'agent'
  | 'storage'
  | 'performance'

export type ComponentCategory = 'core' | 'provider' | 'layout' | 'input'

export interface HookMetadata {
  name: string
  href: string
  description: string
  signature: string
  category: HookCategory
  tags: string[]
  importStatement: string
  useCases?: string[]
  relatedHooks?: string[]
}

export interface ComponentMetadata {
  name: string
  href: string
  description: string
  props: string
  category: ComponentCategory
  importStatement: string
  tags: string[]
}

// =============================================================================
// HOOK METADATA
// =============================================================================

export const hookMetadata: HookMetadata[] = [
  // Top-Level Hooks
  {
    name: 'useClarityChat',
    href: '/reference/hooks/use-clarity-chat',
    description: 'Primary chat hook with streaming and memory support',
    signature: '(options: UseClarityChatOptions) => UseClarityChatReturn',
    category: 'top-level',
    tags: ['chat', 'streaming', 'memory', 'essential'],
    importStatement: "import { useClarityChat } from '@clarity-chat/react'",
    useCases: ['Basic chat interfaces', 'Chat with memory', 'Streaming responses'],
    relatedHooks: ['useClarityChatWithTools', 'useMemoryContext'],
  },
  {
    name: 'useClarityObject',
    href: '/reference/hooks/use-clarity-object',
    description: 'Generate structured JSON from AI responses',
    signature: '<T>(options: UseClarityObjectOptions<T>) => UseClarityObjectReturn<T>',
    category: 'top-level',
    tags: ['structured-data', 'json', 'extraction', 'essential'],
    importStatement: "import { useClarityObject } from '@clarity-chat/react'",
    useCases: ['Data extraction', 'Form generation', 'Structured outputs'],
  },

  // Chat Hooks
  {
    name: 'useClarityChatWithTools',
    href: '/reference/hooks/use-clarity-chat-with-tools',
    description: 'Chat with tool UI registry integration',
    signature: '(options) => { ...chat, toolResults }',
    category: 'chat',
    tags: ['chat', 'tools', 'function-calling', 'agents'],
    importStatement: "import { useClarityChatWithTools } from '@clarity-chat/react'",
    useCases: ['Tool-augmented chat', 'Agent interfaces', 'Function calling'],
    relatedHooks: ['useClarityChat', 'useAgent'],
  },
  {
    name: 'useChatEnhanced',
    href: '/reference/hooks/use-chat-enhanced',
    description: 'Enhanced useChat with additional features',
    signature: '(options) => UseChatEnhancedReturn',
    category: 'chat',
    tags: ['chat', 'enhanced', 'features'],
    importStatement: "import { useChatEnhanced } from '@clarity-chat/react'",
    relatedHooks: ['useClarityChat'],
  },
  {
    name: 'useChatHandlers',
    href: '/reference/hooks/use-chat-handlers',
    description: 'Message event handlers for chat',
    signature: '(options) => ChatHandlers',
    category: 'chat',
    tags: ['chat', 'handlers', 'events'],
    importStatement: "import { useChatHandlers } from '@clarity-chat/react'",
  },
  {
    name: 'useAssistant',
    href: '/reference/hooks/use-assistant',
    description: 'OpenAI Assistants API integration',
    signature: '(options) => AssistantReturn',
    category: 'chat',
    tags: ['openai', 'assistant', 'integration'],
    importStatement: "import { useAssistant } from '@clarity-chat/react'",
    useCases: ['OpenAI Assistant features', 'Thread management'],
  },
  {
    name: 'useCompletion',
    href: '/reference/hooks/use-completion',
    description: 'Text completion without chat context',
    signature: '(options) => CompletionReturn',
    category: 'chat',
    tags: ['completion', 'text', 'generation'],
    importStatement: "import { useCompletion } from '@clarity-chat/react'",
  },
  {
    name: 'useChatOptimized',
    href: '/reference/hooks/use-chat-optimized',
    description: 'Optimized variant with memoization and batching',
    signature: '(options) => UseChatOptimizedReturn',
    category: 'performance',
    tags: ['chat', 'performance', 'optimization', 'enterprise'],
    importStatement: "import { useChatOptimized } from '@clarity-chat/react'",
    useCases: ['High-performance chat', 'Complex dashboards', 'Enterprise apps'],
    relatedHooks: ['useClarityChat', 'useTokenOptimization'],
  },

  // Memory Hooks
  {
    name: 'useMemoryContext',
    href: '/reference/hooks/use-memory-context',
    description: 'Access memory context for AI memory operations',
    signature: '() => MemoryContextValue | null',
    category: 'memory',
    tags: ['memory', 'context', 'persistence', 'ai'],
    importStatement: "import { useMemoryContext } from '@clarity-chat/react'",
    useCases: ['Add/query memories', 'Memory management', 'Context-aware features'],
    relatedHooks: ['useClarityChat', 'useIndexedDB'],
  },
  {
    name: 'useIndexedDB',
    href: '/reference/hooks/use-indexed-db',
    description: 'IndexedDB storage for large data with fallback',
    signature: '<T>(options) => IndexedDBReturn<T>',
    category: 'storage',
    tags: ['storage', 'indexeddb', 'persistence', 'large-data'],
    importStatement: "import { useIndexedDB } from '@clarity-chat/react'",
    useCases: ['Large data storage', 'Conversation history', 'File storage'],
    relatedHooks: ['useLocalStorage', 'useMemoryContext'],
  },
  {
    name: 'useEmbeddings',
    href: '/reference/hooks/use-embeddings',
    description: 'Generate text embeddings with caching',
    signature: '(options) => { embed, embedBatch }',
    category: 'memory',
    tags: ['embeddings', 'vectors', 'similarity', 'rag'],
    importStatement: "import { useEmbeddings } from '@clarity-chat/react'",
    useCases: ['Semantic search', 'RAG pipelines', 'Similarity matching'],
    relatedHooks: ['useVectorStore', 'useRAGPipeline'],
  },
  {
    name: 'useVectorStore',
    href: '/reference/hooks/use-vector-store',
    description: 'Vector store operations for similarity search',
    signature: '(options) => VectorStoreReturn',
    category: 'memory',
    tags: ['vectors', 'search', 'similarity', 'rag'],
    importStatement: "import { useVectorStore } from '@clarity-chat/react'",
    useCases: ['Custom RAG', 'Semantic search', 'Knowledge bases'],
    relatedHooks: ['useEmbeddings', 'useRAGPipeline'],
  },
  {
    name: 'useRAGPipeline',
    href: '/reference/hooks/use-rag-pipeline',
    description: 'Complete RAG pipeline management',
    signature: '(options) => RAGPipelineReturn',
    category: 'agent',
    tags: ['rag', 'retrieval', 'pipeline', 'agents'],
    importStatement: "import { useRAGPipeline } from '@clarity-chat/react'",
    useCases: ['Document Q&A', 'Knowledge retrieval', 'Context augmentation'],
    relatedHooks: ['useVectorStore', 'useEmbeddings'],
  },
  {
    name: 'useAgent',
    href: '/reference/hooks/use-agent',
    description: 'Stateful agent with tool execution',
    signature: '(options) => AgentReturn',
    category: 'agent',
    tags: ['agent', 'tools', 'workflow', 'autonomous'],
    importStatement: "import { useAgent } from '@clarity-chat/react'",
    useCases: ['Multi-step workflows', 'Autonomous agents', 'Complex tasks'],
    relatedHooks: ['useClarityChatWithTools'],
  },

  // Streaming Hooks
  {
    name: 'useStreamingSSE',
    href: '/reference/hooks/use-streaming-sse',
    description: 'Server-Sent Events streaming',
    signature: '(options) => SSEReturn',
    category: 'streaming',
    tags: ['streaming', 'sse', 'real-time'],
    importStatement: "import { useStreamingSSE } from '@clarity-chat/react'",
  },
  {
    name: 'useStreamingWebSocket',
    href: '/reference/hooks/use-streaming-websocket',
    description: 'WebSocket streaming connection',
    signature: '(options) => WebSocketReturn',
    category: 'streaming',
    tags: ['streaming', 'websocket', 'real-time', 'bidirectional'],
    importStatement: "import { useStreamingWebSocket } from '@clarity-chat/react'",
  },
  {
    name: 'useStreamableUI',
    href: '/reference/hooks/use-streamable-ui',
    description: 'UI state for streaming content',
    signature: '() => StreamableUIReturn',
    category: 'streaming',
    tags: ['streaming', 'ui', 'animations'],
    importStatement: "import { useStreamableUI } from '@clarity-chat/react'",
    useCases: ['Smooth typing effects', 'Progressive rendering'],
    relatedHooks: ['useRealisticTyping'],
  },
  {
    name: 'useRealisticTyping',
    href: '/reference/hooks/use-realistic-typing',
    description: 'Realistic typing animation effect',
    signature: '(options) => TypingReturn',
    category: 'streaming',
    tags: ['typing', 'animation', 'ui'],
    importStatement: "import { useRealisticTyping } from '@clarity-chat/react'",
    useCases: ['Human-like typing', 'Character-by-character display'],
    relatedHooks: ['useStreamableUI'],
  },

  // UI Hooks
  {
    name: 'useKeyboardShortcuts',
    href: '/reference/hooks/use-keyboard-shortcuts',
    description: 'Global keyboard shortcut handling',
    signature: '(shortcuts) => void',
    category: 'ui',
    tags: ['keyboard', 'shortcuts', 'accessibility'],
    importStatement: "import { useKeyboardShortcuts } from '@clarity-chat/react'",
    useCases: ['Keyboard navigation', 'Power user features'],
    relatedHooks: ['useCommandPalette'],
  },
  {
    name: 'useCommandPalette',
    href: '/reference/hooks/use-command-palette',
    description: 'Cmd+K command palette state management',
    signature: '(options) => { isOpen, toggle }',
    category: 'ui',
    tags: ['command-palette', 'search', 'navigation', 'cmd-k'],
    importStatement: "import { useCommandPalette } from '@clarity-chat/react'",
    useCases: ['Quick navigation', 'Command search', 'Power user features'],
    relatedHooks: ['useKeyboardShortcuts'],
  },
  {
    name: 'useDesignTokens',
    href: '/reference/hooks/use-design-tokens',
    description: 'Access design system tokens programmatically',
    signature: '() => DesignTokens',
    category: 'ui',
    tags: ['design-tokens', 'theming', 'styling', 'css-in-js'],
    importStatement: "import { useDesignTokens } from '@clarity-chat/react'",
    useCases: ['CSS-in-JS styling', 'Dynamic theming', 'Custom components'],
    relatedHooks: ['useTheme'],
  },
  {
    name: 'useTheme',
    href: '/reference/hooks/use-theme',
    description: 'Theme switching and system detection',
    signature: '() => { theme, setTheme }',
    category: 'ui',
    tags: ['theme', 'dark-mode', 'light-mode', 'system'],
    importStatement: "import { useTheme } from '@clarity-chat/react'",
    useCases: ['Dark/light mode', 'Theme persistence'],
    relatedHooks: ['useDesignTokens'],
  },
  {
    name: 'useMobileOptimization',
    href: '/reference/hooks/use-mobile-optimization',
    description: 'Mobile-specific optimizations',
    signature: '(options) => MobileOptimizationReturn',
    category: 'ui',
    tags: ['mobile', 'touch', 'responsive'],
    importStatement: "import { useMobileOptimization } from '@clarity-chat/react'",
    useCases: ['Touch handling', 'Viewport adjustments'],
    relatedHooks: ['useMobileKeyboard'],
  },
  {
    name: 'useMobileKeyboard',
    href: '/reference/hooks/use-mobile-keyboard',
    description: 'Mobile keyboard handling and focus',
    signature: '(options) => MobileKeyboardReturn',
    category: 'ui',
    tags: ['mobile', 'keyboard', 'input', 'focus'],
    importStatement: "import { useMobileKeyboard } from '@clarity-chat/react'",
    useCases: ['Input focus management', 'Keyboard resize handling'],
    relatedHooks: ['useMobileOptimization'],
  },

  // Utility Hooks
  {
    name: 'useDebounce',
    href: '/reference/hooks/use-debounce',
    description: 'Debounce rapidly changing values',
    signature: '<T>(value: T, delay: number) => T',
    category: 'utility',
    tags: ['debounce', 'performance', 'utility'],
    importStatement: "import { useDebounce } from '@clarity-chat/react'",
  },
  {
    name: 'useLocalStorage',
    href: '/reference/hooks/use-local-storage',
    description: 'Simple localStorage wrapper with SSR safety',
    signature: '<T>(key, initial) => [T, setter]',
    category: 'storage',
    tags: ['storage', 'localstorage', 'persistence', 'small-data'],
    importStatement: "import { useLocalStorage } from '@clarity-chat/react'",
    useCases: ['User preferences', 'Settings', 'Small data (<5MB)'],
    relatedHooks: ['useIndexedDB'],
  },
  {
    name: 'useTokenTracker',
    href: '/reference/hooks/use-token-tracker',
    description: 'Track token usage across messages',
    signature: '(messages) => TokenStats',
    category: 'utility',
    tags: ['tokens', 'analytics', 'monitoring', 'costs'],
    importStatement: "import { useTokenTracker } from '@clarity-chat/react'",
    useCases: ['Cost monitoring', 'Context window tracking'],
    relatedHooks: ['useTokenOptimization'],
  },
  {
    name: 'useTokenOptimization',
    href: '/reference/hooks/use-token-optimization-enhanced',
    description: 'Advanced token management and compression',
    signature: '(options) => TokenOptimizationReturn',
    category: 'performance',
    tags: ['tokens', 'optimization', 'compression', 'enterprise'],
    importStatement: "import { useTokenOptimization } from '@clarity-chat/react'",
    useCases: ['Context compression', 'Budget management'],
    relatedHooks: ['useTokenTracker', 'useChatOptimized'],
  },
  {
    name: 'useDashboardData',
    href: '/reference/hooks/use-dashboard-data',
    description: 'Data fetching with auto-refresh for dashboards',
    signature: '<T>(options) => { data, refresh }',
    category: 'utility',
    tags: ['data-fetching', 'polling', 'dashboard', 'analytics'],
    importStatement: "import { useDashboardData } from '@clarity-chat/react'",
    useCases: ['Analytics dashboards', 'Real-time data', 'Auto-refresh'],
  },
]

// =============================================================================
// COMPONENT METADATA
// =============================================================================

export const componentMetadata: ComponentMetadata[] = [
  {
    name: 'ClarityChat',
    href: '/reference/components/clarity-chat',
    description: 'Drop-in complete chat interface',
    props: 'api, memory?, theme?, appearance?',
    category: 'core',
    importStatement: "import { ClarityChat } from '@clarity-chat/react'",
    tags: ['chat', 'complete', 'drop-in'],
  },
  {
    name: 'ChatWindow',
    href: '/reference/components/chat-window',
    description: 'Chat container with layout',
    props: 'messages, onSend, isLoading?',
    category: 'core',
    importStatement: "import { ChatWindow } from '@clarity-chat/react'",
    tags: ['chat', 'container', 'layout'],
  },
  {
    name: 'Message',
    href: '/reference/components/message',
    description: 'Individual message display',
    props: 'role, content, timestamp?',
    category: 'core',
    importStatement: "import { Message } from '@clarity-chat/react'",
    tags: ['message', 'display'],
  },
  {
    name: 'MessageList',
    href: '/reference/components/message-list',
    description: 'Scrollable message list with virtualization',
    props: 'messages, virtualized?',
    category: 'core',
    importStatement: "import { MessageList } from '@clarity-chat/react'",
    tags: ['messages', 'list', 'virtualization'],
  },
  {
    name: 'ChatInput',
    href: '/reference/components/chat-input',
    description: 'Chat input field with submit',
    props: 'onSubmit, placeholder?',
    category: 'input',
    importStatement: "import { ChatInput } from '@clarity-chat/react'",
    tags: ['input', 'form'],
  },
  {
    name: 'MemoryProvider',
    href: '/reference/components/memory-provider',
    description: 'Memory context provider for AI memory operations',
    props: 'config: { maxTokens }',
    category: 'provider',
    importStatement: "import { MemoryProvider } from '@clarity-chat/react'",
    tags: ['memory', 'context', 'provider'],
  },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get hooks by category
 */
export function getHooksByCategory(category: HookCategory): HookMetadata[] {
  return hookMetadata.filter((hook) => hook.category === category)
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: ComponentCategory): ComponentMetadata[] {
  return componentMetadata.filter((comp) => comp.category === category)
}

/**
 * Search hooks by name or tags
 */
export function searchHooks(query: string): HookMetadata[] {
  const lowerQuery = query.toLowerCase()
  return hookMetadata.filter(
    (hook) =>
      hook.name.toLowerCase().includes(lowerQuery) ||
      hook.description.toLowerCase().includes(lowerQuery) ||
      hook.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get hook by name
 */
export function getHookByName(name: string): HookMetadata | undefined {
  return hookMetadata.find((hook) => hook.name === name)
}

/**
 * Get related hooks for a given hook
 */
export function getRelatedHooks(hookName: string): HookMetadata[] {
  const hook = getHookByName(hookName)
  if (!hook?.relatedHooks) return []
  return hook.relatedHooks
    .map((name) => getHookByName(name))
    .filter((h): h is HookMetadata => h !== undefined)
}

// Category display names and colors for UI
export const categoryConfig: Record<
  HookCategory,
  { label: string; colorClass: string }
> = {
  'top-level': {
    label: 'Top-Level (Drop-in Ready)',
    colorClass: 'text-brand-600 dark:text-brand-400',
  },
  chat: {
    label: 'Chat State',
    colorClass: 'text-amber-600 dark:text-amber-400',
  },
  memory: {
    label: 'Memory & Context',
    colorClass: 'text-green-600 dark:text-green-400',
  },
  streaming: {
    label: 'Streaming',
    colorClass: 'text-blue-600 dark:text-blue-400',
  },
  ui: {
    label: 'UI & Theming',
    colorClass: 'text-purple-600 dark:text-purple-400',
  },
  utility: {
    label: 'Utilities',
    colorClass: 'text-gray-600 dark:text-gray-400',
  },
  agent: {
    label: 'Agents & RAG',
    colorClass: 'text-orange-600 dark:text-orange-400',
  },
  storage: {
    label: 'Storage',
    colorClass: 'text-cyan-600 dark:text-cyan-400',
  },
  performance: {
    label: 'Performance',
    colorClass: 'text-red-600 dark:text-red-400',
  },
}

export const componentCategoryConfig: Record<
  ComponentCategory,
  { label: string; colorClass: string }
> = {
  core: {
    label: 'Core',
    colorClass: 'text-brand-600 dark:text-brand-400',
  },
  provider: {
    label: 'Providers',
    colorClass: 'text-green-600 dark:text-green-400',
  },
  layout: {
    label: 'Layout',
    colorClass: 'text-blue-600 dark:text-blue-400',
  },
  input: {
    label: 'Input',
    colorClass: 'text-purple-600 dark:text-purple-400',
  },
}
