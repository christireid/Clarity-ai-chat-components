/**
 * Enhanced Accessibility Utilities
 * 
 * Consolidates accessibility utilities from:
 * - /apps/docs/lib/accessibility/accessibilityEnhanced.ts (405 lines)
 * - /packages/error-handling/src/hooks/useAccessibility.ts (139 lines)
 * 
 * Provides comprehensive WCAG AAA compliant accessibility utilities for React components
 * 
 * @module @clarity-chat/error-handling/accessibility
 * 
 * @example
 * ```tsx
 * import {
 *   useFocusManagement,
 *   useScreenReaderAnnounce,
 *   useHighContrastMode,
 *   useReducedMotion,
 *   useColorContrast,
 *   useKeyboardNavigation
 * } from '@clarity-chat/error-handling/accessibility'
 * 
 * function AccessibleComponent() {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   
 *   // Focus management with trapping and restoration
 *   useFocusManagement(containerRef, {
 *     trapFocus: true,
 *     restoreFocus: true,
 *     initialFocus: '#first-input'
 *   });
 *   
 *   // Screen reader announcements
 *   useScreenReaderAnnounce('Form submitted successfully', {
 *     priority: 'polite',
 *     delay: 500
 *   });
 *   
 *   // High contrast mode detection
 *   const isHighContrast = useHighContrastMode();
 *   
 *   // Reduced motion preference
 *   const prefersReducedMotion = useReducedMotion();
 *   
 *   return <div ref={containerRef}>...</div>;
 * }
 * ```
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// ============================================================================
// Focus Management
// ============================================================================

export interface FocusManagementOptions {
  trapFocus?: boolean;
  restoreFocus?: boolean;
  initialFocus?: string;
  returnFocus?: string;
}

/**
 * Enhanced focus management hook for WCAG AAA compliance
 * Manages focus trapping, restoration, and initial focus setting
 */
export function useFocusManagement(
  containerRef: React.RefObject<HTMLElement>,
  options: FocusManagementOptions = {}
) {
  const { trapFocus = false, restoreFocus = true, initialFocus, returnFocus } = options;
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Store current focus before managing
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements using comprehensive selectors
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'area[href]',
      'iframe',
      'object',
      'embed',
      '[contenteditable]'
    ].join(', ');

    focusableElementsRef.current = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ).filter((el): el is HTMLElement => el instanceof HTMLElement && isFocusable(el));

    // Set initial focus if specified
    if (initialFocus) {
      const initialElement = containerRef.current.querySelector(initialFocus) as HTMLElement;
      if (initialElement && focusableElementsRef.current.includes(initialElement)) {
        initialElement.focus({ preventScroll: false });
        console.log('Focus set to initial element', { selector: initialFocus });
      }
    } else if (focusableElementsRef.current.length > 0) {
      focusableElementsRef.current[0]?.focus({ preventScroll: false });
      console.log('Focus set to first focusable element');
    }

    // Handle focus trapping
    if (trapFocus && focusableElementsRef.current.length > 0) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        event.preventDefault();
        const currentIndex = focusableElementsRef.current.indexOf(
          document.activeElement as HTMLElement
        );
        const nextIndex = event.shiftKey
          ? (currentIndex - 1 + focusableElementsRef.current.length) % focusableElementsRef.current.length
          : (currentIndex + 1) % focusableElementsRef.current.length;

        focusableElementsRef.current[nextIndex]?.focus();
        console.log('Focus trapped to next element', { direction: event.shiftKey ? 'previous' : 'next' });
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [containerRef, trapFocus, initialFocus]);

  // Restore focus on unmount
  useEffect(() => {
    return () => {
      if (restoreFocus && previousFocusRef.current) {
        const elementToFocus = returnFocus
          ? (document.querySelector(returnFocus) as HTMLElement)
          : previousFocusRef.current;

        if (elementToFocus && elementToFocus.focus) {
          elementToFocus.focus({ preventScroll: true });
          console.log('Focus restored to previous element');
        }
      }
    };
  }, [restoreFocus, returnFocus]);

  return {
    previousFocusRef,
    focusableElementsRef,
    getFirstFocusable: () => focusableElementsRef.current[0] || null,
    getLastFocusable: () => focusableElementsRef.current[focusableElementsRef.current.length - 1] || null,
    focusNext: () => {
      const currentIndex = focusableElementsRef.current.indexOf(document.activeElement as HTMLElement);
      const nextIndex = (currentIndex + 1) % focusableElementsRef.current.length;
      focusableElementsRef.current[nextIndex]?.focus();
    },
    focusPrevious: () => {
      const currentIndex = focusableElementsRef.current.indexOf(document.activeElement as HTMLElement);
      const prevIndex = (currentIndex - 1 + focusableElementsRef.current.length) % focusableElementsRef.current.length;
      focusableElementsRef.current[prevIndex]?.focus();
    }
  };
}

