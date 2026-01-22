'use client'

import { durations } from '@/lib/animations'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import clsx from 'clsx'

interface TutorialProgressProps {
  currentStep: number
  totalSteps: number
  steps: Array<{
    id: string
    title: string
    href: string
  }>
}

export function TutorialProgress({
  currentStep,
  totalSteps,
  steps,
}: TutorialProgressProps) {
  const progressPercent = Math.round((currentStep / totalSteps) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.moderate }}
      className="mb-8 p-4 rounded-xl bg-bg-secondary border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-text-secondary">
          Tutorial Progress
        </span>
        <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-bg-tertiary rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: durations.slow, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
        />
      </div>

      {/* Step Pills */}
      <div className="flex flex-wrap gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <motion.a
              key={step.id}
              href={step.href}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                isCompleted &&
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                isCurrent &&
                  'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 ring-2 ring-brand-500/20',
                !isCompleted &&
                  !isCurrent &&
                  'bg-bg-tertiary text-text-secondary hover:bg-bg-primary hover:text-text-primary'
              )}
            >
              {isCompleted ? (
                <Check className="w-3 h-3" />
              ) : (
                <span
                  className={clsx(
                    'w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold',
                    isCurrent
                      ? 'bg-brand-500 text-white'
                      : 'bg-bg-primary text-text-secondary'
                  )}
                >
                  {stepNumber}
                </span>
              )}
              <span className="hidden sm:inline">{step.title}</span>
            </motion.a>
          )
        })}
      </div>

      {/* Completion Message */}
      {currentStep === totalSteps && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        >
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
            You're almost done! Complete this final step to finish the tutorial.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
