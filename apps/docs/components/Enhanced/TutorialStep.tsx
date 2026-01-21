'use client'

import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative"
    >
      {/* Step Indicator */}
      <div className="flex items-start gap-4 mb-6">
        <motion.div
          animate={{
            scale: completed ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            scale: { duration: 0.5, type: 'spring', stiffness: 200, damping: 15 },
          }}
          whileHover={{ scale: 1.05 }}
          className={clsx(
            'flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0 transition-colors duration-300',
            completed
              ? 'bg-brand-500 border-brand-500 text-white'
              : 'bg-bg-secondary border-border text-text-secondary'
          )}
        >
          <AnimatePresence mode="wait">
            {completed ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.span
                key="number"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="font-semibold"
              >
                {step}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1"
        >
          <h3
            className={clsx(
              'text-xl font-semibold mb-2',
              completed ? 'text-text-secondary line-through' : 'text-text-primary'
            )}
          >
            {title}
          </h3>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="ml-14 mb-8"
      >
        {children}
      </motion.div>

      {/* Next Step Link */}
      {nextStepHref && nextStepTitle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="ml-14 mb-8 pt-6 border-t border-border"
        >
          <motion.a
            href={nextStepHref}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-medium transition-colors"
          >
            <span>Next: {nextStepTitle}</span>
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.a>
        </motion.div>
      )}
    </motion.div>
  )
}
