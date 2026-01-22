/**
 * RAG Evaluation Framework
 *
 * Comprehensive evaluation tools for measuring and improving RAG system quality.
 * Implements standard information retrieval metrics: Precision, Recall, MRR, NDCG.
 *
 * Use this framework to:
 * - Measure retrieval quality with gold standard test sets
 * - Compare different retrieval strategies (A/B testing)
 * - Track quality improvements over time
 * - Identify failure modes and edge cases
 *
 * @example
 * ```tsx
 * // Create test set
 * const testSet = [
 *   {
 *     query: 'What is machine learning?',
 *     relevantDocs: ['doc1', 'doc3', 'doc5'],
 *   }
 * ]
 *
 * // Evaluate retrieval
 * const evaluator = new RAGEvaluator(testSet)
 * const results = await evaluator.evaluate(retrievalFunction)
 *
 * console.log(`Precision@5: ${results.precision@5}`)
 * console.log(`Recall@5: ${results.recall@5}`)
 * console.log(`MRR: ${results.mrr}`)
 * console.log(`NDCG@10: ${results.ndcg@10}`)
 * ```
 */

/**
 * Test case with query and relevant documents
 */
export interface RAGTestCase {
  /** Query text */
  query: string
  /** List of relevant document IDs */
  relevantDocs: string[]
  /** Optional relevance scores (for NDCG) */
  relevanceScores?: Record<string, number>
  /** Optional metadata */
  metadata?: Record<string, any>
}

/**
 * Retrieved document result
 */
export interface RetrievedDoc {
  /** Document ID */
  id: string
  /** Retrieval score */
  score: number
  /** Rank position (1-indexed) */
  rank: number
}

/**
 * Retrieval function type
 */
export type RetrievalFunction = (query: string, k: number) => Promise<RetrievedDoc[]>

/**
 * Evaluation metrics for a single query
 */
export interface QueryMetrics {
  /** Query text */
  query: string
  /** Number of retrieved documents */
  retrieved: number
  /** Number of relevant documents in collection */
  totalRelevant: number
  /** Precision at K */
  precision: Record<number, number>
  /** Recall at K */
  recall: Record<number, number>
  /** Average Precision */
  averagePrecision: number
  /** Reciprocal Rank */
  reciprocalRank: number
  /** NDCG at K */
  ndcg: Record<number, number>
  /** Retrieved document IDs */
  retrievedDocs: string[]
  /** Relevant documents that were retrieved */
  foundRelevant: string[]
  /** Relevant documents that were missed */
  missedRelevant: string[]
}

/**
 * Aggregated evaluation results across all queries
 */
export interface EvaluationResults {
  /** Number of queries evaluated */
  queryCount: number
  /** Mean Precision at K */
  precision: Record<number, number>
  /** Mean Recall at K */
  recall: Record<number, number>
  /** Mean Average Precision (MAP) */
  map: number
  /** Mean Reciprocal Rank */
  mrr: number
  /** Mean NDCG at K */
  ndcg: Record<number, number>
  /** F1 score at K */
  f1: Record<number, number>
  /** Per-query detailed metrics */
  perQueryMetrics: QueryMetrics[]
  /** Summary statistics */
  summary: {
    totalRelevantDocs: number
    totalRetrievedDocs: number
    totalFoundDocs: number
    avgRelevantPerQuery: number
    avgRetrievedPerQuery: number
  }
}

/**
 * RAG Evaluation Framework
 */
export class RAGEvaluator {
  private testSet: RAGTestCase[]
  private kValues: number[]

  constructor(testSet: RAGTestCase[], kValues: number[] = [1, 3, 5, 10, 20]) {
    if (testSet.length === 0) {
      throw new Error('Test set cannot be empty')
    }

    this.testSet = testSet
    this.kValues = kValues.sort((a, b) => a - b)
  }

  /**
   * Evaluate a retrieval function across the test set
   */
  async evaluate(
    retrievalFn: RetrievalFunction,
    options?: {
      k?: number
      verbose?: boolean
      onProgress?: (current: number, total: number) => void
    }
  ): Promise<EvaluationResults> {
    const k = options?.k || Math.max(...this.kValues)
    const perQueryMetrics: QueryMetrics[] = []

    // Evaluate each test case
    for (let i = 0; i < this.testSet.length; i++) {
      const testCase = this.testSet[i]

      if (options?.onProgress) {
        options.onProgress(i + 1, this.testSet.length)
      }

      try {
        const retrievedDocs = await retrievalFn(testCase.query, k)
        const metrics = this.calculateQueryMetrics(testCase, retrievedDocs)
        perQueryMetrics.push(metrics)

        if (options?.verbose) {
          console.log(`Query ${i + 1}/${this.testSet.length}:`, testCase.query)
          console.log(`  P@5: ${metrics.precision[5]?.toFixed(3)}`)
          console.log(`  R@5: ${metrics.recall[5]?.toFixed(3)}`)
          console.log(`  AP: ${metrics.averagePrecision.toFixed(3)}`)
        }
      } catch (error) {
        console.error(`Failed to evaluate query: ${testCase.query}`, error)
        // Add zero metrics for failed queries
        perQueryMetrics.push(this.getZeroMetrics(testCase))
      }
    }

    // Aggregate metrics
    return this.aggregateMetrics(perQueryMetrics)
  }

