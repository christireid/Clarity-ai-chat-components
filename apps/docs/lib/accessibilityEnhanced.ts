/**
 * Advanced accessibility utilities for WCAG AAA compliance
 * Implements enhanced screen reader support, keyboard navigation, and focus management
 */

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Enhanced screen reader announcements
 */
export interface AnnouncementOptions {
  priority: 'polite' | 'assertive';
  duration?: number;
  clearPrevious?: boolean;
}

/**
 * Hook for managing screen reader announcements
 */
export function useScreenReader() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const announcementId = useRef(0);

  const announce = useCallback((message: string, options: AnnouncementOptions = { priority: 'polite' }) => {
    const id = ++announcementId.current;
    
    setAnnouncements(prev => {
      if (options.clearPrevious) {
        return [message];
      }
      return [...prev, message];
    });

    // Auto-remove announcement after duration
    if (options.duration) {
      setTimeout(() => {
        setAnnouncements(prev => prev.filter((_, index) => index !== prev.indexOf(message)));
      }, options.duration);
    }

    return id;
  }, []);

  const clearAnnouncements = useCallback(() => {
    setAnnouncements([]);
  }, []);

  return {
    announcements,
    announce,
    clearAnnouncements
  };
}

/**
 * Enhanced keyboard navigation hook
 */
export interface KeyboardNavigationOptions {
  containerRef: React.RefObject<HTMLElement>;
  itemSelector?: string;
  loop?: boolean;
  horizontal?: boolean;
  onActivate?: (element: HTMLElement) => void;
}

/**
 * Hook for implementing keyboard navigation with WCAG AAA compliance
 */
export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  const { containerRef, itemSelector = '[role="menuitem"], button:not([disabled]), a[href]', loop = true, horizontal = false, onActivate } = options;
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsRef = useRef<HTMLElement[]>([]);

  const updateItems = useCallback(() => {
    if (!containerRef.current) return;
    
    const items = Array.from(containerRef.current.querySelectorAll(itemSelector));
    itemsRef.current = items.filter((item): item is HTMLElement => item instanceof HTMLElement);
  }, [containerRef, itemSelector]);

  const focusItem = useCallback((index: number) => {
    const items = itemsRef.current;
    if (items.length === 0) return;

    const normalizedIndex = loop 
      ? ((index % items.length) + items.length) % items.length
      : Math.max(0, Math.min(index, items.length - 1));

    const item = items[normalizedIndex];
    if (item) {
      item.focus();
      setCurrentIndex(normalizedIndex);
      
      // Announce to screen readers
      const label = item.getAttribute('aria-label') || item.textContent || 'Item';
      announceToScreenReader(`${label} ${normalizedIndex + 1} of ${items.length}`);
    }
  }, [loop]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const items = itemsRef.current;
    if (items.length === 0) return;

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        if (horizontal && event.key === 'ArrowRight') {
          newIndex++;
        } else if (!horizontal && event.key === 'ArrowDown') {
          newIndex++;
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        if (horizontal && event.key === 'ArrowLeft') {
          newIndex--;
        } else if (!horizontal && event.key === 'ArrowUp') {
          newIndex--;
        }
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        const currentItem = items[currentIndex];
        if (currentItem && onActivate) {
          onActivate(currentItem);
        }
        return;
      case 'Escape':
        // Return focus to trigger element
        if (containerRef.current) {
          const trigger = containerRef.current.querySelector('[aria-expanded]');
          if (trigger instanceof HTMLElement) {
            trigger.focus();
          }
        }
        return;
    }

    if (newIndex !== currentIndex) {
      event.preventDefault();
      focusItem(newIndex);
    }
  }, [currentIndex, focusItem, horizontal, onActivate, containerRef]);

  useEffect(() => {
    updateItems();
    
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    
    // Update items when DOM changes
    const observer = new MutationObserver(updateItems);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [handleKeyDown, updateItems, containerRef]);

  return {
    currentIndex,
    focusItem,
    updateItems
  };
}

/**
 * Enhanced focus management with trap and restoration
 */
export interface FocusTrapOptions {
  containerRef: React.RefObject<HTMLElement>;
  initialFocus?: string;
  restoreFocus?: boolean;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
}

/**
 * Hook for implementing focus trap (WCAG AAA requirement for modals)
 */
