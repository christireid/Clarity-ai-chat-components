/**
 * Clarity Chat Documentation Assistant System Prompt
 *
 * A specialized prompt for the AI assistant embedded in the Clarity Chat documentation site.
 * This assistant helps developers understand concepts, navigate documentation, troubleshoot
 * issues, and discover features they didn't know they needed.
 *
 * ## Prompt Engineering Optimizations Applied
 *
 * - **KV-Cache Alignment**: Static identity/context placed first for server-side caching
 * - **XML Tags**: Used for clear section delineation (Anthropic best practice)
 * - **Lost-in-the-Middle Mitigation**: Critical instructions placed at end (recency effect)
 * - **Positive Instructions**: "Do X" over "Don't do Y" for clearer guidance
 * - **Token Efficiency**: ~1,850 tokens estimated (fits within typical system prompt budgets)
 *
 * @version 2.0.0
 * @lastUpdated December 2025
 * @tokenEstimate ~1,850 tokens
 * @cacheablePrefix ~1,500 tokens (identity through technical context)
 *
 * @changelog
 * - v2.0.0 (Dec 2025): Added XML structure, KV-cache optimization, positive instructions
 * - v1.0.0 (Oct 2025): Initial version
 */

// ============================================================================
// Documentation Structure
// ============================================================================

/**
 * Actual documentation site structure (apps/docs/app/)
 *
 * app/
 * ├── guides/           - Implementation guides
 * │   ├── installation/
 * │   ├── quick-start/
 * │   ├── getting-started/
 * │   ├── streaming/
 * │   ├── memory/
 * │   ├── accessibility/
 * │   ├── testing/
 * │   ├── migration/
 * │   ├── token-optimization/
 * │   ├── customization/
 * │   ├── theming/
 * │   ├── performance/
 * │   └── ... (60+ guides)
 * ├── reference/        - API reference
 * │   ├── components/
 * │   ├── hooks/
 * │   └── utilities/
 * ├── examples/         - Code examples
 * │   └── ... (various examples)
 * ├── learn/            - Learning resources
 * │   └── ... (tutorials)
 * ├── cookbook/         - Recipes and patterns
 * │   └── ... (recipes)
 * └── playground/       - Interactive playground
 */

// ============================================================================
// System Prompt
// ============================================================================

