/**
 * Token Optimization Test Runner
 *
 * Executes test scenarios in baseline and optimized modes,
 * captures measurements, and generates comparison reports.
 */

import { randomUUID } from 'crypto'
import type {
  TestScenario,
  MeasurementRunConfig,
  RunStatistics,
  RunComparison,
  OptimizationApplied,
} from './types'
import {
  TokenMeasurementHarness,
  createMeasurementHarness,
} from './measurement-harness'
import { ALL_SCENARIOS, SCENARIO_BY_ID } from './scenarios'
import { createPayloadSnapshot, estimateTokens } from './token-estimator'

/**
 * Optimization configuration that matches the enhanced hook options
 */
export interface OptimizationConfig {
  /** Enable TOON format optimization */
  enableToon?: boolean
  /** Enable prompt compression */
  enablePromptCompression?: boolean
  /** Compression level */
  compressionLevel?: 'conservative' | 'balanced' | 'aggressive'
  /** Enable history limiting */
  enableHistoryLimiting?: boolean
  /** Max history messages */
  maxHistoryMessages?: number
  /** Enable semantic caching */
  enableSemanticCaching?: boolean
  /** Enable model routing */
  enableModelRouting?: boolean
  /** Enable response prefilling */
  enablePrefilling?: boolean
  /** Enable prompt restructuring */
  enablePromptStructure?: boolean
  /** Enable PII redaction */
  enablePIIRedaction?: boolean
}

/**
 * Mock LLM call result for testing
 */
interface MockLLMResult {
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  finish_reason?: string
}

/**
 * LLM provider interface for test runner
 */
export interface LLMProvider {
  /**
   * Send a chat completion request
   */
  chat(
    messages: Array<{ role: string; content: string }>,
    options?: {
      model?: string
      temperature?: number
      maxTokens?: number
      tools?: unknown[]
    }
  ): Promise<{
    content: string
    usage?: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
    finish_reason?: string
  }>
}

/**
 * Filler patterns to remove (comprehensive list)
 */
const FILLER_PATTERNS = [
  // Single words
  /\b(um|uh|hmm|like|actually|basically|literally|really|very|quite|rather|pretty|somewhat|just|only|simply|merely|perhaps|maybe)\b/gi,
  // Multi-word phrases
  /\b(you know|sort of|kind of|a bit|a little|in order to|as well as|in spite of the fact that|due to the fact that|for the purpose of|at this point in time|in the event that|prior to|subsequent to)\b/gi,
  // Redundant starters
  /^(well,?\s*|so,?\s*|okay,?\s*|alright,?\s*|right,?\s*)/gi,
  // Excessive politeness (keep one)
  /(\bplease\b.*?\bplease\b)/gi,
  // Repeated words
  /\b(\w+)\s+\1\b/gi,
]

/**
 * Deduplicate repeated content within a message
 */
function deduplicateContent(text: string): string {
  // Find repeated sentences
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const seen = new Set<string>()
  const unique: string[] = []

  for (const sentence of sentences) {
    const normalized = sentence.trim().toLowerCase()
    if (!seen.has(normalized) || normalized.length < 20) {
      seen.add(normalized)
      unique.push(sentence.trim())
    }
  }

  // Find repeated phrases (3+ words repeated)
  let result = unique.join('. ')
  const words = result.split(/\s+/)
  if (words.length > 10) {
    // Look for repeated n-grams
    for (let n = 3; n <= 6; n++) {
      const ngrams = new Map<string, number>()
      for (let i = 0; i <= words.length - n; i++) {
        const ngram = words
          .slice(i, i + n)
          .join(' ')
          .toLowerCase()
        ngrams.set(ngram, (ngrams.get(ngram) || 0) + 1)
      }
      // Replace repeated n-grams with single instance
      for (const [ngram, count] of ngrams) {
        if (count > 2 && ngram.length > 15) {
          const regex = new RegExp(
            `(${ngram.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s,.!?]*){2,}`,
            'gi'
          )
          result = result.replace(regex, ngram + ' ')
        }
      }
    }
  }

  return result.trim()
}

