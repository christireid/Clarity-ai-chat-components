import * as React from 'react'

export interface UseClipboardOptions {
  /**
   * Timeout in ms before resetting copied state
   * @default 2000
   */
  timeout?: number
  /**
   * Callback when copy succeeds
   */
  onSuccess?: () => void
  /**
   * Callback when copy fails
   */
  onError?: (error: Error) => void
}

export interface UseClipboardReturn {
  /**
   * Current clipboard value
   */
  value: string
  /**
   * Whether value was recently copied
   */
  copied: boolean
  /**
   * Copy text to clipboard
   */
  copy: (text: string) => Promise<void>
  /**
   * Reset copied state
   */
  reset: () => void
}

/**
 * Copy text to clipboard with success tracking
 * 
 * @example
 * ```tsx
 * const { copy, copied } = useClipboard({ timeout: 3000 })
 * 
 * return (
 *   <button onClick={() => copy('Hello world')}>
 *     {copied ? 'Copied!' : 'Copy'}
 *   </button>
 * )
 * ```
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000, onSuccess, onError } = options

  const [value, setValue] = React.useState<string>('')
  const [copied, setCopied] = React.useState<boolean>(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const copy = React.useCallback(
    async (text: string) => {
      try {
        // Modern clipboard API
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
        }
        // Fallback for older browsers
        else {
          const textArea = document.createElement('textarea')
          textArea.value = text
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          textArea.style.top = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          
          try {
            document.execCommand('copy')
          } finally {
            textArea.remove()
          }
        }

        setValue(text)
        setCopied(true)
        onSuccess?.()

        // Reset after timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          setCopied(false)
        }, timeout)
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to copy')
        onError?.(err)
        throw err
      }
    },
    [timeout, onSuccess, onError]
  )

  const reset = React.useCallback(() => {
    setCopied(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { value, copied, copy, reset }
}
