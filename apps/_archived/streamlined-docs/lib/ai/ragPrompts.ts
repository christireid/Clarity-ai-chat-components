/**
 * Optimized RAG Prompts for Documentation Assistant
 *
 * This module contains highly optimized prompt templates for RAG (Retrieval-Augmented Generation)
 * designed to maximize response quality, prevent hallucinations, and ensure accurate citations.
 *
 * Key Features:
 * - Few-shot examples for consistent response format
 * - Explicit citation requirements and formatting
 * - Context-aware prompting with conversation history
 * - Hallucination prevention through strict constraints
 * - Token-efficient context management
 * - Structured output templates
 *
 * @module ragPrompts
 */

import type { SearchResult } from './vectorStore'
import type { Message } from '@clarity-chat/types'

// ============================================================================
// Core RAG System Prompts
// ============================================================================

/**
 * Base RAG System Prompt
 *
 * Optimized for:
 * - Accuracy: Only use provided context
 * - Citations: Always quote sources
 * - Helpfulness: Structured, actionable responses
 * - Safety: Explicit constraints against hallucination
 */
export const RAG_SYSTEM_PROMPT = `You are the Clarity Chat Documentation Assistant. Your role is to provide accurate, helpful answers about the Clarity Chat React library using ONLY the documentation context provided to you.

<critical_constraints>
- ONLY answer using information from the provided documentation context
- If the answer is not in the context, explicitly state: "I don't have that information in the documentation"
- NEVER make up component names, prop types, or API details
- ALWAYS cite your sources using the format [Source N] where N is the source number
- Quote exact code examples from the context when available
</critical_constraints>

<response_structure>
1. **Direct Answer**: Concise answer to the user's question
2. **Code Example**: Working code snippet from the documentation (if applicable)
3. **Explanation**: Step-by-step details or context
4. **Related Resources**: Links to relevant documentation pages
5. **Citations**: List all sources used with [Source N] references
</response_structure>

<citation_format>
- Reference sources inline: "According to [Source 1], the ChatProvider..."
- Include source list at the end: "**Sources:** [Source 1]: Title (URL)"
- Use exact quotes when referencing specific details
</citation_format>

<code_example_format>
\`\`\`tsx
// Always include imports
import { Component } from '@clarity-chat/react'

// Complete, runnable example from documentation
function Example() {
  return <Component />
}
\`\`\`
</code_example_format>

<tone>
- Professional but friendly
- Confident when information is in context
- Honest when information is not available
- Encouraging and supportive
</tone>`

/**
 * RAG User Prompt Template
 *
 * Template for injecting retrieved context and user question into the conversation.
 * Uses XML tags for clear separation and better parsing.
 */
export const RAG_USER_PROMPT_TEMPLATE = `<documentation_context>
{context}
</documentation_context>

<user_question>
{question}
</user_question>

<instructions>
Provide a comprehensive answer using ONLY the documentation context above. Include:
- Direct answer with citations [Source N]
- Code examples (if applicable)
- Step-by-step explanation
- Links to relevant docs
- Source list at the end
</instructions>`

// ============================================================================
// Few-Shot Examples
// ============================================================================

/**
 * Few-shot examples for teaching the model the desired response format
 *
 * These examples demonstrate:
 * - Proper citation format
 * - Code example structure
 * - How to handle missing information
 * - Step-by-step explanations
 */