/**
 * Apply optimization techniques to messages
 */
function applyOptimizations(
  messages: Array<{ role: string; content: string }>,
  config: OptimizationConfig,
  model: string
): {
  optimizedMessages: Array<{ role: string; content: string }>
  optimization: OptimizationApplied
} {
  let optimizedMessages = [...messages]
  const techniques: OptimizationApplied['techniques'] = []

  // Track original tokens
  const originalSnapshot = createPayloadSnapshot(messages, model)
  const originalTokens = originalSnapshot.totalEstimatedTokens

  // 1. History limiting (LOWERED threshold for better savings)
  if (config.enableHistoryLimiting && config.maxHistoryMessages) {
    const systemMessage = optimizedMessages.find((m) => m.role === 'system')
    const nonSystemMessages = optimizedMessages.filter(
      (m) => m.role !== 'system'
    )
    const keepCount = config.maxHistoryMessages * 2 // pairs of user/assistant

    if (nonSystemMessages.length > keepCount) {
      const keptMessages = nonSystemMessages.slice(-keepCount)
      optimizedMessages = systemMessage
        ? [systemMessage, ...keptMessages]
        : keptMessages

      const afterSnapshot = createPayloadSnapshot(optimizedMessages, model)
      techniques.push({
        name: 'history-limiting',
        applied: true,
        inputTokens: originalTokens,
        outputTokens: afterSnapshot.totalEstimatedTokens,
        tokensSaved: originalTokens - afterSnapshot.totalEstimatedTokens,
        savingsPercent:
          ((originalTokens - afterSnapshot.totalEstimatedTokens) /
            originalTokens) *
          100,
        config: { maxMessages: config.maxHistoryMessages },
      })
    } else {
      techniques.push({ name: 'history-limiting', applied: false })
    }
  }

  // 2. Content deduplication (NEW - high impact on repetitive content)
  {
    let deduplicationApplied = false
    const beforeDedup = createPayloadSnapshot(optimizedMessages, model)

    optimizedMessages = optimizedMessages.map((msg) => {
      if (msg.role === 'user' && msg.content.length > 50) {
        const deduplicated = deduplicateContent(msg.content)
        if (deduplicated.length < msg.content.length * 0.95) {
          deduplicationApplied = true
          return { ...msg, content: deduplicated }
        }
      }
      return msg
    })

    if (deduplicationApplied) {
      const afterDedup = createPayloadSnapshot(optimizedMessages, model)
      techniques.push({
        name: 'content-deduplication',
        applied: true,
        inputTokens: beforeDedup.totalEstimatedTokens,
        outputTokens: afterDedup.totalEstimatedTokens,
        tokensSaved:
          beforeDedup.totalEstimatedTokens - afterDedup.totalEstimatedTokens,
        savingsPercent:
          ((beforeDedup.totalEstimatedTokens -
            afterDedup.totalEstimatedTokens) /
            beforeDedup.totalEstimatedTokens) *
          100,
      })
    }
  }

  // 3. Enhanced prompt compression (IMPROVED - applies to all messages > 30 chars)
  if (config.enablePromptCompression) {
    let compressionApplied = false
    const beforeCompression = createPayloadSnapshot(optimizedMessages, model)

    const targetRatio =
      config.compressionLevel === 'aggressive'
        ? 0.6
        : config.compressionLevel === 'balanced'
          ? 0.75
          : 0.9

    optimizedMessages = optimizedMessages.map((msg) => {
      // Apply to user messages AND assistant messages (in history)
      if (
        (msg.role === 'user' || msg.role === 'assistant') &&
        msg.content.length > 30
      ) {
        let compressed = msg.content

        // Apply all filler patterns
        for (const pattern of FILLER_PATTERNS) {
          compressed = compressed.replace(pattern, ' ')
        }

        // Normalize whitespace
        compressed = compressed.replace(/\s+/g, ' ').trim()

        // For aggressive mode, also shorten long sentences
        if (
          config.compressionLevel === 'aggressive' &&
          compressed.length > 200
        ) {
          // Keep first part of very long content
          const targetLength = Math.floor(compressed.length * targetRatio)
          // Try to break at sentence boundary
          const truncated = compressed.slice(0, targetLength)
          const lastPeriod = truncated.lastIndexOf('.')
          const lastQuestion = truncated.lastIndexOf('?')
          const lastBoundary = Math.max(lastPeriod, lastQuestion)

          if (lastBoundary > targetLength * 0.7) {
            compressed = truncated.slice(0, lastBoundary + 1)
          } else {
            compressed = truncated + '...'
          }
        }

        if (
          compressed !== msg.content &&
          compressed.length < msg.content.length
        ) {
          compressionApplied = true
          return { ...msg, content: compressed }
        }
      }
      return msg
    })

    const afterCompression = createPayloadSnapshot(optimizedMessages, model)
    techniques.push({
      name: 'prompt-compression',
      applied: compressionApplied,
      inputTokens: beforeCompression.totalEstimatedTokens,
      outputTokens: afterCompression.totalEstimatedTokens,
      tokensSaved: compressionApplied
        ? beforeCompression.totalEstimatedTokens -
          afterCompression.totalEstimatedTokens
        : 0,
      savingsPercent: compressionApplied
        ? ((beforeCompression.totalEstimatedTokens -
            afterCompression.totalEstimatedTokens) /
            beforeCompression.totalEstimatedTokens) *
          100
        : 0,
      config: { compressionLevel: config.compressionLevel },
    })
  }

  // 3. TOON format (for JSON content)
  if (config.enableToon) {
    let toonApplied = false
    optimizedMessages = optimizedMessages.map((msg) => {
      if (msg.role === 'user') {
        // Check if content contains JSON
        const jsonMatch = msg.content.match(/\[[\s\S]*\]|\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0])
            if (
              Array.isArray(parsed) &&
              parsed.length > 0 &&
              typeof parsed[0] === 'object'
            ) {
              // Convert array of objects to TOON format
              const keys = Object.keys(parsed[0])
              const toon =
                keys.join(', ') +
                '\n' +
                parsed
                  .map((item) => keys.map((k) => item[k]).join(', '))
                  .join('\n')

              if (toon.length < jsonMatch[0].length * 0.8) {
                // Only apply if savings > 20%
                toonApplied = true
                return {
                  ...msg,
                  content: msg.content.replace(jsonMatch[0], toon),
                }
              }
            }
          } catch {
            // Not valid JSON, skip
          }
        }
      }
      return msg
    })

    if (toonApplied) {
      const afterSnapshot = createPayloadSnapshot(optimizedMessages, model)
      techniques.push({
        name: 'toon-format',
        applied: true,
        inputTokens: originalTokens,
        outputTokens: afterSnapshot.totalEstimatedTokens,
        tokensSaved: originalTokens - afterSnapshot.totalEstimatedTokens,
        savingsPercent:
          ((originalTokens - afterSnapshot.totalEstimatedTokens) /
            originalTokens) *
          100,
      })
    } else {
      techniques.push({ name: 'toon-format', applied: false })
    }
  }

  // 4. PII Redaction
  if (config.enablePIIRedaction) {
    let piiRedacted = false
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g

    optimizedMessages = optimizedMessages.map((msg) => {
      let content = msg.content
      if (emailRegex.test(content) || phoneRegex.test(content)) {
        content = content
          .replace(emailRegex, '<EMAIL>')
          .replace(phoneRegex, '<PHONE>')
        piiRedacted = true
      }
      return { ...msg, content }
    })

    techniques.push({ name: 'pii-redaction', applied: piiRedacted })
  }

  // Calculate total savings
  const finalSnapshot = createPayloadSnapshot(optimizedMessages, model)
  const estimatedTotalSaved =
    originalTokens - finalSnapshot.totalEstimatedTokens

  return {
    optimizedMessages,
    optimization: {
      enabled: true,
      techniques,
      estimatedTotalSaved,
      preset: config.compressionLevel,
    },
  }
}