  /**
   * Calculate metrics for a single query
   */
  private calculateQueryMetrics(
    testCase: RAGTestCase,
    retrievedDocs: RetrievedDoc[]
  ): QueryMetrics {
    const relevantSet = new Set(testCase.relevantDocs)
    const retrievedIds = retrievedDocs.map((d) => d.id)

    // Find relevant docs that were retrieved
    const foundRelevant = retrievedIds.filter((id) => relevantSet.has(id))
    const missedRelevant = testCase.relevantDocs.filter(
      (id) => !retrievedIds.includes(id)
    )

    // Calculate Precision and Recall at K
    const precision: Record<number, number> = {}
    const recall: Record<number, number> = {}

    for (const k of this.kValues) {
      const topK = retrievedIds.slice(0, k)
      const relevantInTopK = topK.filter((id) => relevantSet.has(id)).length

      precision[k] =
        topK.length > 0 ? relevantInTopK / topK.length : 0
      recall[k] =
        testCase.relevantDocs.length > 0
          ? relevantInTopK / testCase.relevantDocs.length
          : 0
    }

    // Calculate Average Precision (AP)
    const ap = this.calculateAveragePrecision(retrievedIds, relevantSet)

    // Calculate Reciprocal Rank (RR)
    const rr = this.calculateReciprocalRank(retrievedIds, relevantSet)

    // Calculate NDCG at K
    const ndcg: Record<number, number> = {}
    for (const k of this.kValues) {
      ndcg[k] = this.calculateNDCG(
        retrievedIds.slice(0, k),
        testCase.relevantDocs,
        testCase.relevanceScores
      )
    }

    return {
      query: testCase.query,
      retrieved: retrievedIds.length,
      totalRelevant: testCase.relevantDocs.length,
      precision,
      recall,
      averagePrecision: ap,
      reciprocalRank: rr,
      ndcg,
      retrievedDocs: retrievedIds,
      foundRelevant,
      missedRelevant,
    }
  }

  /**
   * Calculate Average Precision
   */
  private calculateAveragePrecision(
    retrievedIds: string[],
    relevantSet: Set<string>
  ): number {
    let relevantCount = 0
    let precisionSum = 0

    for (let i = 0; i < retrievedIds.length; i++) {
      if (relevantSet.has(retrievedIds[i])) {
        relevantCount++
        const precision = relevantCount / (i + 1)
        precisionSum += precision
      }
    }

    return relevantSet.size > 0 ? precisionSum / relevantSet.size : 0
  }

  /**
   * Calculate Reciprocal Rank
   */
  private calculateReciprocalRank(
    retrievedIds: string[],
    relevantSet: Set<string>
  ): number {
    for (let i = 0; i < retrievedIds.length; i++) {
      if (relevantSet.has(retrievedIds[i])) {
        return 1 / (i + 1)
      }
    }
    return 0
  }

  /**
   * Calculate Normalized Discounted Cumulative Gain (NDCG)
   */
  private calculateNDCG(
    retrievedIds: string[],
    relevantDocs: string[],
    relevanceScores?: Record<string, number>
  ): number {
    // Default relevance: binary (1 for relevant, 0 for irrelevant)
    const getRelevance = (id: string): number => {
      if (relevanceScores && id in relevanceScores) {
        return relevanceScores[id]
      }
      return relevantDocs.includes(id) ? 1 : 0
    }

    // Calculate DCG
    let dcg = 0
    for (let i = 0; i < retrievedIds.length; i++) {
      const relevance = getRelevance(retrievedIds[i])
      const discount = Math.log2(i + 2) // i+2 because log2(1) = 0
      dcg += relevance / discount
    }

    // Calculate IDCG (ideal DCG with perfect ranking)
    const idealRanking = [...relevantDocs].sort((a, b) => {
      const scoreA = relevanceScores?.[a] ?? 1
      const scoreB = relevanceScores?.[b] ?? 1
      return scoreB - scoreA // Descending order
    })

    let idcg = 0
    for (let i = 0; i < Math.min(idealRanking.length, retrievedIds.length); i++) {
      const relevance = getRelevance(idealRanking[i])
      const discount = Math.log2(i + 2)
      idcg += relevance / discount
    }

    return idcg > 0 ? dcg / idcg : 0
  }