/**
 * Check if an element is focusable
 */
function isFocusable(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;
  
  // Check if element is disabled
  if (element.hasAttribute('disabled')) return false;
  
  // Check if element is hidden
  if (element.hidden) return false;
  
  // Check if element has negative tabindex
  if (element.getAttribute('tabindex') === '-1') return false;
  
  // Check visibility
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  
  return true;
}

// ============================================================================
// Screen Reader Announcements
// ============================================================================

export interface ScreenReaderAnnounceOptions {
  priority?: 'polite' | 'assertive';
  delay?: number;
}

/**
 * Enhanced screen reader announcement hook
 * Creates and manages ARIA live regions for screen reader compatibility
 */
export function useScreenReaderAnnounce(
  message: string,
  options: ScreenReaderAnnounceOptions = {}
) {
  const { priority = 'polite', delay = 0 } = options;
  const announcementRef = useRef<HTMLDivElement | null>(null);
  const [isAnnouncing, setIsAnnouncing] = useState(false);

  useEffect(() => {
    if (!message) return;

    // Create or get announcement region
    if (!announcementRef.current) {
      const region = document.createElement('div');
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.style.position = 'absolute';
      region.style.left = '-10000px';
      region.style.width = '1px';
      region.style.height = '1px';
      region.style.overflow = 'hidden';
      document.body.appendChild(region);
      announcementRef.current = region;
      console.log('Created ARIA live region', { priority });
    }

    const timeoutId = setTimeout(() => {
      if (announcementRef.current) {
        // Clear previous content first to ensure screen readers pick up the new content
        announcementRef.current.textContent = '';
        
        // Use a small delay to ensure the clear is processed
        setTimeout(() => {
          if (announcementRef.current) {
            announcementRef.current.textContent = message;
            setIsAnnouncing(true);
            
            // Reset announcing state after a reasonable time
            setTimeout(() => setIsAnnouncing(false), 1000);
            console.log('Screen reader announcement', { message, priority });
          }
        }, 100);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [message, priority, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
        announcementRef.current = null;
        console.log('Removed ARIA live region');
      }
    };
  }, []);

  return {
    isAnnouncing,
    clearAnnouncement: () => {
      if (announcementRef.current) {
        announcementRef.current.textContent = '';
        setIsAnnouncing(false);
      }
    }
  };
}

// ============================================================================
// High Contrast Mode
// ============================================================================

/**
 * Detects high contrast mode preferences
 * Supports Windows high contrast mode and CSS forced-colors
 */
export function useHighContrastMode(): boolean {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const checkHighContrast = () => {
      // Check for Windows high contrast mode
      const isWindowsHighContrast = window.matchMedia('(-ms-high-contrast: active)').matches;
      
      // Check for forced colors (CSS media query)
      const isForcedColors = window.matchMedia('(forced-colors: active)').matches;
      
      const highContrast = isWindowsHighContrast || isForcedColors;
      setIsHighContrast(highContrast);
      
      if (highContrast) {
        console.log('High contrast mode detected', {
          windowsHighContrast: isWindowsHighContrast,
          forcedColors: isForcedColors
        });
      }
    };

    checkHighContrast();

    // Listen for changes
    const mediaQuery1 = window.matchMedia('(-ms-high-contrast: active)');
    const mediaQuery2 = window.matchMedia('(forced-colors: active)');

    if (mediaQuery1.addEventListener) {
      mediaQuery1.addEventListener('change', checkHighContrast);
      mediaQuery2.addEventListener('change', checkHighContrast);
    } else {
      // Fallback
      mediaQuery1.addListener(checkHighContrast);
      mediaQuery2.addListener(checkHighContrast);
    }

    return () => {
      if (mediaQuery1.removeEventListener) {
        mediaQuery1.removeEventListener('change', checkHighContrast);
        mediaQuery2.removeEventListener('change', checkHighContrast);
      } else {
        mediaQuery1.removeListener(checkHighContrast);
        mediaQuery2.removeListener(checkHighContrast);
      }
    };
  }, []);

  return isHighContrast;
}

// ============================================================================
// Reduced Motion
// ============================================================================

/**
 * Detects user preference for reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
      console.log('Reduced motion preference changed', { prefersReducedMotion: event.matches });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// ============================================================================
// Color Contrast
// ============================================================================

export interface ColorContrastResult {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  largeAA: boolean;
  largeAAA: boolean;
}

/**
 * Calculate color contrast ratio between two colors
 * Returns WCAG compliance levels (AA, AAA, Large AA, Large AAA)
 */