export const FEW_SHOT_EXAMPLES = [
  {
    role: 'user' as const,
    content: `<documentation_context>
[Source 1]: ChatProvider Component
**Category:** Components
**URL:** /reference/components/chat-provider

# ChatProvider

The ChatProvider is the root provider component that manages chat state and configuration.

\`\`\`tsx
import { ChatProvider } from '@clarity-chat/react'

function App() {
  return (
    <ChatProvider apiKey={process.env.OPENAI_API_KEY}>
      <YourChatApp />
    </ChatProvider>
  )
}
\`\`\`

## Props
- \`apiKey\` (string, required): Your OpenAI or Anthropic API key
- \`model\` (string, optional): Model to use (default: 'gpt-4-turbo')
- \`theme\` (object, optional): Custom theme configuration
</documentation_context>

<user_question>
How do I use the ChatProvider component?
</user_question>`,
  },
  {
    role: 'assistant' as const,
    content: `To use the ChatProvider component, wrap your application with it and pass your API key [Source 1].

**Code Example:**
\`\`\`tsx
import { ChatProvider } from '@clarity-chat/react'

function App() {
  return (
    <ChatProvider apiKey={process.env.OPENAI_API_KEY}>
      <YourChatApp />
    </ChatProvider>
  )
}
\`\`\`

**Step-by-Step:**
1. Import ChatProvider from '@clarity-chat/react'
2. Wrap your app component with ChatProvider
3. Pass your API key via the \`apiKey\` prop (store in environment variables)
4. Optionally configure the model and theme

**Available Props:**
- \`apiKey\` (required): Your OpenAI or Anthropic API key [Source 1]
- \`model\` (optional): Model selection, defaults to 'gpt-4-turbo' [Source 1]
- \`theme\` (optional): Custom theme configuration [Source 1]

**Related Resources:**
- [ChatProvider Documentation](/reference/components/chat-provider)

**Sources:**
[Source 1]: ChatProvider Component (/reference/components/chat-provider)`,
  },
  {
    role: 'user' as const,
    content: `<documentation_context>
[Source 1]: useChat Hook
**Category:** Hooks
**URL:** /reference/hooks/use-chat

The useChat hook provides chat functionality.

\`\`\`tsx
const { messages, sendMessage, isLoading } = useChat()
\`\`\`

Returns:
- messages: Message[]
- sendMessage: (content: string) => Promise<void>
- isLoading: boolean
</documentation_context>

<user_question>
How do I implement file uploads with useChat?
</user_question>`,
  },
  {
    role: 'assistant' as const,
    content: `I don't have that information in the documentation. The provided context shows the basic useChat hook API [Source 1], but doesn't include details about file upload functionality.

**What I found:**
The useChat hook provides basic message handling with \`messages\`, \`sendMessage\`, and \`isLoading\` [Source 1], but file upload capabilities are not documented in this section.

**Suggestions:**
- Check the [Components](/reference/components) section for a FileUpload component
- Look in the [Advanced Features](/guides/advanced) guide
- Search for "file upload" or "attachments" in the documentation

**Sources:**
[Source 1]: useChat Hook (/reference/hooks/use-chat)`,
  },
]

// ============================================================================
// Conversation-Aware Prompts
// ============================================================================

/**
 * Conversation History Template
 *
 * Format for including previous conversation context
 */
export function formatConversationHistory(
  messages: Message[],
  maxTokens: number = 1000
): string {
  if (messages.length === 0) return ''

  // Estimate tokens (rough: 1 token ≈ 4 characters)
  const charLimit = maxTokens * 4

  let history = '<conversation_history>\n'
  let charCount = history.length
  const relevantMessages: Message[] = []

  // Take most recent messages that fit in budget
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    const msgLength = msg.content.length + 50 // +50 for formatting

    if (charCount + msgLength > charLimit) break

    relevantMessages.unshift(msg)
    charCount += msgLength
  }

  // Format messages
  for (const msg of relevantMessages) {
    if (msg.role === 'user') {
      history += `<user>\n${msg.content}\n</user>\n\n`
    } else if (msg.role === 'assistant') {
      // Truncate long assistant messages to save tokens
      const content =
        msg.content.length > 500
          ? msg.content.slice(0, 500) + '...'
          : msg.content
      history += `<assistant>\n${content}\n</assistant>\n\n`
    }
  }

  history += '</conversation_history>\n\n'
  return history
}

/**
 * Conversation-aware RAG prompt
 *
 * Includes conversation history for context continuity
 */
export function buildConversationRAGPrompt(params: {
  question: string
  context: string
  conversationHistory: Message[]
  maxHistoryTokens?: number
}): string {
  const {
    question,
    context,
    conversationHistory,
    maxHistoryTokens = 1000,
  } = params

  const history = formatConversationHistory(
    conversationHistory,
    maxHistoryTokens
  )

  return `${history}<documentation_context>
${context}
</documentation_context>

<current_question>
${question}
</current_question>

<instructions>
Consider the conversation history when answering. If this is a follow-up question:
- Reference previous topics discussed
- Build on earlier explanations
- Maintain consistency with prior answers

Provide a comprehensive answer using the documentation context. Include citations [Source N] and code examples where applicable.
</instructions>`
}

// ============================================================================
// Context Formatting and Prioritization
// ============================================================================

/**
 * Format retrieved sources into structured context
 *
 * Features:
 * - Clear source numbering for citation
 * - Relevance scores for transparency
 * - Category labels for context
 * - Token-efficient formatting
 */
