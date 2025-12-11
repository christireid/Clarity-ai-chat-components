/**
 * Public API Type Safety Tests
 *
 * These tests verify that the public API exports have stable, correct types.
 * Run as part of the project's type check with: pnpm typecheck
 */

// Core imports that should always work
import type { Message as TypesMessage } from '@clarity-chat/types'
import type {
  // Core types
  Message,
  UseChatOptions,
  UseChatReturn,
  UseClarityChatOptions,

  // Plugin types
  Plugin,
  PluginHooks,
  PluginContext,
  PluginConfig,
  CreatePluginOptions,

  // Agent types
  Tool,
  AgentConfig,
  AgentExecution,
  AgentStep,

  // Vector store types
  VectorStore,
  VectorStoreConfig,
  VectorQuery,
  VectorMatch,
} from '../index'

// ============================================================================
// Type Assertions - Compile-time checks
// ============================================================================

// Verify Message type has required fields
type MessageHasId = Message extends { id: string } ? true : false
type MessageHasRole = Message extends { role: string } ? true : false
type MessageHasContent = Message extends { content: string } ? true : false
const _messageChecks: [MessageHasId, MessageHasRole, MessageHasContent] = [
  true,
  true,
  true,
]

// Verify Plugin type has required fields
type PluginHasName = Plugin extends { name: string } ? true : false
type PluginHasVersion = Plugin extends { version: string } ? true : false
const _pluginChecks: [PluginHasName, PluginHasVersion] = [true, true]

// Verify Tool type has required fields
type ToolHasName = Tool extends { name: string } ? true : false
type ToolHasDescription = Tool extends { description: string } ? true : false
type ToolHasExecute = Tool extends { execute: (...args: unknown[]) => unknown }
  ? true
  : false
const _toolChecks: [ToolHasName, ToolHasDescription, ToolHasExecute] = [
  true,
  true,
  true,
]

// Verify VectorStoreConfig discriminated union
type VectorStoreProviders = VectorStoreConfig['provider']
type HasPinecone = 'pinecone' extends VectorStoreProviders ? true : false
type HasQdrant = 'qdrant' extends VectorStoreProviders ? true : false
type HasWeaviate = 'weaviate' extends VectorStoreProviders ? true : false
type HasChroma = 'chroma' extends VectorStoreProviders ? true : false
const _vectorProviderChecks: [HasPinecone, HasQdrant, HasWeaviate, HasChroma] =
  [true, true, true, true]

// ============================================================================
// Export to prevent tree-shaking
// ============================================================================
export const typeAssertions = {
  _messageChecks,
  _pluginChecks,
  _toolChecks,
  _vectorProviderChecks,
}
