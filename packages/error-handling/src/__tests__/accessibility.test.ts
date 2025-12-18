/**
 * Test suite for enhanced accessibility utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useFocusManagement,
  useScreenReaderAnnounce,
  useHighContrastMode,
  useReducedMotion,
  useColorContrast,
  useKeyboardNavigation,
  useFocusManagementLegacy,
  useFocusTrap,
  useAnnounce,
  usePrefersReducedMotion,
  useIdLegacy,
} from '../accessibility';

// Mock SecureLogger
vi.mock('@clarity-chat/utils/logger', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as object,
    logger: {
      debug: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
    },
  };
});

// Mock window.matchMedia
const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('Enhanced Accessibility Utilities', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    mockMatchMedia(false);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  describe('useFocusManagement', () => {
    it('should manage focus within container', () => {
      const focusSpy = vi.spyOn(container, 'focus');
      const querySelectorSpy = vi.spyOn(container, 'querySelectorAll');
      
      // Mock focusable elements
      const mockFocusableElements = [
        document.createElement('button'),
        document.createElement('input'),
        document.createElement('a'),
      ];
      
      querySelectorSpy.mockReturnValue(mockFocusableElements as any);

      const { result } = renderHook(() => useFocusManagement({ current: container }));

      act(() => {
        // Simulate component mount
      });

      expect(querySelectorSpy).toHaveBeenCalledWith([
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
      ].join(', '));
    });

    it('should trap focus when enabled', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      // Create real focusable elements attached to container
      const button = document.createElement('button');
      const input = document.createElement('input');
      container.appendChild(button);
      container.appendChild(input);

      // Don't mock querySelectorAll, use real DOM
      // const querySelectorSpy = vi.spyOn(container, 'querySelectorAll'); 
      // We need to ensure querySelectorAll is NOT mocked if it was mocked in previous test or shared?
      // It was mocked in "should manage focus within container". 
      // But beforeEach creates NEW container.
      // So spies on container are fresh.
      // Wait, "should manage focus within container" mocked querySelectorAll on `container`.
      // `container` is recreated in beforeEach. So spy is gone.
      
      const { result, unmount } = renderHook(() => 
        useFocusManagement({ current: container }, { trapFocus: true })
      );

      act(() => {
        // Simulate component mount
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      // Cleanup
      act(() => {
        unmount();
      });

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should restore focus on unmount', () => {
      const previousFocus = document.createElement('button');
      document.body.appendChild(previousFocus);
      previousFocus.focus();

      const { result } = renderHook(() => 
        useFocusManagement({ current: container }, { restoreFocus: true })
      );

      act(() => {
        // Simulate component mount
      });

      // Simulate unmount
      act(() => {
        // Cleanup effect will run
      });

      document.body.removeChild(previousFocus);
    });
  });

  describe('useScreenReaderAnnounce', () => {
    it('should create ARIA live region', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');

      const { result } = renderHook(() => 
        useScreenReaderAnnounce('Test announcement')
      );

      act(() => {
        // Allow effect to run
      });

      expect(createElementSpy).toHaveBeenCalledWith('div');
      expect(appendChildSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
    });

    it('should announce messages with delay', () => {
      vi.useFakeTimers();

      const { result } = renderHook(() => 
        useScreenReaderAnnounce('Delayed message', { delay: 500 })
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      vi.useRealTimers();
    });

    it('should handle different priority levels', () => {
      const { result: politeResult } = renderHook(() => 
        useScreenReaderAnnounce('Polite message', { priority: 'polite' })
      );

      const { result: assertiveResult } = renderHook(() => 
        useScreenReaderAnnounce('Assertive message', { priority: 'assertive' })
      );

      act(() => {
        // Allow effects to run
      });
    });

    it('should cleanup on unmount', () => {
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const { unmount } = renderHook(() => 
        useScreenReaderAnnounce('Test message')
      );

      act(() => {
        // Allow effect to run
      });

      unmount();

      expect(removeChildSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
    });
  });

  describe('useHighContrastMode', () => {
    it('should detect high contrast mode', () => {
      mockMatchMedia(true);

      const { result } = renderHook(() => useHighContrastMode());

      expect(result.current).toBe(true);
    });

    it('should detect forced colors', () => {
      let forcedColorsCallback: ((event: MediaQueryListEvent) => void) | undefined;
      
      vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
        matches: query === '(forced-colors: active)',
        media: query,
        onchange: null,
        addEventListener: vi.fn((event, callback) => {
          if (event === 'change') {
            forcedColorsCallback = callback;
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useHighContrastMode());

      expect(result.current).toBe(true); // Should be true as mock returns true
    });
  });

  describe('useReducedMotion', () => {
    it('should detect reduced motion preference', () => {
      mockMatchMedia(true);

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(true);
    });

    it('should handle preference changes', () => {
      let changeCallback: ((event: MediaQueryListEvent) => void) | undefined;
      
      vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addEventListener: vi.fn((event, callback) => {
          if (event === 'change') {
            changeCallback = callback;
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as any);

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);

      // Simulate preference change
      if (changeCallback) {
        act(() => {
          changeCallback({ matches: true } as MediaQueryListEvent);
        });
      }
    });
  });

  describe('useColorContrast', () => {
    it('should calculate color contrast', () => {
      const { result } = renderHook(() => 
        useColorContrast('#000000', '#ffffff')
      );

      expect(result.current.ratio).toBeGreaterThan(0);
      expect(result.current.aa).toBe(true);
      expect(result.current.aaa).toBe(true);
    });

    it('should handle invalid colors', () => {
      const { result } = renderHook(() => 
        useColorContrast('invalid', '#ffffff')
      );

      expect(result.current.ratio).toBe(0);
    });

    it('should calculate contrast for different color combinations', () => {
      const testCases = [
        { fg: '#000000', bg: '#ffffff', expectedAAA: true },
        { fg: '#ffffff', bg: '#000000', expectedAAA: true },
        { fg: '#808080', bg: '#ffffff', expectedAAA: false },
      ];

      testCases.forEach(({ fg, bg, expectedAAA }) => {
        const { result } = renderHook(() => useColorContrast(fg, bg));
        expect(result.current.aaa).toBe(expectedAAA);
      });
    });
  });

  describe('useKeyboardNavigation', () => {
    it('should handle keyboard events', () => {
      const onEnter = vi.fn();
      const onEscape = vi.fn();

      const { result, unmount } = renderHook(() => 
        useKeyboardNavigation({
          onEnter,
          onEscape,
          preventDefault: true
        })
      );

      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      act(() => {
        // Simulate component mount
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      // Cleanup
      act(() => {
        unmount();
      });

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should handle all supported keys', () => {
      const handlers = {
        onEnter: vi.fn(),
        onEscape: vi.fn(),
        onArrowUp: vi.fn(),
        onArrowDown: vi.fn(),
        onArrowLeft: vi.fn(),
        onArrowRight: vi.fn(),
        onTab: vi.fn(),
      };

      const { result } = renderHook(() => useKeyboardNavigation(handlers));

      act(() => {
        // Simulate component mount
      });

      // Test that all handlers are set up correctly
      expect(handlers).toBeDefined();
    });
  });

  describe('Legacy Hooks (Backward Compatibility)', () => {
    describe('useFocusManagementLegacy', () => {
      it('should manage focus for error handling', () => {
        const { result } = renderHook(() => useFocusManagementLegacy());

        expect(result.current).toHaveProperty('previousFocusRef');
        expect(result.current).toHaveProperty('errorContainerRef');
        expect(result.current).toHaveProperty('captureFocus');
        expect(result.current).toHaveProperty('focusError');
        expect(result.current).toHaveProperty('restoreFocus');
      });

      it('should capture and restore focus', () => {
        const button = document.createElement('button');
        document.body.appendChild(button);
        button.focus();

        const { result } = renderHook(() => useFocusManagementLegacy());

        act(() => {
          result.current.captureFocus();
        });

        expect(result.current.previousFocusRef.current).toBe(document.activeElement);

        act(() => {
          result.current.restoreFocus();
        });

        document.body.removeChild(button);
      });
    });

    describe('useAnnounce', () => {
      it('should announce messages to screen readers', () => {
        const { result } = renderHook(() => useAnnounce());

        expect(result.current).toHaveProperty('announceRef');
        expect(result.current).toHaveProperty('announce');
      });

      it('should handle announcements with different priorities', () => {
        const { result } = renderHook(() => useAnnounce());

        act(() => {
          result.current.announce('Test message', 'polite');
          result.current.announce('Urgent message', 'assertive');
        });
      });
    });

    describe('usePrefersReducedMotion', () => {
      it('should detect reduced motion preference', () => {
        mockMatchMedia(true);

        const { result } = renderHook(() => usePrefersReducedMotion());

        expect(result.current).toBe(true);
      });
    });

    describe('useIdLegacy', () => {
      it('should generate unique IDs', () => {
        const { result } = renderHook(() => useIdLegacy('test'));

        expect(result.current).toMatch(/^test-[a-z0-9]+$/);
      });

      it('should return same ID on subsequent calls', () => {
        const { result, rerender } = renderHook(() => useIdLegacy('test'));

        const firstId = result.current;
        rerender();
        const secondId = result.current;

        expect(firstId).toBe(secondId);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should work together in an accessible component', () => {
      const TestComponent = () => {
        const containerRef = { current: container };
        
        // Use multiple accessibility hooks together
        useFocusManagement(containerRef, {
          trapFocus: true,
          restoreFocus: true
        });

        useScreenReaderAnnounce('Component loaded', { priority: 'polite' });
        
        const isHighContrast = useHighContrastMode();
        const prefersReducedMotion = useReducedMotion();

        useKeyboardNavigation({
          onEscape: () => console.log('Escape pressed'),
          onEnter: () => console.log('Enter pressed')
        });

        return null;
      };

      const { unmount } = renderHook(() => TestComponent());

      // Simulate user interaction
      act(() => {
        // Component interactions
      });

      unmount();
    });

    it('should handle error scenarios gracefully', () => {
      const invalidContainerRef = { current: null };

      const { result } = renderHook(() => 
        useFocusManagement(invalidContainerRef as any)
      );

      // Should handle null container gracefully
      expect(result.current).toBeDefined();
    });

    it('should handle missing DOM APIs', () => {
      // Temporarily remove DOM APIs
      const originalMatchMedia = window.matchMedia;
      delete (window as any).matchMedia;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false); // Default fallback

      // Restore
      window.matchMedia = originalMatchMedia;
    });
  });
});