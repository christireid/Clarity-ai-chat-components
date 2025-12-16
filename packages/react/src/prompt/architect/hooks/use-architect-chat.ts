import { logger } from '@clarity-chat/utils/logger';
/**
 * useArchitectChat Hook
 *
 * React hook that integrates the architect workflow with useClarityChat
 * for AI-powered software engineering conversations.
 *
 * @packageDocumentation
 */

import { useCallback, useMemo, useState } from 'react'
import { useClarityChat, type UseClarityChatOptions } from '../../../hooks/use-clarity-chat'
import { useArchitectWorkflow, type UseArchitectWorkflowOptions } from './use-architect-workflow'
import { renderMasterSystemPrompt, ARCHITECT_RECIPES, getArchitectRecipe } from '../master-prompt'
import type {
  ArchitectConfig,
  ArchitectPhase,
  AuditResult,
  StrategicPlan,
  ReviewResult,
} from '../types'
import { DEFAULT_ARCHITECT_CONFIG } from '../types'

/**
 * Parsed response block from AI
 */
export interface ParsedResponseBlock {
  type: 'planning' | 'code' | 'review' | 'adr' | 'text'
  content: string
  language?: string
}

/**
 * Recipe types for architect chat
 */
export type ArchitectRecipeType =
  | 'masterArchitect'
  | 'securityAuditor'
  | 'refactoringSpecialist'
  | 'architectureReviewer'
  | 'testEngineer'

/**
 * Options for the architect chat hook
 */
export interface UseArchitectChatOptions {
  /** Chat API endpoint */
  api: string
  /** Recipe to use (default: masterArchitect) */
  recipe?: ArchitectRecipeType
  /** Custom system prompt (overrides recipe) */
  customSystemPrompt?: string
  /** Architect configuration */
  architectConfig?: Partial<ArchitectConfig>
  /** Workflow callbacks */
  workflow?: UseArchitectWorkflowOptions
  /** Additional chat options */
  chatOptions?: Omit<UseClarityChatOptions, 'api' | 'systemPrompt'>
  /** Auto-parse response blocks */
  autoParseBlocks?: boolean
  /** Callback when blocks are parsed */
  onBlocksParsed?: (blocks: ParsedResponseBlock[]) => void
}

/**
 * Return type for the architect chat hook
 */
export interface UseArchitectChatReturn {
  // Chat functionality
  /** All messages in the conversation */
  messages: ReturnType<typeof useClarityChat>['messages']
  /** Send a message to the AI */
  sendMessage: (content: string) => Promise<void>
  /** Clear the conversation */
  clearMessages: () => void
  /** Whether the AI is currently responding */
  isLoading: boolean
  /** Any error that occurred */
  error: Error | null

  // Workflow state
  /** Current workflow phase */
  currentPhase: ArchitectPhase
  /** Workflow progress (0-100) */
  progress: number
  /** Whether workflow is complete */
  isComplete: boolean

  // Workflow actions
  /** Reset the workflow and conversation */
  reset: () => void
  /** Mark current phase as complete and advance */
  advancePhase: () => void

  // Parsed content
  /** Last parsed response blocks */
  lastParsedBlocks: ParsedResponseBlock[]
  /** Extract planning blocks from messages */
  getPlanningBlocks: () => ParsedResponseBlock[]
  /** Extract code blocks from messages */
  getCodeBlocks: () => ParsedResponseBlock[]
  /** Extract review blocks from messages */
  getReviewBlocks: () => ParsedResponseBlock[]

  // Recipe management
  /** Current recipe being used */
  currentRecipe: ArchitectRecipeType
  /** Switch to a different recipe */
  switchRecipe: (recipe: ArchitectRecipeType) => void

  // Raw access
  /** Full chat hook return for advanced usage */
  chat: ReturnType<typeof useClarityChat>
  /** Full workflow hook return for advanced usage */
  workflow: ReturnType<typeof useArchitectWorkflow>
}

/**
 * Parse XML-like blocks from AI response
 */
