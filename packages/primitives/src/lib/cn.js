/**
 * Tailwind CSS class name utility
 *
 * Combines clsx for conditional classes with tailwind-merge for conflict resolution
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500', 'text-white')
 * // => 'px-2 py-1 bg-blue-500 text-white' (if condition is true)
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
//# sourceMappingURL=cn.js.map