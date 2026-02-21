/**
 * Service Layer - Clean Architecture Implementation
 *
 * Centralized exports for all business logic services.
 * All API routes should use these services instead of implementing logic directly.
 *
 * @example
 * ```typescript
 * // In API routes
 * import { getService } from '@/lib/services'
 *
 * export async function POST(request: NextRequest) {
 *   const docService = await getService('documentation')
 *   const result = await docService.searchDocumentation(query)
 *   return NextResponse.json(result)
 * }
 * ```
 */

// Services
export { RAGService } from './RAGService'
export { SearchService } from './SearchService'
export { DocumentationService } from './DocumentationService'
export { AgentCoordinator } from './AgentCoordinator'

// Service container
export {
  getServiceContainer,
  getServices,
  getService,
  resetServices,
  services,
  type ServiceName,
} from './ServiceContainer'

// Types
export type { RAGOptions, RAGContext, Citation } from './RAGService'

export type { HybridSearchOptions, ScoredResult } from './SearchService'

export type {
  APIMetadata,
  APIDocumentation,
  DocumentationSearchOptions,
} from './DocumentationService'

export type {
  AgentLock,
  AgentTask,
  AgentStatus,
  ConflictInfo,
} from './AgentCoordinator'