export function parseResponseBlocks(content: string): ParsedResponseBlock[] {
  const blocks: ParsedResponseBlock[] = []

  // Match <PLANNING>...</PLANNING>
  const planningRegex = /<PLANNING>([\s\S]*?)<\/PLANNING>/gi
  let match: RegExpExecArray | null
  while ((match = planningRegex.exec(content)) !== null) {
    blocks.push({
      type: 'planning',
      content: match[1].trim(),
    })
  }

  // Match <CODE language="...">...</CODE> or <CODE>...</CODE>
  const codeRegex = /<CODE(?:\s+language="([^"]*)")?>([\s\S]*?)<\/CODE>/gi
  while ((match = codeRegex.exec(content)) !== null) {
    blocks.push({
      type: 'code',
      content: match[2].trim(),
      language: match[1] || 'typescript',
    })
  }

  // Match ```language ... ``` code blocks
  const markdownCodeRegex = /```(\w+)?\n([\s\S]*?)```/g
  while ((match = markdownCodeRegex.exec(content)) !== null) {
    // Skip if already captured by CODE tags
    if (!blocks.some((b) => b.type === 'code' && b.content === match![2].trim())) {
      blocks.push({
        type: 'code',
        content: match[2].trim(),
        language: match[1] || 'text',
      })
    }
  }

  // Match <REVIEW>...</REVIEW>
  const reviewRegex = /<REVIEW>([\s\S]*?)<\/REVIEW>/gi
  while ((match = reviewRegex.exec(content)) !== null) {
    blocks.push({
      type: 'review',
      content: match[1].trim(),
    })
  }

  // Match <ADR>...</ADR>
  const adrRegex = /<ADR>([\s\S]*?)<\/ADR>/gi
  while ((match = adrRegex.exec(content)) !== null) {
    blocks.push({
      type: 'adr',
      content: match[1].trim(),
    })
  }

  // If no blocks found, treat entire content as text
  if (blocks.length === 0) {
    blocks.push({
      type: 'text',
      content: content.trim(),
    })
  }

  return blocks
}

/**
 * Hook for AI-powered architect conversations
 *
 * Combines the architect workflow with useClarityChat to enable
 * structured AI-assisted software engineering conversations.
 *
 * @param options - Configuration options
 * @returns Chat and workflow state and actions
 *
 * @example
 * ```typescript
 * const architect = useArchitectChat({
 *   api: '/api/chat',
 *   recipe: 'masterArchitect',
 *   onBlocksParsed: (blocks) => {
 *     const codeBlocks = blocks.filter(b => b.type === 'code')
 *     logger.debug('Generated code:', codeBlocks)
 *   },
 * })
 *
 * // Send a message
 * await architect.sendMessage('Review this code for security issues: ...')
 *
 * // Check workflow progress
 * logger.debug(`Phase: ${architect.currentPhase}, Progress: ${architect.progress}%`)
 *
 * // Get parsed content
 * const code = architect.getCodeBlocks()
 * const reviews = architect.getReviewBlocks()
 * ```
 */
