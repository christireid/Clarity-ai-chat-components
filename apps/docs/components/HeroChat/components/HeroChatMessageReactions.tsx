'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, ThumbsDown, Copy, RefreshCw } from 'lucide-react'

export type ReactionType = 'like' | 'dislike' | null

interface HeroChatMessageReactionsProps {
  messageId: string
  reaction: ReactionType
  onReact: (messageId: string, reaction: ReactionType) => void
  onCopy?: () => void
  onRegenerate?: () => void
  showActions?: boolean
}

export function HeroChatMessageReactions({
  messageId,
  reaction,
  onReact,
  onCopy,
  onRegenerate,
  showActions = true,
}: HeroChatMessageReactionsProps) {
  const [justReacted, setJustReacted] = useState<ReactionType>(null)

  const handleReact = (newReaction: 'like' | 'dislike') => {
    const finalReaction = reaction === newReaction ? null : newReaction
    onReact(messageId, finalReaction)
    setJustReacted(finalReaction)
    setTimeout(() => setJustReacted(null), 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 mt-2"
    >
      {/* Thumbs up */}
      <motion.button
        onClick={() => handleReact('like')}
        className={`p-1.5 rounded-lg transition-colors ${
          reaction === 'like'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={reaction === 'like' ? 'Remove like' : 'Like this response'}
        aria-pressed={reaction === 'like'}
      >
        <ThumbsUp className="w-4 h-4" />
        <AnimatePresence>
          {justReacted === 'like' && (
            <motion.span
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0 }}
              className="absolute text-lg"
            >
              👍
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Thumbs down */}
      <motion.button
        onClick={() => handleReact('dislike')}
        className={`p-1.5 rounded-lg transition-colors ${
          reaction === 'dislike'
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={
          reaction === 'dislike' ? 'Remove dislike' : 'Dislike this response'
        }
        aria-pressed={reaction === 'dislike'}
      >
        <ThumbsDown className="w-4 h-4" />
        <AnimatePresence>
          {justReacted === 'dislike' && (
            <motion.span
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0 }}
              className="absolute text-lg"
            >
              👎
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {showActions && (
        <>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Copy */}
          {onCopy && (
            <motion.button
              onClick={onCopy}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Copy response"
            >
              <Copy className="w-4 h-4" />
            </motion.button>
          )}

          {/* Regenerate */}
          {onRegenerate && (
            <motion.button
              onClick={onRegenerate}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Regenerate response"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          )}
        </>
      )}
    </motion.div>
  )
}
