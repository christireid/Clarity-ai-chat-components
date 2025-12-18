/**
 * Core Minimal Entry Point
 *
 * A lightweight bundle (~30KB) containing only essential chat functionality.
 * Enterprise features can be loaded on-demand for optimal performance.
 *
 * @packageDocumentation
 */

// Core Components (Essential)
export { ChatWindow } from './components/chat/chat-window'
export { MessageList } from './components/message/message-list'
export { Message } from './components/message/message'
export { ChatInput } from './components/chat/chat-input'

// Core Hooks (Essential)
export { useClarityChat } from './hooks/chat/use-clarity-chat'
export { useChat } from './hooks/chat/use-chat'
export { useAutoScroll } from './hooks/ui/use-auto-scroll'

// Essential Types
export type {
  Message as MessageType,
  ChatConfig,
  ChatOptions,
  ChatResponse,
} from '@clarity-chat/types'

// Lazy Loading Utilities for Enterprise Features
export const lazyLoadRAG = () =>
  import('./enterprise/rag').then((m) => ({
    RAGPipeline: m.RAGPipeline,
    useRAGPipeline: m.useRAGPipeline,
  }))

export const lazyLoadAnalytics = () =>
  import('./analytics').then((m) => ({
    AnalyticsProvider: m.AnalyticsProvider,
    useAnalytics: m.useAnalytics,
    useTrackEvent: m.useTrackEvent,
  }))

export const lazyLoadTokenOptimization = () =>
  import('./memory/token-optimizer').then((m) => ({
    TokenOptimizer: m.TokenOptimizer,
    useTokenOptimization: m.useTokenOptimization,
  }))

export const lazyLoadVectorStores = () =>
  import('./vector-stores').then((m) => ({
    useVectorStore: m.useVectorStore,
    PineconeStore: m.PineconeStore,
    QdrantStore: m.QdrantStore,
  }))

export const lazyLoadAgents = () =>
  import('./agents').then((m) => ({
    useAgentOrchestration: m.useAgentOrchestration,
    ReactAgent: m.ReactAgent,
  }))

export const lazyLoadMemory = () =>
  import('./memory').then((m) => ({
    MemoryProvider: m.MemoryProvider,
    useMemory: m.useMemory,
    useMemoryService: m.useMemoryService,
  }))

/**
 * Feature Loader Helper
 * Provides a consistent API for loading enterprise features
 */
export class FeatureLoader {
  private loadedFeatures = new Set<string>()

  async loadRAG() {
    if (this.loadedFeatures.has('rag')) return
    await lazyLoadRAG()
    this.loadedFeatures.add('rag')
  }

  async loadAnalytics() {
    if (this.loadedFeatures.has('analytics')) return
    await lazyLoadAnalytics()
    this.loadedFeatures.add('analytics')
  }

  async loadTokenOptimization() {
    if (this.loadedFeatures.has('token-optimization')) return
    await lazyLoadTokenOptimization()
    this.loadedFeatures.add('token-optimization')
  }

  async loadVectorStores() {
    if (this.loadedFeatures.has('vector-stores')) return
    await lazyLoadVectorStores()
    this.loadedFeatures.add('vector-stores')
  }

  async loadAgents() {
    if (this.loadedFeatures.has('agents')) return
    await lazyLoadAgents()
    this.loadedFeatures.add('agents')
  }

  async loadMemory() {
    if (this.loadedFeatures.has('memory')) return
    await lazyLoadMemory()
    this.loadedFeatures.add('memory')
  }

  isLoaded(feature: string): boolean {
    return this.loadedFeatures.has(feature)
  }

  async loadAll() {
    await Promise.all([
      this.loadRAG(),
      this.loadAnalytics(),
      this.loadTokenOptimization(),
      this.loadVectorStores(),
      this.loadAgents(),
      this.loadMemory(),
    ])
  }
}

export const featureLoader = new FeatureLoader()
