/**
 * DocumentationService - Central documentation orchestration service
 *
 * Coordinates API documentation generation, RAG search, and related API discovery.
 * Acts as the main business logic layer for documentation operations.
 *
 * Responsibilities:
 * - Generate complete API documentation
 * - Extract API metadata from source code
 * - Find related APIs and examples
 * - Coordinate RAG and search services
 * - Build comprehensive documentation contexts
 *
 * Dependencies: RAGService, SearchService
 *
 * @example
 * ```typescript
 * const docService = new DocumentationService(ragService, searchService)
 * const doc = await docService.generateAPIDocumentation('useChat')
 * ```
 */

import type { RAGService } from './RAGService'
import type { SearchService, ScoredResult } from './SearchService'

// Simple logger for services
const logger = {
  debug: (msg: string, ...args: unknown[]) =>
    console.debug(`[DocumentationService] ${msg}`, ...args),
  info: (msg: string, ...args: unknown[]) =>
    console.info(`[DocumentationService] ${msg}`, ...args),
  warn: (msg: string, ...args: unknown[]) =>
    console.warn(`[DocumentationService] ${msg}`, ...args),
  error: (msg: string, ...args: unknown[]) =>
    console.error(`[DocumentationService] ${msg}`, ...args),
}

export interface APIMetadata {
  id: string
  name: string
  type: 'component' | 'hook' | 'utility' | 'api'
  description: string
  category: string
  tags: string[]
  signature?: string
  props?: Record<string, unknown>
  returns?: Record<string, unknown>
  examples?: string[]
  lastUpdated: string
}

export interface APIDocumentation {
  metadata: APIMetadata
  examples: ScoredResult[]
  relatedAPIs: ScoredResult[]
  context: string
  generatedAt: Date
}

export interface DocumentationSearchOptions {
  topK?: number
  includeExamples?: boolean
  includeRelated?: boolean
  currentPath?: string
}

/**
 * DocumentationService - Main documentation orchestration service
 */
export class DocumentationService {
  constructor(
    private ragService: RAGService,
    private searchService: SearchService
  ) {}

  /**
   * Generate complete API documentation
   */
  async generateAPIDocumentation(
    apiId: string,
    options: DocumentationSearchOptions = {}
  ): Promise<APIDocumentation> {
    const {
      topK = 5,
      includeExamples = true,
      includeRelated = true,
      currentPath,
    } = options

    try {
      // Extract API metadata (in real implementation, parse source code)
      const metadata = await this.getAPIMetadata(apiId)

      // Find relevant examples using RAG
      const examples = includeExamples
        ? await this.findRelevantExamples(metadata, topK)
        : []

      // Find related APIs using hybrid search
      const relatedAPIs = includeRelated
        ? await this.findRelatedAPIs(metadata, topK)
        : []

      // Build comprehensive context
      const context = this.buildDocumentationContext(
        metadata,
        examples,
        relatedAPIs
      )

      return {
        metadata,
        examples,
        relatedAPIs,
        context,
        generatedAt: new Date(),
      }
    } catch (error) {
      logger.error(`Error generating documentation for ${apiId}:`, error)
      throw error
    }
  }

  /**
   * Search documentation with RAG
   */
  async searchDocumentation(
    query: string,
    options: DocumentationSearchOptions = {}
  ) {
    const { topK = 5, currentPath } = options

    // Use hybrid search for best results
    const results = await this.searchService.hybridSearch(query, {
      topK,
      currentPath,
      enableMMR: true,
      enableReranking: true,
    })

    // Get RAG context for the query
    const ragContext = await this.ragService.retrieveContext(query, {
      topK,
      currentPath,
    })

    return {
      results,
      ragContext,
      suggestions: this.ragService.getSuggestedFollowUps(ragContext.sources),
    }
  }

  /**
   * Find relevant examples for an API
   */
  async findRelevantExamples(
    metadata: APIMetadata,
    topK = 5
  ): Promise<ScoredResult[]> {
    const query = `${metadata.name} ${metadata.type} example usage`

    const results = await this.searchService.hybridSearch(query, {
      topK,
      minScore: 0.5,
    })

    // Filter to only examples
    return results.filter((r) => r.category === 'example')
  }

  /**
   * Find related APIs based on metadata
   */
  async findRelatedAPIs(
    metadata: APIMetadata,
    topK = 5
  ): Promise<ScoredResult[]> {
    return this.searchService.findRelated(metadata, topK)
  }

  /**
   * Extract API metadata from source code
   * (Placeholder - actual implementation would parse TypeScript/JSDoc)
   */
  private async getAPIMetadata(apiId: string): Promise<APIMetadata> {
    // TODO: Implement actual source code parsing
    // For now, return mock metadata
    logger.warn(
      `getAPIMetadata not fully implemented, returning mock data for ${apiId}`
    )

    return {
      id: apiId,
      name: apiId,
      type: this.inferAPIType(apiId),
      description: `Documentation for ${apiId}`,
      category: 'api',
      tags: [],
      lastUpdated: new Date().toISOString(),
    }
  }

  /**
   * Infer API type from ID
   */
  private inferAPIType(
    apiId: string
  ): 'component' | 'hook' | 'utility' | 'api' {
    if (apiId.startsWith('use')) return 'hook'
    if (apiId.includes('Component') || /^[A-Z]/.test(apiId)) return 'component'
    return 'utility'
  }

  /**
   * Build comprehensive documentation context
   */
  private buildDocumentationContext(
    metadata: APIMetadata,
    examples: ScoredResult[],
    relatedAPIs: ScoredResult[]
  ): string {
    let context = `# ${metadata.name}\n\n`
    context += `**Type:** ${metadata.type}\n`
    context += `**Category:** ${metadata.category}\n\n`
    context += `${metadata.description}\n\n`

    if (metadata.signature) {
      context += `## Signature\n\n\`\`\`typescript\n${metadata.signature}\n\`\`\`\n\n`
    }

    if (examples.length > 0) {
      context += `## Examples\n\n`
      examples.forEach((example, i) => {
        context += `### ${example.title}\n`
        context += `${example.content.slice(0, 300)}...\n`
        context += `[View full example](${example.url})\n\n`
      })
    }

    if (relatedAPIs.length > 0) {
      context += `## Related APIs\n\n`
      relatedAPIs.forEach((api) => {
        context += `- [${api.title}](${api.url}) - ${api.category}\n`
      })
      context += '\n'
    }

    return context
  }

  /**
   * Validate documentation completeness
   */
  validateDocumentation(doc: APIDocumentation): {
    isComplete: boolean
    missing: string[]
  } {
    const missing: string[] = []

    if (!doc.metadata.description || doc.metadata.description.length < 10) {
      missing.push('description')
    }

    if (!doc.metadata.signature) {
      missing.push('signature')
    }

    if (doc.examples.length === 0) {
      missing.push('examples')
    }

    if (doc.relatedAPIs.length === 0) {
      missing.push('relatedAPIs')
    }

    return {
      isComplete: missing.length === 0,
      missing,
    }
  }

  /**
   * Get documentation coverage statistics
   */
  async getCoverageStats(): Promise<{
    total: number
    documented: number
    coverage: number
  }> {
    // TODO: Implement actual coverage calculation
    logger.warn('getCoverageStats not fully implemented')

    return {
      total: 100,
      documented: 75,
      coverage: 0.75,
    }
  }
}
