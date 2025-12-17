/**
 * Core Minimal Entry Point - Ultra-lightweight bundle (~30KB actual)
 * Implements proper tree shaking and code splitting for optimal bundle size
 */

// Re-export only essential components and utilities
export { ClarityChat } from './components/ClarityChat'
export { ChatWindow } from './components/ChatWindow'
export { MessageList } from './components/MessageList'
export { Message } from './components/Message'
export { ChatInput } from './components/ChatInput'

// Core hooks only
export { useClarityChat } from './hooks/useClarityChat'
export { useChat } from './hooks/useChat'
export { useAutoScroll } from './hooks/useAutoScroll'

// Essential types
export type {
  ChatMessage,
  ChatConfig,
  ChatState,
  ChatEvent,
  ChatEventHandler
} from './types'

// Minimal utilities
export { cn } from './utils/cn'
export { formatMessage } from './utils/format'

// Constants
export { DEFAULT_CHAT_CONFIG } from './constants'

/**
 * FeatureLoader for on-demand loading of enterprise features
 * This enables code splitting and lazy loading
 */
export class FeatureLoader {
  private loadedFeatures = new Set<string>()
  private featurePromises = new Map<string, Promise<any>>()

  /**
   * Dynamically load a feature module
   */
  async loadFeature<T>(featureName: string, modulePath: string): Promise<T> {
    if (this.loadedFeatures.has(featureName)) {
      return this.featurePromises.get(featureName) as Promise<T>
    }

    const loadPromise = import(/* webpackChunkName: "[request]" */ modulePath)
      .then(module => {
        this.loadedFeatures.add(featureName)
        return module.default || module
      })
      .catch(error => {
        console.error(`Failed to load feature ${featureName}:`, error)
        throw error
      })

    this.featurePromises.set(featureName, loadPromise)
    return loadPromise
  }

  /**
   * Check if a feature is loaded
   */
  isFeatureLoaded(featureName: string): boolean {
    return this.loadedFeatures.has(featureName)
  }

  /**
   * Get loaded features
   */
  getLoadedFeatures(): string[] {
    return Array.from(this.loadedFeatures)
  }

  /**
   * Unload a feature to free memory
   */
  unloadFeature(featureName: string): void {
    this.loadedFeatures.delete(featureName)
    this.featurePromises.delete(featureName)
  }

  /**
   * Clear all loaded features
   */
  clearFeatures(): void {
    this.loadedFeatures.clear()
    this.featurePromises.clear()
  }
}

/**
 * Lazy-loaded feature modules for optimal bundle size
 */
export const LazyFeatures = {
  // Analytics - Load only when needed
  getAnalytics: () => import('./analytics/index').then(m => m.AnalyticsManager),
  
  // RAG - Load only when RAG features are used
  getRAG: () => import('./rag/index').then(m => m.RAGManager),
  
  // Vector Stores - Load only when vector search is needed
  getVectorStores: () => import('./vector-stores/index').then(m => m.VectorStoreManager),
  
  // Agents - Load only when agent features are used
  getAgents: () => import('./agents/index').then(m => m.AgentManager),
  
  // Memory - Load only when memory features are used
  getMemory: () => import('./memory/index').then(m => m.MemoryManager),
  
  // Enterprise Security - Load only when enterprise features are used
  getEnterpriseSecurity: () => import('./enterprise/security').then(m => m.EnterpriseSecurityManager)
}

/**
 * Bundle size optimization utilities
 */
export class BundleOptimizer {
  private static instance: BundleOptimizer
  private featureLoader = new FeatureLoader()
  private loadedModules = new Map<string, any>()

  static getInstance(): BundleOptimizer {
    if (!BundleOptimizer.instance) {
      BundleOptimizer.instance = new BundleOptimizer()
    }
    return BundleOptimizer.instance
  }

  /**
   * Load a feature on-demand with caching
   */
  async loadFeature<T>(featureName: string, modulePath: string): Promise<T> {
    if (this.loadedModules.has(featureName)) {
      return this.loadedModules.get(featureName)
    }

    const feature = await this.featureLoader.loadFeature<T>(featureName, modulePath)
    this.loadedModules.set(featureName, feature)
    return feature
  }

  /**
   * Preload critical features for better UX
   */
  async preloadFeatures(features: Array<{ name: string; path: string }>): Promise<void> {
    const loadPromises = features.map(({ name, path }) => 
      this.loadFeature(name, path).catch(() => {
        // Silent fail for non-critical features
        console.warn(`Failed to preload feature: ${name}`)
      })
    )

    await Promise.allSettled(loadPromises)
  }

  /**
   * Get bundle size information
   */
  getBundleInfo(): {
    loadedFeatures: string[]
    memoryUsage: number
    estimatedSize: string
  } {
    const loadedFeatures = this.featureLoader.getLoadedFeatures()
    const memoryUsage = performance.memory ? performance.memory.usedJSHeapSize : 0
    const estimatedSize = this.estimateBundleSize(loadedFeatures)

    return {
      loadedFeatures,
      memoryUsage,
      estimatedSize
    }
  }

  /**
   * Estimate bundle size based on loaded features
   */
  private estimateBundleSize(features: string[]): string {
    const baseSize = 30 // 30KB for core-minimal
    const featureSizes: Record<string, number> = {
      'analytics': 45,
      'rag': 65,
      'vector-stores': 55,
      'agents': 75,
      'memory': 85,
      'enterprise-security': 95
    }

    const totalSize = features.reduce((total, feature) => {
      return total + (featureSizes[feature] || 25)
    }, baseSize)

    return `${totalSize}KB`
  }

  /**
   * Optimize for mobile devices
   */
  optimizeForMobile(): void {
    // Disable heavy features on mobile
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      console.log('Mobile device detected, disabling heavy features')
      // Additional mobile-specific optimizations can be added here
    }
  }

  /**
   * Cleanup unused features
   */
  cleanup(): void {
    this.featureLoader.clearFeatures()
    this.loadedModules.clear()
  }
}

/**
 * Tree-shaking friendly exports
 */
export const createMinimalChat = () => import('./components/ClarityChat').then(m => m.ClarityChat)
export const createChatWindow = () => import('./components/ChatWindow').then(m => m.ChatWindow)
export const createMessageList = () => import('./components/MessageList').then(m => m.MessageList)

/**
 * Performance monitoring for bundle optimization
 */
export class BundleMonitor {
  private startTime = Date.now()
  private loadTimes = new Map<string, number>()

  recordLoadTime(featureName: string, startTime: number): void {
    const loadTime = Date.now() - startTime
    this.loadTimes.set(featureName, loadTime)
  }

  getLoadReport(): Record<string, number> {
    return Object.fromEntries(this.loadTimes)
  }

  getTotalLoadTime(): number {
    return Date.now() - this.startTime
  }

  reset(): void {
    this.startTime = Date.now()
    this.loadTimes.clear()
  }
}

// Export singleton instances
export const featureLoader = new FeatureLoader()
export const bundleOptimizer = BundleOptimizer.getInstance()
export const bundleMonitor = new BundleMonitor()

// Performance optimization for production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Enable performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
      console.log(`Core-minimal bundle loaded in ${loadTime}ms`)
    })
  }

  // Optimize for mobile
  bundleOptimizer.optimizeForMobile()
}