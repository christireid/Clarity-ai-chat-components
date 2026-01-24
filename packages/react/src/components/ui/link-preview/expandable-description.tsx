'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { duration } from '../../../animations/constants'

interface ExpandableDescriptionProps {
  description: string
  maxLength?: number
  className?: string
}

export function ExpandableDescription({
  description,
  maxLength = 120,
  className,
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const needsExpansion = description.length > maxLength
  const prefersReducedMotion = useReducedMotion()

  const displayText =
    needsExpansion && !isExpanded
      ? description.slice(0, maxLength).trim() + '...'
      : description

  return (
    <div className={className}>
      <motion.p
        className="text-xs text-muted-foreground/90"
        initial={false}
        animate={{ height: 'auto' }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: duration('normal') }
        }
      >
        {displayText}
      </motion.p>
      {needsExpansion && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className="text-xs text-primary hover:underline mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}
