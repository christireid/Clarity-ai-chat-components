/**
 * AutoResizeTextarea Component
 *
 * Textarea that automatically resizes based on content.
 * Respects min/max row constraints.
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

export interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number
  maxRows?: number
}

/**
 * AutoResizeTextarea - Auto-resizing textarea
 *
 * Automatically adjusts height based on content while respecting row constraints.
 */
export const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(function AutoResizeTextarea(
  { minRows = 1, maxRows = 5, className, value, onChange, ...props },
  ref
) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const combinedRef = React.useCallback(
    (node: HTMLTextAreaElement) => {
      textareaRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )

  // Auto-resize effect
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get accurate scrollHeight
    textarea.style.height = 'auto'

    // Calculate line height from computed styles
    const computedStyle = window.getComputedStyle(textarea)
    const lineHeight = parseInt(computedStyle.lineHeight, 10) || 24
    const paddingTop = parseInt(computedStyle.paddingTop, 10) || 0
    const paddingBottom = parseInt(computedStyle.paddingBottom, 10) || 0

    const minHeight = lineHeight * minRows + paddingTop + paddingBottom
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom

    // Set height based on content, clamped between min and max
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
    textarea.style.height = `${newHeight}px`
  }, [value, minRows, maxRows])

  return (
    <textarea
      ref={combinedRef}
      value={value}
      onChange={onChange}
      className={cn(
        'resize-none bg-transparent outline-none w-full',
        'placeholder:text-muted-foreground/60',
        'scrollbar-hide',
        className
      )}
      rows={minRows}
      {...props}
    />
  )
})

AutoResizeTextarea.displayName = 'AutoResizeTextarea'
