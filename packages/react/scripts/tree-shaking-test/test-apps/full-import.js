/**
 * Full import test: Import everything (anti-pattern)
 * Expected: Largest bundle, includes everything
 * This is the baseline worst-case scenario
 */
import * as Clarity from '@clarity-ai/react'

// Use various exports to prevent DCE
const components = [
  Clarity.ClarityChat,
  Clarity.ChatInput,
  Clarity.FollowUpSuggestions,
  Clarity.ThemeCustomizer,
  Clarity.CodeBlock,
]

const hooks = [
  Clarity.useClarityChat,
  Clarity.useAutoScroll,
  Clarity.useTokenLimitGuard,
]

const utils = [Clarity.sanitizeInput, Clarity.formatTokenCount]

console.log('Components:', components.length)
console.log('Hooks:', hooks.length)
console.log('Utils:', utils.length)

export { components, hooks, utils }