export function useColorContrast(
  foregroundColor: string,
  backgroundColor: string
): ColorContrastResult {
  const [contrast, setContrast] = useState<ColorContrastResult>({
    ratio: 0,
    aa: false,
    aaa: false,
    largeAA: false,
    largeAAA: false
  });

  useEffect(() => {
    try {
      const ratio = calculateContrastRatio(foregroundColor, backgroundColor);
      const result = {
        ratio,
        aa: ratio >= 4.5,
        aaa: ratio >= 7,
        largeAA: ratio >= 3,
        largeAAA: ratio >= 4.5
      };
      setContrast(result);
      
      console.log('Color contrast calculated', {
        foreground: foregroundColor,
        background: backgroundColor,
        ratio,
        wcag: result
      });
    } catch (error) {
      console.error('Color contrast calculation failed', {
        foreground: foregroundColor,
        background: backgroundColor,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }, [foregroundColor, backgroundColor]);

  return contrast;
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(color1: string, color2: string): number {
  // Convert colors to RGB
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format');
  }

  // Calculate relative luminance
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);

  // Calculate contrast ratio
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Handle both #ffffff and ffffff formats
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return null;
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  if (!result || !result[1] || !result[2] || !result[3]) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

/**
 * Calculate relative luminance from RGB
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  const sRGB = [r, g, b].map(value => {
    value = value / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  }) as [number, number, number];

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

// ============================================================================
// Keyboard Navigation
// ============================================================================

export interface KeyboardNavigationOptions {
  onEnter?: (event: KeyboardEvent) => void;
  onEscape?: (event: KeyboardEvent) => void;
  onArrowUp?: (event: KeyboardEvent) => void;
  onArrowDown?: (event: KeyboardEvent) => void;
  onArrowLeft?: (event: KeyboardEvent) => void;
  onArrowRight?: (event: KeyboardEvent) => void;
  onTab?: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
}

/**
 * Enhanced keyboard navigation hook
 * Provides keyboard event handling with WCAG compliance
 */
export function useKeyboardNavigation(
  options: KeyboardNavigationOptions = {}
) {
  const { preventDefault = false } = options;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMap = {
        Enter: options.onEnter,
        Escape: options.onEscape,
        ArrowUp: options.onArrowUp,
        ArrowDown: options.onArrowDown,
        ArrowLeft: options.onArrowLeft,
        ArrowRight: options.onArrowRight,
        Tab: options.onTab
      };

      const handler = keyMap[event.key as keyof typeof keyMap];
      
      if (handler) {
        if (preventDefault) {
          event.preventDefault();
        }
        handler(event);
        console.log('Keyboard navigation event handled', { key: event.key });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [options, preventDefault]);
}

// ============================================================================
// Focus Management Utilities (from error-handling)
// ============================================================================

/**
 * Hook to manage focus when errors occur
 * Returns focus to the previously focused element on recovery
 * 
 * @deprecated Use useFocusManagement instead for better WCAG compliance
 */
export function useFocusManagementLegacy() {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const errorContainerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Capture current focus before error
   */
  const captureFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    console.log('Focus captured for error handling');
  }, []);

  /**
   * Move focus to error container
   */
  const focusError = useCallback(() => {
    if (errorContainerRef.current) {
      errorContainerRef.current.focus({ preventScroll: false });
      console.log('Focus moved to error container');
    }
  }, []);

  /**
   * Restore focus to previously focused element
   */
  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && previousFocusRef.current.focus) {
      previousFocusRef.current.focus({ preventScroll: true });
      previousFocusRef.current = null;
      console.log('Focus restored to previous element');
    }
  }, []);

  return {
    previousFocusRef,
    errorContainerRef,
    captureFocus,
    focusError,
    restoreFocus,
  };
}

/**
 * Hook to trap focus within a container (for modal-like error displays)
 * 
 * @deprecated Use useFocusManagement with trapFocus option instead
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef]);
}

/**
 * Hook to announce messages to screen readers (legacy version)
 * 
 * @deprecated Use useScreenReaderAnnounce instead
 */
export function useAnnounce() {
  const announceRef = useRef<HTMLDivElement | null>(null);

  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!announceRef.current) return;

      // Clear previous announcement
      announceRef.current.textContent = '';

      // Set aria-live attribute
      announceRef.current.setAttribute('aria-live', priority);

      // Use setTimeout to ensure screen readers pick up the change
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = message;
        }
      }, 100);
      
      console.log('Screen reader announcement (legacy)', { message, priority });
    },
    []
  );

  return { announceRef, announce };
}

/**
 * Check if user prefers reduced motion (legacy version)
 * 
 * @deprecated Use useReducedMotion instead
 */
export function usePrefersReducedMotionLegacy(): boolean {
  const mediaQuery =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  return mediaQuery?.matches ?? false;
}

/**
 * Generate unique IDs for ARIA relationships
 * 
 * @deprecated Use React's built-in useId hook instead
 */
export function useIdLegacy(prefix: string): string {
  const idRef = useRef<string | undefined>(undefined);
  if (!idRef.current) {
    idRef.current = `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
  }
  return idRef.current;
}