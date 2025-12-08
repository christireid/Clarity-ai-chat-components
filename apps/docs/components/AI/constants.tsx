/**
 * DocsAssistant Constants
 *
 * Centralized configuration constants for the DocsAssistant component.
 */

import { Code2, Lightbulb, MessageSquare, Sparkles } from 'lucide-react'
import type { PromptSuggestion } from '@clarity-chat/react'
import { createSlideVariant, createFadeVariant } from '@clarity-chat/react'

// ============================================================================
// Storage Keys
// ============================================================================

export const SESSION_ID_KEY = 'clarity-docs-assistant-session-id'
export const MESSAGES_KEY = 'clarity-docs-assistant-messages'

// ============================================================================
// Timing Constants
// ============================================================================

export const CONVERSATION_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
export const STREAM_THROTTLE_MS = 50 // Throttle streaming updates
export const CLIPBOARD_TIMEOUT_MS = 2000 // Clipboard success display time
export const TOAST_DURATION_MS = 3000 // Toast notification duration
export const FOCUS_DELAY_MS = 100 // Delay before focusing input

// ============================================================================
// Streaming Retry Configuration
// ============================================================================

export const MAX_RETRY_ATTEMPTS = 3
export const INITIAL_RETRY_DELAY_MS = 1000
export const MAX_RETRY_DELAY_MS = 10000
export const RETRY_BACKOFF_MULTIPLIER = 2

// ============================================================================
// Token Tracking Constants
// ============================================================================

export const MODEL_MAX_TOKENS = 128000 // Claude/GPT-4 turbo context window
export const TOKEN_COST_PER_TOKEN = 0.000003 // Claude 3 Sonnet pricing
export const TOKEN_WARNING_THRESHOLD = 0.75 // Warn at 75% usage
export const TOKEN_CRITICAL_THRESHOLD = 0.9 // Critical at 90% usage

// ============================================================================
// Animation Variants
// ============================================================================

// Static animation variants using library utilities (outside component for performance)
export const BACKDROP_VARIANTS = createFadeVariant('fast', 'out')
export const DIALOG_VARIANTS_REDUCED = createFadeVariant('fast', 'out')
export const DIALOG_VARIANTS_NORMAL = createSlideVariant('up', 20, 'fast', 'out')

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
]

// ============================================================================
// Session ID Generation
// ============================================================================

export const generateSessionId = () =>
  `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