export function useArchitectChat(
  options: UseArchitectChatOptions
): UseArchitectChatReturn {
  const {
    api,
    recipe: initialRecipe = 'masterArchitect',
    customSystemPrompt,
    architectConfig,
    workflow: workflowOptions,
    chatOptions,
    autoParseBlocks = true,
    onBlocksParsed,
  } = options

  // State
  const [currentRecipe, setCurrentRecipe] = useState<ArchitectRecipeType>(initialRecipe)
  const [lastParsedBlocks, setLastParsedBlocks] = useState<ParsedResponseBlock[]>([])

  // Build system prompt
  const systemPrompt = useMemo(() => {
    if (customSystemPrompt) {
      return customSystemPrompt
    }

    if (currentRecipe === 'masterArchitect') {
      return renderMasterSystemPrompt(architectConfig)
    }

    const recipeObj = getArchitectRecipe(currentRecipe)
    return typeof recipeObj.systemPrompt === 'string'
      ? recipeObj.systemPrompt
      : renderMasterSystemPrompt(architectConfig)
  }, [currentRecipe, customSystemPrompt, architectConfig])

  // Workflow hook
  const workflow = useArchitectWorkflow({
    config: architectConfig,
    ...workflowOptions,
  })

  // Chat hook with architect system prompt
  const chat = useClarityChat({
    api,
    ...chatOptions,
    initialMessages: chatOptions?.initialMessages ?? [
      {
        id: 'system-architect',
        role: 'system',
        content: systemPrompt,
      },
    ],
  })

  /**
   * Send a message and optionally parse the response
   */
  const sendMessage = useCallback(
    async (content: string) => {
      await chat.append({
        role: 'user',
        content,
      })

      // Parse blocks from the latest assistant message after response completes
      if (autoParseBlocks && chat.messages.length > 0) {
        const lastMessage = chat.messages[chat.messages.length - 1]
        if (lastMessage?.role === 'assistant' && typeof lastMessage.content === 'string') {
          const blocks = parseResponseBlocks(lastMessage.content)
          setLastParsedBlocks(blocks)
          onBlocksParsed?.(blocks)
        }
      }
    },
    [chat, autoParseBlocks, onBlocksParsed]
  )

  /**
   * Clear messages and reset to system prompt
   */
  const clearMessages = useCallback(() => {
    chat.setMessages([
      {
        id: 'system-architect',
        role: 'system',
        content: systemPrompt,
      },
    ])
    setLastParsedBlocks([])
  }, [chat, systemPrompt])

  /**
   * Reset everything
   */
  const reset = useCallback(() => {
    clearMessages()
    workflow.resetWorkflow()
  }, [clearMessages, workflow])

  /**
   * Advance to next phase
   */
  const advancePhase = useCallback(() => {
    switch (workflow.state.currentPhase) {
      case 'analysis':
        workflow.completeAudit({
          contextRequirements: [],
          securityFindings: [],
          codeSmells: [],
          technicalDebt: [],
          riskScore: 0,
          summary: 'Audit completed via chat',
          timestamp: new Date(),
        })
        break
      case 'planning':
        workflow.completePlanning({
          chainOfThought: 'Planning completed via chat',
          steps: [],
          patternRecommendations: [],
          rejectedAlternatives: [],
          testPlan: [],
          approachSummary: 'Plan completed',
          totalComplexity: 'moderate',
        })
        break
      case 'implementation':
        workflow.completeImplementation({
          code: '',
          language: 'typescript',
          boyScoutRuleApplied: false,
        })
        break
      case 'review':
        workflow.completeReview({
          selfCorrections: [],
          dryCheck: { isDRY: true, duplications: [] },
          securityRecheck: [],
          qualityScore: 100,
          recommendations: [],
        })
        break
    }
  }, [workflow])

  /**
   * Switch to a different recipe
   */
  const switchRecipe = useCallback(
    (recipe: ArchitectRecipeType) => {
      setCurrentRecipe(recipe)

      // Update system message
      const newSystemPrompt =
        recipe === 'masterArchitect'
          ? renderMasterSystemPrompt(architectConfig)
          : getArchitectRecipe(recipe).systemPrompt

      if (typeof newSystemPrompt === 'string') {
        const messages = chat.messages.filter((m) => m.role !== 'system')
        chat.setMessages([
          {
            id: 'system-architect',
            role: 'system',
            content: newSystemPrompt,
          },
          ...messages,
        ])
      }
    },
    [chat, architectConfig]
  )

  /**
   * Get planning blocks from all messages
   */
  const getPlanningBlocks = useCallback((): ParsedResponseBlock[] => {
    const blocks: ParsedResponseBlock[] = []
    for (const message of chat.messages) {
      if (message.role === 'assistant' && typeof message.content === 'string') {
        blocks.push(...parseResponseBlocks(message.content).filter((b) => b.type === 'planning'))
      }
    }
    return blocks
  }, [chat.messages])

  /**
   * Get code blocks from all messages
   */
  const getCodeBlocks = useCallback((): ParsedResponseBlock[] => {
    const blocks: ParsedResponseBlock[] = []
    for (const message of chat.messages) {
      if (message.role === 'assistant' && typeof message.content === 'string') {
        blocks.push(...parseResponseBlocks(message.content).filter((b) => b.type === 'code'))
      }
    }
    return blocks
  }, [chat.messages])

  /**
   * Get review blocks from all messages
   */
  const getReviewBlocks = useCallback((): ParsedResponseBlock[] => {
    const blocks: ParsedResponseBlock[] = []
    for (const message of chat.messages) {
      if (message.role === 'assistant' && typeof message.content === 'string') {
        blocks.push(...parseResponseBlocks(message.content).filter((b) => b.type === 'review'))
      }
    }
    return blocks
  }, [chat.messages])

  return {
    // Chat functionality
    messages: chat.messages,
    sendMessage,
    clearMessages,
    isLoading: chat.isLoading,
    error: chat.error ?? null,

    // Workflow state
    currentPhase: workflow.state.currentPhase,
    progress: workflow.progress,
    isComplete: workflow.state.isComplete,

    // Workflow actions
    reset,
    advancePhase,

    // Parsed content
    lastParsedBlocks,
    getPlanningBlocks,
    getCodeBlocks,
    getReviewBlocks,

    // Recipe management
    currentRecipe,
    switchRecipe,

    // Raw access
    chat,
    workflow,
  }
}
