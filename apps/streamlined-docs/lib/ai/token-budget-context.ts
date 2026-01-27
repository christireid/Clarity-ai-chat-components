/**
 * Token Budget Context Injection
 *
 * **Agent-Native Architecture Principle**:
 * "What the user can see, the agent can see" - The AI should have visibility
 * into its token budget so it can make intelligent decisions about response
 * detail, length, and cost trade-offs.
 *
 * This utility formats token budget information for injection into AI system
 * prompts, enabling budget-aware responses.
 */

import type {
  TokenBudgetUsage,
  TokenUsageStatus,
} from '@clarity-chat/token-optimization'

/**
 * Token budget context configuration
 */
export interface TokenBudgetContextConfig {
  /** Whether to include cost information */
  includeCost?: boolean
  /** Whether to include specific token counts */
  includeDetails?: boolean
  /** Model being used (for context) */
  model?: string
}

/**
 * Generate AI-readable token budget context
 *
 * This context is injected into the system prompt to make the AI aware of
 * its current token budget status. The AI can then adapt its response style:
 *
 * - **Safe (0-80%)**: Full detailed responses
 * - **Warning (80-95%)**: More concise, focus on essentials
 * - **Critical (95-100%)**: Minimal responses, bullet points
 * - **Exceeded (>100%)**: Emergency mode, absolute minimum

 *
 * @param usage - Current token budget usage from useTokenBudgetMonitor
 * @param config - Optional configuration for context formatting
 * @returns Formatted context string for system prompt injection
 *
 * @example
 * ```typescript
 * import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'
 * import { generateTokenBudgetContext } from './token-budget-context'
 *
 * const { usage } = useTokenBudgetMonitor({ maxInputTokens: 128000 })
 * const budgetContext = generateTokenBudgetContext(usage, {
 *   includeCost: true,
 *   model: 'gpt-4o',
 * })
 *
 * const systemPrompt = `${baseSystemPrompt}\n\n${budgetContext}`
 * ```
 */
export function generateTokenBudgetContext(
  usage: TokenBudgetUsage,
  config: TokenBudgetContextConfig = {}
): string {
  const {
    includeCost = false,
    includeDetails = true,
    model = 'unknown',
  } = config

  // Format status with visual indicator
  const statusIndicator = getStatusIndicator(usage.status)
  const statusLabel = usage.status.toUpperCase()

  // Build context sections
  const sections: string[] = []

  // Header
  sections.push('<token_budget_status>')
  sections.push(
    `Current Status: ${statusIndicator} ${statusLabel} (${usage.utilizationPercent.toFixed(1)}% utilized)`
  )

  // Detailed metrics (if enabled)
  if (includeDetails) {
    sections.push('')
    sections.push('Budget Metrics:')
    sections.push(`- Current Usage: ${formatNumber(usage.current)} tokens`)
    sections.push(
      `- Available: ${formatNumber(usage.available)} tokens remaining`
    )
    sections.push(
      `- Maximum: ${formatNumber(usage.effectiveMax)} tokens (${formatNumber(usage.reservedForOutput)} reserved for output)`
    )

    if (usage.exceededPercent > 0) {
      sections.push(`- ⚠️  OVER BUDGET by ${usage.exceededPercent.toFixed(1)}%`)
    }
  }

  // Cost information (if enabled and exceeded)
  if (includeCost && usage.status === 'exceeded') {
    sections.push('')
    sections.push('Cost Impact:')
    sections.push(
      `⚠️  Context overflow may result in truncation or additional API calls.`
    )
    sections.push(`Model: ${model}`)
  }

  // Response adaptation guidance
  sections.push('')
  sections.push('Response Adaptation Guidelines:')
  sections.push(getAdaptationGuidance(usage.status, usage.utilizationPercent))

  sections.push('</token_budget_status>')

  return sections.join('\n')
}

/**
 * Get visual status indicator
 */
function getStatusIndicator(status: TokenUsageStatus): string {
  switch (status) {
    case 'safe':
      return '✅'
    case 'warning':
      return '⚠️'
    case 'critical':
      return '🔴'
    case 'exceeded':
      return '🚨'
  }
}

/**
 * Get response adaptation guidance based on status
 */
function getAdaptationGuidance(
  status: TokenUsageStatus,
  utilizationPercent: number
): string {
  switch (status) {
    case 'safe':
      return `
**SAFE** - You have plenty of budget (${utilizationPercent.toFixed(1)}% used).
- Provide detailed, comprehensive responses
- Include code examples with comments
- Add explanations of "why" not just "what"
- Suggest related concepts and features
- Use formatting for readability

Example response style: Full explanations with context, examples, and next steps.`

    case 'warning':
      return `
**WARNING** - Budget is elevated (${utilizationPercent.toFixed(1)}% used).
- Focus on essential information
- Include code examples but keep comments concise
- Explain "what" clearly, minimize "why" unless critical
- Reduce tangential suggestions
- Maintain clarity but be more direct

Example response style: Clear and direct with focused examples.`

    case 'critical':
      return `
**CRITICAL** - Budget nearly exhausted (${utilizationPercent.toFixed(1)}% used).
- Provide MINIMAL but complete answers
- Code-first responses (example + brief explanation only)
- Use bullet points over paragraphs
- Skip "nice-to-have" information
- No tangential suggestions
- Prioritize solving the immediate question

Example response style: Brief bullet points + essential code example.`

    case 'exceeded':
      return `
**EXCEEDED** - Budget over limit (${utilizationPercent.toFixed(1)}% used).
‼️  EMERGENCY MODE - Absolute minimum responses only!
- ONE clear, actionable answer
- Code snippet if essential, NO explanations
- Single bullet list maximum
- NO examples, analogies, or context
- Direct user to docs for details

Example response style: "Use X. See /docs/path for details."`
  }
}

