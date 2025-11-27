'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'
import { Skeleton, SkeletonText } from './skeleton'

/**
 * Summary detail level
 */
export type SummaryLevel = 'brief' | 'detailed' | 'comprehensive'

/**
 * Summarization configuration
 */
export interface SummarizationConfig {
  /** When to trigger summary generation */
  trigger: 'manual' | 'auto' | 'interval'
  /** Interval for auto-generation (number of messages or milliseconds) */
  interval?: number
  /** Available summary levels */
  levels: SummaryLevel[]
  /** LLM provider for summarization */
  provider: {
    type: 'openai' | 'anthropic' | 'cohere' | 'custom'
    model: string
    apiKey?: string
    endpoint?: string
  }
  /** Include action items in summary */
  includeActionItems: boolean
  /** Include key topics in summary */
  includeKeyTopics: boolean
  /** Include code snippets in summary */
  includeCodeSnippets?: boolean
  /** Maximum summary length (in words) */
  maxLength?: {
    brief: number
    detailed: number
    comprehensive: number
  }
}

/**
 * Generated conversation summary
 */
export interface ConversationSummary {
  id: string
  level: SummaryLevel
  content: string
  keyTopics?: string[]
  actionItems?: string[]
  codeSnippets?: Array<{
    language: string
    code: string
    description: string
  }>
  messageRange: {
    start: number
    end: number
    totalMessages: number
  }
  timestamp: number
  tokenCount?: number
  generationTime?: number
}

/**
 * Props for ConversationSummarizer component
 */
export interface ConversationSummarizerProps {
  /** Messages to summarize */
  messages: Message[]
  /** Summarization configuration */
  config?: Partial<SummarizationConfig>
  /** Callback when summary is generated */
  onSummaryGenerated?: (summary: ConversationSummary) => void
  /** Callback for custom summarization logic */
  onGenerateSummary?: (
    messages: Message[],
    level: SummaryLevel
  ) => Promise<ConversationSummary>
  /** Show history of generated summaries */
  showHistory?: boolean
  /** Default summary level */
  defaultLevel?: SummaryLevel
  /** Custom empty state */
  emptyState?: React.ReactNode
  className?: string
}

const defaultConfig: SummarizationConfig = {
  trigger: 'manual',
  interval: 10, // Every 10 messages
  levels: ['brief', 'detailed', 'comprehensive'],
  provider: {
    type: 'openai',
    model: 'gpt-4o',
  },
  includeActionItems: true,
  includeKeyTopics: true,
  includeCodeSnippets: false,
  maxLength: {
    brief: 50,
    detailed: 200,
    comprehensive: 500,
  },
}

/**
 * ConversationSummarizer Component
 *
 * Generates AI-powered summaries of conversations at different detail levels.
 * Supports automatic, interval-based, and manual summary generation.
 *
 * Features:
 * - Multi-level summaries (brief, detailed, comprehensive)
 * - Key topics extraction
 * - Action items identification
 * - Code snippet extraction
 * - Summary history tracking
 * - Export functionality
 *
 * @example
 * ```tsx
 * <ConversationSummarizer
 *   messages={messages}
 *   config={{
 *     trigger: 'manual',
 *     provider: { type: 'openai', model: 'gpt-4o' },
 *     includeActionItems: true,
 *     includeKeyTopics: true,
 *   }}
 *   onSummaryGenerated={(summary) => {
 *     console.log('Summary:', summary.content)
 *   }}
 * />
 * ```
 */
