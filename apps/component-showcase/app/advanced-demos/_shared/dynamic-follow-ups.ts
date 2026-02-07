import type { PromptSuggestion } from '@clarity-chat/react'
import type { HookMessage } from './types'
import { getTextContent } from './types'

/**
 * Derives context-aware follow-up suggestions from the last assistant message.
 * Falls back to the provided defaults if no meaningful content is available.
 */
export function deriveFollowUpSuggestions(
  messages: HookMessage[],
  defaults: PromptSuggestion[]
): PromptSuggestion[] {
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant')
  if (!lastAssistant) return defaults

  const text = getTextContent(lastAssistant.content).toLowerCase()

  const suggestions: PromptSuggestion[] = []

  // Detect code content
  if (
    text.includes('```') ||
    text.includes('function ') ||
    text.includes('import ')
  ) {
    suggestions.push({
      id: 'explain-code',
      text: 'Explain this code step by step',
      type: 'follow-up',
    })
    suggestions.push({
      id: 'add-tests',
      text: 'How would I test this?',
      type: 'follow-up',
    })
  }

  // Detect comparison or list content
  if (
    text.includes('vs') ||
    text.includes('compare') ||
    text.includes('difference')
  ) {
    suggestions.push({
      id: 'deeper-comparison',
      text: 'Which approach do you recommend and why?',
      type: 'follow-up',
    })
  }

  // Detect API/component documentation
  if (
    text.includes('props') ||
    text.includes('interface') ||
    text.includes('api')
  ) {
    suggestions.push({
      id: 'show-example',
      text: 'Show me a complete usage example',
      type: 'follow-up',
    })
  }

  // Detect step-by-step or how-to content
  if (
    text.includes('step') ||
    text.includes('first') ||
    text.includes('then')
  ) {
    suggestions.push({
      id: 'common-mistakes',
      text: 'What are common mistakes to avoid?',
      type: 'follow-up',
    })
  }

  // Always include a generic follow-up
  suggestions.push({
    id: 'dive-deeper',
    text: 'Tell me more about this',
    type: 'follow-up',
  })

  // Return at most 3
  return suggestions.slice(0, 3)
}
