/**
 * Chat Configuration Builder
 * 
 * Implements the Builder Pattern for Configuration as specified in the blueprint.
 * Allows fluent, type-safe configuration of chat components.
 * 
 * @example
 * ```tsx
 * const config = new ChatConfigBuilder()
 *   .withStreaming({
 *     provider: 'openai',
 *     endpoint: '/api/chat',
 *     retryPolicy: 'exponential'
 *   })
 *   .withAccessibility({
 *     screenReader: true,
 *     keyboardShortcuts: true
 *   })
 *   .withPersistence({
 *     storage: 'indexeddb',
 *     maxHistory: 1000
 *   })
 *   .build()
 * ```
 */

export type AIServiceProvider = 'openai' | 'anthropic' | 'google' | 'azure' | 'custom'
export type RetryPolicy = 'exponential' | 'linear' | 'fixed' | 'none'
export type StorageType = 'localstorage' | 'indexeddb' | 'memory' | 'custom'

export interface StreamingConfig {
  provider: AIServiceProvider
  endpoint: string
  retryPolicy: RetryPolicy
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  timeout?: number
}

export interface AccessibilityConfig {
  screenReader: boolean
  highContrast: boolean
  keyboardShortcuts: boolean
  focusManagement?: boolean
  ariaLabels?: boolean
}

export interface PersistenceConfig {
  storage: StorageType
  maxHistory: number
  autoSave?: boolean
  saveInterval?: number
  encryption?: boolean
}

export interface MarkdownConfig {
  enableKaTeX?: boolean
  enableMermaid?: boolean
  enableSyntaxHighlight?: boolean
  codeTheme?: 'light' | 'dark'
}

export interface SearchConfig {
  enableFuzzySearch?: boolean
  enableAdvancedFilters?: boolean
  maxResults?: number
}

export interface ExportConfig {
  formats: Array<'pdf' | 'markdown' | 'json' | 'html' | 'docx'>
  defaultFormat?: 'pdf' | 'markdown' | 'json' | 'html' | 'docx'
  includeMetadata?: boolean
  includeImages?: boolean
}

export interface ChatConfig {
  streaming?: StreamingConfig
  accessibility?: AccessibilityConfig
  persistence?: PersistenceConfig
  markdown?: MarkdownConfig
  search?: SearchConfig
  export?: ExportConfig
}

/**
 * Chat Configuration Builder
 * 
 * Fluent builder API for creating chat configurations
 */
export class ChatConfigBuilder {
  private config: ChatConfig = {}

  /**
   * Configure streaming behavior
   */
  withStreaming(config: StreamingConfig): this {
    this.config.streaming = {
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 30000,
      timeout: 60000,
      ...config,
    }
    return this
  }

  /**
   * Configure accessibility features
   */
  withAccessibility(config: AccessibilityConfig): this {
    this.config.accessibility = {
      focusManagement: true,
      ariaLabels: true,
      ...config,
    }
    return this
  }

  /**
   * Configure persistence/storage
   */
  withPersistence(config: PersistenceConfig): this {
    this.config.persistence = {
      autoSave: true,
      saveInterval: 5000,
      encryption: false,
      ...config,
    }
    return this
  }

  /**
   * Configure markdown rendering
   */
  withMarkdown(config: MarkdownConfig): this {
    this.config.markdown = {
      enableSyntaxHighlight: true,
      codeTheme: 'dark',
      ...config,
    }
    return this
  }

  /**
   * Configure search functionality
   */
  withSearch(config: SearchConfig): this {
    this.config.search = {
      enableFuzzySearch: false,
      enableAdvancedFilters: true,
      maxResults: 100,
      ...config,
    }
    return this
  }

  /**
   * Configure export functionality
   */
  withExport(config: ExportConfig): this {
    this.config.export = {
      defaultFormat: 'markdown',
      includeMetadata: true,
      includeImages: true,
      ...config,
    }
    return this
  }

  /**
   * Build the final configuration
   */
  build(): ChatConfig {
    return { ...this.config }
  }

  /**
   * Reset the builder
   */
  reset(): this {
    this.config = {}
    return this
  }

  /**
   * Merge with another configuration
   */
  merge(other: ChatConfig): this {
    this.config = {
      ...this.config,
      ...other,
      streaming: { ...this.config.streaming, ...other.streaming },
      accessibility: { ...this.config.accessibility, ...other.accessibility },
      persistence: { ...this.config.persistence, ...other.persistence },
      markdown: { ...this.config.markdown, ...other.markdown },
      search: { ...this.config.search, ...other.search },
      export: { ...this.config.export, ...other.export },
    }
    return this
  }
}

/**
 * Create a new ChatConfigBuilder instance
 */
export function createChatConfig(): ChatConfigBuilder {
  return new ChatConfigBuilder()
}

/**
 * Default configuration factory
 */
export function getDefaultChatConfig(): ChatConfig {
  return new ChatConfigBuilder()
    .withStreaming({
      provider: 'openai',
      endpoint: '/api/chat',
      retryPolicy: 'exponential',
    })
    .withAccessibility({
      screenReader: true,
      highContrast: false,
      keyboardShortcuts: true,
    })
    .withPersistence({
      storage: 'localstorage',
      maxHistory: 100,
    })
    .withMarkdown({
      enableSyntaxHighlight: true,
      codeTheme: 'dark',
    })
    .build()
}

/**
 * Create configuration from JSON
 */
export function fromJSON(json: string | object): ChatConfig {
  const parsed = typeof json === 'string' ? JSON.parse(json) : json
  return parsed as ChatConfig
}

/**
 * Validate configuration
 */
export function validateConfig(config: ChatConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (config.streaming) {
    if (!config.streaming.endpoint) {
      errors.push('Streaming endpoint is required')
    }
    if (config.streaming.maxRetries && config.streaming.maxRetries < 0) {
      errors.push('Max retries must be non-negative')
    }
  }

  if (config.persistence) {
    if (config.persistence.maxHistory < 0) {
      errors.push('Max history must be non-negative')
    }
    if (config.persistence.saveInterval && config.persistence.saveInterval < 0) {
      errors.push('Save interval must be non-negative')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
