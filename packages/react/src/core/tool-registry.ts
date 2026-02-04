/**
 * Tool Registry
 *
 * Central registry for managing tool definitions. Provides discovery, validation,
 * and organization of tools with support for categories, tags, and namespaces.
 *
 * **Features**:
 * - Register and unregister tools
 * - Query by name, category, tags
 * - Search with fuzzy matching
 * - Namespace support for organization
 * - Validation on registration
 * - Event notifications for changes
 *
 * @module core/tool-registry
 */

import { validateToolDefinition } from '../types/tool-definition'
import type { IToolRegistry, ToolDefinition } from '../types/tool-definition'
import { validateToolImplementationStrict } from './tool-implementation-validator'

// =============================================================================
// Registry Events
// =============================================================================

/**
 * Registry event types
 */
export type RegistryEventType = 'registered' | 'unregistered' | 'cleared'

/**
 * Registry event
 */
export interface RegistryEvent {
  type: RegistryEventType
  toolName: string
  timestamp: number
}

/**
 * Registry event listener
 */
export type RegistryListener = (event: RegistryEvent) => void

// =============================================================================
// Tool Registry Implementation
// =============================================================================

/**
 * Tool Registry
 *
 * Manages collection of tool definitions with discovery and validation.
 *
 * @example
 * ```typescript
 * const registry = new ToolRegistry()
 *
 * // Register tools
 * registry.register(weatherTool)
 * registry.register(calculatorTool)
 *
 * // Query tools
 * const tool = registry.get('get_weather')
 * const utilityTools = registry.getByCategory('utility')
 * const mathTools = registry.getByTag('math')
 *
 * // Search
 * const results = registry.search('weather')
 * ```
 */
export class ToolRegistry implements IToolRegistry {
  private tools = new Map<string, ToolDefinition>()
  private listeners: RegistryListener[] = []
  // FIX: TOOL-004 - Add max listeners to prevent memory leaks
  private maxListeners = 100 // Default limit like Node.js EventEmitter
  private hasWarnedMaxListeners = false

  /**
   * Register a tool
   *
   * @param tool - Tool definition to register
   * @throws Error if tool is invalid or name conflicts
   */
  register(tool: ToolDefinition): void {
    // Validate tool definition
    validateToolDefinition(tool)

    // Validate tool implementation (security checks)
    validateToolImplementationStrict(tool)

    // Check for name conflicts
    if (this.tools.has(tool.name)) {
      throw new Error(
        `Tool "${tool.name}" is already registered. Unregister it first or use a different name.`
      )
    }

    // Register tool
    this.tools.set(tool.name, tool)

    // Emit event
    this.emit({
      type: 'registered',
      toolName: tool.name,
      timestamp: Date.now(),
    })
  }