/**
 * Test Runner class
 */
export class TokenOptimizationTestRunner {
  private harness: TokenMeasurementHarness
  private provider: LLMProvider | null = null
  private model: string = 'gpt-4'
  private providerName: string = 'openai'

  constructor(config?: { outputDir?: string; verbose?: boolean }) {
    this.harness = createMeasurementHarness({
      outputDir: config?.outputDir,
      verbose: config?.verbose ?? true,
      model: this.model,
      provider: this.providerName,
    })
  }

  /**
   * Set the LLM provider for actual API calls
   */
  setProvider(provider: LLMProvider, providerName: string = 'openai'): void {
    this.provider = provider
    this.providerName = providerName
  }

  /**
   * Set the model to use
   */
  setModel(model: string): void {
    this.model = model
  }

  /**
   * Run baseline measurements (no optimization)
   */
  async runBaseline(
    scenarioIds?: string[],
    trialsPerScenario: number = 1
  ): Promise<RunStatistics> {
    const scenarios = scenarioIds
      ? (scenarioIds
          .map((id) => SCENARIO_BY_ID.get(id))
          .filter(Boolean) as TestScenario[])
      : ALL_SCENARIOS

    const runConfig: MeasurementRunConfig = {
      runId: `baseline-${randomUUID().slice(0, 8)}`,
      timestamp: new Date().toISOString(),
      mode: 'baseline',
      scenarioIds: scenarios.map((s) => s.id),
      trialsPerScenario,
      model: this.model,
      provider: this.providerName,
    }

    this.harness.startRun(runConfig)

    for (const scenario of scenarios) {
      for (let trial = 0; trial < trialsPerScenario; trial++) {
        await this.executeScenario(
          scenario,
          {},
          `${scenario.id}-trial-${trial}`
        )
      }
    }

    return this.harness.endRun()
  }

