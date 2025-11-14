/**
 * AI Infrastructure Domain
 * 
 * APIs for agents, tools, adapters, embeddings, vector stores, RAG
 */

// Top-level: Drop-in ready APIs
export {
  useAgent,
  type UseAgentOptions,
  type UseAgentReturn,
} from '../../hooks/use-agent'
export {
  useRAGPipeline,
  type UseRAGPipelineOptions,
  type UseRAGPipelineReturn,
} from '../../hooks/use-rag-pipeline'

// Mid-level: Building blocks
export {
  useVectorStore,
  type UseVectorStoreOptions,
  type UseVectorStoreReturn,
} from '../../vector-stores/react'
export {
  useEmbeddings,
  type UseEmbeddingsOptions,
} from '../../embeddings/react'
export {
  useReactAgent,
} from '../../agents/react-agent'

// Low-level: Primitives
export { createAdapter } from '../../adapters/create-adapter'
export { buildPrompt } from '../../prompt/core/builder'
export { parseToolCall } from '../../agents/parse-tool-call'

// Re-export adapters, vector stores, embeddings, agents
export * from '../../adapters'
export * from '../../vector-stores'
export * from '../../embeddings'
export * from '../../agents'
