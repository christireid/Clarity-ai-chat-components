'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { SparklesIcon } from '../ui/icons'
import { duration, ANIMATION_PRESETS } from '../../animations/constants'
import {
  PromptSuggestions,
  type PromptSuggestion,
} from '../prompt/PromptSuggestions'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

export interface FollowUpSuggestionsProps {
  showFollowUp: boolean
  followUpSuggestions?: PromptSuggestion[]
  onPromptSelect: (suggestion: PromptSuggestion) => void
}

export function FollowUpSuggestions({
  showFollowUp,
  followUpSuggestions,
  onPromptSelect,
}: FollowUpSuggestionsProps) {
  const prefersReducedMotion = useReducedMotion()

  if (!showFollowUp || !followUpSuggestions?.length) return null

  return (
    <motion.div
      className="flex flex-col gap-3 px-5 py-4 sm:px-6 border-t border-border/60"
      {...(prefersReducedMotion
        ? ANIMATION_PRESETS.fadeIn
        : ANIMATION_PRESETS.slideUp)}
      transition={{
        duration: prefersReducedMotion ? 0 : duration('normal'),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2">
        <SparklesIcon size={14} className="text-primary" />
        <span className="text-xs font-medium text-muted-foreground/80">
          Suggested follow-ups
        </span>
      </div>
      <PromptSuggestions
        suggestions={followUpSuggestions}
        onSelect={onPromptSelect}
        suggestionType="follow-up"
        layout="chips"
        maxSuggestions={3}
      />
    </motion.div>
  )
}
