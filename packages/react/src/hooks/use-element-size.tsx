import * as React from 'react'

export interface ElementSize {
  width: number
  height: number
}

export interface UseElementSizeOptions {
  /**
   * Debounce resize updates (milliseconds)
   * @default 0 (no debounce)
   */
  debounceMs?: number
  /**
   * Observe which dimension changes
   * @default 'both'
   */
  observe?: 'width' | 'height' | 'both'
  /**
   * Callback when size changes
   */
  onChange?: (size: ElementSize) => void
  /**
   * Use content box sizing (default: border-box)
   * @default false
   */
  useContentBox?: boolean
  /**
   * Initial size before element is measured
   */
  initialSize?: ElementSize
}

export interface UseElementSizeReturn {
  /**
   * Ref to attach to element (callback ref for dynamic elements)
   */
  ref: React.RefCallback<HTMLElement>
  /**
   * Current element size
   */
  size: ElementSize
  /**
   * Width of the element
   */
  width: number
  /**
   * Height of the element
   */
  height: number
}

/**
 * Track element size using ResizeObserver with debouncing and callbacks.
 * More accurate than window resize events, works for any element.
 * 
 * **Features**:
 * - Uses modern ResizeObserver API (60fps updates)
 * - Callback ref support for dynamic elements
 * - Debouncing for performance
 * - Selective dimension observation
 * - Content box or border box sizing
 * - onChange callback for custom handling
 * - SSR-safe with initial size
 * 
 * **Use Cases**:
 * - Responsive component rendering
 * - Canvas/SVG sizing
 * - Dynamic layouts
 * - Conditional rendering based on element size
 * - Chart/graph sizing
 * 
 * @example
 * ```tsx
 * const { ref, width, height } = useElementSize()
 * 
 * return (
 *   <div ref={ref}>
 *     Element size: {width} x {height}
 *     {width < 400 ? <CompactView /> : <FullView />}
 *   </div>
 * )
 * ```
 * 
 * @example
 * ```tsx
 * // With debouncing and callback
 * const { ref, size } = useElementSize({
 *   debounceMs: 150,
 *   onChange: (size) => {
 *     console.log('Element resized:', size)
 *   },
 *   observe: 'width', // Only track width changes
 * })
 * 
 * return <div ref={ref}>Responsive element</div>
 * ```
 * 
 * @example
 * ```tsx
 * // Canvas sizing
 * const { ref, width, height } = useElementSize({
 *   useContentBox: true, // Use content box for canvas
 * })
 * 
 * return (
 *   <div ref={ref}>
 *     <canvas width={width} height={height} />
 *   </div>
 * )
 * ```
 * 
 * @example
 * ```tsx
 * // SSR-safe with initial size
 * const { ref, width } = useElementSize({
 *   initialSize: { width: 1200, height: 600 },
 * })
 * 
 * // On server: width = 1200
 * // On client: width = actual measured width
 * return <div ref={ref} style={{ width }}>Content</div>
 * ```
 */
export function useElementSize(
  options: UseElementSizeOptions = {}
): UseElementSizeReturn {
  const {
    debounceMs = 0,
    observe = 'both',
    onChange,
    useContentBox = false,
    initialSize = { width: 0, height: 0 },
  } = options

  const [size, setSize] = React.useState<ElementSize>(initialSize)
  
  const elementRef = React.useRef<HTMLElement | null>(null)
  const observerRef = React.useRef<ResizeObserver | null>(null)
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const onChangeRef = React.useRef(onChange)

  // Keep onChange ref up to date
  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  /**
   * Update size with optional debouncing
   */
  const updateSize = React.useCallback(
    (newSize: ElementSize) => {
      // Check if size actually changed based on observe option
      const shouldUpdate =
        observe === 'both' ||
        (observe === 'width' && newSize.width !== size.width) ||
        (observe === 'height' && newSize.height !== size.height)

      if (!shouldUpdate) return

      if (debounceMs > 0) {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }

        debounceTimeoutRef.current = setTimeout(() => {
          setSize(newSize)
          onChangeRef.current?.(newSize)
          debounceTimeoutRef.current = null
        }, debounceMs)
      } else {
        setSize(newSize)
        onChangeRef.current?.(newSize)
      }
    },
    [debounceMs, observe, size.width, size.height]
  )

  /**
   * Callback ref that supports dynamic elements
   */
  const ref = React.useCallback(
    (node: HTMLElement | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      // Clear pending debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = null
      }

      elementRef.current = node

      if (!node) return

      // Check for ResizeObserver support
      if (typeof window === 'undefined' || !window.ResizeObserver) {
        // SSR or old browser - use initial size
        return
      }

      // Create ResizeObserver
      observerRef.current = new ResizeObserver((entries) => {
        if (!Array.isArray(entries) || entries.length === 0) return

        const entry = entries[0]
        
        // Get size based on box model preference
        const boxSize = useContentBox
          ? entry.contentBoxSize
          : entry.borderBoxSize

        // Handle both array and single object formats
        const box = Array.isArray(boxSize) ? boxSize[0] : boxSize

        if (box) {
          updateSize({
            width: Math.round(box.inlineSize),
            height: Math.round(box.blockSize),
          })
        } else {
          // Fallback to content rect
          updateSize({
            width: Math.round(entry.contentRect.width),
            height: Math.round(entry.contentRect.height),
          })
        }
      })

      observerRef.current.observe(node)
    },
    [updateSize, useContentBox]
  )

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return {
    ref,
    size,
    width: size.width,
    height: size.height,
  }
}
