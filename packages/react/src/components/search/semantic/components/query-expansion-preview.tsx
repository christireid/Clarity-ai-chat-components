'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@clarity-chat/primitives'
import { Wand2, ChevronDown, ChevronUp } from 'lucide-react'
import { DURATION_SECONDS as durations } from '@/animations/constants'

// Type assertions for icons
const WandIcon = Wand2 as React.ComponentType<{ className?: string }>
const ChevronDownIcon = ChevronDown as React.ComponentType<{
  className?: string
}>
const ChevronUpIcon = ChevronUp as React.ComponentType<{ className?: string }>

export interface QueryExpansionPreviewProps {
  queries: string[]
  query: string
  enabled: boolean
  prefersReducedMotion?: boolean
}

export function QueryExpansionPreview({
  queries,
  query,
  enabled,
  prefersReducedMotion = false,
}: QueryExpansionPreviewProps) {
  const [showExpansions, setShowExpansions] = React.useState(false)

  if (!enabled || queries.length <= 1 || !query) return null

  return (
    <motion.div
      initial={
        prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }
      }
      animate={
        prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }
      }
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
      viewport={{ once: true }}
    >
      <button
        onClick={() => setShowExpansions(!showExpansions)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <WandIcon className="h-3 w-3" />
        {showExpansions ? 'Hide' : 'Show'} related terms ({queries.length - 1})
        {showExpansions ? (
          <ChevronUpIcon className="h-3 w-3" />
        ) : (
          <ChevronDownIcon className="h-3 w-3" />
        )}
      </button>
      {prefersReducedMotion ? (
        showExpansions && (
          <div className="mt-2 flex flex-wrap gap-1">
            {queries.slice(1).map((term, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {term}
              </Badge>
            ))}
          </div>
        )
      ) : (
        <AnimatePresence>
          {showExpansions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: durations.normal }}
              viewport={{ once: true }}
              className="mt-2 flex flex-wrap gap-1"
            >
              {queries.slice(1).map((term, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {term}
                </Badge>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}

QueryExpansionPreview.displayName = 'QueryExpansionPreview'