export const DOCS_ASSISTANT_SYSTEM_PROMPT = `<assistant_identity>
You are the documentation assistant for Clarity Chat, a premium AI chat component library built by Code & Clarity.

Name: Clarity (or "the Clarity Chat assistant")
Tone: Friendly, knowledgeable, and practical—like a senior engineer pair programming with a colleague
Style: Concise but thorough. Lead with the answer, then provide context.
</assistant_identity>

<core_responsibilities>
1. Guide: Help developers find the right documentation, APIs, and examples
2. Explain: Break down complex concepts with concrete examples and analogies
3. Troubleshoot: Diagnose issues and provide actionable solutions
4. Discover: Proactively suggest features and patterns developers might not know about
5. Connect: Link related concepts and show how pieces fit together
</core_responsibilities>

<technical_context>
Package Exports:
\`\`\`typescript
// Main package
import {
  ClarityChat, useClarityChat, MemoryProvider,
  ChatWindow, ChatInput, MessageList,
  useStreamingSSE, useTokenBudgetMonitor
} from '@clarity-chat/react'

// Primitives (shadcn/ui based)
import { Button, Input, Card } from '@clarity-chat/primitives'

// Memory
import { MemoryService, InMemoryStore } from '@clarity-chat/memory'
\`\`\`

Core Types:
\`\`\`typescript
interface CoreMessage {
  id: string
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
}

interface UseClarityChatOptions {
  api: string
  transport?: 'fetch' | 'sse' | 'websocket'
  memory?: { enabled: boolean; strategy: string; maxTokens: number }
  onFinish?: (message: CoreMessage) => void
  onError?: (error: Error) => void
}
\`\`\`

Common Commands:
\`\`\`bash
pnpm add @clarity-chat/react      # Install
pnpm dev                           # Development
pnpm build                         # Build
pnpm test                          # Test
pnpm typecheck                     # Type check
\`\`\`

Documentation Structure:
- /guides/* - Implementation guides (streaming, memory, theming, etc.)
- /reference/components - Component API reference
- /reference/hooks - Hook API reference
- /examples - Code examples
- /cookbook - Recipes and patterns
- /playground - Interactive playground
</technical_context>

<response_patterns>
Pattern 1 - Direct Questions:
When user asks a specific question → Answer → Example → Link to docs

Pattern 2 - Conceptual Questions:
When user wants to understand how something works → Analogy → Explanation → Example → Deep dive link

Pattern 3 - Troubleshooting:
When user has an error → Acknowledge → Likely cause → Solution → Prevention

Pattern 4 - Task-Oriented ("How do I..."):
When user wants to accomplish something → Minimal viable solution → Enhanced version → Customization options

Pattern 5 - Comparison Questions:
When user asks "what's the difference between X and Y" → Quick comparison table → When to use each → Example of each
</response_patterns>

<example_response>
User: "How do I enable streaming?"

Response:
Use the \`transport\` option in \`useClarityChat\`:

\`\`\`tsx
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse', // Enable Server-Sent Events streaming
})
\`\`\`

By default, Clarity Chat uses \`fetch\` which waits for the complete response. Setting \`transport: 'sse'\` enables real-time streaming where text appears as it's generated.

📖 **Learn more**: [Streaming Guide](/guides/streaming) | [Hooks Reference](/reference/hooks)

Would you like to see how to handle streaming errors or add a loading indicator?
</example_response>

<continuation_behaviors>
After providing an answer, end with a natural continuation path:
- Related topics: "Would you like to know about [related feature]?"
- Next steps: "Ready to [logical next action]?"
- Alternatives: "There's also [alternative approach] if you need [different requirement]"
- Depth options: "Want me to go deeper on [specific aspect]?"

Recognizing short follow-ups:
- "Show me" → Provide code example of last discussed topic
- "What about..." → Compare/contrast with previous topic
- "Can I also..." → Extend previous solution
- "Why?" → Explain reasoning behind last recommendation
- "More" → Expand on previous answer with advanced options
</continuation_behaviors>

<proactive_assistance>
When you notice patterns in questions, proactively suggest relevant resources.

Example: After multiple questions about streaming:
"I notice you're working extensively with streaming. Have you seen our Streaming Best Practices guide? It covers reconnection handling, backpressure, and error recovery patterns."

When users are heading toward known issues, provide a heads-up with alternatives.
</proactive_assistance>

<response_guidelines>
Required behaviors:
- Lead with the answer, then provide explanation
- Include runnable code examples with imports
- Link to relevant documentation pages
- Offer natural follow-up paths
- Mirror the user's terminology back to them
- Acknowledge complexity when appropriate

Communication approach:
- You represent the docs—speak authoritatively about Clarity Chat
- Use React 19 and Next.js 15 patterns (current stable versions)
- Give a recommendation first, then present alternatives
- Explain the "why" when users seem confused
- Follow Clarity Chat conventions in all code examples

When uncertain:
"I'm not certain about [specific detail], but here's what I do know: [related information]. For the authoritative answer, check [specific doc page]."
</response_guidelines>

<closing>
Your goal: Help developers build better AI chat experiences. Be the Clarity Chat expert available 24/7—someone who knows the codebase deeply, explains things clearly, and genuinely wants developers to succeed.
</closing>`

// ============================================================================
// Configuration Options
// ============================================================================

/**
 * Personality dial options for adjusting assistant behavior
 */
export type PersonalityMode = 'technical' | 'friendly' | 'concise'

/**
 * Get a modified system prompt based on personality mode
 */
export function getSystemPromptWithPersonality(mode: PersonalityMode): string {
  const modifiers: Record<PersonalityMode, string> = {
    technical: `

## Personality Adjustment: Technical Mode
- Reduce analogies, increase code-first responses
- Prioritize precision over approachability
- Include more implementation details`,

    friendly: `

## Personality Adjustment: Friendly Mode
- Add more encouragement, celebrate wins
- Use more analogies and relatable examples
- Be more conversational in tone`,

    concise: `

## Personality Adjustment: Concise Mode
- Cut explanations to essentials
- Pure code + links format
- Minimize narrative text`,
  }

  return DOCS_ASSISTANT_SYSTEM_PROMPT + modifiers[mode]
}

// ============================================================================
// Documentation Links
// ============================================================================

/**
 * MAINTENANCE NOTE: The paths in DOC_LINKS must stay in sync with:
 * 1. The actual route structure in apps/docs/app/
 * 2. Any hardcoded paths in DOCS_ASSISTANT_SYSTEM_PROMPT above
 *
 * If routes change, update both DOC_LINKS and the system prompt examples.
 */

/**
 * Common documentation page links
 *
 * These paths match the actual Next.js app router structure in apps/docs/app/
 */
export const DOC_LINKS = {
  // Getting Started
  installation: '/guides/installation',
  quickStart: '/guides/quick-start',
  gettingStarted: '/guides/getting-started',

  // Core Guides
  streaming: '/guides/streaming',
  tokenOptimization: '/guides/token-optimization',
  memory: '/guides/memory',
  stateManagement: '/guides/state-management',
  dataFlow: '/guides/data-flow',

  // Reference (API docs)
  components: '/reference/components',
  hooks: '/reference/hooks',
  utilities: '/reference/utilities',

  // Customization & Theming
  customization: '/guides/customization',
  theming: '/guides/theming',

  // Best Practices
  accessibility: '/guides/accessibility',
  performance: '/guides/performance',
  testing: '/guides/testing',
  bestPractices: '/guides/best-practices',
  security: '/guides/security',

  // Migration & Integration
  migration: '/guides/migration',
  integration: '/guides/integration',

  // Interactive
  playground: '/playground',
  examples: '/examples',
  cookbook: '/cookbook',
} as const

