/**
 * Utility for combining class names with Tailwind CSS
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
//# sourceMappingURL=cn.js.map