  /**
   * Run optimized measurements
   */
  async runOptimized(
    optimizationConfig: OptimizationConfig,
    scenarioIds?: string[],
    trialsPerScenario: number = 1
  ): Promise<RunStatistics> {
    const scenarios = scenarioIds
      ? (scenarioIds
          .map((id) => SCENARIO_BY_ID.get(id))
          .filter(Boolean) as TestScenario[])
      : ALL_SCENARIOS

    const runConfig: MeasurementRunConfig = {
      runId: `optimized-${randomUUID().slice(0, 8)}`,
      timestamp: new Date().toISOString(),
      mode: 'optimized',
      optimizationConfig,
      scenarioIds: scenarios.map((s) => s.id),
      trialsPerScenario,
      model: this.model,
      provider: this.providerName,
    }

    this.harness.startRun(runConfig)

    for (const scenario of scenarios) {
      for (let trial = 0; trial < trialsPerScenario; trial++) {
        await this.executeScenario(
          scenario,
          optimizationConfig,
          `${scenario.id}-trial-${trial}`
        )
      }
    }

    return this.harness.endRun()
  }

  /**
   * Run A/B comparison
   */
  async runComparison(
    optimizationConfig: OptimizationConfig,
    scenarioIds?: string[],
    trialsPerScenario: number = 1
  ): Promise<RunComparison> {
    console.log('\n========== BASELINE RUN ==========')
    const baseline = await this.runBaseline(scenarioIds, trialsPerScenario)

    console.log('\n========== OPTIMIZED RUN ==========')
    const optimized = await this.runOptimized(
      optimizationConfig,
      scenarioIds,
      trialsPerScenario
    )

    const comparison = this.compareRuns(baseline, optimized)

    this.printComparisonReport(comparison)

    return comparison
  }

