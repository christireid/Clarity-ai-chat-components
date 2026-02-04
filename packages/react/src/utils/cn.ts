/**
 * Utility function to merge CSS class names
 *
 * Filters out falsy values and joins class names with spaces.
 * Note: This is a simplified implementation that does NOT handle
 * Tailwind CSS class conflicts. For proper Tailwind conflict resolution,
 * consider using `clsx` + `tailwind-merge` or `@clarity-chat/primitives`
 * which provides the full implementation.
 *
 * @param inputs - Class names, which can include strings, numbers, booleans, undefined, or null
 * @returns Merged class name string
 *
 * @example
 * ```ts
 * cn('px-2 py-1', undefined, 'text-sm') // "px-2 py-1 text-sm"
 * cn('flex', false && 'hidden', true && 'visible') // "flex visible"
 * cn(null, 'mt-4') // "mt-4"
 * ```
 */
export function cn(
  ...inputs: Array<string | number | boolean | undefined | null>
): string {
  return inputs
    .filter(Boolean)
    .map(String)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}