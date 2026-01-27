'use client'

/**
 * Components Reference - Overview Page
 *
 * Lists all available components in the Clarity Chat library.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Box,
  ArrowRight,
  MessageSquare,
  Layout,
  Zap,
  Palette,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { durations } from '@/lib/animations'

interface ComponentInfo {
  name: string
  slug: string
  description: string
  category: string
  isNew?: boolean
  isExperimental?: boolean
}

const components: ComponentInfo[] = [
  // ====== CHAT COMPONENTS ======
  {
    name: 'ClarityChatApp',
    slug: 'clarity-chat-app',
    description:
      'The main drop-in component for AI chat. Handles streaming, memory, rate limiting, and more.',
    category: 'Chat',
  },
  {
    name: 'ClarityChat',
    slug: 'clarity-chat',
    description:
      'Full-featured chat component with advanced customization options.',
    category: 'Chat',
  },
  {
    name: 'ClarityChatSimple',
    slug: 'clarity-chat-simple',
    description: 'Simplified chat component for basic use cases.',
    category: 'Chat',
  },
  {
    name: 'ChatWindow',
    slug: 'chat-window',
    description:
      'The UI component for rendering chat messages with full customization.',
    category: 'Chat',
  },
  {
    name: 'ChatInput',
    slug: 'chat-input',
    description: 'Customizable input component for sending messages.',
    category: 'Chat',
  },
  {
    name: 'MobileChatWindow',
    slug: 'mobile-chat-window',
    description: 'Mobile-optimized chat interface with touch interactions.',
    category: 'Chat',
  },
  {
    name: 'ChatWithErrorBoundary',
    slug: 'chat-with-error-boundary',
    description: 'Chat component wrapped with error recovery.',
    category: 'Chat',
  },

  // ====== MESSAGE COMPONENTS ======
  {
    name: 'MessageList',
    slug: 'message-list',
    description: 'Scrollable list of chat messages.',
    category: 'Messages',
  },
  {
    name: 'VirtualizedMessageList',
    slug: 'virtualized-message-list',
    description: 'Performant virtualized message list for large conversations.',
    category: 'Messages',
  },
  {
    name: 'StreamingMessage',
    slug: 'streaming-message',
    description: 'Real-time streaming message with typewriter effect.',
    category: 'Messages',
  },
  {
    name: 'MessageThreadView',
    slug: 'message-thread-view',
    description: 'Threaded conversation view with branching support.',
    category: 'Messages',
  },

  // ====== INPUT COMPONENTS ======
  {
    name: 'AdvancedChatInput',
    slug: 'advanced-chat-input',
    description: 'Feature-rich input with mentions, file upload, and voice.',
    category: 'Input',
  },
  {
    name: 'VoiceInput',
    slug: 'voice-input',
    description: 'Voice-to-text input with audio recording.',
    category: 'Input',
  },
  {
    name: 'FileUpload',
    slug: 'file-upload',
    description: 'Drag-and-drop file upload with previews.',
    category: 'Input',
  },
  {
    name: 'MentionSystem',
    slug: 'mention-system',
    description: '@-mention autocomplete for users and entities.',
    category: 'Input',
  },
  {
    name: 'StructuredInputBuilder',
    slug: 'structured-input-builder',
    description: 'Build structured prompts with form fields.',
    category: 'Input',
  },
  {
    name: 'OutputPreferenceSelector',
    slug: 'output-preference-selector',
    description: 'Select preferred output format (markdown, JSON, etc.).',
    category: 'Input',
  },

  // ====== RENDERING COMPONENTS ======
  {
    name: 'MarkdownRenderer',
    slug: 'markdown-renderer',
    description: 'Enhanced markdown with syntax highlighting and LaTeX.',
    category: 'Rendering',
  },

  // ====== STREAMING COMPONENTS ======
  {
    name: 'StreamingProgress',
    slug: 'streaming-progress',
    description: 'Real-time progress indicator for streaming responses.',
    category: 'Streaming',
  },
  {
    name: 'StreamingCodeBlock',
    slug: 'streaming-code-block',
    description: 'Live syntax-highlighted code streaming.',
    category: 'Streaming',
  },
  {
    name: 'StreamingTextRenderer',
    slug: 'streaming-text-renderer',
    description: 'Smooth text streaming with typewriter animation.',
    category: 'Streaming',
  },

  // ====== TOKEN OPTIMIZATION ======
  {
    name: 'TokenUsageMeter',
    slug: 'token-usage-meter',
    description: 'Real-time token usage visualization.',
    category: 'Token Optimization',
  },
  {
    name: 'TokenBudgetBar',
    slug: 'token-budget-bar',
    description: 'Progress bar for token budget tracking.',
    category: 'Token Optimization',
  },
  {
    name: 'TokenOptimizationPanel',
    slug: 'token-optimization-panel',
    description: 'Control panel for token optimization settings.',
    category: 'Token Optimization',
  },
  {
    name: 'TokenOptimizationDashboard',
    slug: 'token-optimization-dashboard',
    description: 'Comprehensive dashboard for token analytics.',
    category: 'Token Optimization',
  },
  {
    name: 'TokenCostPreview',
    slug: 'token-cost-preview',
    description: 'Preview estimated costs before sending.',
    category: 'Token Optimization',
  },
  {
    name: 'TokenCounter',
    slug: 'token-counter',
    description: 'Simple token counter badge.',
    category: 'Token Optimization',
  },
  {
    name: 'TokenOptimizationBadge',
    slug: 'token-optimization-badge',
    description: 'Badge showing optimization status.',
    category: 'Token Optimization',
  },

  // ====== MEMORY COMPONENTS ======
  {
    name: 'MemoryActivityIndicator',
    slug: 'memory-activity-indicator',
    description: 'Visual indicator for memory operations.',
    category: 'Memory',
  },
  {
    name: 'MemoryInspector',
    slug: 'memory-inspector',
    description: 'Debug tool for inspecting conversation memory.',
    category: 'Memory',
  },

  // ====== NAVIGATION & COMMAND ======
  {
    name: 'CommandPalette',
    slug: 'command-palette',
    description: 'Quick action command palette (Cmd+K).',
    category: 'Navigation',
  },
  {
    name: 'CommandPaletteEnhanced',
    slug: 'command-palette-enhanced',
    description: 'Enhanced command palette with fuzzy search.',
    category: 'Navigation',
  },

  // ====== SEARCH COMPONENTS ======
  {
    name: 'MessageSearch',
    slug: 'message-search',
    description: 'Basic message search with keyword filtering.',
    category: 'Search',
  },
  {
    name: 'AdvancedMessageSearch',
    slug: 'advanced-message-search',
    description: 'Advanced search with filters and operators.',
    category: 'Search',
  },
  {
    name: 'AdvancedMessageSearchSemantic',
    slug: 'advanced-message-search-semantic',
    description: 'Semantic search with AI-powered relevance.',
    category: 'Search',
  },
  {
    name: 'SemanticMessageSearch',
    slug: 'semantic-message-search',
    description: 'Natural language semantic search.',
    category: 'Search',
  },
  {
    name: 'SearchFiltersPanel',
    slug: 'search-filters-panel',
    description: 'Filter panel for search refinement.',
    category: 'Search',
  },
  {
    name: 'SearchResultsSummary',
    slug: 'search-results-summary',
    description: 'Summary of search results with statistics.',
    category: 'Search',
  },
  {
    name: 'SavedSearchesPanel',
    slug: 'saved-searches-panel',
    description: 'Save and manage frequently used searches.',
    category: 'Search',
  },

  // ====== PROMPT COMPONENTS ======
  {
    name: 'PromptLibrary',
    slug: 'prompt-library',
    description: 'Browse and select from saved prompts.',
    category: 'Prompts',
  },
  {
    name: 'TemplateMarketplace',
    slug: 'template-marketplace',
    description: 'Discover and install prompt templates.',
    category: 'Prompts',
  },
  {
    name: 'PromptVariablesEditor',
    slug: 'prompt-variables-editor',
    description: 'Edit variables in prompt templates.',
    category: 'Prompts',
  },

  // ====== CONVERSATION COMPONENTS ======
  {
    name: 'ConversationTimeline',
    slug: 'conversation-timeline',
    description: 'Timeline view of conversation history.',
    category: 'Conversation',
  },
  {
    name: 'ConversationList',
    slug: 'conversation-list',
    description: 'List of all conversations with search.',
    category: 'Conversation',
  },

  // ====== THEME COMPONENTS ======
  {
    name: 'ThemeSwitcher',
    slug: 'theme-switcher',
    description: 'Toggle between light/dark/system themes.',
    category: 'Theming',
  },
  {
    name: 'ThemeSelector',
    slug: 'theme-selector',
    description: 'Select from multiple theme presets.',
    category: 'Theming',
  },
  {
    name: 'ThemeCustomizer',
    slug: 'theme-customizer',
    description: 'Customize theme colors and settings.',
    category: 'Theming',
  },
  {
    name: 'ThemePreview',
    slug: 'theme-preview',
    description: 'Preview theme changes in real-time.',
    category: 'Theming',
  },
]

const categories = [...new Set(components.map((c) => c.category))]

export default function ComponentsReferencePage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Box className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-sm text-muted-foreground">API Reference</span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Components
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore the full library of React components for building AI chat
            interfaces. From simple drop-in solutions to fully customizable
            building blocks.
          </p>
        </motion.header>

        {/* Category sections */}
        <div className="space-y-12">
          {categories.map((category) => (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {category}
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {components
                  .filter((c) => c.category === category)
                  .map((component, index) => (
                    <Link
                      key={component.slug}
                      href={`/reference/components/${component.slug}`}
                      className={cn(
                        'group relative rounded-xl border bg-card text-card-foreground p-6',
                        'shadow-sm hover:shadow-lg transition-all duration-300',
                        'border-border/50 hover:border-brand-500/30',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                      )}
                    >
                      {/* Gradient glow on hover */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {component.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {component.isNew && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                New
                              </span>
                            )}
                            {component.isExperimental && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                Beta
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {component.description}
                        </p>

                        <div className="flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                          View documentation
                          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  )
}
