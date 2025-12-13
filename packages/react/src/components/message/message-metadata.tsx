import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { motion, AnimatePresence } from 'framer-motion'
import { LinkIcon, FileIcon, InfoIcon, ChevronDownIcon, ChevronUpIcon } from '../icons'
import { cn } from '@clarity-chat/primitives'

export interface MessageMetadataProps {
  metadata?: Message['metadata'] & {
    citations?: Array<{
      title: string
      url?: string
      sourceType?: 'file' | 'web' | 'memory'
    }>
    memoryUsed?: boolean
  }
}

/**
 * Message metadata component (tokens, processing time, model, context citations)
 * Extracted from Message component for better organization
 */
export const MessageMetadata = React.memo<MessageMetadataProps>(
  ({ metadata }) => {
    const [isExpanded, setIsExpanded] = React.useState(false)
    if (!metadata) return null

    const hasContext = (metadata.citations && metadata.citations.length > 0) || metadata.memoryUsed

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground/80">
          {metadata.model && <span title="Model">🤖 {metadata.model}</span>}
          {metadata.tokens && <span title="Token usage">{metadata.tokens} tokens</span>}
          {metadata.processingTime && (
            <span title="Latency">⚡ {metadata.processingTime}ms</span>
          )}
          
          {hasContext && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 hover:text-primary transition-colors ml-auto text-[10px] uppercase tracking-wider font-medium bg-muted/50 px-2 py-0.5 rounded-full"
              aria-expanded={isExpanded}
            >
              <InfoIcon size={10} />
              <span>Context Used</span>
              {isExpanded ? <ChevronUpIcon size={10} /> : <ChevronDownIcon size={10} />}
            </button>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && hasContext && (
             <motion.div
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="overflow-hidden"
             >
               <div className="bg-muted/30 border border-border/40 rounded-lg p-2.5 text-xs space-y-2">
                  <div className="font-medium text-muted-foreground mb-1">Sources & Context</div>
                  {metadata.memoryUsed && (
                    <div className="flex items-center gap-2 text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span>Long-term memory context applied</span>
                    </div>
                  )}
                  {metadata.citations?.map((citation, i) => (
                    <a 
                      key={i} 
                      href={citation.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors block truncate",
                        citation.url ? "text-primary hover:underline" : "text-foreground/80"
                      )}
                    >
                      {citation.sourceType === 'file' ? <FileIcon size={12} /> : <LinkIcon size={12} />}
                      <span className="truncate">{citation.title}</span>
                    </a>
                  ))}
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

MessageMetadata.displayName = 'MessageMetadata'
