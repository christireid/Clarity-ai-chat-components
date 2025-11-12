import { type ClassValue } from 'clsx';
/**
 * Combines class names using clsx and tailwind-merge
 * Useful for merging Tailwind classes and avoiding conflicts
 */
export declare function cn(...inputs: ClassValue[]): string;
/**
 * Format a date to a readable string
 */
export declare function formatDate(date: Date | string): string;
/**
 * Generate a slug from a string
 */
export declare function slugify(text: string): string;
/**
 * Truncate text to a specified length
 */
export declare function truncate(text: string, length: number): string;
/**
 * Debounce function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=utils.d.ts.map