  /**
   * Register or update a tool (allows overwriting with warning)
   *
   * FIX: TOOL-005 - Provide explicit method for updating tools
   *
   * @param tool - Tool definition to register or update
   * @param options - Options for registration
   */
  registerOrUpdate(
    tool: ToolDefinition,
    options: { silent?: boolean } = {}
  ): void {
    // Validate tool definition
    validateToolDefinition(tool)

    // Check if tool already exists
    const existing = this.tools.get(tool.name)
    if (existing && !options.silent) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[ToolRegistry] Overwriting existing tool "${tool.name}". ` +
            `Use unregister() first if this is intentional, or pass { silent: true } to suppress this warning.`
        )
      }
    }

    // Register/update tool
    this.tools.set(tool.name, tool)

    // Emit appropriate event
    this.emit({
      type: existing ? 'registered' : 'registered', // Could add 'updated' type in future
      toolName: tool.name,
      timestamp: Date.now(),
    })
  }

  /**
   * Register multiple tools at once
   *
   * @param tools - Array of tools to register
   */
  registerMany(tools: ToolDefinition[]): void {
    for (const tool of tools) {
      this.register(tool)
    }
  }

  /**
   * Unregister a tool by name
   *
   * @param name - Tool name
   * @returns true if tool was unregistered, false if not found
   */
  unregister(name: string): boolean {
    const deleted = this.tools.delete(name)

    if (deleted) {
      this.emit({
        type: 'unregistered',
        toolName: name,
        timestamp: Date.now(),
      })
    }

    return deleted
  }

  /**
   * Get tool by name
   *
   * @param name - Tool name
   * @returns Tool definition or undefined if not found
   */
  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name)
  }

  /**
   * Check if tool exists
   *
   * @param name - Tool name
   * @returns true if tool is registered
   */
  has(name: string): boolean {
    return this.tools.has(name)
  }

  /**
   * Get all registered tools
   *
   * @returns Array of all tool definitions
   */
  getAll(): ToolDefinition[] {
    return Array.from(this.tools.values())
  }

  /**
   * Get tools by category
   *
   * @param category - Category name
   * @returns Array of tools in category
   */
  getByCategory(category: string): ToolDefinition[] {
    return this.getAll().filter((tool) => tool.category === category)
  }

  /**
   * Get tools by tag
   *
   * @param tag - Tag name
   * @returns Array of tools with tag
   */
  getByTag(tag: string): ToolDefinition[] {
    return this.getAll().filter((tool) => tool.tags?.includes(tag))
  }

  /**
   * Search tools by query
   *
   * Searches in: name, description, displayName, category, tags
   *
   * @param query - Search query (case-insensitive)
   * @returns Array of matching tools, sorted by relevance
   */
  search(query: string): ToolDefinition[] {
    if (!query || query.trim().length === 0) {
      return this.getAll()
    }

    const normalizedQuery = query.toLowerCase().trim()
    const results: Array<{ tool: ToolDefinition; score: number }> = []

    for (const tool of this.getAll()) {
      let score = 0

      // Exact name match (highest priority)
      if (tool.name.toLowerCase() === normalizedQuery) {
        score += 100
      }
      // Name contains query
      else if (tool.name.toLowerCase().includes(normalizedQuery)) {
        score += 50
      }

      // Display name match
      if (tool.displayName?.toLowerCase().includes(normalizedQuery)) {
        score += 30
      }

      // Description match
      if (tool.description.toLowerCase().includes(normalizedQuery)) {
        score += 20
      }

      // Category match
      if (tool.category?.toLowerCase().includes(normalizedQuery)) {
        score += 15
      }

      // Tag match
      if (
        tool.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      ) {
        score += 10
      }

      if (score > 0) {
        results.push({ tool, score })
      }
    }

    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score)

    return results.map((r) => r.tool)
  }

  /**
   * Get all unique categories
   *
   * @returns Array of category names
   */
  getCategories(): string[] {
    const categories = new Set<string>()
    for (const tool of this.getAll()) {
      if (tool.category) {
        categories.add(tool.category)
      }
    }
    return Array.from(categories).sort()
  }

  /**
   * Get all unique tags
   *
   * @returns Array of tag names
   */
  getTags(): string[] {
    const tags = new Set<string>()
    for (const tool of this.getAll()) {
      if (tool.tags) {
        for (const tag of tool.tags) {
          tags.add(tag)
        }
      }
    }
    return Array.from(tags).sort()
  }

  /**
   * Clear all tools
   */
  clear(): void {
    const names = Array.from(this.tools.keys())
    this.tools.clear()

    for (const name of names) {
      this.emit({
        type: 'cleared',
        toolName: name,
        timestamp: Date.now(),
      })
    }
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    totalTools: number
    byCategory: Record<string, number>
    byTag: Record<string, number>
  } {
    const stats = {
      totalTools: this.tools.size,
      byCategory: {} as Record<string, number>,
      byTag: {} as Record<string, number>,
    }

    for (const tool of this.getAll()) {
      // Count by category
      if (tool.category) {
        stats.byCategory[tool.category] =
          (stats.byCategory[tool.category] || 0) + 1
      }

      // Count by tags
      if (tool.tags) {
        for (const tag of tool.tags) {
          stats.byTag[tag] = (stats.byTag[tag] || 0) + 1
        }
      }
    }

    return stats
  }

  /**
   * Subscribe to registry events
   *
   * @param listener - Event listener function
   * @returns Unsubscribe function
   */
  on(listener: RegistryListener): () => void {
    // FIX: TOOL-004 - Check listener count before adding to prevent memory leaks
    // Skip check if maxListeners is 0 (unlimited)
    if (this.maxListeners > 0 && this.listeners.length >= this.maxListeners) {
      const error = new Error(
        `Maximum listener count (${this.maxListeners}) exceeded for ToolRegistry. ` +
          'This may indicate a memory leak. Ensure listeners are properly unsubscribed.'
      )
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }
      throw error
    }

    // FIX: TOOL-004 - Warn when approaching limit (only if limit is set)
    if (
      this.maxListeners > 0 &&
      this.listeners.length >= this.maxListeners * 0.8 &&
      !this.hasWarnedMaxListeners
    ) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[ToolRegistry] Approaching maximum listener count: ${this.listeners.length}/${this.maxListeners}. ` +
            'Ensure listeners are properly cleaned up to avoid memory leaks.'
        )
      }
      this.hasWarnedMaxListeners = true
    }

    this.listeners.push(listener)

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index !== -1) {
        this.listeners.splice(index, 1)
        // Reset warning flag when count drops below threshold
        if (this.listeners.length < this.maxListeners * 0.7) {
          this.hasWarnedMaxListeners = false
        }
      }
    }
  }

  /**
   * Set maximum number of listeners (default: 100)
   * Set to 0 for unlimited listeners (not recommended)
   *
   * FIX: TOOL-004 - Allow configuration of listener limits
   */
  setMaxListeners(n: number): void {
    if (n < 0) {
      throw new Error('maxListeners must be non-negative')
    }
    this.maxListeners = n
  }

  /**
   * Get current listener count
   *
   * FIX: TOOL-004 - Provide visibility into listener count
   */
  getListenerCount(): number {
    return this.listeners.length
  }

  /**
   * Emit registry event
   */
  private emit(event: RegistryEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error in registry listener:', error)
        }
      }
    }
  }

  /**
   * Create a namespaced registry
   *
   * Returns a new registry that operates on a subset of tools
   * with names matching the namespace prefix.
   *
   * @param namespace - Namespace prefix (e.g., 'builtin', 'custom')
   * @returns Namespaced registry
   *
   * @example
   * ```typescript
   * const mainRegistry = new ToolRegistry()
   * const builtinRegistry = mainRegistry.namespace('builtin')
   *
   * // Register in namespace
   * builtinRegistry.register({
   *   name: 'builtin.calculator',
   *   ...
   * })
   *
   * // Query from namespace
   * const tools = builtinRegistry.getAll() // Only 'builtin.*' tools
   * ```
   */
  namespace(namespace: string): NamespacedRegistry {
    return new NamespacedRegistry(this, namespace)
  }

  /**
   * Export registry to JSON
   */
  toJSON(): ToolDefinition[] {
    return this.getAll()
  }

  /**
   * Import tools from JSON
   *
   * @param tools - Array of tool definitions
   * @param replace - If true, clear existing tools first
   */
  fromJSON(tools: ToolDefinition[], replace = false): void {
    if (replace) {
      this.clear()
    }
    this.registerMany(tools)
  }
}

