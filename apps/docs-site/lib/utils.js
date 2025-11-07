import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
/**
 * Combines class names using clsx and tailwind-merge
 * Useful for merging Tailwind classes and avoiding conflicts
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * Format a date to a readable string
 */
export function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}
/**
 * Generate a slug from a string
 */
export function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
/**
 * Truncate text to a specified length
 */
export function truncate(text, length) {
    if (text.length <= length)
        return text;
    return text.slice(0, length).trim() + '...';
}
/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
//# sourceMappingURL=utils.js.map