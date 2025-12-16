'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message, AIStatus } from '@clarity-chat/types'
import { Card, Button, Badge, cn } from '@clarity-chat/primitives'
import { duration } from '../animations/constants'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ThinkingIndicator } from './thinking-indicator'
import { BotIcon, SparklesIcon } from './icons'
import type { CoreMessage } from '../hooks/use-chat-enhanced'
import { convertCoreMessagesToMessages } from '../utils/message-conversion'
import { PromptSuggestions, type PromptSuggestion } from './prompt-suggestions'
import { UIEnhancementsContext, useUIEnhancements } from '../../contexts/ui-enhancements'

// Extended interface with 2025 UI/UX enhancements
export interface EnhancedChatWindowProps {
  /** Messages in either Message[] or CoreMessage[] format */
  messages: Message[] | CoreMessage[]
  isLoading?: boolean
  /** AI processing status for thinking indicator */
  aiStatus?: AIStatus
  onSendMessage: (content: string) => void
  onStopGeneration?: () => void
  onMessageCopy?: (messageId: string, content: string) => void
  onMessageFeedback?: (
    messageId: string,
    type: 'up' | 'down',
    comment?: string
  ) => void
  onMessageRetry?: (messageId: string) => void
  onEditMessage?: (messageId: string) => void
  onRegenerateMessage?: (messageId: string) => void
  onDeleteMessage?: (messageId: string) => void
  editingMessageId?: string | null
  onSaveEdit?: (messageId: string, newContent: string) => void
  onCancelEdit?: (messageId: string) => void
  /** Custom empty state */
  emptyState?: React.ReactNode
  /** Show header with session info */
  showHeader?: boolean
  /** Session title */
  sessionTitle?: string
  /** Session subtitle or description */
  sessionSubtitle?: string
  /** Header actions */
  headerActions?: React.ReactNode
  /** Show message count badge */
  showMessageCount?: boolean
  /** Enable export functionality */
  onExport?: () => void
  /** Enable clear chat functionality */
  onClear?: () => void
  /**
   * Error message to display (e.g., network errors).
   * Shows a banner above the chat when set.
   */
  error?: string | null
  /**
   * Callback to retry after an error.
   * When provided along with `error`, shows a "Retry" button.
   */
  onRetry?: () => void
  /**
   * Callback to dismiss the error banner.
   * When provided, shows a dismiss button on the error banner.
   */
  onDismissError?: () => void
  className?: string
  /**
   * 2025 UI/UX Enhancement Features
   */
  enhancements?: {
    quantumAnimations?: boolean
    glassmorphism?: boolean
    auroraGradients?: boolean
    neumorphism?: boolean
    voiceIntegration?: boolean
    adaptiveColors?: boolean
    wcagAAA?: boolean
  }
  /**
   * Starter prompts to show in empty state (2024 AI UX trend)
   * These help users discover what the chat can do
   */
  starterPrompts?: PromptSuggestion[]
  /**
   * Suggested follow-up prompts shown after assistant messages
   * Helps maintain conversation flow
   */
  followUpSuggestions?: PromptSuggestion[]
  /**
   * Whether to show starter prompts in empty state
   * @default true when starterPrompts is provided
   */
  showStarterPrompts?: boolean
  /**
   * Whether to show follow-up suggestions after last assistant message
   * @default true when followUpSuggestions is provided
   */
  showFollowUpSuggestions?: boolean
}

// Default empty state component with quantum enhancements
interface EnhancedEmptyStateProps {
  starterPrompts?: PromptSuggestion[]
  onSelectPrompt?: (suggestion: PromptSuggestion) => void
  showStarterPrompts?: boolean
  quantumAnimations?: boolean
  glassmorphism?: boolean
  auroraGradients?: boolean
}

