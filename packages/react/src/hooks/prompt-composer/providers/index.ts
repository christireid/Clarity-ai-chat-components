/**
 * Context Providers for PromptComposer
 *
 * Pre-built providers for common context sources:
 * - @file: File system integration
 * - @doc: Documentation lookup
 * - @user: User/team mentions
 * - @web: Web search/fetch
 *
 * @example
 * ```tsx
 * import {
 *   createFileProvider,
 *   createDocProvider,
 *   createUserProvider,
 *   createWebProvider
 * } from '@clarity-chat/react/hooks'
 *
 * const fileProvider = createFileProvider({
 *   searchFiles: async (query) => await searchProjectFiles(query),
 *   readFile: async (path) => await fs.readFile(path, 'utf-8')
 * })
 *
 * const docProvider = createDocProvider({
 *   searchDocs: async (query) => await searchDocsAPI(query)
 * })
 *
 * const userProvider = createUserProvider({
 *   searchUsers: async (query) => await searchTeamMembers(query)
 * })
 *
 * const webProvider = createWebProvider({
 *   searchWeb: async (query) => await googleCustomSearch(query),
 *   fetchUrl: async (url) => await fetchPageContent(url)
 * })
 *
 * <PromptComposer
 *   api="/api/chat"
 *   features={{
 *     context: {
 *       triggers: ['@'],
 *       providers: [fileProvider, docProvider, userProvider, webProvider]
 *     }
 *   }}
 * />
 * ```
 */

// File Provider
export {
  createFileProvider,
  createMockFileProvider,
  type FileSystemEntry,
  type FileProviderConfig,
} from './file-provider'

// Documentation Provider
export {
  createDocProvider,
  createMockDocProvider,
  type DocEntry,
  type DocProviderConfig,
} from './doc-provider'

// User Provider
export {
  createUserProvider,
  createMockUserProvider,
  type UserEntry,
  type UserProviderConfig,
} from './user-provider'

// Web Provider
export {
  createWebProvider,
  createMockWebProvider,
  type WebResult,
  type WebProviderConfig,
} from './web-provider'

// ============================================================================
// Convenience: Create All Mock Providers
// ============================================================================

import { createMockFileProvider } from './file-provider'
import { createMockDocProvider } from './doc-provider'
import { createMockUserProvider } from './user-provider'
import { createMockWebProvider } from './web-provider'
import type { ContextProvider } from '../types'

/**
 * Create all mock providers for testing/demos
 *
 * @example
 * ```tsx
 * import { createMockProviders } from '@clarity-chat/react/hooks'
 *
 * const providers = createMockProviders()
 *
 * <PromptComposer
 *   api="/api/chat"
 *   features={{
 *     context: {
 *       triggers: ['@'],
 *       providers
 *     }
 *   }}
 * />
 * ```
 */
export function createMockProviders(): ContextProvider[] {
  return [
    createMockFileProvider(),
    createMockDocProvider(),
    createMockUserProvider(),
    createMockWebProvider(),
  ]
}