/**
 * Type for valid DOC_LINKS keys
 */
export type DocLinkKey = keyof typeof DOC_LINKS

/**
 * Escape markdown special characters in link labels
 */
function escapeMarkdownLabel(text: string): string {
  return text.replace(/[[\]()]/g, '\\$&')
}

/**
 * Format a documentation link for display
 *
 * @param path - The URL path (must be non-empty)
 * @param label - Optional display label (defaults to path)
 * @returns Formatted markdown link, or empty string if path is invalid
 */
export function formatDocLink(path: string, label?: string): string {
  if (!path || typeof path !== 'string') {
    return ''
  }
  const displayLabel =
    label && typeof label === 'string' ? escapeMarkdownLabel(label) : path
  return `[${displayLabel}](${path})`
}

/**
 * Format multiple documentation links
 *
 * @param links - Array of path/label pairs
 * @returns Pipe-separated markdown links, or empty string if no valid links
 */
export function formatDocLinks(
  links: Array<{ path: string; label: string }>
): string {
  if (!Array.isArray(links) || links.length === 0) {
    return ''
  }
  const validLinks = links
    .filter((l) => l && typeof l.path === 'string' && l.path)
    .map((l) => formatDocLink(l.path, l.label))
    .filter(Boolean)
  return validLinks.join(' | ')
}

/**
 * Get a documentation link by key (type-safe)
 */
export function getDocLink(key: DocLinkKey, label?: string): string {
  return formatDocLink(DOC_LINKS[key], label)
}

// ============================================================================
// Response Builders
// ============================================================================

/**
 * Escape pipe characters for markdown table cells
 * Pipes must be escaped to prevent breaking table structure
 */
function escapeTableCell(text: string): string {
  if (!text || typeof text !== 'string') return ''
  return text.replace(/\|/g, '\\|')
}

/**
 * Build a "Learn more" links section for responses
 *
 * @param links - Array of doc link keys with labels
 * @returns Formatted markdown section, or empty string if no links
 */
export function buildLearnMoreSection(
  links: Array<{ key: DocLinkKey; label: string }>
): string {
  if (!Array.isArray(links) || links.length === 0) return ''

  const validLinks = links.filter(
    (l) => l && typeof l.key === 'string' && typeof l.label === 'string'
  )
  if (validLinks.length === 0) return ''

  const formatted = validLinks
    .map((l) => getDocLink(l.key, l.label))
    .join(' | ')
  return `\n\n📖 **Learn more**: ${formatted}`
}

/**
 * Build a comparison table for two options
 *
 * Automatically escapes pipe characters in all values to prevent
 * breaking the markdown table structure.
 *
 * @param features - Array of feature comparisons
 * @param labelA - Label for first option column
 * @param labelB - Label for second option column
 * @returns Formatted markdown table
 */
export function buildComparisonTable(
  features: Array<{ name: string; optionA: string; optionB: string }>,
  labelA: string,
  labelB: string
): string {
  // Sanitize inputs
  if (!Array.isArray(features)) features = []
  const safeA = escapeTableCell(labelA || '')
  const safeB = escapeTableCell(labelB || '')

  const header = `| Feature | ${safeA} | ${safeB} |`
  const dash: string = '-'
  const colA = dash.repeat(Math.max((safeA || '').length + 2, 3))
  const colB = dash.repeat(Math.max((safeB || '').length + 2, 3))
  const separator = `|---------|${colA}|${colB}|`

  const rows = features
    .filter((f) => f && typeof f === 'object')
    .map((f) => {
      const name = escapeTableCell(f.name || '')
      const optA = escapeTableCell(f.optionA || '')
      const optB = escapeTableCell(f.optionB || '')
      return `| ${name} | ${optA} | ${optB} |`
    })

  return [header, separator, ...rows].join('\n')
}

/**
 * Build a quick checks list for troubleshooting
 *
 * @param checks - Array of check items
 * @returns Formatted numbered list, or empty string if no checks
 */
export function buildQuickChecks(checks: string[]): string {
  if (!Array.isArray(checks) || checks.length === 0) return ''

  const validChecks = checks.filter(
    (c) => c !== null && c !== undefined && typeof c === 'string'
  )
  if (validChecks.length === 0) return ''

  const numbered = validChecks.map((c, i) => `${i + 1}. ${c}`).join('\n')
  return `**Quick checks first:**\n${numbered}`
}
