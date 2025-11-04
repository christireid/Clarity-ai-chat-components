/**
 * Accessibility Utilities
 *
 * WCAG 2.1 AAA compliance utilities
 */
/**
 * Generate unique ID for ARIA attributes
 */
export declare function generateAriaId(prefix?: string): string;
/**
 * Announce message to screen readers
 */
export declare function announceToScreenReader(message: string, priority?: 'polite' | 'assertive'): void;
/**
 * Check if element is visible to screen readers
 */
export declare function isVisibleToScreenReader(element: HTMLElement): boolean;
/**
 * Get accessible name for element
 */
export declare function getAccessibleName(element: HTMLElement): string;
/**
 * Create live region for announcements
 */
export declare function createLiveRegion(id?: string): HTMLElement;
/**
 * Check WCAG contrast ratio
 */
export declare function checkContrastRatio(foreground: string, background: string): {
    ratio: number;
    passesAA: boolean;
    passesAAA: boolean;
    level: 'AAA' | 'AA' | 'Fail';
};
/**
 * Screen reader only CSS class
 */
export declare const srOnlyStyles: {
    position: "absolute";
    width: string;
    height: string;
    padding: number;
    margin: string;
    overflow: string;
    clip: string;
    whiteSpace: "nowrap";
    borderWidth: number;
};
/**
 * Skip to content link
 */
export declare function createSkipLink(targetId: string, text?: string): HTMLElement;
/**
 * Validate ARIA attributes
 */
export declare function validateAriaAttributes(element: HTMLElement): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=a11y-utils.d.ts.map