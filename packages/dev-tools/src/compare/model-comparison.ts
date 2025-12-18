import { getLogger } from '../debug/logger'

const logger = getLogger('model-comparison')

/**
 * AI Model Response Comparison Tools
 * Compare responses from different AI models to help developers choose the right model
 */

import type { TableColumn } from '../ui/table'
import { table, keyValueTable } from '../ui/table'
import { infoBox } from '../ui/box'
import chalk from 'chalk'

export interface ModelResponse {
  model: string
  provider: string
  content: string
  metadata: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
    latency: number
    cost: number
  }
  timestamp: Date
}

export interface ComparisonResult {
  prompt: string
  responses: ModelResponse[]
  analysis: {
    fastest: string
    cheapest: string
    mostTokens: string
    averageLatency: number
    totalCost: number
    recommendations: string[]
  }
}

/**
 * Compare responses from multiple models
 */
export class ModelComparator {
  private responses: Map<string, ModelResponse[]> = new Map()

  /**
   * Add a response for comparison
   */
  addResponse(promptId: string, response: ModelResponse): void {
    if (!this.responses.has(promptId)) {
      this.responses.set(promptId, [])
    }
    this.responses.get(promptId)!.push(response)
  }

  /**
   * Compare all responses for a prompt
   */
  compare(promptId: string, prompt: string): ComparisonResult | null {
    const responses = this.responses.get(promptId)
    if (!responses || responses.length === 0) {
      return null
    }

    // Find best performers
    const fastest = responses.reduce((prev, curr) => 
      curr.metadata.latency < prev.metadata.latency ? curr : prev
    )

    const cheapest = responses.reduce((prev, curr) =>
      curr.metadata.cost < prev.metadata.cost ? curr : prev
    )

    const mostTokens = responses.reduce((prev, curr) =>
      curr.metadata.totalTokens > prev.metadata.totalTokens ? curr : prev
    )

    // Calculate averages
    const averageLatency = responses.reduce((sum, r) => sum + r.metadata.latency, 0) / responses.length
    const totalCost = responses.reduce((sum, r) => sum + r.metadata.cost, 0)

    // Generate recommendations
    const recommendations = this.generateRecommendations(responses, fastest, cheapest)

    return {
      prompt,
      responses,
      analysis: {
        fastest: `${fastest.provider}/${fastest.model}`,
        cheapest: `${cheapest.provider}/${cheapest.model}`,
        mostTokens: `${mostTokens.provider}/${mostTokens.model}`,
        averageLatency,
        totalCost,
        recommendations,
      },
    }
  }

  /**
   * Generate recommendations based on comparison
   */
  private generateRecommendations(
    responses: ModelResponse[],
    fastest: ModelResponse,
    cheapest: ModelResponse
  ): string[] {
    const recommendations: string[] = []

    // Speed recommendation
    if (fastest.metadata.latency < 1000) {
      recommendations.push(
        `For real-time applications, use ${fastest.provider}/${fastest.model} (${fastest.metadata.latency}ms)`
      )
    }

    // Cost recommendation
    const avgCost = responses.reduce((sum, r) => sum + r.metadata.cost, 0) / responses.length
    if (cheapest.metadata.cost < avgCost * 0.5) {
      recommendations.push(
        `For cost efficiency, use ${cheapest.provider}/${cheapest.model} ($${cheapest.metadata.cost.toFixed(4)} vs avg $${avgCost.toFixed(4)})`
      )
    }

    // Quality recommendation (based on response length as proxy)
    const avgLength = responses.reduce((sum, r) => sum + r.content.length, 0) / responses.length
    const longest = responses.reduce((prev, curr) =>
      curr.content.length > prev.content.length ? curr : prev
    )
    
    if (longest.content.length > avgLength * 1.2) {
      recommendations.push(
        `For detailed responses, consider ${longest.provider}/${longest.model} (${longest.content.length} chars vs avg ${Math.round(avgLength)})`
      )
    }

    // Cost-performance balance
    const costPerMs = responses.map(r => ({
      model: `${r.provider}/${r.model}`,
      ratio: r.metadata.cost / r.metadata.latency,
    }))
    const bestBalance = costPerMs.reduce((prev, curr) => 
      curr.ratio < prev.ratio ? curr : prev
    )
    
    recommendations.push(
      `For best cost/performance balance, use ${bestBalance.model}`
    )

    return recommendations
  }

  /**
   * Export comparison results to JSON
   */
  exportResults(): string {
    const allResults: ComparisonResult[] = []
    
    for (const [promptId, responses] of this.responses.entries()) {
      const result = this.compare(promptId, promptId)
      if (result) {
        allResults.push(result)
      }
    }

    return JSON.stringify(allResults, null, 2)
  }

