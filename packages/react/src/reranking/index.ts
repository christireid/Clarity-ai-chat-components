/**
 * Reranking System
 *
 * Improve search result relevance by reranking.
 * Use built-in simple rerankers or integrate with production services.
 *
 * @example
 * ```tsx
 * import { SimpleReranker } from '@clarity-chat/react'
 *
 * const reranker = new SimpleReranker()
 *
 * const reranked = await reranker.rerank({
 *   query: 'machine learning',
 *   documents: searchResults,
 *   topK: 5,
 * })
 *
 * console.log(reranked.results) // Top 5 most relevant
 * ```
 *
 * @example
 * ```tsx
 * // With diversity
 * import { DiversityReranker } from '@clarity-chat/react'
 *
 * const reranker = new DiversityReranker(0.8)
 * const reranked = await reranker.rerank({
 *   query: 'python programming',
 *   documents: searchResults,
 *   topK: 10,
 * })
 * ```
 *
 * @example
 * ```tsx
 * // Production-grade reranking with Cohere
 * import { CohereReranker } from '@clarity-chat/react'
 *
 * const reranker = new CohereReranker({
 *   apiKey: process.env.COHERE_API_KEY,
 *   model: 'rerank-english-v3.0'
 * })
 *
 * const reranked = await reranker.rerank({
 *   query: 'machine learning best practices',
 *   documents: searchResults,
 *   topK: 5
 * })
 *
 * console.log(reranked.results) // Top 5 with improved relevance scores
 * ```
 */

export * from './types'
export * from './simple-reranker'
export * from './cohere'