export function formatSourcesForContext(
  sources: SearchResult[],
  options: {
    maxTokens?: number
    includeScores?: boolean
    includeCategories?: boolean
  } = {}
): string {
  const {
    maxTokens = 4000,
    includeScores = true,
    includeCategories = true,
  } = options

  if (sources.length === 0) {
    return '[No relevant documentation found]'
  }

  const charLimit = maxTokens * 4 // Rough token estimate
  let context = ''
  let charCount = 0

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]
    const sourceNum = i + 1

    // Build source header
    let header = `[Source ${sourceNum}]: ${source.title}\n`

    if (includeCategories && source.category) {
      header += `**Category:** ${source.category}\n`
    }

    if (includeScores && source.score !== undefined) {
      header += `**Relevance:** ${(source.score * 100).toFixed(0)}%\n`
    }

    header += `**URL:** ${source.url}\n\n`

    // Calculate if we can fit this source
    const sourceBlock = header + source.content + '\n\n---\n\n'

    if (charCount + sourceBlock.length > charLimit) {
      // Try to fit a truncated version
      const remaining = charLimit - charCount - header.length - 100
      if (remaining > 200) {
        const truncated = source.content.slice(0, remaining)
        context += header + truncated + '...\n\n---\n\n'
      }
      break
    }

    context += sourceBlock
    charCount += sourceBlock.length
  }

  return context
}

/**
 * Prioritize context chunks by relevance, diversity, and recency
 *
 * Algorithm:
 * 1. Sort by relevance score (primary)
 * 2. Apply diversity penalty (avoid duplicate categories)
 * 3. Boost recent content (freshness)
 * 4. Select top-K within token budget
 */
export function prioritizeContext(
  chunks: SearchResult[],
  maxTokens: number = 4000
): SearchResult[] {
  if (chunks.length === 0) return []

  // Score each chunk with bonuses/penalties
  const scoredChunks = chunks.map((chunk) => {
    let finalScore = chunk.score

    // Diversity bonus: lower score for duplicate categories
    const categoryCount = chunks.filter(
      (c) => c.category === chunk.category
    ).length
    if (categoryCount > 2) {
      finalScore *= 0.9 // 10% penalty for over-represented categories
    }

    // Recency bonus: boost recent updates
    if (chunk.metadata?.lastUpdated) {
      const daysSinceUpdate =
        (Date.now() - new Date(chunk.metadata.lastUpdated).getTime()) /
        (1000 * 60 * 60 * 24)
      if (daysSinceUpdate < 7) {
        finalScore *= 1.05 // 5% boost for content updated in last week
      }
    }

    // Title relevance bonus (would need query for full implementation)
    // Placeholder for future enhancement

    return {
      chunk,
      finalScore,
      tokens: estimateTokens(chunk.content),
    }
  })

  // Sort by final score
  scoredChunks.sort((a, b) => b.finalScore - a.finalScore)

  // Select chunks within token budget
  const selected: SearchResult[] = []
  let totalTokens = 0

  for (const item of scoredChunks) {
    if (totalTokens + item.tokens <= maxTokens) {
      selected.push(item.chunk)
      totalTokens += item.tokens
    } else {
      break
    }
  }

  return selected
}

/**
 * Estimate token count from text (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4)
}

// ============================================================================
// Specialized Prompts
// ============================================================================

/**
 * Code-focused RAG prompt
 *
 * Optimized for queries asking for implementation examples
 */
export const CODE_FOCUSED_PROMPT = `You are providing code implementation guidance. Focus on:
- Complete, runnable code examples from documentation
- Step-by-step implementation instructions
- Common pitfalls and best practices
- TypeScript types and prop definitions

Always include:
1. Full import statements
2. Complete component/function implementation
3. Usage example
4. TypeScript types
5. Link to full documentation`

/**
 * Troubleshooting RAG prompt
 *
 * Optimized for debugging and error resolution
 */
export const TROUBLESHOOTING_PROMPT = `You are helping debug an issue. Focus on:
- Identifying the likely root cause from the documentation
- Providing step-by-step debugging steps
- Suggesting common solutions and workarounds
- Linking to relevant troubleshooting guides

Always include:
1. Diagnosis of the likely issue
2. Specific steps to verify/fix
3. Code examples of correct implementation
4. Alternative approaches if applicable`