  /**
   * Execute a single scenario
   */
  private async executeScenario(
    scenario: TestScenario,
    optimizationConfig: OptimizationConfig,
    _runId: string
  ): Promise<void> {
    const messages: Array<{ role: string; content: string }> = []

    for (let i = 0; i < scenario.turns.length; i++) {
      const turn = scenario.turns[i]

      // Add message to history
      messages.push({
        role: turn.role,
        content: turn.content,
      })

      // Only measure on user turns (when we would send to LLM)
      if (turn.role === 'user') {
        // Start measurement
        const measurementId = this.harness.beginMeasurement(
          scenario.id,
          Math.floor(i / 2) + 1, // Turn number
          messages
        )

        // Apply optimizations (if enabled)
        let optimizedMessages = messages
        let optimization: OptimizationApplied = {
          enabled: false,
          techniques: [],
          estimatedTotalSaved: 0,
        }

        if (Object.keys(optimizationConfig).length > 0) {
          const result = applyOptimizations(
            messages,
            optimizationConfig,
            this.model
          )
          optimizedMessages = result.optimizedMessages
          optimization = result.optimization
        }

        // Record optimized payload
        this.harness.recordOptimizedPayload(
          measurementId,
          optimizedMessages,
          optimization,
          turn.tools,
          { temperature: 0.7, maxTokens: 1000 }
        )

        // Call LLM if provider available, otherwise mock
        let result: MockLLMResult
        if (this.provider) {
          try {
            result = await this.provider.chat(optimizedMessages, {
              model: this.model,
              temperature: 0.7,
              maxTokens: 1000,
            })
          } catch (error) {
            this.harness.completeMeasurement(measurementId, null, {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            })
            continue
          }
        } else {
          // Mock response
          result = this.mockLLMResponse(optimizedMessages)
        }

        // Complete measurement with provider usage
        const providerUsage = result.usage
          ? {
              promptTokens: result.usage.prompt_tokens,
              completionTokens: result.usage.completion_tokens,
              totalTokens: result.usage.total_tokens,
            }
          : null

        this.harness.completeMeasurement(measurementId, providerUsage, {
          success: true,
          responseChars: result.content.length,
          finishReason: result.finish_reason,
        })

        // Add assistant response to history for next turn
        if (
          i < scenario.turns.length - 1 &&
          scenario.turns[i + 1]?.role === 'assistant'
        ) {
          // Use the pre-defined assistant response from scenario
          messages.push(scenario.turns[i + 1])
          i++ // Skip the assistant turn in the loop
        } else {
          // Use the actual/mocked response
          messages.push({ role: 'assistant', content: result.content })
        }
      }
    }
  }

  /**
   * Mock LLM response for testing without API calls
   */
  private mockLLMResponse(
    messages: Array<{ role: string; content: string }>
  ): MockLLMResult {
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === 'user')
    const responseContent = `This is a mock response to: "${lastUserMessage?.content.slice(0, 50)}..."`

    // Simulate provider token counting
    const promptTokens = messages.reduce((sum, m) => {
      return sum + estimateTokens(m.content, this.model).tokens + 4 // +4 for message overhead
    }, 3) // +3 for reply priming

    const completionTokens = estimateTokens(responseContent, this.model).tokens