const EnhancedEmptyState = ({
  starterPrompts,
  onSelectPrompt,
  showStarterPrompts = true,
  quantumAnimations = false,
  glassmorphism = false,
  auroraGradients = false,
}: EnhancedEmptyStateProps) => (
  <motion.div
    className={cn(
      "text-center space-y-8 px-4 py-8",
      glassmorphism && "glassmorphism-container",
      auroraGradients && "aurora-gradient-container"
    )}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ 
      duration: quantumAnimations ? duration('quantum-slow') : duration('slow'), 
      ease: quantumAnimations ? 'quantum-ease' : [0.25, 0.1, 0.25, 1] 
    }}
  >
    {/* Enhanced animated icon with quantum effects */}
    <div className="relative inline-flex items-center justify-center">
      {/* Aurora background effect */}
      {auroraGradients && (
        <motion.div
          className="absolute w-40 h-40 rounded-full aurora-gradient"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: quantumAnimations ? durations.quantumEpic : durations.slower,
            repeat: Infinity,
            ease: quantumAnimations ? 'quantum-ease' : 'easeInOut',
          }}
        />
      )}
      
      {/* Outer decorative ring with quantum effects */}
      <motion.div
        className={cn(
          "absolute w-32 h-32 rounded-full border",
          glassmorphism 
            ? "border-white/20 glass-border" 
            : "border-primary/10"
        )}
        animate={quantumAnimations ? {
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5],
          rotate: [0, 360],
        } : {
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: quantumAnimations ? durations.quantumEpic : durations.slower,
          repeat: Infinity,
          ease: quantumAnimations ? 'quantum-ease' : 'easeInOut',
        }}
      />
      
      {/* Middle decorative ring */}
      <motion.div
        className={cn(
          "absolute w-28 h-28 rounded-full border",
          glassmorphism 
            ? "border-white/30 glass-border" 
            : "border-primary/20"
        )}
        animate={quantumAnimations ? {
          scale: [1, 1.03, 1],
          opacity: [0.6, 1, 0.6],
          rotate: [0, -360],
        } : {
          scale: [1, 1.03, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: quantumAnimations ? durations.quantumEpic : durations.slower,
          repeat: Infinity,
          ease: quantumAnimations ? 'quantum-ease' : 'easeInOut',
          delay: quantumAnimations ? 0.25 : 0.5,
        }}
      />
      
      {/* Main icon container with glassmorphism */}
      <motion.div
        className={cn(
          "relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-3xl shadow-lg ring-1",
          glassmorphism
            ? "bg-white/10 backdrop-blur-xl ring-white/20 glassmorphism-card"
            : "bg-gradient-to-br from-primary/20 via-primary/15 to-primary/5 ring-primary/20"
        )}
        animate={quantumAnimations ? {
          scale: [1, 1.02, 1],
          rotate: [0, 1, -1, 0],
        } : {
          scale: [1, 1.02, 1],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: quantumAnimations ? durations.quantumSlow : durations.slower,
          repeat: Infinity,
          ease: quantumAnimations ? 'quantum-ease' : 'easeInOut',
        }}
      >
        <motion.div
          animate={quantumAnimations ? {
            y: [0, -3, 0],
            scale: [1, 1.1, 1],
          } : {
            y: [0, -2, 0],
          }}
          transition={{
            duration: quantumAnimations ? durations.quantumSlow : durations.slower,
            repeat: Infinity,
            ease: quantumAnimations ? 'quantum-ease' : 'easeInOut',
          }}
        >
          <BotIcon size={40} className={cn(
            "text-primary",
            auroraGradients && "aurora-text-gradient"
          )} />
        </motion.div>
      </motion.div>
    </div>

    <div className="space-y-3">
      <h3 className={cn(
        "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
        auroraGradients
          ? "from-aurora-primary to-aurora-secondary"
          : "from-foreground to-foreground/80"
      )}>
        Start a conversation
      </h3>
      <p className={cn(
        "text-sm max-w-md mx-auto leading-relaxed",
        glassmorphism
          ? "text-white/80"
          : "text-muted-foreground/80"
      )}>
        Send a message to begin chatting with the AI assistant. I'm here to help
        with your questions and tasks.
      </p>
    </div>

    {/* Starter Prompts - 2024 AI UX Pattern with enhancements */}
    {showStarterPrompts &&
      starterPrompts &&
      starterPrompts.length > 0 &&
      onSelectPrompt && (
        <motion.div
          className="pt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: quantumAnimations ? 0.4 : 0.2,
            duration: quantumAnimations ? duration('quantum-slow') : duration('slow'),
            ease: quantumAnimations ? 'quantum-ease' : [0.25, 0.1, 0.25, 1],
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-5">
            <motion.div
              animate={quantumAnimations ? {
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              } : {
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: quantumAnimations ? durations.quantumEpic : durations.slower,
                repeat: Infinity,
                ease: quantumAnimations ? 'quantum-ease' : 'easeInOut',
              }}
            >
              <SparklesIcon size={14} className={cn(
                "text-primary",
                auroraGradients && "aurora-text-gradient"
              )} />
            </motion.div>
            <span className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              glassmorphism
                ? "text-white/70"
                : "text-muted-foreground/70"
            )}>
              Try asking
            </span>
          </div>
          <PromptSuggestions
            suggestions={starterPrompts}
            onSelect={onSelectPrompt}
            suggestionType="starter"
            layout="chips"
            maxSuggestions={4}
            className="justify-center"
            glassmorphism={glassmorphism}
            auroraGradients={auroraGradients}
          />
        </motion.div>
      )}
  </motion.div>
)

