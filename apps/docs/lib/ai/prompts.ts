/**
 * AI System Prompts for Documentation Assistant
 *
 * These prompts define the personality, behavior, and capabilities
 * of the Clarity Chat Documentation Assistant.
 *
 * This module integrates the comprehensive system prompt from the
 * systemPrompt module with contextual enhancements and personality modes.
 */

import {
  DOCS_ASSISTANT_SYSTEM_PROMPT,
  getSystemPromptWithPersonality,
  DOC_LINKS,
  type PersonalityMode,
} from '@/components/AI/systemPrompt'

// Re-export types for consumers
export type { PersonalityMode }

/**
 * Default system prompt - uses the comprehensive DocsAssistant prompt
 */
export const SYSTEM_PROMPT = DOCS_ASSISTANT_SYSTEM_PROMPT

/**
 * Prompt version for tracking and A/B testing
 * @changelog
 * - 2.1.0 (Dec 2025): Added token counting utilities, required tokenEstimate
 * - 2.0.0 (Dec 2025): Added XML structure, KV-cache optimization
 * - 1.0.0 (Oct 2025): Initial version
 */
export const PROMPT_VERSION = '2.1.0'

/**
 * Legacy prompt preserved for rollback if needed
 * @deprecated Use SYSTEM_PROMPT instead
 */
export const LEGACY_SYSTEM_PROMPT = `You are the Clarity Chat Documentation Assistant, a helpful AI that assists developers using the Clarity Chat component library.

## Your Role
You help developers understand and implement Clarity Chat components in their projects. You have access to the complete Clarity Chat documentation including:
- All component APIs, props, and usage examples
- Hooks and utilities documentation
- Best practices and patterns
- Cookbook recipes and guides
- Troubleshooting information

## Personality & Communication Style
- **Friendly and enthusiastic**: You love helping developers build great chat interfaces
- **Professional but not robotic**: Use natural, conversational language
- **Use emojis occasionally**: When appropriate, but not excessively (max 2-3 per response)
- **Be honest about limitations**: If you're unsure or the docs don't cover something, say so
- **Ask clarifying questions**: When the user's request is ambiguous

## Response Guidelines

### Always Include:
1. **Working code examples** from the documentation
2. **Links to relevant docs pages** using markdown format: [Text](/path)
3. **TypeScript types** when showing code
4. **Import statements** at the top of code examples

### Code Example Format:
\`\`\`tsx
import { ComponentName } from '@clarity-chat/react'

function Example() {
  // Working example from docs
  return <ComponentName prop="value" />
}
\`\`\`

Remember: You're here to make developers successful with Clarity Chat. Be helpful, accurate, and encouraging! 🚀`

export const GREETING_PROMPT = `Welcome! 👋 I'm your Clarity Chat Documentation Assistant.

I'm here to help you with:
- 🎨 Component APIs and usage examples
- 🪝 Hooks and utilities
- 📚 Best practices and patterns
- 🔧 Troubleshooting and debugging
- 💡 Architecture and design guidance

Ask me anything about Clarity Chat, or try one of the suggestions below!`

export const ERROR_PROMPT = `I encountered an issue while processing your request. This could be due to:
- Temporary connectivity issues
- Rate limiting
- An unexpected error

Please try again in a moment. If the problem persists, you can:
- Check the [documentation](/learn/quick-start) directly
- Visit our [GitHub repository](https://github.com/christireid/Clarity-ai-chat-components) for support
- Report issues in our issue tracker

I apologize for the inconvenience! 🙏`

export const RATE_LIMIT_PROMPT = `I'm receiving too many requests right now and need a brief moment to catch up. ⏳

Please wait a few seconds and try again. In the meantime, you might find what you're looking for in:
- [Quick Start Guide](/guides/quick-start)
- [Component Reference](/reference/components)
- [Examples](/examples)

Thank you for your patience!`

/**
 * Context additions for different page types
 */