// =============================================================================
// Namespaced Registry
// =============================================================================

/**
 * Namespaced registry
 *
 * Provides isolated view of tools within a namespace.
 */
export class NamespacedRegistry implements IToolRegistry {
  constructor(
    private parent: ToolRegistry,
    private namespace: string
  ) {}

  private getFullName(name: string): string {
    return name.startsWith(`${this.namespace}.`)
      ? name
      : `${this.namespace}.${name}`
  }

  private isInNamespace(name: string): boolean {
    return name.startsWith(`${this.namespace}.`)
  }

  register(tool: ToolDefinition): void {
    const fullName = this.getFullName(tool.name)
    this.parent.register({ ...tool, name: fullName })
  }

  unregister(name: string): boolean {
    const fullName = this.getFullName(name)
    return this.parent.unregister(fullName)
  }

  get(name: string): ToolDefinition | undefined {
    const fullName = this.getFullName(name)
    return this.parent.get(fullName)
  }

  has(name: string): boolean {
    const fullName = this.getFullName(name)
    return this.parent.has(fullName)
  }

  getAll(): ToolDefinition[] {
    return this.parent.getAll().filter((tool) => this.isInNamespace(tool.name))
  }

  getByCategory(category: string): ToolDefinition[] {
    return this.getAll().filter((tool) => tool.category === category)
  }

  getByTag(tag: string): ToolDefinition[] {
    return this.getAll().filter((tool) => tool.tags?.includes(tag))
  }

  search(query: string): ToolDefinition[] {
    const allResults = this.parent.search(query)
    return allResults.filter((tool) => this.isInNamespace(tool.name))
  }

  clear(): void {
    const tools = this.getAll()
    for (const tool of tools) {
      this.parent.unregister(tool.name)
    }
  }
}

// =============================================================================
// Global Registry (Optional)
// =============================================================================

/**
 * Global tool registry instance
 *
 * Optional: use this for simple use cases, or create your own instance.
 */
export const globalToolRegistry = new ToolRegistry()

// =============================================================================
// Exports (already exported inline above)
// =============================================================================
// All exports are handled inline throughout the file
