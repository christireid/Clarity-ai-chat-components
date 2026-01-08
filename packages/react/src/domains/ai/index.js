/**
 * AI Infrastructure Domain
 *
 * Production-ready APIs for AI adapters, embeddings, and vector stores.
 *
 * NOTE: useAgent and useRAGPipeline are on the roadmap for v2.0.
 * See: https://github.com/christireid/Clarity-ai-chat-components/issues
 */
// Mid-level: Building blocks
export { useVectorStore, } from '../../vector-stores/react';
export { useEmbeddings, } from '../../embeddings/react';
export { ReactAgent } from '../../agents/react-agent';
// Low-level: Primitives
export { buildPrompt, buildModelPrompt } from '../../prompt/core/builder';
// Re-export adapters, vector stores, embeddings, agents
export * from '../../adapters';
export * from '../../vector-stores';
export * from '../../embeddings';
export * from '../../agents';
//# sourceMappingURL=index.js.map