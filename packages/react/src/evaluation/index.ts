/**
 * RAG Evaluation Framework
 *
 * Comprehensive tools for measuring and improving RAG system quality.
 * Implements standard information retrieval metrics: Precision, Recall, MRR, NDCG.
 *
 * @example
 * ```tsx
 * import { RAGEvaluator, TestSetBuilder } from '@clarity-chat/react'
 *
 * // Build test set
 * const testSet = new TestSetBuilder()
 *   .addTestCase('What is machine learning?', ['doc1', 'doc3', 'doc5'])
 *   .addTestCase('How does neural network work?', ['doc2', 'doc4'])
 *   .build()
 *
 * // Evaluate retrieval
 * const evaluator = new RAGEvaluator(testSet, [1, 3, 5, 10])
 * const results = await evaluator.evaluate(retrievalFunction)
 *
 * // View metrics
 * console.log(`Precision@5: ${results.precision[5]}`)
 * console.log(`Recall@5: ${results.recall[5]}`)
 * console.log(`MAP: ${results.map}`)
 * console.log(`MRR: ${results.mrr}`)
 * console.log(`NDCG@10: ${results.ndcg[10]}`)
 *
 * // Print formatted report
 * console.log(RAGEvaluator.formatReport(results))
 * ```
 *
 * @example
 * ```tsx
 * // Export and import test sets
 * const builder = new TestSetBuilder()
 * builder.addTestCase('query 1', ['doc1', 'doc2'])
 * builder.addTestCase('query 2', ['doc3'])
 *
 * // Save to JSON
 * const json = builder.toJSON()
 * localStorage.setItem('testSet', json)
 *
 * // Load later
 * const loaded = TestSetBuilder.fromJSON(json)
 * const testSet = loaded.build()
 * ```
 */

export * from './rag-evaluator'
