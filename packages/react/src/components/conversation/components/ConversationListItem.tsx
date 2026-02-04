'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { formatRelativeTime } from '../../../internal/helpers'
import {
  EASING_FRAMER,
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../../animations/constants'
import type { Conversation } from '../ConversationList.types'

export interface ConversationListItemProps {
  conversation: Conversation
  isActive: boolean
  isSelected: boolean
  index: number
  multiSelect: boolean
  showFolders: boolean
  folders: Array<{ id: string; name: string }>
  prefersReducedMotion: boolean
  onSelect: (id: string) => void
  onTogglePin?: (id: string) => void
  onToggleFavorite?: (id: string) => void
  onMoveToFolder?: (id: string, folderId: string | null) => void
  onDelete?: (id: string) => void
}

/**
 * Individual conversation list item with actions
 */
export const ConversationListItem = memo(function ConversationListItem({
  conversation,
  isActive,
  isSelected,
  index,
  multiSelect,
  showFolders,
  folders,
  prefersReducedMotion,
  onSelect,
  onTogglePin,
  onToggleFavorite,
  onMoveToFolder,
  onDelete,
}: ConversationListItemProps) {
  const ConversationWrapper = prefersReducedMotion ? 'div' : motion.div

  return (
    <ConversationWrapper
      {...(prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, x: -100, scaleY: 0 },
            transition: {
              duration: durations.normal,
              delay: index * 0.05, // Stagger: 50ms between items
              ease: EASING_FRAMER.default,
            },
            whileHover: {
              y: -2,
              transition: { duration: durations.fast },
            },
            layout: true,
            viewport: { once: true },
          })}
      onClick={() => onSelect(conversation.id)}
      className={`p-4 cursor-pointer transition-all duration-150 ease-out ${
        isActive
          ? 'bg-primary/10 border-l-4 border-primary'
          : isSelected
            ? 'bg-primary/5'
            : 'hover:bg-muted/50'
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Select conversation: ${conversation.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* Checkbox for multi-select */}
            {multiSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="w-4 h-4 text-primary rounded"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Title */}
            <h3 className="text-sm font-medium text-foreground truncate">
              {conversation.title}
            </h3>

            {/* Pin indicator */}
            {conversation.isPinned && <span className="text-xs">📌</span>}

            {/* Favorite indicator */}
            {conversation.isFavorite && <span className="text-xs">⭐</span>}

            {/* Unread badge */}
            {conversation.unreadCount && conversation.unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                {conversation.unreadCount}
              </span>
            )}
          </div>

          {/* Preview */}
          <p className="text-xs text-muted-foreground truncate mb-1">
            {conversation.preview}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
            <span>
              {formatRelativeTime(new Date(conversation.timestamp))}
            </span>
            <span>•</span>
            <span>{conversation.messageCount} messages</span>
          </div>

          {/* Tags */}
          {conversation.tags && conversation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {conversation.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {!prefersReducedMotion && (
          <div
            className="flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {showFolders && onMoveToFolder && (
              <motion.button
                onClick={() => {
                  const currentFolderId = conversation.folderId
                  const newFolderId = currentFolderId
                    ? null
                    : folders[0]?.id || null
                  onMoveToFolder(conversation.id, newFolderId)
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                viewport={{ once: true }}
                className="p-1 hover:bg-muted rounded transition-colors duration-150 ease-out"
                aria-label={
                  conversation.folderId ? 'Remove from folder' : 'Move to folder'
                }
                title={
                  conversation.folderId ? 'Remove from folder' : 'Move to folder'
                }
              >
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {conversation.folderId ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  )}
                </svg>
              </motion.button>
            )}
            {onTogglePin && (
              <motion.button
                onClick={() => onTogglePin(conversation.id)}
                whileHover={{
                  scale: 1.2,
                  rotate: conversation.isPinned ? 0 : 15,
                }}
                whileTap={{ scale: 0.9 }}
                viewport={{ once: true }}
                className="p-1 hover:bg-muted rounded transition-colors duration-150 ease-out"
                aria-label={conversation.isPinned ? 'Unpin' : 'Pin'}
              >
                <motion.span
                  className="text-sm"
                  animate={
                    conversation.isPinned
                      ? { rotate: [0, -10, 10, -10, 0] }
                      : {}
                  }
                  transition={{ duration: durations.slow }}
                >
                  {conversation.isPinned ? '📌' : '📍'}
                </motion.span>
              </motion.button>
            )}

            {onToggleFavorite && (
              <motion.button
                onClick={() => onToggleFavorite(conversation.id)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                viewport={{ once: true }}
                className="p-1 hover:bg-muted rounded transition-colors duration-150 ease-out"
                aria-label={
                  conversation.isFavorite ? 'Unfavorite' : 'Favorite'
                }
              >
                <motion.span
                  className="text-sm"
                  animate={
                    conversation.isFavorite ? { scale: [1, 1.3, 1] } : {}
                  }
                  transition={{ duration: durations.moderate }}
                >
                  {conversation.isFavorite ? '⭐' : '☆'}
                </motion.span>
              </motion.button>
            )}

            {onDelete && (
              <motion.button
                onClick={() => onDelete(conversation.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                viewport={{ once: true }}
                className="p-1 hover:bg-destructive/10 rounded transition-all duration-150 ease-out"
                aria-label="Delete conversation"
              >
                <svg
                  className="w-4 h-4 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </motion.button>
            )}
          </div>
        )}
      </div>
    </ConversationWrapper>
  )
})

ConversationListItem.displayName = 'ConversationListItem'