const PAGE_CONTEXT_MAP: Record<string, string> = {
  '/reference/components':
    '\n\n**Current Context:** The user is viewing component documentation. Focus on practical usage examples, prop details, and API specifics. Suggest related components when relevant.',
  '/reference/hooks':
    '\n\n**Current Context:** The user is viewing hook documentation. Focus on hook usage patterns, return values, and integration examples. Mention React 19 compatibility.',
  '/guides':
    '\n\n**Current Context:** The user is viewing guides. Focus on step-by-step instructions, best practices, and complete implementations. Link to related guides.',
  '/examples':
    '\n\n**Current Context:** The user is viewing examples. Focus on explaining the implementation details and suggesting variations or extensions.',
  '/cookbook':
    '\n\n**Current Context:** The user is viewing cookbook recipes. Focus on complete, production-ready patterns and real-world use cases.',
  '/learn':
    '\n\n**Current Context:** The user is in the learning section. Provide beginner-friendly explanations with progressive complexity.',
  '/playground':
    '\n\n**Current Context:** The user is in the playground. Help them experiment with code and understand how changes affect the output.',
}

/**
 * Suggested links based on current page context
 */
const CONTEXTUAL_LINKS: Record<
  string,
  Array<{ label: string; path: string }>
> = {
  '/reference/components': [
    { label: 'Component Reference', path: DOC_LINKS.components },
    { label: 'Hooks Reference', path: DOC_LINKS.hooks },
    { label: 'Customization Guide', path: DOC_LINKS.customization },
  ],
  '/reference/hooks': [
    { label: 'Hooks Reference', path: DOC_LINKS.hooks },
    { label: 'State Management', path: DOC_LINKS.stateManagement },
    { label: 'Performance Tips', path: DOC_LINKS.performance },
  ],
  '/guides': [
    { label: 'All Guides', path: '/guides' },
    { label: 'Best Practices', path: DOC_LINKS.bestPractices },
    { label: 'Examples', path: DOC_LINKS.examples },
  ],
  '/examples': [
    { label: 'Examples Gallery', path: DOC_LINKS.examples },
    { label: 'Cookbook', path: DOC_LINKS.cookbook },
    { label: 'Playground', path: DOC_LINKS.playground },
  ],
  '/cookbook': [
    { label: 'Cookbook', path: DOC_LINKS.cookbook },
    { label: 'Best Practices', path: DOC_LINKS.bestPractices },
    { label: 'Examples', path: DOC_LINKS.examples },
  ],
}

/**
 * Get contextual links based on current page
 */
export function getContextualLinks(
  currentPath: string
): Array<{ label: string; path: string }> {
  for (const [prefix, links] of Object.entries(CONTEXTUAL_LINKS)) {
    if (currentPath.startsWith(prefix)) {
      return links
    }
  }
  // Default links
  return [
    { label: 'Quick Start', path: DOC_LINKS.quickStart },
    { label: 'Components', path: DOC_LINKS.components },
    { label: 'Examples', path: DOC_LINKS.examples },
  ]
}

/**
 * Generate a contextual system prompt based on the current page
 */
export function getContextualPrompt(currentPath: string): string {
  let contextAddition = ''

  for (const [prefix, context] of Object.entries(PAGE_CONTEXT_MAP)) {
    if (currentPath.startsWith(prefix)) {
      contextAddition = context
      break
    }
  }

  return SYSTEM_PROMPT + contextAddition
}

/**
 * Generate a system prompt with both context and personality mode
 *
 * @param currentPath - Current page path for contextual hints
 * @param personality - Personality mode (technical, friendly, concise)
 */
export function getPromptWithContextAndPersonality(
  currentPath: string,
  personality: PersonalityMode = 'friendly'
): string {
  let contextAddition = ''

  for (const [prefix, context] of Object.entries(PAGE_CONTEXT_MAP)) {
    if (currentPath.startsWith(prefix)) {
      contextAddition = context
      break
    }
  }

  return getSystemPromptWithPersonality(personality) + contextAddition
}

/**
 * Get prompt by version (for A/B testing or rollback)
 */
export function getPromptByVersion(version: string): string {
  switch (version) {
    case '2.0.0':
      return SYSTEM_PROMPT
    case '1.0.0':
      return LEGACY_SYSTEM_PROMPT
    default:
      return SYSTEM_PROMPT
  }
}

/**
 * Format sources/citations for RAG responses
 */
export function formatSources(
  sources: Array<{ title: string; url: string; excerpt: string }>
): string {
  if (!Array.isArray(sources) || sources.length === 0) return ''

  const formatted = sources
    .filter((s) => s && s.title && s.url)
    .map((source, index) => `${index + 1}. [${source.title}](${source.url})`)
    .join('\n')

  return formatted ? `\n\n📚 **Sources:**\n${formatted}` : ''
}
