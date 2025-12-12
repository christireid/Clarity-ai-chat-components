/**
 * Class Name Utility
 *
 * Combines clsx and tailwind-merge for safe className composition.
 * Matches the pattern used in the main library.
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with Tailwind conflict resolution.
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500', 'px-4')
 * // Returns: 'py-1 bg-blue-500 px-4' (px-4 overrides px-2)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
