import * as React from 'react'
import { Badge, cn } from '@clarity-chat/primitives'
import { SettingsIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from '../icons'
import { motion, AnimatePresence } from 'framer-motion'

export type ToolRenderer = React.ComponentType<{
  toolName: string
  args: Record<string, any>
  result?: any
  state: 'partial-call' | 'call' | 'result'
  toolCallId: string
}>

export interface ToolInvocationProps {
  toolName: string
  args: Record<string, any>
  state: 'partial-call' | 'call' | 'result'
  result?: any
  toolCallId: string
  renderers?: Record<string, ToolRenderer>
}

export function ToolInvocation({ 
  toolName, 
  args, 
  state, 
  result, 
  toolCallId,
  renderers 
}: ToolInvocationProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const isComplete = state === 'result'
  const isPartial = state === 'partial-call'

  // Check for custom renderer
  const CustomRenderer = renderers?.[toolName]
  if (CustomRenderer) {
    return (
      <CustomRenderer
        toolName={toolName}
        args={args}
        result={result}
        state={state}
        toolCallId={toolCallId}
      />
    )
  }

  // Handle keyboard interaction for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div className="my-2 max-w-full">
      <div 
        role="button"
        aria-expanded={isExpanded}
        aria-controls={`tool-details-${toolCallId}`}
        tabIndex={0}
        className={cn(
          "flex items-center gap-3 p-2.5 rounded-lg border bg-card/50 text-xs font-mono cursor-pointer hover:bg-muted/50 transition-colors select-none focus:outline-none focus:ring-2 focus:ring-primary/50",
          isPartial ? "border-primary/30 bg-primary/5" : "border-border/60"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={handleKeyDown}
      >
        <div className={cn(
          "flex items-center justify-center w-7 h-7 rounded-md shrink-0 transition-colors",
          isComplete 
            ? "bg-green-500/10 text-green-600 dark:text-green-400" 
            : "bg-primary/10 text-primary"
        )}>
          {isComplete ? (
            <CheckIcon size={14} aria-label="Completed" /> 
          ) : (
            <SettingsIcon size={14} className={isPartial ? "animate-spin" : ""} aria-label="Processing" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground truncate">{toolName}</span>
            <Badge 
              variant={isComplete ? "outline" : "secondary"} 
              className={cn(
                "text-[10px] h-5 px-1.5 font-normal",
                isComplete && "text-green-600 dark:text-green-400 border-green-500/20"
              )}
            >
              {isComplete ? 'Complete' : 'Running...'}
            </Badge>
          </div>
        </div>

        <div className="text-muted-foreground shrink-0">
           {isExpanded ? <ChevronUpIcon size={14} aria-hidden="true" /> : <ChevronDownIcon size={14} aria-hidden="true" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`tool-details-${toolCallId}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
             <div className="p-3 mt-1.5 bg-muted/30 rounded-lg border border-border/40 text-xs font-mono space-y-3">
               <div>
                 <span className="text-muted-foreground/80 font-semibold mb-1 block">Input</span>
                 <pre className="overflow-x-auto p-2.5 bg-background/50 rounded-md border border-border/30 text-foreground/90">
                   {JSON.stringify(args, null, 2)}
                 </pre>
               </div>
               {result && (
                 <div>
                   <span className="text-muted-foreground/80 font-semibold mb-1 block">Result</span>
                   <pre className="overflow-x-auto p-2.5 bg-background/50 rounded-md border border-border/30 text-foreground/90 max-h-40">
                     {JSON.stringify(result, null, 2)}
                   </pre>
                 </div>
               )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