  /**
   * Aggregate metrics across all queries
   */
  private aggregateMetrics(perQueryMetrics: QueryMetrics[]): EvaluationResults {
    const n = perQueryMetrics.length

    // Mean metrics at each K
    const precision: Record<number, number> = {}
    const recall: Record<number, number> = {}
    const ndcg: Record<number, number> = {}
    const f1: Record<number, number> = {}

    for (const k of this.kValues) {
      precision[k] =
        perQueryMetrics.reduce((sum, m) => sum + (m.precision[k] || 0), 0) / n
      recall[k] =
        perQueryMetrics.reduce((sum, m) => sum + (m.recall[k] || 0), 0) / n
      ndcg[k] =
        perQueryMetrics.reduce((sum, m) => sum + (m.ndcg[k] || 0), 0) / n

      // Calculate F1 score
      const p = precision[k]
      const r = recall[k]
      f1[k] = p + r > 0 ? (2 * p * r) / (p + r) : 0
    }

    // MAP and MRR
    const map =
      perQueryMetrics.reduce((sum, m) => sum + m.averagePrecision, 0) / n
    const mrr =
      perQueryMetrics.reduce((sum, m) => sum + m.reciprocalRank, 0) / n

    // Summary statistics
    const totalRelevantDocs = perQueryMetrics.reduce(
      (sum, m) => sum + m.totalRelevant,
      0
    )
    const totalRetrievedDocs = perQueryMetrics.reduce(
      (sum, m) => sum + m.retrieved,
      0
    )
    const totalFoundDocs = perQueryMetrics.reduce(
      (sum, m) => sum + m.foundRelevant.length,
      0
    )

    return {
      queryCount: n,
      precision,
      recall,
      map,
      mrr,
      ndcg,
      f1,
      perQueryMetrics,
      summary: {
        totalRelevantDocs,
        totalRetrievedDocs,
        totalFoundDocs,
        avgRelevantPerQuery: totalRelevantDocs / n,
        avgRetrievedPerQuery: totalRetrievedDocs / n,
      },
    }
  }

  /**
   * Get zero metrics for failed queries
   */
  private getZeroMetrics(testCase: RAGTestCase): QueryMetrics {
    const precision: Record<number, number> = {}
    const recall: Record<number, number> = {}
    const ndcg: Record<number, number> = {}

    for (const k of this.kValues) {
      precision[k] = 0
      recall[k] = 0
      ndcg[k] = 0
    }

    return {
      query: testCase.query,
      retrieved: 0,
      totalRelevant: testCase.relevantDocs.length,
      precision,
      recall,
      averagePrecision: 0,
      reciprocalRank: 0,
      ndcg,
      retrievedDocs: [],
      foundRelevant: [],
      missedRelevant: testCase.relevantDocs,
    }
  }

  /**
   * Format results as a readable report
   */
  static formatReport(results: EvaluationResults): string {
    const lines: string[] = []

    lines.push('=' .repeat(60))
    lines.push('RAG EVALUATION REPORT')
    lines.push('='.repeat(60))
    lines.push('')
    lines.push(`Queries Evaluated: ${results.queryCount}`)
    lines.push(`Total Relevant Docs: ${results.summary.totalRelevantDocs}`)
    lines.push(`Total Retrieved Docs: ${results.summary.totalRetrievedDocs}`)
    lines.push(`Total Found Docs: ${results.summary.totalFoundDocs}`)
    lines.push('')
    lines.push('-'.repeat(60))
    lines.push('AGGREGATE METRICS')
    lines.push('-'.repeat(60))
    lines.push('')
    lines.push(`Mean Average Precision (MAP): ${results.map.toFixed(4)}`)
    lines.push(`Mean Reciprocal Rank (MRR): ${results.mrr.toFixed(4)}`)
    lines.push('')

    // Metrics at K
    const kValues = Object.keys(results.precision).map(Number).sort((a, b) => a - b)
    lines.push('Metrics at K:')
    lines.push('K\tPrecision\tRecall\t\tF1\t\tNDCG')
    for (const k of kValues) {
      const p = results.precision[k].toFixed(4)
      const r = results.recall[k].toFixed(4)
      const f = results.f1[k].toFixed(4)
      const n = results.ndcg[k].toFixed(4)
      lines.push(`${k}\t${p}\t\t${r}\t\t${f}\t\t${n}`)
    }

    lines.push('')
    lines.push('='.repeat(60))

    return lines.join('\n')
  }
}

/**
 * Test Set Builder
 *
 * Helper class for building and managing evaluation test sets
 */
export class TestSetBuilder {
  private testCases: RAGTestCase[] = []

  /**
   * Add a test case
   */
  addTestCase(
    query: string,
    relevantDocs: string[],
    relevanceScores?: Record<string, number>
  ): this {
    this.testCases.push({
      query,
      relevantDocs,
      relevanceScores,
    })
    return this
  }

  /**
   * Add multiple test cases from JSON
   */
  addFromJSON(json: RAGTestCase[]): this {
    this.testCases.push(...json)
    return this
  }

  /**
   * Build the test set
   */
  build(): RAGTestCase[] {
    if (this.testCases.length === 0) {
      throw new Error('Test set is empty')
    }
    return [...this.testCases]
  }

  /**
   * Export to JSON
   */
  toJSON(): string {
    return JSON.stringify(this.testCases, null, 2)
  }

  /**
   * Load from JSON
   */
  static fromJSON(json: string): TestSetBuilder {
    const testCases = JSON.parse(json) as RAGTestCase[]
    const builder = new TestSetBuilder()
    builder.addFromJSON(testCases)
    return builder
  }
}