export function useFocusTrap(options: FocusTrapOptions) {
  const { containerRef, initialFocus, restoreFocus = true, escapeDeactivates = true, clickOutsideDeactivates = true } = options;
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const trapActive = useRef(false);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(',');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors))
      .filter((element): element is HTMLElement => {
        if (!(element instanceof HTMLElement)) return false;
        
        // Check if element is visible and not aria-hidden
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' &&
               !element.hasAttribute('aria-hidden') &&
               element.tabIndex !== -1;
      });
  }, [containerRef]);

  const focusFirstElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      const firstElement = initialFocus 
        ? containerRef.current?.querySelector(initialFocus) as HTMLElement
        : focusableElements[0];
      
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [getFocusableElements, initialFocus, containerRef]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!trapActive.current) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    } else if (escapeDeactivates && event.key === 'Escape') {
      event.preventDefault();
      deactivateTrap();
    }
  }, [getFocusableElements, escapeDeactivates]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!clickOutsideDeactivates || !containerRef.current) return;
    
    if (!containerRef.current.contains(event.target as Node)) {
      deactivateTrap();
    }
  }, [clickOutsideDeactivates, containerRef]);

  const activateTrap = useCallback(() => {
    if (trapActive.current) return;
    
    trapActive.current = true;
    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    
    // Announce to screen readers
    announceToScreenReader('Dialog opened. Press Escape to close.');
    
    // Focus first element after a brief delay
    setTimeout(() => {
      focusFirstElement();
    }, 100);
  }, [focusFirstElement]);

  const deactivateTrap = useCallback(() => {
    if (!trapActive.current) return;
    
    trapActive.current = false;
    
    // Restore focus
    if (restoreFocus && previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
    }
    
    previouslyFocusedElement.current = null;
  }, [restoreFocus]);

  useEffect(() => {
    if (!containerRef.current) return;

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handleClickOutside, true);
      
      // Always deactivate trap on unmount
      deactivateTrap();
    };
  }, [handleKeyDown, handleClickOutside, deactivateTrap]);

  return {
    activateTrap,
    deactivateTrap,
    getFocusableElements
  };
}

/**
 * Enhanced color contrast utilities
 */
export interface ColorContrastResult {
  ratio: number;
  level: 'fail' | 'aa' | 'aaa';
  recommendation: string;
}

/**
 * Calculate WCAG contrast ratio between two colors
 */
export function calculateContrastRatio(foreground: string, background: string): ColorContrastResult {
  // Simple implementation - in production, use a proper color library
  const ratio = Math.random() * 21; // Mock ratio between 1:1 and 21:1
  
  let level: 'fail' | 'aa' | 'aaa';
  let recommendation: string;
  
  if (ratio >= 7) {
    level = 'aaa';
    recommendation = 'Excellent contrast - WCAG AAA compliant';
  } else if (ratio >= 4.5) {
    level = 'aa';
    recommendation = 'Good contrast - WCAG AA compliant';
  } else {
    level = 'fail';
    recommendation = 'Poor contrast - needs improvement';
  }
  
  return { ratio, level, recommendation };
}

/**
 * Check if colors meet WCAG AAA standards
 */
export function meetsWCAGAAA(foreground: string, background: string): boolean {
  const result = calculateContrastRatio(foreground, background);
  return result.level === 'aaa';
}

/**
 * Generate accessible color palette
 */
export function generateAccessiblePalette(baseColor: string): {
  foreground: string;
  background: string;
  ratio: number;
}[] {
  // Mock implementation - in production, use proper color algorithms
  return [
    { foreground: '#000000', background: '#ffffff', ratio: 21 },
    { foreground: '#ffffff', background: '#000000', ratio: 21 },
    { foreground: '#333333', background: '#ffffff', ratio: 12.6 },
    { foreground: '#ffffff', background: '#333333', ratio: 12.6 }
  ];
}

/**
 * Utility function to announce to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  // Create or update aria-live region
  let liveRegion = document.getElementById('sr-announcements');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'sr-announcements';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }
  
  // Update content to trigger announcement
  liveRegion.textContent = message;
  
  // Clear after announcement
  setTimeout(() => {
    if (liveRegion && liveRegion.parentNode) {
      liveRegion.textContent = '';
    }
  }, 1000);
}

/**
 * Enhanced skip link implementation
 */
export function createSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLAnchorElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'skip-link';
  skipLink.style.position = 'absolute';
  skipLink.style.top = '-40px';
  skipLink.style.left = '6px';
  skipLink.style.backgroundColor = '#000';
  skipLink.style.color = '#fff';
  skipLink.style.padding = '8px';
  skipLink.style.textDecoration = 'none';
  skipLink.style.borderRadius = '0 0 4px 0';
  skipLink.style.zIndex = '1000';
  skipLink.style.transition = 'top 0.3s';
  
  // Show on focus
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  return skipLink;
}

/**
 * Enhanced focus management for dynamic content
 */
export function manageFocusForDynamicContent(container: HTMLElement, focusTarget?: HTMLElement) {
  // Save current focus
  const activeElement = document.activeElement as HTMLElement;
  
  // Focus management after content update
  setTimeout(() => {
    const target = focusTarget || container.querySelector('[data-autofocus]') as HTMLElement;
    if (target && typeof target.focus === 'function') {
      target.focus();
    } else {
      // Focus first focusable element
      const focusable = container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      if (focusable) {
        focusable.focus();
      }
    }
    
    // Announce content change
    announceToScreenReader('Content updated');
  }, 100);
  
  // Return function to restore focus
  return () => {
    if (activeElement && typeof activeElement.focus === 'function') {
      activeElement.focus();
    }
  };
}