/**
 * EnhancedChatWindow - Mid-Level Composable Component with 2025 UI/UX Enhancements
 *
 * @description Modern chat interface with quantum animations, glassmorphism, aurora gradients,
 * neumorphism, voice integration, and adaptive colors. Extends existing ChatWindow patterns.
 * @example
 * ```tsx
 * <EnhancedChatWindow
 *   messages={messages}
 *   onSendMessage={handleSend}
 *   enhancements={{
 *     quantumAnimations: true,
 *     glassmorphism: true,
 *     auroraGradients: true,
 *     voiceIntegration: true,
 *     wcagAAA: true
 *   }}
 * />
 * ```
 */
export const EnhancedChatWindow = React.forwardRef<HTMLDivElement, EnhancedChatWindowProps>(
  ({
    messages,
    isLoading = false,
    aiStatus,
    onSendMessage,
    onStopGeneration,
    onMessageCopy,
    onMessageFeedback,
    onMessageRetry,
    onEditMessage,
    onRegenerateMessage,
    onDeleteMessage,
    editingMessageId,
    onSaveEdit,
    onCancelEdit,
    emptyState,
    showHeader = true,
    sessionTitle,
    sessionSubtitle,
    headerActions,
    showMessageCount = true,
    onExport,
    onClear,
    error,
    onRetry,
    onDismissError,
    className,
    enhancements = {},
    starterPrompts,
    followUpSuggestions,
    showStarterPrompts: showStarterPromptsProp,
    showFollowUpSuggestions: showFollowUpSuggestionsProp,
  }, ref) => {
    const {
      quantumAnimations = false,
      glassmorphism = false,
      auroraGradients = false,
      neumorphism = false,
      voiceIntegration = false,
      adaptiveColors = false,
      wcagAAA = false,
    } = enhancements

    const showStarterPrompts = showStarterPromptsProp ?? (starterPrompts && starterPrompts.length > 0)
    const showFollowUpSuggestions = showFollowUpSuggestionsProp ?? (followUpSuggestions && followUpSuggestions.length > 0)

    // Convert messages to standard format
    const standardMessages = React.useMemo(() => {
      if (messages.length === 0) return []
      if ('role' in messages[0]) {
        return messages as Message[]
      }
      return convertCoreMessagesToMessages(messages as CoreMessage[])
    }, [messages])

    const lastAssistantMessage = React.useMemo(() => {
      return standardMessages
        .slice()
        .reverse()
        .find((msg) => msg.role === 'assistant')
    }, [standardMessages])

    // Enhanced context value
    const enhancementsValue = React.useMemo(() => ({
      quantumAnimations,
      glassmorphism,
      auroraGradients,
      neumorphism,
      voiceIntegration,
      adaptiveColors,
      wcagAAA,
    }), [quantumAnimations, glassmorphism, auroraGradients, neumorphism, voiceIntegration, adaptiveColors, wcagAAA])

    const handleSelectStarterPrompt = React.useCallback(
      (suggestion: PromptSuggestion) => {
        onSendMessage(suggestion.prompt)
      },
      [onSendMessage]
    )

    const handleSelectFollowUp = React.useCallback(
      (suggestion: PromptSuggestion) => {
        onSendMessage(suggestion.prompt)
      },
      [onSendMessage]
    )

    const messageCount = standardMessages.length

    return (
      <UIEnhancementsContext.Provider value={enhancementsValue}>
        <div
          ref={ref}
          className={cn(
            "flex flex-col h-full bg-background rounded-lg border border-border overflow-hidden",
            glassmorphism && "glassmorphism-container backdrop-blur-xl",
            auroraGradients && "aurora-gradient-container",
            neumorphism && "neumorphism-container",
            wcagAAA && "wcag-aaa-compliant",
            quantumAnimations && "quantum-animations-enabled",
            adaptiveColors && "adaptive-colors-enabled",
            voiceIntegration && "voice-integration-enabled",
            className
          )}
        >
          {/* Enhanced Header */}
          {showHeader && (
            <motion.header
              className={cn(
                "flex items-center justify-between p-4 border-b border-border shrink-0",
                glassmorphism && "bg-white/10 backdrop-blur-xl border-white/20",
                auroraGradients && "bg-gradient-to-r from-aurora-primary/10 to-aurora-secondary/10"
              )}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: quantumAnimations ? duration('quantum-micro') : duration('fast'),
                ease: quantumAnimations ? 'quantum-ease' : [0.25, 0.1, 0.25, 1]
              }}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "relative inline-flex items-center justify-center w-10 h-10 rounded-xl",
                  glassmorphism
                    ? "bg-white/20 backdrop-blur-xl ring-1 ring-white/30"
                    : "bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20"
                )}>
                  <BotIcon size={20} className={cn(
                    "text-primary",
                    auroraGradients && "aurora-text-gradient"
                  )} />
                </div>
                <div className="flex flex-col">
                  <h2 className={cn(
                    "font-semibold text-base leading-tight",
                    wcagAAA && "text-lg font-bold"
                  )}>
                    {sessionTitle || "AI Assistant"}
                  </h2>
                  {sessionSubtitle && (
                    <p className={cn(
                      "text-xs text-muted-foreground leading-tight mt-0.5",
                      glassmorphism && "text-white/70",
                      wcagAAA && "text-sm"
                    )}>
                      {sessionSubtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {showMessageCount && messageCount > 0 && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      glassmorphism && "bg-white/20 text-white border-white/30",
                      auroraGradients && "aurora-badge",
                      quantumAnimations && "quantum-badge"
                    )}
                  >
                    {messageCount}
                  </Badge>
                )}
                {headerActions}
                {onExport && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onExport}
                    className={cn(
                      quantumAnimations && "quantum-button",
                      glassmorphism && "glassmorphism-button"
                    )}
                  >
                    Export
                  </Button>
                )}
                {onClear && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className={cn(
                      quantumAnimations && "quantum-button",
                      glassmorphism && "glassmorphism-button"
                    )}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </motion.header>
          )}

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  duration: quantumAnimations ? duration('quantum-fast') : duration('fast')
                }}
                className={cn(
                  "border-b px-4 py-3 shrink-0",
                  glassmorphism
                    ? "bg-red-500/10 border-red-500/20 text-white"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className={cn(
                    "text-sm font-medium leading-tight",
                    wcagAAA && "text-base"
                  )}>
                    {error}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    {onRetry && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className={cn(
                          quantumAnimations && "quantum-button",
                          glassmorphism && "glassmorphism-button"
                        )}
                      >
                        Retry
                      </Button>
                    )}
                    {onDismissError && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDismissError}
                        className={cn(
                          quantumAnimations && "quantum-button",
                          glassmorphism && "glassmorphism-button"
                        )}
                      >
                        Dismiss
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {standardMessages.length === 0 ? (
              emptyState || (
                <EnhancedEmptyState
                  starterPrompts={starterPrompts}
                  onSelectPrompt={handleSelectStarterPrompt}
                  showStarterPrompts={showStarterPrompts}
                  quantumAnimations={quantumAnimations}
                  glassmorphism={glassmorphism}
                  auroraGradients={auroraGradients}
                />
              )
            ) : (
              <MessageList
                messages={standardMessages}
                isLoading={isLoading}
                aiStatus={aiStatus}
                onMessageCopy={onMessageCopy}
                onMessageFeedback={onMessageFeedback}
                onMessageRetry={onMessageRetry}
                onEditMessage={onEditMessage}
                onRegenerateMessage={onRegenerateMessage}
                onDeleteMessage={onDeleteMessage}
                editingMessageId={editingMessageId}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                className={cn(
                  quantumAnimations && "quantum-message-list",
                  glassmorphism && "glassmorphism-message-list"
                )}
              />
            )}

            {/* Follow-up Suggestions */}
            <AnimatePresence>
              {showFollowUpSuggestions &&
                followUpSuggestions &&
                followUpSuggestions.length > 0 &&
                lastAssistantMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      duration: quantumAnimations ? duration('quantum-slow') : duration('slow'),
                      ease: quantumAnimations ? 'quantum-ease' : [0.25, 0.1, 0.25, 1]
                    }}
                    className="p-4"
                  >
                    <PromptSuggestions
                      suggestions={followUpSuggestions}
                      onSelect={handleSelectFollowUp}
                      suggestionType="followup"
                      layout="chips"
                      maxSuggestions={3}
                      className="justify-center"
                      glassmorphism={glassmorphism}
                      auroraGradients={auroraGradients}
                    />
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Thinking Indicator */}
          <AnimatePresence>
            {aiStatus === 'thinking' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: quantumAnimations ? duration('quantum-micro') : duration('fast')
                }}
                className="px-4 py-2 shrink-0"
              >
                <ThinkingIndicator
                  className={cn(
                    quantumAnimations && "quantum-thinking-indicator",
                    glassmorphism && "glassmorphism-thinking-indicator"
                  )}
                  quantumAnimations={quantumAnimations}
                  glassmorphism={glassmorphism}
                  auroraGradients={auroraGradients}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Chat Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: quantumAnimations ? 0.1 : 0,
              duration: quantumAnimations ? duration('quantum-slow') : duration('slow'),
              ease: quantumAnimations ? 'quantum-ease' : [0.25, 0.1, 0.25, 1]
            }}
            className="border-t p-4 shrink-0"
          >
            <ChatInput
              onSend={onSendMessage}
              isLoading={isLoading}
              onStopGeneration={onStopGeneration}
              className={cn(
                quantumAnimations && "quantum-chat-input",
                glassmorphism && "glassmorphism-chat-input"
              )}
              voiceInput={voiceIntegration}
              quantumEnhancements={voiceIntegration ? {
                realTimeProcessing: true,
                adaptiveRecognition: true,
                noiseCancellation: true,
                emotionDetection: true,
                accentAdaptation: false, // Disabled by default for privacy
              } : undefined}
              glassmorphism={glassmorphism}
              auroraGradients={auroraGradients}
              quantumAnimations={quantumAnimations}
            />
          </motion.div>
        </div>
      </div>
    </UIEnhancementsContext.Provider>
  }
)

EnhancedChatWindow.displayName = 'EnhancedChatWindow'

export default EnhancedChatWindow