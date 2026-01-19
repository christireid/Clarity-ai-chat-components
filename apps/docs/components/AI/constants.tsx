/**
 * DocsAssistant Constants
 *
 * Centralized configuration constants for the DocsAssistant component.
 */

import { Code2, Lightbulb, MessageSquare, Sparkles } from 'lucide-react'
import type { PromptSuggestion } from '@clarity-chat/react'
import {
  createSlideVariant,
  createFadeVariant,
} from '@clarity-chat/react'

// ============================================================================
// Storage Keys
// ============================================================================

export const SESSION_ID_KEY = 'clarity-docs-assistant-session-id'
export const MESSAGES_KEY = 'clarity-docs-assistant-messages'

// ============================================================================
// Timing Constants (re-exported from lib for backward compatibility)
// ============================================================================

export {
  CONVERSATION_TTL_MS,
  STREAM_THROTTLE_MS,
  CLIPBOARD_TIMEOUT_MS,
  TOAST_DURATION_MS,
  FOCUS_DELAY_MS,
  MAX_RETRY_ATTEMPTS,
  INITIAL_RETRY_DELAY_MS,
  MAX_RETRY_DELAY_MS,
  RETRY_BACKOFF_MULTIPLIER,
  MODEL_MAX_TOKENS,
  TOKEN_COST_PER_TOKEN,
  TOKEN_WARNING_THRESHOLD,
  TOKEN_CRITICAL_THRESHOLD,
} from '@/lib/timing-constants'

// ============================================================================
// Animation Variants
// ============================================================================

// Static animation variants using library utilities (outside component for performance)
export const BACKDROP_VARIANTS = createFadeVariant('fast', 'out')
export const DIALOG_VARIANTS_REDUCED = createFadeVariant('fast', 'out')
export const DIALOG_VARIANTS_NORMAL = createSlideVariant(
  'up',
  20,
  'fast',
  'out'
)

// ============================================================================
// Starter Prompts
// ============================================================================

// Suggested questions to help users get started (using library PromptSuggestion type)
export const DOCS_STARTER_PROMPTS: PromptSuggestion[] = [
  {
    id: 'getting-started',
    text: 'How do I get started with Clarity Chat?',
    label: 'Get Started',
    description: 'Learn the basics of installation and setup',
    icon: <Sparkles className="w-4 h-4" />,
    type: 'starter',
    category: 'Setup',
    keywords: ['installation', 'setup', 'quickstart'],
  },
  {
    id: 'streaming',
    text: 'How do I implement streaming messages?',
    label: 'Streaming',
    description: 'Add real-time streaming to your chat interface',
    icon: <MessageSquare className="w-4 h-4" />,
    type: 'starter',
    category: 'Features',
    keywords: ['streaming', 'real-time', 'SSE'],
  },
  {
    id: 'components',
    text: 'What components are available?',
    label: 'Components',
    description: 'Explore all available UI components',
    icon: <Code2 className="w-4 h-4" />,
    type: 'starter',
    category: 'Reference',
    keywords: ['components', 'ui', 'reference'],
  },
  {
    id: 'theming',
    text: 'How do I customize the theme?',
    label: 'Theming',
    description: 'Learn about theming and customization options',
    icon: <Lightbulb className="w-4 h-4" />,
    type: 'starter',
    category: 'Customization',
    keywords: ['theme', 'customize', 'styling'],
  },
  {
    id: 'hooks',
    text: 'What hooks are available for chat functionality?',
    label: 'Hooks',
    description: 'Discover 95+ custom hooks for advanced features',
    icon: <Code2 className="w-4 h-4" />,
    type: 'starter',
    category: 'Reference',
    keywords: ['hooks', 'useChat', 'useStreaming', 'state'],
  },
  {
    id: 'examples',
    text: 'Show me some example implementations',
    label: 'Examples',
    description: 'Browse 30+ production-ready examples',
    icon: <Lightbulb className="w-4 h-4" />,
    type: 'starter',
    category: 'Examples',
    keywords: ['examples', 'demos', 'code', 'samples'],
  },
  {
    id: 'memory',
    text: 'How do I manage conversation memory?',
    label: 'Memory',
    description: 'Implement long-term conversation persistence',
    icon: <MessageSquare className="w-4 h-4" />,
    type: 'starter',
    category: 'Features',
    keywords: ['memory', 'persistence', 'history', 'context'],
  },
  {
    id: 'tokens',
    text: 'How can I optimize token usage and costs?',
    label: 'Token Optimization',
    description: 'Learn about cost reduction strategies',
    icon: <Sparkles className="w-4 h-4" />,
    type: 'starter',
    category: 'Advanced',
    keywords: ['tokens', 'cost', 'optimization', 'budget'],
  },
]

// ============================================================================
// Session ID Generation
// ============================================================================

/**
 * Generate a unique session ID
 * Uses substring() instead of deprecated substr()
 */
export const generateSessionId = (): string =>
  `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
