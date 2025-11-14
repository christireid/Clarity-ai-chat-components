/**
 * Utility for combining class names with Tailwind CSS
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