/**
 * Format number with thousands separators
 */
function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

/**
 * Inject token budget context into existing system prompt
 *
 * Adds budget context at the end of the system prompt (recency effect)
 * while maintaining the existing prompt structure.
 *
 * @param systemPrompt - Existing system prompt
 * @param usage - Token budget usage
 * @param config - Optional configuration
 * @returns System prompt with budget context injected
 *
 * @example
 * ```typescript
 * const enhancedPrompt = injectTokenBudgetContext(
 *   DOCS_ASSISTANT_SYSTEM_PROMPT,
 *   usage,
 *   { includeCost: true, model: 'gpt-4o' }
 * )
 * ```
 */
export function injectTokenBudgetContext(
  systemPrompt: string,
  usage: TokenBudgetUsage,
  config: TokenBudgetContextConfig = {}
): string {
  const budgetContext = generateTokenBudgetContext(usage, config)

  // Check if prompt has closing tag structure
  const hasClosingTag = systemPrompt.includes('</closing>')

  if (hasClosingTag) {
    // Insert before closing tag (critical instructions at end)
    return systemPrompt.replace(
      '</closing>',
      `\n\n${budgetContext}\n</closing>`
    )
  }

  // Append to end
  return `${systemPrompt}\n\n${budgetContext}`
}

/**
 * Get recommended response length based on budget status
 *
 * Provides concrete token targets for response generation.
 *
 * @param status - Current token usage status
 * @param availableTokens - Tokens remaining in budget
 * @returns Recommended maximum response length in tokens
 */
export function getRecommendedResponseLength(
  status: TokenUsageStatus,
  availableTokens: number
): number {
  switch (status) {
    case 'safe':
      // Use up to 40% of available budget for response
      return Math.floor(availableTokens * 0.4)

    case 'warning':
      // Use up to 25% of available budget
      return Math.floor(availableTokens * 0.25)

    case 'critical':
      // Use up to 10% of available budget
      return Math.floor(availableTokens * 0.1)

    case 'exceeded':
      // Absolute minimum - 100 tokens maximum
      return Math.min(100, availableTokens)
  }
}

/**
 * Determine if AI should suggest follow-up questions
 *
 * Based on budget status, decide whether proactive suggestions are appropriate.
 *
 * @param status - Current token usage status
 * @returns Whether follow-up suggestions should be included
 */
export function shouldIncludeFollowUps(status: TokenUsageStatus): boolean {
  return status === 'safe' // Only suggest follow-ups when budget is safe
}

/**
 * Determine if AI should include code examples
 *
 * @param status - Current token usage status
 * @returns Level of code example detail
 */
export function getCodeExampleDetail(
  status: TokenUsageStatus
): 'full' | 'minimal' | 'none' {
  switch (status) {
    case 'safe':
      return 'full' // Full examples with comments and explanations
    case 'warning':
      return 'full' // Full examples but minimal comments
    case 'critical':
      return 'minimal' // Essential code only, no comments
    case 'exceeded':
      return 'none' // No examples, link to docs
  }
}

/**
 * Example integration with docs assistant API route
 *
 * ```typescript
 * // In app/api/docs-assistant/route.ts
 * import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'
 * import { injectTokenBudgetContext } from '@/lib/ai/token-budget-context'
 * import { DOCS_ASSISTANT_SYSTEM_PROMPT } from '@/components/AI/systemPrompt'
 *
 * export async function POST(request: Request) {
 *   const { messages, model } = await request.json()
 *
 *   // Calculate current token usage
 *   const { usage } = useTokenBudgetMonitor({
 *     maxInputTokens: 128000,
 *     model: model || 'gpt-4o',
 *   })
 *
 *   // Inject budget context
 *   const enhancedPrompt = injectTokenBudgetContext(
 *     DOCS_ASSISTANT_SYSTEM_PROMPT,
 *     usage,
 *     { includeCost: true, model }
 *   )
 *
 *   // Use enhanced prompt with AI provider
 *   const response = await fetch('https://api.openai.com/v1/chat/completions', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
 *     },
 *     body: JSON.stringify({
 *       model,
 *       messages: [
 *         { role: 'system', content: enhancedPrompt },
 *         ...messages,
 *       ],
 *     }),
 *   })
 *
 *   return response
 * }
 * ```
 */

/**
 * Budget-aware response formatting hints
 *
 * Provides specific formatting recommendations based on budget status.
 */
export interface BudgetAwareFormattingHints {
  /** Use markdown code blocks */
  useCodeBlocks: boolean
  /** Include code comments */
  includeComments: boolean
  /** Use bullet points vs paragraphs */
  useBulletPoints: boolean
  /** Include examples */
  includeExamples: boolean
  /** Maximum response length in tokens */
  maxResponseTokens: number
  /** Include follow-up suggestions */
  includeFollowUps: boolean
}

/**
 * Get formatting hints based on budget status
 *
 * @param usage - Token budget usage
 * @returns Formatting recommendations for AI
 */
export function getBudgetAwareFormattingHints(
  usage: TokenBudgetUsage
): BudgetAwareFormattingHints {
  const status = usage.status
  const codeExampleDetail = getCodeExampleDetail(status)

  return {
    useCodeBlocks: status !== 'exceeded',
    includeComments: status === 'safe',
    useBulletPoints: status === 'critical' || status === 'exceeded',
    includeExamples: codeExampleDetail !== 'none',
    maxResponseTokens: getRecommendedResponseLength(status, usage.available),
    includeFollowUps: shouldIncludeFollowUps(status),
  }
}
