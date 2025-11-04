import * as React from 'react';
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
export declare function useEventListener<K extends keyof WindowEventMap>(eventName: K, handler: (event: WindowEventMap[K]) => void, element?: React.RefObject<HTMLElement> | null, options?: boolean | AddEventListenerOptions): void;
export declare function useEventListener<K extends keyof DocumentEventMap>(eventName: K, handler: (event: DocumentEventMap[K]) => void, element: React.RefObject<Document>, options?: boolean | AddEventListenerOptions): void;
export declare function useEventListener<K extends keyof HTMLElementEventMap>(eventName: K, handler: (event: HTMLElementEventMap[K]) => void, element: React.RefObject<HTMLElement>, options?: boolean | AddEventListenerOptions): void;
//# sourceMappingURL=use-event-listener.d.ts.map