/**
 * Comparison RAG prompt
 *
 * Optimized for "X vs Y" or "when to use" questions
 */
export const COMPARISON_PROMPT = `You are comparing different approaches or components. Focus on:
- Clear distinction between options from documentation
- Use cases for each approach
- Pros and cons based on documented features
- Concrete examples showing differences

Always include:
1. Side-by-side comparison table
2. When to use each option
3. Code examples of both approaches
4. Performance or bundle size considerations`

// ============================================================================
// Prompt Quality Utilities
// ============================================================================

/**
 * Validate that a response properly cites sources
 */
export function validateCitations(
  response: string,
  sourceCount: number
): {
  isValid: boolean
  missingCitations: number[]
  issues: string[]
} {
  const issues: string[] = []
  const missingCitations: number[] = []

  // If no sources provided, validation passes
  if (sourceCount === 0) {
    return {
      isValid: true,
      missingCitations: [],
      issues: [],
    }
  }

  // Check for source citations [Source N]
  const citationPattern = /\[Source (\d+)\]/g
  const matches = [...response.matchAll(citationPattern)]
  const citedSources = new Set(matches.map((m) => parseInt(m[1], 10)))

  // Check if all sources are cited at least once in inline citations OR source list
  // Some responses may not cite all sources inline but list them at the end
  for (let i = 1; i <= sourceCount; i++) {
    if (!citedSources.has(i)) {
      // Check if it appears in the source list section
      const sourceListPattern = new RegExp(`\\[Source ${i}\\].*?\\(.*?\\)`, 'i')
      if (!sourceListPattern.test(response)) {
        missingCitations.push(i)
      }
    }
  }

  if (missingCitations.length > 0) {
    issues.push(`Missing citations for sources: ${missingCitations.join(', ')}`)
  }

  // Check for source list at the end
  if (!response.includes('**Sources:**') && sourceCount > 0) {
    issues.push('Missing source list at end of response')
  }

  return {
    isValid: issues.length === 0,
    missingCitations,
    issues,
  }
}

/**
 * Detect potential hallucinations
 *
 * Red flags:
 * - Mentions of components/hooks not in context
 * - Made-up prop names
 * - Fictional API endpoints
 */
export function detectHallucination(
  response: string,
  context: string
): {
  isLikelySafe: boolean
  warnings: string[]
} {
  const warnings: string[] = []

  // Extract component/hook names from response
  const componentPattern = /<([A-Z][a-zA-Z]+)\s/g
  const hooksPattern = /use([A-Z][a-zA-Z]+)/g

  const responseComponents = [
    ...new Set([...response.matchAll(componentPattern)].map((m) => m[1])),
  ]
  const responseHooks = [
    ...new Set([...response.matchAll(hooksPattern)].map((m) => 'use' + m[1])),
  ]

  // Check if mentioned components/hooks appear in context
  for (const component of responseComponents) {
    if (!context.includes(component)) {
      warnings.push(
        `Component "${component}" not found in documentation context`
      )
    }
  }

  for (const hook of responseHooks) {
    if (!context.includes(hook)) {
      warnings.push(`Hook "${hook}" not found in documentation context`)
    }
  }

  // Check for hedging language (good signs)
  const hedgingPhrases = [
    "I don't have",
    'not in the documentation',
    'according to the documentation',
    'based on the provided context',
  ]
  const hasHedging = hedgingPhrases.some((phrase) =>
    response.toLowerCase().includes(phrase.toLowerCase())
  )

  if (
    !hasHedging &&
    responseComponents.length === 0 &&
    responseHooks.length === 0
  ) {
    warnings.push('Response lacks proper attribution or hedging language')
  }

  return {
    isLikelySafe: warnings.length === 0,
    warnings,
  }
}

// ============================================================================
// Exports
// ============================================================================

export const RAGPrompts = {
  system: RAG_SYSTEM_PROMPT,
  userTemplate: RAG_USER_PROMPT_TEMPLATE,
  fewShot: FEW_SHOT_EXAMPLES,
  codeFocused: CODE_FOCUSED_PROMPT,
  troubleshooting: TROUBLESHOOTING_PROMPT,
  comparison: COMPARISON_PROMPT,
}

export const RAGUtils = {
  formatConversationHistory,
  buildConversationRAGPrompt,
  formatSourcesForContext,
  prioritizeContext,
  estimateTokens,
  validateCitations,
  detectHallucination,
}
