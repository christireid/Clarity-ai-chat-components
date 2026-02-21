/**
 * AI Infrastructure Domain
 *
 * APIs for AI adapters and agents.
 *
 * NOTE: Vector stores, embeddings, useAgent, and useRAGPipeline are on the roadmap for v2.0.
 * These infrastructure concerns have been moved out of the react package.
 */

// Mid-level: Building blocks
export { ReactAgent } from '../../agents/react-agent'

// Low-level: Primitives
export { buildPrompt, buildModelPrompt } from '../../prompt/core/builder'

// Re-export adapters, agents
export * from '../../adapters'
export * from '../../agents'
