import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { truncate } from '@clarity-chat/utils/format'
import { debounce } from '@clarity-chat/utils/async'

/**
 * Combines class names using clsx and tailwind-merge
 * Useful for merging Tailwind classes and avoiding conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export { truncate, debounce }
