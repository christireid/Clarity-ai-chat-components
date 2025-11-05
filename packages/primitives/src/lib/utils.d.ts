import { type ClassValue } from 'clsx';
/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 */
export declare function cn(...inputs: ClassValue[]): string;
/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export declare function formatRelativeTime(date: Date): string;
/**
 * Copy text to clipboard
 */
export declare function copyToClipboard(text: string): Promise<boolean>;
/**
 * Generate unique ID
 */
export declare function generateId(): string;
/**
 * Truncate text with ellipsis
 */
export declare function truncate(text: string, maxLength: number): string;
/**
 * Format file size
 */
export declare function formatFileSize(bytes: number): string;
//# sourceMappingURL=utils.d.ts.map