  /**
   * Clear all stored responses
   */
  clear(): void {
    this.responses.clear()
  }
}

/**
 * Side-by-side comparison formatter with beautiful formatting
 */
export function formatSideBySide(result: ComparisonResult): string {
  const output: string[] = []

  // Header
  output.push('')
  output.push(infoBox(result.prompt, '💬 Prompt'))
  output.push('')

  // Responses comparison table
  const columns: TableColumn[] = [
    { header: 'Provider/Model', width: 25, color: chalk.yellow },
    { header: 'Latency', width: 12, align: 'right', color: chalk.cyan },
    { header: 'Cost', width: 12, align: 'right', color: chalk.green },
    { header: 'Tokens', width: 10, align: 'right', color: chalk.blue },
    { header: 'Content Preview', width: 30 },
  ]

  const tableData = result.responses.map(response => {
    const preview = response.content.length > 30 
      ? response.content.substring(0, 30) + '...'
      : response.content

    return [
      `${response.provider}/${response.model}`,
      `${response.metadata.latency}ms`,
      `$${response.metadata.cost.toFixed(4)}`,
      response.metadata.totalTokens.toString(),
      preview,
    ]
  })

  output.push(table(tableData, columns))
  output.push('')

  // Analysis summary
  const analysisData: Record<string, string> = {
    '⚡ Fastest': chalk.green(result.analysis.fastest),
    '💰 Cheapest': chalk.green(result.analysis.cheapest),
    '📊 Most Tokens': chalk.cyan(result.analysis.mostTokens),
    '⏱️  Avg Latency': chalk.cyan(`${result.analysis.averageLatency.toFixed(2)}ms`),
    '💵 Total Cost': chalk.yellow(`$${result.analysis.totalCost.toFixed(4)}`),
  }

  output.push(infoBox(keyValueTable(analysisData), '📊 Analysis'))
  output.push('')

  // Recommendations
  if (result.analysis.recommendations.length > 0) {
    const recs = result.analysis.recommendations
      .map((rec, i) => `${i + 1}. ${rec}`)
      .join('\n')
    
    output.push(infoBox(recs, '💡 Recommendations'))
    output.push('')
  }

  return output.join('\n')
}

/**
 * Quality scorer for responses
 */
export interface QualityMetrics {
  coherence: number // 0-100
  completeness: number // 0-100
  relevance: number // 0-100
  overall: number // 0-100
}

export function scoreResponseQuality(
  prompt: string,
  response: string,
  expectedKeywords?: string[]
): QualityMetrics {
  // Simple heuristic scoring (in production, use ML models)
  
  // Coherence: based on sentence structure
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const avgSentenceLength = response.length / sentences.length
  const coherence = Math.min(100, Math.max(0, 
    (avgSentenceLength > 20 && avgSentenceLength < 150) ? 80 : 50
  ))

  // Completeness: based on response length relative to prompt
  const promptWordCount = prompt.split(/\s+/).length
  const responseWordCount = response.split(/\s+/).length
  const completeness = Math.min(100, 
    (responseWordCount / promptWordCount) * 20
  )

  // Relevance: keyword matching
  let relevance = 70 // Default
  if (expectedKeywords && expectedKeywords.length > 0) {
    const matchedKeywords = expectedKeywords.filter(kw =>
      response.toLowerCase().includes(kw.toLowerCase())
    )
    relevance = (matchedKeywords.length / expectedKeywords.length) * 100
  }

  const overall = (coherence + completeness + relevance) / 3

  return { coherence, completeness, relevance, overall }
}

/**
 * Batch comparison helper
 */
export async function compareModels(
  prompt: string,
  modelConfigs: Array<{
    provider: string
    model: string
    apiCall: () => Promise<any>
  }>,
  options?: {
    calculateCost?: (usage: any) => number
    expectedKeywords?: string[]
  }
): Promise<ComparisonResult> {
  const comparator = new ModelComparator()
  const promptId = Date.now().toString()

  for (const config of modelConfigs) {
    const start = Date.now()
    
    try {
      const result = await config.apiCall()
      const latency = Date.now() - start

      const response: ModelResponse = {
        model: config.model,
        provider: config.provider,
        content: result.content || result.choices?.[0]?.message?.content || '',
        metadata: {
          promptTokens: result.usage?.prompt_tokens || 0,
          completionTokens: result.usage?.completion_tokens || 0,
          totalTokens: result.usage?.total_tokens || 0,
          latency,
          cost: options?.calculateCost?.(result.usage) || 0,
        },
        timestamp: new Date(),
      }

      comparator.addResponse(promptId, response)
    } catch (error) {
      logger.error(`Error calling ${config.provider}/${config.model}:`, { error })
    }
  }

  return comparator.compare(promptId, prompt)!
}