export function ConversationSummarizer({
  messages,
  config: userConfig,
  onSummaryGenerated,
  onGenerateSummary,
  showHistory = true,
  defaultLevel = 'detailed',
  emptyState,
  className,
}: ConversationSummarizerProps) {
  const config = { ...defaultConfig, ...userConfig }

  const [currentSummary, setCurrentSummary] = React.useState<ConversationSummary | null>(null)
  const [summaryHistory, setSummaryHistory] = React.useState<ConversationSummary[]>([])
  const [selectedLevel, setSelectedLevel] = React.useState<SummaryLevel>(defaultLevel)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  /**
   * Generate summary using built-in logic (fallback)
   */
  const generateSummaryFallback = React.useCallback(
    async (msgs: Message[], level: SummaryLevel): Promise<ConversationSummary> => {
      // Simple rule-based summarization as fallback
      // In production, this would call an LLM API

      const userMessages = msgs.filter((m) => m.role === 'user')
      const assistantMessages = msgs.filter((m) => m.role === 'assistant')

      // Extract key topics (simple keyword extraction)
      const allContent = msgs.map((m) => m.content.toLowerCase()).join(' ')
      const keywords = allContent
        .split(/\s+/)
        .filter((word) => word.length > 5)
        .reduce(
          (acc, word) => {
            acc[word] = (acc[word] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        )

      const keyTopics = Object.entries(keywords)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word)

      // Extract action items (simple pattern matching)
      const actionItems: string[] = []
      msgs.forEach((msg) => {
        const content = msg.content
        const patterns = [
          /(?:I will|I'll|I should|I need to|TODO:|Action:)\s+([^.!?\n]+)/gi,
          /(?:Next step:?|Following:?|Then:?)\s+([^.!?\n]+)/gi,
        ]
        patterns.forEach((pattern) => {
          const matches = content.matchAll(pattern)
          for (const match of matches) {
            if (match[1]) actionItems.push(match[1].trim())
          }
        })
      })

      // Extract code snippets
      const codeSnippets: ConversationSummary['codeSnippets'] = []
      if (config.includeCodeSnippets) {
        const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g
        msgs.forEach((msg) => {
          const matches = msg.content.matchAll(codeBlockPattern)
          for (const match of matches) {
            const codeContent = match[2]
            if (codeContent) {
              codeSnippets.push({
                language: match[1] || 'plaintext',
                code: codeContent.trim(),
                description: 'Code snippet from conversation',
              })
            }
          }
        })
      }

      // Generate summary content based on level
      let summaryContent = ''
      const maxLength = config.maxLength?.[level] || 200

      if (level === 'brief') {
        summaryContent = `Conversation with ${userMessages.length} user messages and ${assistantMessages.length} assistant responses. `
        if (keyTopics.length > 0) {
          summaryContent += `Main topics: ${keyTopics.slice(0, 3).join(', ')}.`
        }
      } else if (level === 'detailed') {
        summaryContent = `This conversation covered ${msgs.length} messages exchanged between the user and assistant. `
        summaryContent += `The user asked about ${keyTopics.slice(0, 3).join(', ')}. `
        if (actionItems.length > 0) {
          summaryContent += `Key action items identified: ${actionItems.slice(0, 2).join('; ')}. `
        }
        summaryContent += `The assistant provided ${assistantMessages.length} detailed responses addressing these topics.`
      } else {
        // comprehensive
        summaryContent = `Comprehensive Summary:\n\n`
        summaryContent += `This conversation consisted of ${msgs.length} messages (${userMessages.length} from user, ${assistantMessages.length} from assistant).\n\n`
        summaryContent += `Topics Covered:\n${keyTopics.map((t) => `- ${t}`).join('\n')}\n\n`
        if (actionItems.length > 0) {
          summaryContent += `Action Items:\n${actionItems.map((a) => `- ${a}`).join('\n')}\n\n`
        }
        if (codeSnippets.length > 0) {
          summaryContent += `Code Examples: ${codeSnippets.length} code snippets were shared.\n\n`
        }
        summaryContent += `The conversation explored these topics in depth, with the assistant providing detailed explanations and examples.`
      }

      // Truncate if needed
      const words = summaryContent.split(/\s+/)
      if (words.length > maxLength) {
        summaryContent = words.slice(0, maxLength).join(' ') + '...'
      }

      return {
        id: `summary-${Date.now()}`,
        level,
        content: summaryContent,
        keyTopics: config.includeKeyTopics ? keyTopics : undefined,
        actionItems: config.includeActionItems ? actionItems.slice(0, 5) : undefined,
        codeSnippets: config.includeCodeSnippets ? codeSnippets.slice(0, 3) : undefined,
        messageRange: {
          start: 0,
          end: msgs.length - 1,
          totalMessages: msgs.length,
        },
        timestamp: Date.now(),
        generationTime: 500,
      }
    },
    [config.maxLength, config.includeActionItems, config.includeKeyTopics, config.includeCodeSnippets]
  )

  /**
   * Generate summary
   */
  const generateSummary = React.useCallback(
    async (level: SummaryLevel) => {
      if (messages.length === 0) {
        setError('No messages to summarize')
        return
      }

      setIsGenerating(true)
      setError(null)

      const startTime = Date.now()

      try {
        let summary: ConversationSummary

        if (onGenerateSummary) {
          // Use custom summarization logic
          summary = await onGenerateSummary(messages, level)
        } else {
          // Use fallback logic
          summary = await generateSummaryFallback(messages, level)
        }

        summary.generationTime = Date.now() - startTime

        setCurrentSummary(summary)
        setSummaryHistory((prev) => [summary, ...prev].slice(0, 10)) // Keep last 10

        onSummaryGenerated?.(summary)
      } catch (err) {
        console.error('Failed to generate summary:', err)
        setError(err instanceof Error ? err.message : 'Failed to generate summary')
      } finally {
        setIsGenerating(false)
      }
    },
    [messages, onGenerateSummary, generateSummaryFallback, onSummaryGenerated]
  )

  /**
   * Auto-generate summary based on interval
   */
  React.useEffect(() => {
    if (config.trigger === 'auto' || config.trigger === 'interval') {
      const interval = config.interval || 10
      const shouldGenerate = messages.length > 0 && messages.length % interval === 0

      if (shouldGenerate) {
        generateSummary(selectedLevel)
      }
    }
  }, [messages.length, config.trigger, config.interval, selectedLevel, generateSummary])

  /**
   * Export summary
   */
  const exportSummary = React.useCallback((summary: ConversationSummary) => {
    const text = `
# Conversation Summary (${summary.level})
Generated: ${new Date(summary.timestamp).toLocaleString()}

${summary.content}

${
  summary.keyTopics && summary.keyTopics.length > 0
    ? `\n## Key Topics\n${summary.keyTopics.map((t) => `- ${t}`).join('\n')}`
    : ''
}

${
  summary.actionItems && summary.actionItems.length > 0
    ? `\n## Action Items\n${summary.actionItems.map((a) => `- ${a}`).join('\n')}`
    : ''
}

${
  summary.codeSnippets && summary.codeSnippets.length > 0
    ? `\n## Code Snippets\n${summary.codeSnippets.map((s, i) => `\n### Snippet ${i + 1} (${s.language})\n\`\`\`${s.language}\n${s.code}\n\`\`\``).join('\n')}`
    : ''
}

---
Messages: ${summary.messageRange.totalMessages}
Generation Time: ${summary.generationTime}ms
    `.trim()

    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-summary-${summary.id}.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  // Empty state
  if (messages.length === 0) {
    if (emptyState) return <>{emptyState}</>
    return (
      <Card className={cn('shadow-sm', className)}>
        <CardContent className="p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Start a conversation to generate summaries
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Controls */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <CardTitle className="text-base">Conversation Summary</CardTitle>
                <CardDescription className="text-xs">
                  {messages.length} messages • Generate AI-powered summaries
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary">{config.trigger}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Level selection */}
          <div className="flex flex-wrap gap-2">
            {config.levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel(level)}
                disabled={isGenerating}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>

          {/* Generate button */}
          <Button
            onClick={() => generateSummary(selectedLevel)}
            disabled={isGenerating || messages.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <motion.div
                  className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Generating...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Current Summary */}
      <AnimatePresence mode="wait">
        {currentSummary && (
          <motion.div
            key={currentSummary.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{currentSummary.level}</Badge>
                      <Badge variant="outline">
                        {new Date(currentSummary.timestamp).toLocaleTimeString()}
                      </Badge>
                      {currentSummary.generationTime && (
                        <Badge variant="secondary">{currentSummary.generationTime}ms</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => exportSummary(currentSummary)}
                    aria-label="Export summary"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm leading-relaxed text-foreground">
                    {currentSummary.content}
                  </p>
                </div>

                {/* Key Topics */}
                {currentSummary.keyTopics && currentSummary.keyTopics.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-foreground">Key Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentSummary.keyTopics.map((topic, i) => (
                        <Badge key={i} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Items */}
                {currentSummary.actionItems && currentSummary.actionItems.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-foreground">Action Items</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {currentSummary.actionItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Code Snippets */}
                {currentSummary.codeSnippets && currentSummary.codeSnippets.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-foreground">
                      Code Snippets ({currentSummary.codeSnippets.length})
                    </h4>
                    <div className="text-xs text-muted-foreground">
                      View code examples in the conversation above
                    </div>
                  </div>
                )}

                {/* Message range */}
                <div className="text-xs text-muted-foreground border-t pt-3">
                  Summarizes messages {currentSummary.messageRange.start + 1} -{' '}
                  {currentSummary.messageRange.end + 1} of{' '}
                  {currentSummary.messageRange.totalMessages}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {isGenerating && !currentSummary && (
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <Skeleton width="100%" height={20} />
            <SkeletonText lines={4} />
            <div className="flex gap-2">
              <Skeleton width={80} height={24} rounded="full" />
              <Skeleton width={80} height={24} rounded="full" />
              <Skeleton width={80} height={24} rounded="full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary History */}
      {showHistory && summaryHistory.length > 1 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Summary History</CardTitle>
            <CardDescription className="text-xs">
              {summaryHistory.length} previous summaries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {summaryHistory.slice(1, 4).map((summary) => (
              <motion.button
                key={summary.id}
                className="w-full text-left rounded-lg border p-3 hover:bg-accent transition-colors"
                onClick={() => setCurrentSummary(summary)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">
                    {summary.level}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(summary.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {summary.content}
                </p>
              </motion.button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

ConversationSummarizer.displayName = 'ConversationSummarizer'
