import * as React from 'react'

/**
 * Attach event listener to element with automatic cleanup
 * 
 * @example
 * ```tsx
 * const buttonRef = useRef<HTMLButtonElement>(null)
 * 
 * useEventListener('click', (e) => {
 *   console.log('Button clicked!', e)
 * }, buttonRef)
 * 
 * // Or listen to window/document
 * useEventListener('keydown', (e) => {
 *   if (e.key === 'Escape') setModalOpen(false)
 * })
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: React.RefObject<HTMLElement> | null,
  options?: boolean | AddEventListenerOptions
): void
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: React.RefObject<Document>,
  options?: boolean | AddEventListenerOptions
): void
export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: React.RefObject<HTMLElement>,
  options?: boolean | AddEventListenerOptions
): void
export function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KD extends keyof DocumentEventMap,
  T extends HTMLElement | Document | Window = HTMLElement | Document | Window
>(
  eventName: KW | KH | KD,
  handler: (event: Event | WindowEventMap[KW] | HTMLElementEventMap[KH] | DocumentEventMap[KD]) => void,
  element?: React.RefObject<T> | null,
  options?: boolean | AddEventListenerOptions
): void {
  // Create a ref that stores handler
  const savedHandler = React.useRef(handler)

  React.useLayoutEffect(() => {
    savedHandler.current = handler
  }, [handler])

  React.useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current ?? window

    if (!(targetElement && targetElement.addEventListener)) return

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = (event) => savedHandler.current(event)

    targetElement.addEventListener(eventName, listener as EventListener, options)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener as EventListener, options)
    }
  }, [eventName, element, options])
}
