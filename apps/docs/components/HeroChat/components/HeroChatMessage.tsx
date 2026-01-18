'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { MarkdownRendererEnhanced } from '@clarity-chat/react'
import { ToolUIRegistry } from '../ToolUIRegistry'
import { durations } from '@/lib/animations'
import { HeroChatMessageReactions, ReactionType } from './HeroChatMessageReactions'
import { HeroChatMessageEditor } from './HeroChatMessageEditor'
import { HeroChatBranchIndicator } from './HeroChatBranching'

interface ToolResult {
  id: string
  name: string
  data: Record<string, unknown>
  ui: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  toolResults?: ToolResult[]
  reaction?: ReactionType
}

interface HeroChatMessageProps {
  message: Message
  isStreaming: boolean
  isLastMessage: boolean
  onContextMenu: (e: React.MouseEvent) => void
  // Reactions
  onReact?: (messageId: string, reaction: ReactionType) => void
  onCopyMessage?: (content: string) => void
  onRegenerateMessage?: (messageId: string) => void
  // Editing
  isEditing?: boolean
  onEditSave?: (messageId: string, content: string) => void
  onEditCancel?: () => void
  // Branching
  branchCount?: number
  onShowBranches?: (messageId: string) => void
}

export function HeroChatMessage({
  message,
  isStreaming,
  isLastMessage,
  onContextMenu,
  // Reactions
  onReact,
  onCopyMessage,
  onRegenerateMessage,
  // Editing
  isEditing,
  onEditSave,
  onEditCancel,
  // Branching
  branchCount = 0,
  onShowBranches,
}: HeroChatMessageProps) {
  const isUser = message.role === 'user'
  const showThinking =
    isStreaming && !isUser && isLastMessage && !message.content

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      onContextMenu={onContextMenu}
      role="article"
      aria-label={`${isUser ? 'Your' : 'Assistant'} message`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : ''}`}>
        {/* Avatar and content */}
        <div
          className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
        >
          {/* Avatar */}
          <motion.div
            className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              isUser
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
            }`}
            whileHover={{ scale: 1.1 }}
            aria-hidden="true"
          >
            {isUser ? (
              <span className="text-white text-sm font-medium">U</span>
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
          </motion.div>

          <div
            className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}
          >
            {/* Message bubble - with editing support */}
            {isEditing && isUser && onEditSave && onEditCancel ? (
              <HeroChatMessageEditor
                initialContent={message.content}
                onSave={(content) => onEditSave(message.id, content)}
                onCancel={onEditCancel}
              />
            ) : (
              <motion.div
                className={`px-4 py-3 rounded-2xl ${
                  isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm'
                    : 'bg-bg-primary dark:bg-slate-800 text-text-primary border border-border dark:border-slate-700 rounded-tl-sm shadow-sm'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                {message.content ? (
                  isUser ? (
                    // User messages: plain text (no markdown needed)
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  ) : (
                    // Assistant messages: render with markdown
                    <div className="text-sm prose-sm dark:prose-invert max-w-none">
                      <MarkdownRendererEnhanced
                        content={message.content}
                        enableMath={true}
                        enableGFM={true}
                        enableHighlight={true}
                        enableCodeCopy={true}
                        components={{}}
                        onMathError={() => {}}
                        className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                      />
                    </div>
                  )
                ) : showThinking ? (
                  <ThinkingIndicator />
                ) : null}
              </motion.div>
            )}

            {/* Reactions for assistant messages */}
            {!isUser && onReact && !isStreaming && message.content && (
              <HeroChatMessageReactions
                messageId={message.id}
                reaction={message.reaction || null}
                onReact={onReact}
                onCopy={onCopyMessage ? () => onCopyMessage(message.content) : undefined}
                onRegenerate={onRegenerateMessage ? () => onRegenerateMessage(message.id) : undefined}
                showActions={true}
              />
            )}

            {/* Tool results */}
            {message.toolResults && message.toolResults.length > 0 && (
              <div
                className="flex flex-col gap-3 mt-2"
                role="region"
                aria-label="Tool results"
              >
                {message.toolResults.map((tool) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <ToolUIRegistry
                      toolResult={{ ui: tool.ui, data: tool.data }}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Timestamp and branch indicator */}
            <div className="flex items-center gap-2">
              <time
                className="text-xs text-slate-400"
                dateTime={message.timestamp.toISOString()}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
              {/* Branch indicator */}
              {branchCount > 0 && onShowBranches && (
                <HeroChatBranchIndicator
                  branchCount={branchCount}
                  onClick={() => onShowBranches(message.id)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ThinkingIndicator() {
  return (
    <div
      className="flex items-center gap-2"
      role="status"
      aria-label="Assistant is thinking"
    >
      <motion.div
        className="flex gap-1"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: durations.slower, repeat: Infinity, type: 'tween' }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-slate-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: durations.slower,
              repeat: Infinity,
              delay: i * 0.15,
              type: 'tween',
            }}
          />
        ))}
      </motion.div>
      <span className="text-sm text-slate-400">Thinking...</span>
    </div>
  )
}