    return {
      content: responseContent,
      usage: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens,
      },
      finish_reason: 'stop',
    }
  }

  /**
   * Compare baseline and optimized runs
   */
  private compareRuns(
    baseline: RunStatistics,
    optimized: RunStatistics
  ): RunComparison {
    const meanInputReductionEstimated =
      baseline.tokens.meanEstimatedInput - optimized.tokens.meanEstimatedInput

    const meanInputReductionActual =
      baseline.tokens.meanActualInput !== undefined &&
      optimized.tokens.meanActualInput !== undefined
        ? baseline.tokens.meanActualInput - optimized.tokens.meanActualInput
        : undefined

    const percentReductionEstimated =
      baseline.tokens.meanEstimatedInput > 0
        ? (meanInputReductionEstimated / baseline.tokens.meanEstimatedInput) *
          100
        : 0

    const percentReductionActual =
      baseline.tokens.meanActualInput !== undefined &&
      optimized.tokens.meanActualInput !== undefined &&
      baseline.tokens.meanActualInput > 0
        ? ((baseline.tokens.meanActualInput -
            optimized.tokens.meanActualInput) /
            baseline.tokens.meanActualInput) *
          100
        : undefined

    const isEffective =
      percentReductionActual !== undefined
        ? percentReductionActual > 0
        : percentReductionEstimated > 0

    const notes: string[] = []

    if (percentReductionActual !== undefined) {
      if (percentReductionActual >= 10) {
        notes.push('✅ Significant token reduction achieved')
      } else if (percentReductionActual > 0) {
        notes.push('⚠️ Minor token reduction - may not be cost-effective')
      } else {
        notes.push('❌ No actual token reduction - optimization is PLACEBO')
      }
    } else {
      notes.push('⚠️ No provider usage data - cannot verify actual savings')
    }

    if (optimized.timing.meanLatencyMs > baseline.timing.meanLatencyMs + 100) {
      notes.push('⚠️ Optimization adds significant latency overhead')
    }

    return {
      baseline,
      optimized,
      tokenDelta: {
        meanInputReductionEstimated,
        meanInputReductionActual,
        percentReductionEstimated,
        percentReductionActual,
      },
      latencyImpact: {
        meanLatencyDeltaMs:
          optimized.timing.meanLatencyMs - baseline.timing.meanLatencyMs,
        optimizationOverheadMs: optimized.timing.meanOptimizationMs,
      },
      verdict: {
        isEffective,
        confidence:
          percentReductionActual !== undefined
            ? percentReductionActual >= 10
              ? 'high'
              : 'medium'
            : 'low',
        notes,
      },
    }
  }

  /**
   * Print comparison report
   */
  private printComparisonReport(comparison: RunComparison): void {
    console.log('\n' + '='.repeat(60))
    console.log('TOKEN OPTIMIZATION A/B COMPARISON REPORT')
    console.log('='.repeat(60))

    console.log('\n--- TOKEN METRICS ---')
    console.log(
      `Baseline mean input tokens (estimated): ${comparison.baseline.tokens.meanEstimatedInput.toFixed(1)}`
    )
    console.log(
      `Optimized mean input tokens (estimated): ${comparison.optimized.tokens.meanEstimatedInput.toFixed(1)}`
    )
    console.log(
      `Estimated reduction: ${comparison.tokenDelta.meanInputReductionEstimated.toFixed(1)} tokens (${comparison.tokenDelta.percentReductionEstimated.toFixed(1)}%)`
    )

    if (comparison.baseline.tokens.meanActualInput !== undefined) {
      console.log(
        `\nBaseline mean input tokens (actual): ${comparison.baseline.tokens.meanActualInput.toFixed(1)}`
      )
      console.log(
        `Optimized mean input tokens (actual): ${comparison.optimized.tokens.meanActualInput?.toFixed(1) ?? 'N/A'}`
      )
      console.log(
        `Actual reduction: ${comparison.tokenDelta.meanInputReductionActual?.toFixed(1) ?? 'N/A'} tokens (${comparison.tokenDelta.percentReductionActual?.toFixed(1) ?? 'N/A'}%)`
      )
    }

    console.log('\n--- LATENCY IMPACT ---')
    console.log(
      `Baseline mean latency: ${comparison.baseline.timing.meanLatencyMs.toFixed(1)}ms`
    )
    console.log(
      `Optimized mean latency: ${comparison.optimized.timing.meanLatencyMs.toFixed(1)}ms`
    )
    console.log(
      `Delta: ${comparison.latencyImpact.meanLatencyDeltaMs.toFixed(1)}ms`
    )

    console.log('\n--- VERDICT ---')
    console.log(`Effective: ${comparison.verdict.isEffective ? 'YES' : 'NO'}`)
    console.log(`Confidence: ${comparison.verdict.confidence.toUpperCase()}`)
    console.log('Notes:')
    comparison.verdict.notes.forEach((note) => console.log(`  ${note}`))

    console.log('\n' + '='.repeat(60))
  }

  /**
   * Export measurements to CSV
   */
  exportToCSV(outputPath: string): void {
    this.harness.exportToCSV(outputPath)
  }

  /**
   * Get all measurements
   */
  getMeasurements() {
    return this.harness.getMeasurements()
  }
}

/**
 * Create a test runner instance
 */
export function createTestRunner(config?: {
  outputDir?: string
  verbose?: boolean
}): TokenOptimizationTestRunner {
  return new TokenOptimizationTestRunner(config)
}
