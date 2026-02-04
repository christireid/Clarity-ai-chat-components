'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { BotIcon, SparklesIcon } from '../ui/icons'
import { duration, ANIMATION_PRESETS } from '../../animations/constants'
import {
  PromptSuggestions,
  type PromptSuggestion,
} from '../prompt/PromptSuggestions'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

// Animation constants for decorative rings
const OUTER_RING_ANIMATION = {
  scale: [1, 1.05, 1],
  opacity: [0.5, 0.8, 0.5],
}

const MIDDLE_RING_ANIMATION = {
  scale: [1, 1.03, 1],
  opacity: [0.6, 1, 0.6],
}

const SPARKLES_ANIMATION = {
  rotate: [0, 15, -15, 0],
}

export interface DefaultEmptyStateProps {
  starterPrompts?: PromptSuggestion[]
  onSelectPrompt?: (suggestion: PromptSuggestion) => void
  showStarterPrompts?: boolean
}

export function DefaultEmptyState({
  starterPrompts,
  onSelectPrompt,
  showStarterPrompts = true,
}: DefaultEmptyStateProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="text-center space-y-8 px-4 py-8"
      {...(prefersReducedMotion
        ? ANIMATION_PRESETS.fadeIn
        : ANIMATION_PRESETS.scale)}
      transition={{
        duration: prefersReducedMotion ? 0 : duration('slow'),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      viewport={{ once: true }}
    >
      {/* Animated icon with decorative rings */}
      <div className="relative inline-flex items-center justify-center">
        {/* Outer decorative ring */}
        {prefersReducedMotion ? (
          <div
            className="absolute w-32 h-32 rounded-full border border-primary/10"
            style={{ opacity: 0.5 }}
          />
        ) : (
          <motion.div
            className="absolute w-32 h-32 rounded-full border border-primary/10"
            {...ANIMATION_PRESETS.scale}
            animate={{
              ...ANIMATION_PRESETS.scale.animate,
              ...OUTER_RING_ANIMATION,
            }}
            transition={{
              duration: duration('slower'),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        {/* Middle decorative ring */}
        {prefersReducedMotion ? (
          <div
            className="absolute w-28 h-28 rounded-full border border-primary/20"
            style={{ opacity: 0.6 }}
          />
        ) : (
          <motion.div
            className="absolute w-28 h-28 rounded-full border border-primary/20"
            {...ANIMATION_PRESETS.scale}
            animate={{
              ...ANIMATION_PRESETS.scale.animate,
              ...MIDDLE_RING_ANIMATION,
            }}
            transition={{
              duration: duration('slower'),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
        )}
        {/* Main icon container */}
        <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/5 shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.3)] ring-1 ring-primary/20">
          <BotIcon size={40} className="text-primary" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Start a conversation
        </h3>
        <p className="text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
          Send a message to begin chatting with the AI assistant. I'm here to
          help with your questions and tasks.
        </p>
      </div>

      {/* Starter Prompts - 2024 AI UX Pattern */}
      {showStarterPrompts &&
        starterPrompts &&
        starterPrompts.length > 0 &&
        onSelectPrompt &&
        (prefersReducedMotion ? (
          <div className="pt-6">
            <div className="flex items-center justify-center gap-2 mb-5">
              <SparklesIcon size={14} className="text-primary" />
              <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
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
            />
          </div>
        ) : (
          <motion.div
            className="pt-6"
            {...ANIMATION_PRESETS.slideUp}
            transition={{
              delay: 0.2,
              duration: duration('slow'),
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-5">
              <motion.div
                {...ANIMATION_PRESETS.scaleRotate}
                animate={{
                  ...ANIMATION_PRESETS.scaleRotate.animate,
                  ...SPARKLES_ANIMATION,
                }}
                transition={{
                  duration: duration('slower'),
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <SparklesIcon size={14} className="text-primary" />
              </motion.div>
              <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
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
            />
          </motion.div>
        ))}
    </motion.div>
  )
}
