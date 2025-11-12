'use client'

import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { ReactNode } from 'react'

interface TutorialStepProps {
  step: number
  title: string
  completed?: boolean
  children: ReactNode
  nextStepHref?: string
  nextStepTitle?: string
}

export function TutorialStep({
  step,
  title,
  completed = false,
  children,
  nextStepHref,
  nextStepTitle,
}: TutorialStepProps) {
  return (
    <div className="relative">
      {/* Step Indicator */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className={clsx(
            'flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0 transition-all',
            completed
              ? 'bg-brand-500 border-brand-500 text-white'
              : 'bg-bg-secondary border-border text-text-secondary'
          )}
        >
          {completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <span className="font-semibold">{step}</span>
          )}
        </div>
        <div className="flex-1">
          <h3
            className={clsx(
              'text-xl font-semibold mb-2',
              completed ? 'text-text-secondary line-through' : 'text-text-primary'
            )}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="ml-14 mb-8">{children}</div>

      {/* Next Step Link */}
      {nextStepHref && nextStepTitle && (
        <div className="ml-14 mb-8 pt-6 border-t border-border">
          <a
            href={nextStepHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-medium transition-colors"
          >
            <span>Next: {nextStepTitle}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  )
}
